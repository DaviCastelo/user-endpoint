const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
//const Usuario = require('./models/Usuario');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT ? process.env.PORT : 27;
const uri = process.env.URI ? process.env.URI : '';
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado ao banco de dados MongoDB');
  })
  .catch(error => {
    console.error('Erro ao conectar ao banco de dados MongoDB:', error);
  });

 

// Definir o schema do usuário usando Mongoose
const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: true },
  cpf: { type: String, required: true },
  rg: { type: String, required: true },
  telefone: { type: String, required: true },
  email: { type: String, required: true },
  senha: { type: String, required: true }
});

// Criar o modelo de usuário usando o schema
const UsuarioModel = mongoose.model('Usuario', usuarioSchema);

// Endpoint para cadastrar um novo usuário
app.post('/usuarios', async (req, res) => {
  try {
    // Verificar se o email já está em uso
    console.log('body: ', req.body);
    const emailExistente = await UsuarioModel.findOne({ email: req.body.email });
    if (emailExistente) return res.status(400).send('O email já está cadastrado');

    // Hash da senha
    const hashedPassword = await bcrypt.hash(req.body.senha, 10);

    // Criar novo usuário
    const usuario = new UsuarioModel({
      nome: req.body.nome,
      sobrenome: req.body.sobrenome ,
      cpf: req.body.cpf,
      rg: req.body.rg,
      telefone: req.body.telefone,
      email: req.body.email,
      senha: hashedPassword
    });
    const savedUsuario = await usuario.save();
    res.send(savedUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao cadastrar usuário');
  }
});

// Endpoint para buscar todos os usuários
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await UsuarioModel.find();
    res.send(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar usuários');
  }
});

// Endpoint para buscar um usuário pelo ID


app.get('/usuarios/:email', async (req, res) => {
  try {
    const usuario = await UsuarioModel.findOne({ email: req.params.email });
    if (!usuario) return res.status(404).send('Usuário não encontrado');
    res.send(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar usuário');
  }
});


// Endpoint para atualizar um usuário
app.put('/usuarios/:id', async (req, res) => {
  try {
    const { nome, sobrenome, cpf, rg, telefone, email, senha } = req.body;
    const usuario = await UsuarioModel.findByIdAndUpdate(req.params.id, {
      nome, sobrenome, cpf, rg, telefone, email, senha
    }, { new: true });
    if (!usuario) return res.status(404).send('Usuário não encontrado');
    res.send(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao atualizar usuário');
  }
});

// Endpoint para deletar um usuário
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const usuario = await UsuarioModel.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).send('Usuário não encontrado');
    res.send(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao deletar usuário');
  }
});

// Endpoint para autenticar um usuário
app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    console.log(req.body)
    const usuario = await UsuarioModel.findOne({ email });
    if (!usuario) return res.status(400).send('Credenciais inválidas');
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(400).send('Credenciais inválidas');
    res.status(200).send('ok');
    console.log('ok')
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao autenticar usuário');
  }
});


// Inicializar o servidor e começar a ouvir na porta especificada
app.listen(port, () => {
  console.log(`Servidor Express rodando na porta ${port}`);
});
