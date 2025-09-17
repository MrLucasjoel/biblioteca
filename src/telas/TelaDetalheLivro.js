// ARQUIVO: src/telas/TelaDetalheLivro.js

import React, {useState,useEffect} from 'react';
import {View,Text,StyleSheet,TextInput,Button,ActivityIndicator,Alert} from 'react-native';
import {obterLivroPorId,atualizarLivro,excluirLivro} from '../servicos/servicoAPI';

const TelaDetalheLivro = ({ route, navigation}) => {
  const { idLivro } = route.params;
  const [livro, setLivro] = useState(null);
  const [estaCarregando, setEstaCarregando] = useState(true);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  useEffect(() => {const buscarLivro = async () => {
      try {
        const livroBuscado = await obterLivroPorId(idLivro);
        setLivro(livroBuscado);
        setTitulo(livroBuscado.titulo);
        setAutor(livroBuscado.autor);
      } catch (e) {
        Alert.alert('Erro', 'Livro não encontrado.');
        navigation.goBack();
      } finally {
        setEstaCarregando(false);
      }
    };
    buscarLivro();
  }, [idLivro, navigation]);

  const lidarComAtualizacao = async () => {
    try {
      await atualizarLivro(idLivro, {
        titulo: titulo,
        autor: autor
      });
      Alert.alert('Sucesso', 'Livro atualizado!');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  };

  const lidarComExclusao = async () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este livro?',
      [{
        text: 'Cancelar',
        style: 'cancel'
      }, {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluirLivro(idLivro);
            Alert.alert('Sucesso', 'Livro excluído!');
            navigation.goBack();
          } catch (e) {
            Alert.alert('Erro', e.message);
          }
        },
      }, ],
    );
  };

  if (estaCarregando) {
    return (
      <View style={estilos.centralizado}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
        <Button title="Salvar Alterações" onPress={lidarComAtualizacao} />
      </View>
      <View style={estilos.containerBotao}>
        <Button title="Excluir Livro" color="red" onPress={lidarComExclusao} />
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
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

export default TelaDetalheLivro;