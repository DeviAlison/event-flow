from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

# Inicializamos o objeto do banco de dados sem atrelar ao app ainda
db = SQLAlchemy()

class Usuario(db.Model):
    __tablename__ = "usuarios"

    idusuarios = db.Column(db.Integer, primary_key=True, autoincrement=True)

    nome = db.Column(db.String(45), nullable=False)
    sobrenome = db.Column(db.String(45), nullable=False)

    email = db.Column(db.String(45), unique=True, nullable=False)
    senha = db.Column(db.String(256), nullable=False)
    telefone = db.Column(db.String(45), nullable=False)

    perfil = db.Column(
        db.Enum("usuario", "admin"),
        nullable=False,
        default="usuario"
    )

    tipo_conta = db.Column(
        db.Enum("PF", "PJ"),
        nullable=False
    )

    documento = db.Column(db.String(20), unique=True, nullable=False)

    email_verificado = db.Column(
        db.Boolean,
        nullable=False,
        default=False
    )

class Categoria(db.Model):
    __tablename__ = "categoria"

    idcatEvento = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(45), nullable=False)

    subcategorias = db.relationship(
        "SubCategoria",
        back_populates="categoria",
        lazy=True
    )

class SubCategoria(db.Model):
    __tablename__ = "sub_categoria"

    idsub_categoria = db.Column(
        db.Integer,
        primary_key=True
    )

    genero = db.Column(
        db.String(45),
        nullable=False
    )

    categoria_idcatEvento = db.Column(
        db.Integer,
        db.ForeignKey("categoria.idcatEvento"),
        nullable=False
    )

    categoria = db.relationship(
        "Categoria",
        back_populates="subcategorias"
    )

    eventos = db.relationship(
        "Evento",
        back_populates="sub_categoria",
        lazy=True
    )

class Evento(db.Model):
    __tablename__ = "eventos"

    ideventos = db.Column(db.Integer, primary_key=True)

    nome = db.Column(db.String(45), nullable=False)
    descricao = db.Column(db.String(500), nullable=False)

    imagem_url = db.Column(db.String(500))

    data_inicio = db.Column(db.DateTime, nullable=False)
    data_encerramento = db.Column(db.DateTime, nullable=False)

    tipo_evento = db.Column(db.String(45), nullable=False)

    nome_local = db.Column(db.String(45), nullable=False)
    endereco = db.Column(db.String(45), nullable=False)
    numero_end = db.Column(db.Integer, nullable=False)

    cidade = db.Column(db.String(45), nullable=False)
    estado = db.Column(db.String(2), nullable=False)

    quant_pessoas = db.Column(db.Integer, nullable=False)

    status = db.Column(
        db.Enum("publicado", "encerrado", "cancelado"),
        nullable=False,
        default="publicado"
    )

    usuarios_idusuarios = db.Column(
        db.Integer,
        db.ForeignKey("usuarios.idusuarios"),
        nullable=False
    )

    sub_categoria_idsub_categoria = db.Column(
        db.Integer,
        db.ForeignKey("sub_categoria.idsub_categoria"),
        nullable=False
    )

    usuario = db.relationship("Usuario")

    sub_categoria = db.relationship(
        "SubCategoria",
        back_populates="eventos"
    )

    curtidas = db.relationship(
        "Curtida",
        backref="evento",
        lazy="dynamic"
    )

    tipos_ingresso = db.relationship(
        "TipoIngresso",
        backref="evento",
        lazy=True
    )

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

class Comentario(db.Model):
    __tablename__ = 'comentarios'
    idcomentario = db.Column(db.Integer, primary_key=True, autoincrement=True)
    texto = db.Column(db.String(200))
    data = db.Column(db.DateTime, default=datetime.utcnow)
    atualizado = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    comentariopai = db.Column(db.String(100), nullable=True) 
    
    eventos_ideventos = db.Column(db.Integer, db.ForeignKey('eventos.ideventos'))
    usuarios_idusuarios = db.Column(db.Integer, db.ForeignKey('usuarios.idusuarios'))

    usuario = db.relationship('Usuario', backref='comentarios_feitos')
    evento = db.relationship('Evento', backref=db.backref('comentarios_recebidos', lazy='dynamic'))

class CurtidaComentario(db.Model):
    __tablename__ = 'curtidas_comentarios'
    idcurtida_comentario = db.Column(db.Integer, primary_key=True, autoincrement=True)
    comentarios_idcomentario = db.Column(db.Integer, db.ForeignKey('comentarios.idcomentario'))
    usuarios_idusuarios = db.Column(db.Integer, db.ForeignKey('usuarios.idusuarios'))