from flask_sqlalchemy import SQLAlchemy

# Inicializamos o objeto do banco de dados sem atrelar ao app ainda
db = SQLAlchemy()

class Usuario(db.Model):
    __tablename__ = 'usuarios'

    idusuarios = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(45), nullable=True)
    email = db.Column(db.String(45), unique=True, nullable=True)
    senha = db.Column(db.String(256), nullable=True)
    telefone = db.Column(db.String(45), nullable=True)
    perfil = db.Column(db.Enum('Usuario', 'Admin'), default='Usuario')
    documento = db.Column(db.Enum('CPF', 'CNPJ'), nullable=True)
    
    # Variável extra para nossa regra de negócio de confirmação de e-mail (US 2)
    # Como não estava no seu diagrama SQL original, estou adicionando como uma coluna extra
    is_verificado = db.Column(db.Boolean, default=False)

class Categoria(db.Model):
    __tablename__ = 'categoria'

    idcatEvento = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(45))

class Evento(db.Model):
    __tablename__ = 'eventos'

    ideventos = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(45))
    descricao = db.Column(db.String(500))
    data_inicio = db.Column(db.DateTime)
    nome_local = db.Column(db.String(45))
    endereco = db.Column(db.String(45))
    numero_end = db.Column(db.Integer)
    cidade = db.Column(db.String(45))
    estado = db.Column(db.String(2))
    status = db.Column(db.Enum('Publicado', 'Encerrado', 'Cancelado'))
    # Adicione isso dentro da classe Evento:
    curtidas = db.relationship('Curtida', backref='evento', lazy='dynamic')
    tipos_ingresso = db.relationship('TipoIngresso', backref='evento', lazy=True)
    
    # Chave estrangeira ligando à tabela de categorias
    categoria_idcatEvento = db.Column(db.Integer, db.ForeignKey('categoria.idcatEvento'))
    
    # Relacionamento que permite acessar a categoria direto pelo evento (ex: evento.categoria.nome)
    categoria = db.relationship('Categoria', backref='eventos')

class Curtida(db.Model):
    __tablename__ = 'curtidas'
    idcurtidas = db.Column(db.Integer, primary_key=True)
    eventos_ideventos = db.Column(db.Integer, db.ForeignKey('eventos.ideventos'))
    usuarios_idusuarios = db.Column(db.Integer, db.ForeignKey('usuarios.idusuarios'))

class TipoIngresso(db.Model):
    __tablename__ = 'tipo_ingresso'
    idtipo_ingresso = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(45))
    eventos_ideventos = db.Column(db.Integer, db.ForeignKey('eventos.ideventos'))
    
    # Relação com os lotes (Um tipo de ingresso tem vários lotes)
    lotes = db.relationship('Lote', backref='tipo_ingresso', lazy=True)

class Lote(db.Model):
    __tablename__ = 'lote'
    idLote = db.Column(db.Integer, primary_key=True)
    preco = db.Column(db.Numeric(10, 2))
    quant_total = db.Column(db.Integer)
    quant_vendida = db.Column(db.Integer)
    tipo_ingresso_idTipo_Ingresso = db.Column(db.Integer, db.ForeignKey('tipo_ingresso.idtipo_ingresso'))