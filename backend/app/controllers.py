from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import random
from flask import current_app

from app.models import Usuario, db

# Tokens temporários para confirmação e recuperação de senha
tokens_armazenados = {} # Formato: { "email": {"codigo": "123456", "timestamps": [dt1, dt2]} }

# --- Função Auxiliar: US 2 (Gerar Token e Rate Limit) ---
def gerenciar_token(email):
    agora = datetime.datetime.now()
    dados_token = tokens_armazenados.get(email, {"codigo": None, "timestamps": []})
    timestamps = dados_token["timestamps"]

    # Limpa timestamps mais velhos que 5 minutos para evitar acúmulo desnecessário na memória
    timestamps = [t for t in timestamps if (agora - t).total_seconds() < 300]

    # AC 2 (Regra Anti-Abuso): Bloqueia se o 3º token mais recente foi gerado há menos de 5 min
    if len(timestamps) >= 3:
        if (agora - timestamps[-3]).total_seconds() < 300:
            return None, "Limite de envios atingido. Aguarde alguns minutos para tentar novamente."

    # AC 1 (Formato do Token): Gera 6 dígitos numéricos
    codigo = str(random.randint(100000, 999999))
    timestamps.append(agora)

    tokens_armazenados[email] = {"codigo": codigo, "timestamps": timestamps}

    # Simulação de disparo de E-mail (Aparecerá no seu terminal)
    print(f"\n[EMAIL MOCK] De: nao-responda@stateful.com.br | Para: {email} | Seu código é: {codigo}\n")
    
    return codigo, None

# --- US 1: Criação de Nova Conta ---
def registrar_usuario(dados):
    campos_obrigatorios = ["nome", "sobrenome", "telefone", "email", "tipo_conta", "senha"]
    if not all(campo in dados for campo in campos_obrigatorios):
        return {"erro": "Preencha todos os campos obrigatórios"}, 400

    email = dados["email"]
    tipo = dados["tipo_conta"] # "PF" ou "PJ"
    documento = dados.get("cpf") if tipo == "PF" else dados.get("cnpj")

    if not documento:
        return {"erro": f"O documento {'CPF' if tipo == 'PF' else 'CNPJ'} é obrigatório."}, 400

    # AC 3 (Bloqueio de Duplicidade)
    usuario_existente = Usuario.query.filter_by(email=email).first()

    if usuario_existente:
        return {"erro": "Conta já existente. Deseja fazer login?"}, 409


    novo_usuario = Usuario(
        nome=f"{dados['nome']} {dados['sobrenome']}",
        email=email,
        senha=generate_password_hash(dados["senha"]),
        telefone=dados["telefone"],
        perfil='Usuario',
        documento='CPF' if tipo == 'PF' else 'CNPJ',
        is_verificado=False
    )

    db.session.add(novo_usuario)
    db.session.commit()

    # Gera e "envia" o token de confirmação
    codigo, erro = gerenciar_token(email)
    
    return {"message": "Conta criada! Verifique seu e-mail para ativar."}, 201

# --- US 2: Confirmar Conta ---
def confirmar_conta(email, token_inserido):

    usuario = Usuario.query.filter_by(email=email).first()

    if not usuario:
        return {"erro": "Usuário não encontrado"}, 404

    dados_token = tokens_armazenados.get(email)

    if not dados_token or dados_token["codigo"] != str(token_inserido):
        return {"erro": "Código inválido ou expirado"}, 401

    # Ativa a conta no banco
    usuario.is_verificado = True

    db.session.commit()

    # Remove o token utilizado
    tokens_armazenados.pop(email)

    return {
        "message": "Conta validada com sucesso! Você já pode fazer login."
    }, 200

# --- US 4: Login no Sistema ---
def autenticar_usuario(email, senha):

    usuario = Usuario.query.filter_by(email=email).first()

    if not usuario:
        return {"erro": "E-mail ou senha inválidos"}, 401

    if not check_password_hash(usuario.senha, senha):
        return {"erro": "E-mail ou senha inválidos"}, 401

    # AC 2 (Conta Não Verificada)
    if not usuario.is_verificado:
        gerenciar_token(email)
        return {
            "erro": "Conta não verificada",
            "redirecionar": "tela_verificacao"
        }, 403

    # AC 1 (Autenticação com Sucesso)
    token = jwt.encode(
        {
            "user": email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        },
        current_app.config['SECRET_KEY'],
        algorithm="HS256"
    )

    return {
        "token": token,
        "message": "Login realizado com sucesso"
    }, 200

# --- US 3: Recuperação de Senha ---
def solicitar_recuperacao(email):

    usuario = Usuario.query.filter_by(email=email).first()

    # Por segurança, não informamos se o e-mail existe ou não
    if not usuario:
        return {"message": "Se o e-mail existir, um código foi enviado."}, 200

    codigo, erro = gerenciar_token(email)

    if erro:
        return {"erro": erro}, 429

    return {"message": "Se o e-mail existir, um código foi enviado."}, 200

def redefinir_senha_com_token(email, token_inserido, nova_senha):

    usuario = Usuario.query.filter_by(email=email).first()

    if not usuario:
        return {"erro": "Usuário não encontrado"}, 404

    dados_token = tokens_armazenados.get(email)

    if not dados_token or dados_token["codigo"] != str(token_inserido):
        return {"erro": "Código inválido ou expirado"}, 401

    usuario.senha = generate_password_hash(nova_senha)

    db.session.commit()

    tokens_armazenados.pop(email)

    return {"message": "Senha redefinida com sucesso"}, 200