// ARQUIVO: src/componentes/ItemLivro.js

import React from 'react';
import {Text,StyleSheet,TouchableOpacity} from 'react-native';

const ItemLivro = ({ livro, aoPressionar}) => {
  return (
    <TouchableOpacity onPress={aoPressionar} style={estilos.containerItem}>
      <Text style={estilos.titulo}>{livro.titulo}</Text>
      <Text style={estilos.autor}>{livro.autor}</Text>
    </TouchableOpacity>
  );
};

const estilos = StyleSheet.create({
  containerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  autor: {
    fontSize: 14,
    color: '#666',
  },
});

export default ItemLivro;