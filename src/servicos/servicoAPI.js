// ARQUIVO: src/servicos/servicoAPI.js

// Lembre-se: use o IP da sua máquina quando rodar no celular (ex: 'http://192.168.1.10:8083')
const URL_BASE = 'http://10.0.2.2:8083';

/**
 * Obtém a lista de todos os livros.
 * @returns {Promise<Array<Object>>} Lista de livros.
 */
export const obterLivros = async () => {
  const resposta = await fetch(`${URL_BASE}/livros`);
  if (!resposta.ok) {
    throw new Error('Falha ao buscar os livros.');
  }
  return resposta.json();
};

/**
 * Obtém um livro específico pelo ID.
 * @param {number} id - O ID do livro.
 * @returns {Promise<Object>} O objeto do livro.
 */
export const obterLivroPorId = async (id) => {
  const resposta = await fetch(`${URL_BASE}/livros/${id}`);
  if (!resposta.ok) {
    throw new Error('Livro não encontrado.');
  }
  return resposta.json();
};

/**
 * Cria um novo livro no banco de dados.
 * @param {Object} livro - Objeto com titulo e autor.
 * @returns {Promise<Object>} O resultado da criação.
 */
export const criarLivro = async (livro) => {
  const resposta = await fetch(`${URL_BASE}/livros`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(livro),
  });
  if (!resposta.ok) {
    const dadosErro = await resposta.json();
    throw new Error(dadosErro.message || 'Falha ao criar o livro.');
  }
  return resposta.json();
};

/**
 * Atualiza um livro existente.
 * @param {number} id - O ID do livro a ser atualizado.
 * @param {Object} livro - Objeto com titulo e autor.
 */
export const atualizarLivro = async (id, livro) => {
  const resposta = await fetch(`${URL_BASE}/livros/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(livro),
  });
  if (!resposta.ok) {
    const dadosErro = await resposta.json();
    throw new Error(dadosErro.message || 'Falha ao atualizar o livro.');
  }
};

/**
 * Exclui um livro pelo ID.
 * @param {number} id - O ID do livro a ser excluído.
 */
export const excluirLivro = async (id) => {
  const resposta = await fetch(`${URL_BASE}/livros/${id}`, {
    method: 'DELETE',
  });
  if (resposta.status === 404) {
    throw new Error('Livro não encontrado para exclusão.');
  }
  if (!resposta.ok && resposta.status !== 204) {
    const dadosErro = await resposta.json();
    throw new Error(dadosErro.message || 'Falha ao excluir o livro.');
  }
};