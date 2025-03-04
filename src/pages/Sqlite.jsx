import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

let db;

const initDB = async () => {
  try {
    db = await SQLite.openDatabaseAsync('tasks.db');
    console.log("📂 Base de datos abierta correctamente");

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          name TEXT NOT NULL
      );
    `);
    console.log('📂 Base de datos inicializada correctamente.');
  } catch (error) {
    console.error('⚠️ Error al inicializar la base de datos:', error);
  }
};

const addTask = async (task) => {
  try {
    if (!task.trim()) throw new Error('⚠️ Escribe una tarea válida');
    const result = await db.runAsync('INSERT INTO tasks (name) VALUES (?);', [task]);
    console.log(`✅ Tarea añadida con ID: ${result.lastInsertRowId}`);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('⚠️ Error al añadir tarea:', error);
  }
};

const deleteTask = async (id) => {
  try {
    const result = await db.runAsync('DELETE FROM tasks WHERE id = ?;', [id]);
    console.log(`🗑️ Tarea eliminada (${result.changes} filas afectadas)`);
  } catch (error) {
    console.error('⚠️ Error al eliminar tarea:', error);
  }
};

const fetchAllTasks = async () => {
  try {
      const tasks = await db.getAllAsync('SELECT * FROM tasks;');
      console.log('📋 Tareas obtenidas:', tasks);
      return tasks;
  } catch (error) {
      console.error('⚠️ Error al obtener tareas:', error);
      return [];
  }
};

export default function SQLiteScreen() {
  const [taskName, setTaskName] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    initDB().then(() => loadTasks());
  }, []);

  const loadTasks = async () => {
    const storedTasks = await fetchAllTasks();
    console.log('Tareas cargadas:', storedTasks);
    setTasks(storedTasks); 
  };

  const handleAddTask = async () => {
    if (taskName.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa un nombre de tarea');
      return;
    }
    await addTask(taskName);
    loadTasks();
    setTaskName('');
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    loadTasks(); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión con SQLite</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de la tarea"
        value={taskName}
        onChangeText={setTaskName}
      />
      <Button title="Añadir Tarea" onPress={handleAddTask} color="#4CAF50" />

      <FlatList
        style={styles.list}
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.name}</Text>
            <Button
              title="Eliminar"
              onPress={() => handleDeleteTask(item.id)}
              color="#F44336"
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
  list: {
    width: '100%',
    marginTop: 20,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  taskText: {
    fontSize: 18,
    color: '#333',
  },
});
