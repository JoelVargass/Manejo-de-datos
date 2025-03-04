import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function SecureStoreScreen() {
  const [storedValue, setStoredValue] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const saveData = async () => {
    try {
      await SecureStore.setItemAsync('miClave', inputValue);
      Alert.alert('Éxito', 'Dato guardado correctamente');
      setInputValue('');
    } catch (error) {
      console.error('Error al guardar el dato', error);
      Alert.alert('Error', 'No se pudo guardar el dato');
    }
  };

  const retrieveData = async () => {
    try {
      const value = await SecureStore.getItemAsync('miClave');
      if (value) {
        setStoredValue(value);
      } else {
        Alert.alert('Sin datos', 'No se encontró ningún dato guardado');
      }
    } catch (error) {
      console.error('Error al recuperar el dato', error);
      Alert.alert('Error', 'No se pudo recuperar el dato');
    }
  };

  const deleteData = async () => {
    try {
      await SecureStore.deleteItemAsync('miClave');
      Alert.alert('Éxito', 'Dato eliminado correctamente');
      setStoredValue(null);
    } catch (error) {
      console.error('Error al eliminar el dato', error);
      Alert.alert('Error', 'No se pudo eliminar el dato');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SecureStore</Text>

      <TextInput
        style={styles.input}
        placeholder="Ingresa un token para guardar"
        value={inputValue}
        onChangeText={setInputValue}
      />

      <View style={styles.buttonContainer}>
        <Button title="Guardar Dato" onPress={saveData} color="#4CAF50" />
        <Button title="Recuperar Dato" onPress={retrieveData} color="#2196F3" />
        <Button title="Eliminar Dato" onPress={deleteData} color="#F44336" />
      </View>

      {storedValue && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Dato guardado: {storedValue}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e0f7fa',
    borderRadius: 5,
    borderColor: '#0097a7',
    borderWidth: 1,
  },
  resultText: {
    fontSize: 16,
    color: '#00796b',
  },
});
