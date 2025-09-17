// ARQUIVO: src/telas/TelaListaLivros.js

import React, {useState,useEffect,useCallback} from 'react';
import {View,Text,FlatList,StyleSheet,ActivityIndicator,Button} from 'react-native';
import ItemLivro from '../componentes/ItemLivro';
import { obterLivros} from '../servicos/servicoAPI';

const TelaListaLivros = ({ navigation}) => {
  const [livros, setLivros] = useState([]);
  const [estaCarregando, setEstaCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscarLivros = useCallback(async () => {
    try {
      setEstaCarregando(true);
      const dados = await obterLivros();
      setLivros(dados);
      setErro(null);
    } catch (e) {
      setErro(e.message);
    } finally {
      setEstaCarregando(false);
    }
  }, []);

  useEffect(() => {
    // Escuta o evento 'focus' para recarregar a lista sempre que a tela for visitada
    const cancelarInscricao = navigation.addListener('focus', () => {
      buscarLivros();
    });
    return cancelarInscricao;
  }, [navigation, buscarLivros]);

  if (estaCarregando) {
    return (
      <View style={estilos.centralizado}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={estilos.centralizado}>
        <Text style={estilos.textoErro}>Erro ao carregar: {erro}</Text>
        <Button title="Tentar Novamente" onPress={buscarLivros} />
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <FlatList
        data={livros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({
          item
        }) => (
          <ItemLivro
            livro={item}
            aoPressionar={() => navigation.navigate('DetalheLivro', { idLivro: item.id })}
          />
        )}
      />
      <View style={estilos.containerBotao}>
        <Button
          title="Incluir Novo Livro"
          onPress={() => navigation.navigate('CriarLivro')}
        />
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoErro: {
    color: 'red',
    marginBottom: 10,
  },
  containerBotao: {
    paddingVertical: 10,
  }
});

export default TelaListaLivros;