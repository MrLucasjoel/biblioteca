
// ARQUIVO COMPLETO: src/servicos/servidor.js

import express from 'express';
import mysql from 'mysql2/promise';

const aplicacao = express();
const porta = 8083;

// Middleware para processar JSON e habilitar CORS
aplicacao.use(express.json());
aplicacao.use((requisicao, resposta, proximo) => {
  resposta.header('Access-Control-Allow-Origin', '*');
  resposta.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  resposta.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (requisicao.method === 'OPTIONS') {
      return resposta.sendStatus(200);
  }
  proximo();
});

// --- Configuração de Conexão com Banco de Dados ---
const configuracaoBD = {
  host: '127.0.0.1',
  user: 'livros',
  password: 'senha',
  database: 'biblioteca',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let poolConexao;
async function criarPoolBD() {
  try {
    poolConexao = mysql.createPool(configuracaoBD);
    console.log('Pool de conexões com o banco de dados MySQL criado com sucesso!');
  } catch (erro) {
    console.error('ERRO CRÍTICO: Falha ao conectar ao banco de dados:');
    console.error(erro); // Loga o objeto de erro completo, incluindo o ER_ACCESS_DENIED_ERROR
    process.exit(1);
  }
}
criarPoolBD();

// --- Rotas da API (CRUD COMPLETO) ---

// 1. Rota para LISTAR TODOS OS LIVROS (GET /livros)
aplicacao.get('/livros', async (requisicao, resposta) => {
  try {
    const [linhas] = await poolConexao.execute('SELECT id, titulo, autor FROM livros ORDER BY id');
    return resposta.json(linhas);
  } catch (erro) {
    console.error('Erro ao listar livros:', erro);
    resposta.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// 2. Rota para CONSULTAR POR ID (GET /livros/:id)
aplicacao.get('/livros/:id', async (requisicao, resposta) => {
  const idLivro = requisicao.params.id;
  try {
    const [linhas] = await poolConexao.execute(
      'SELECT id, titulo, autor FROM livros WHERE id = ?',
      [idLivro]
    );

    if (linhas.length === 0) {
      return resposta.status(404).json({ message: 'Livro não encontrado.' });
    }
    return resposta.json(linhas[0]);
  } catch (erro) {
    console.error('Erro ao consultar livro por ID:', erro);
    resposta.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// 3. INCLUIR NOVO LIVRO (POST /livros)
aplicacao.post('/livros', async (requisicao, resposta) => {
  const { titulo, autor } = requisicao.body;
  if (!titulo || !autor) {
    return resposta.status(400).json({ message: 'Título e autor são obrigatórios.' });
  }

  try {
    const [resultado] = await poolConexao.execute(
      'INSERT INTO livros (titulo, autor) VALUES (?, ?)',
      [titulo, autor]
    );
    resposta.status(201).json({
      message: 'Livro incluído com sucesso!',
      id: resultado.insertId,
      titulo,
      autor
    });
  } catch (erro) {
    console.error('Erro ao incluir livro:', erro);
    resposta.status(500).json({ message: 'Erro interno ao incluir livro.' });
  }
});

// 4. ATUALIZAR (PUT /livros/:id)
aplicacao.put('/livros/:id', async (requisicao, resposta) => {
  const idLivro = parseInt(requisicao.params.id);
  const { titulo, autor } = requisicao.body;

  if (isNaN(idLivro) || !titulo || !autor) {
    return resposta.status(400).json({ message: 'ID, Título e Autor são obrigatórios.' });
  }

  try {
    const [resultado] = await poolConexao.execute(
      'UPDATE livros SET titulo = ?, autor = ? WHERE id = ?',
      [titulo, autor, idLivro]
    );

    if (resultado.affectedRows === 0) {
      return resposta.status(404).json({ message: 'Livro não encontrado para atualização.' });
    }

    resposta.json({ message: 'Livro atualizado com sucesso!' });
  } catch (erro) {
    console.error('Erro ao atualizar livro:', erro);
    resposta.status(500).json({ message: 'Erro interno ao atualizar livro.' });
  }
});

// 5. EXCLUIR (DELETE /livros/:id)
aplicacao.delete('/livros/:id', async (requisicao, resposta) => {
  const idLivro = parseInt(requisicao.params.id);

  if (isNaN(idLivro)) {
    return resposta.status(400).json({ message: 'ID do livro inválido.' });
  }

  try {
    const [resultado] = await poolConexao.execute(
      'DELETE FROM livros WHERE id = ?',
      [idLivro]
    );

    if (resultado.affectedRows === 0) {
      return resposta.status(404).json({ message: 'Livro não encontrado para exclusão.' });
    }

    resposta.status(204).end();
  } catch (erro) {
    console.error('Erro ao excluir livro:', erro);
    resposta.status(500).json({ message: 'Erro interno ao excluir livro.' });
  }
});

// --- Inicia o Servidor HTTP ---
aplicacao.listen(porta, () => {
  console.log(`Servidor API Node.js ouvindo em http://localhost:${porta}`);
});