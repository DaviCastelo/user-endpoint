import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    cpf: '',
    rg: '',
    telefone: '',
    email: '',
    senha: ''
  });
  const [editando, setEditando] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [logado, setLogado] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [emailLogin, setEmailLogin] = useState('');
  
  const [senhaLogin, setSenhaLogin] = useState('');
  const [filtroNome, setFiltroNome] = useState('');
  const [popupUsuario, setPopupUsuario] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:3001/usuarios');
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Usuário criado com sucesso!');
        setFormData({
          nome: '',
          sobrenome: '',
          cpf: '',
          rg: '',
          telefone: '',
          email: '',
          senha: ''
        });
        fetchUsuarios();
      } else {
        alert('Erro ao criar usuário!');
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      alert('Erro ao criar usuário!');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/usuarios/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Usuário deletado com sucesso!');
        fetchUsuarios();
      } else {
        alert('Erro ao deletar usuário!');
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      alert('Erro ao deletar usuário!');
    }
  };

  const handleEdit = (usuario) => {
    setEditando(true);
    setUsuarioEditando(usuario);
    setFormData(usuario);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancelEdit = () => {
    setEditando(false);
    setUsuarioEditando(null);
    setFormData({
      nome: '',
      sobrenome: '',
      cpf: '',
      rg: '',
      telefone: '',
      email: '',
      senha: ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/usuarios/${usuarioEditando._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Usuário editado com sucesso!');
        setEditando(false);
        setUsuarioEditando(null);
        fetchUsuarios();
      } else {
        alert('Erro ao editar usuário!');
      }
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      alert('Erro ao editar usuário!');
    }
  };

  const setLoginData = async () => {
    
      try{
      const response = await fetch(`http://localhost:3001/usuarios/${emailLogin}`);
          const data = await response.json();
          setUsuarioLogado(data);
          console.log(usuarioLogado);
        } catch (error) {
          console.error('Erro ao buscar usuários:', error);
        }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailLogin, senha: senhaLogin }),
      });
      if (response.ok) {
        alert('Login bem-sucedido!');
        setLogado(true);
        setLoginData();
        setEmailLogin('');
        setSenhaLogin('');
        // Aqui você pode fazer uma nova requisição para obter os detalhes do usuário logado, se necessário
      } else {
        alert('Credenciais inválidas!');
      }
    } catch (error) {
      console.error('Erro ao tentar fazer login:', error);
      alert('Erro ao tentar fazer login!');
    }
  };


  const handleLogout = () => {
    setLogado(false);
    setUsuarioLogado(null);
  };
  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nome.toLowerCase().includes(filtroNome.toLowerCase())
  );

  const handlePopupOpen = (usuario) => {
   
    setPopupUsuario(usuario);
    };
    
    const handlePopupClose = () => {
    setPopupUsuario(null);
    };
  return (
    <div className="App">
      <h1>Teste de Endpoints</h1>
      <div className="container">
        <h2>Criar Usuário</h2>
        <form onSubmit={editando ? handleEditSubmit : handleSubmit}>
          <input type="text" placeholder="Nome" name="nome" value={formData.nome} onChange={handleInputChange} required />
          <input type="text" placeholder="Sobrenome" name="sobrenome" value={formData.sobrenome} onChange={handleInputChange} required />
          <input type="text" placeholder="CPF" name="cpf" value={formData.cpf} onChange={handleInputChange} required />
          <input type="text" placeholder="RG" name="rg" value={formData.rg} onChange={handleInputChange} required />
          <input type="text" placeholder="Telefone" name="telefone" value={formData.telefone} onChange={handleInputChange} required />
          <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleInputChange} required />
          <input type="password" placeholder="Senha" name="senha" value={formData.senha} onChange={handleInputChange} required />
          <button type="submit">{editando ? 'Salvar Edição' : 'Criar Usuário'}</button>
          {editando && <button type="button" onClick={handleCancelEdit}>Cancelar Edição</button>}
        </form>
        <h2>Filtrar Usuários por Nome</h2>
        <input type="text" placeholder="Filtrar por nome" value={filtroNome} onChange={(e) => setFiltroNome(e.target.value)} />
        <h2>Lista de Usuários</h2>
        <ul>
          {filteredUsuarios.map((usuario) => (
            <li key={usuario._id} >
              <div onClick={() => handlePopupOpen(usuario)}>
      {usuario.nome} {usuario.sobrenome} - {usuario.email}
    </div>
              <button onClick={() => handleDelete(usuario._id)}>Deletar</button>{' '}
              <button onClick={() => handleEdit(usuario)}>Editar</button>
            </li>
          ))}
        </ul>
      </div>
      {popupUsuario && (
<div className="popup">
<div className="popup-inner">
<button className="close-btn" onClick={handlePopupClose}>Fechar</button>
<h2>Dados do Usuário</h2>
<p>ID: {popupUsuario._id}</p>
<p>Nome: {popupUsuario.nome}</p>
<p>Sobrenome: {popupUsuario.sobrenome}</p>
<p>CPF: {popupUsuario.cpf}</p>
<p>RG: {popupUsuario.rg}</p>
<p>Telefone: {popupUsuario.telefone}</p>
<p>E-mail: {popupUsuario.email}</p>
</div></div>)}
      <div className="login-container">
      {!logado ? (
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={emailLogin} onChange={(e) => setEmailLogin(e.target.value)} required />
            <input type="password" placeholder="Senha" value={senhaLogin} onChange={(e) => setSenhaLogin(e.target.value)} required />
            <button type="submit">Login</button>
          </form>
        ) : (
          <div>
            <p>Logado como: {usuarioLogado ? usuarioLogado.nome : ''}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
