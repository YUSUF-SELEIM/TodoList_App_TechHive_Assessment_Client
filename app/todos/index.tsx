import { Link } from 'expo-router';
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../AuthProvider';

const TodosComponent = () => {
  const [todos, setTodos] = useState<{ id: string; title: string; content: string; completed: boolean; }[]>([]);
  const [loading, setLoading] = useState(true);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (!authContext?.token) {
      setLoading(false); // Set loading to false immediately if no token
      return;
    }

    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/todos', {
          headers: {
            Authorization: `Bearer ${authContext?.token}`,
          },
        });
        setTodos(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [authContext?.token]);

  if (!authContext?.token && !loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.text}>Please <Link href={'/login'}>login</Link> to view todos</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todos</Text>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text>{item.title}</Text>
            <Text>{item.content}</Text>
            <Text>Completed: {item.completed ? 'Yes' : 'No'}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 30,
    color: '#333',
  },
  todoItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default TodosComponent;
