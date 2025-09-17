// ARQUIVO: src/telas/TelaCriarLivro.js
import React, {useState} from 'react';
import {View,Text,StyleSheet,TextInput,Button,Alert} from 'react-native';
import {criarLivro} from '../servicos/servicoAPI';

const TelaCriarLivro = ({ navigation}) => {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  const lidarComCriacao = async () => {
    if (!titulo.trim() || !autor.trim()) {
      Alert.alert('Erro', 'Título e autor são obrigatórios.');
      return;
    }
    try {
      await criarLivro({
        titulo: titulo,
        autor: autor
      });
      Alert.alert('Sucesso', 'Livro criado com sucesso!');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.rotulo}>Título:</Text>
      <TextInput
        style={estilos.entrada}
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Título do livro"
      />
      <Text style={estilos.rotulo}>Autor:</Text>
      <TextInput
        style={estilos.entrada}
        value={autor}
        onChangeText={setAutor}
        placeholder="Autor do livro"
      />
      <View style={estilos.containerBotao}>
        <Button title="Criar Livro" onPress={lidarComCriacao} />
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  rotulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  entrada: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  containerBotao: {
    marginTop: 10,
  },
});

export default TelaCriarLivro;