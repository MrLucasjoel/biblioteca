// ARQUIVO: App.js

import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import TelaListaLivros from './src/telas/TelaListaLivros';
import TelaDetalheLivro from './src/telas/TelaDetalheLivro';
import TelaCriarLivro from './src/telas/TelaCriarLivro';

const Pilha = createNativeStackNavigator(); // Usando Pilha para Stack

export default function App() {
  return (
    <NavigationContainer>
      <Pilha.Navigator initialRouteName="ListaLivros">
        <Pilha.Screen
          name="ListaLivros"
          component={TelaListaLivros}
          options={{
            title: 'Lista de Livros'
          }}
        />
        <Pilha.Screen
          name="DetalheLivro"
          component={TelaDetalheLivro}
          options={{
            title: 'Detalhes e Edição'
          }}
        />
        <Pilha.Screen
          name="CriarLivro"
          component={TelaCriarLivro}
          options={{
            title: 'Novo Livro'
          }}
        />
      </Pilha.Navigator>
    </NavigationContainer>
  );
}