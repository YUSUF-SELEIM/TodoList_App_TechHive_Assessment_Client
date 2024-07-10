import React, { useState, useEffect, useContext } from 'react';
import { Text, FlatList, ActivityIndicator, StyleSheet, Pressable, SafeAreaView, Platform, StatusBar } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../AuthProvider';
import { Link } from 'expo-router';
import AddTodoModal from '../modal';
import { IP_ADDRESS } from '@/ip';

const TodosComponent = () => {
  const [todos, setTodos] = useState<{ id: string; title: string; content: string; completed: boolean; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const authContext = useContext(AuthContext);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`http://${IP_ADDRESS}:3000/todos`, {
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

  useEffect(() => {
    if (!authContext?.token) {
      setLoading(false);
      return;
    }

    fetchTodos();
  }, [authContext?.token]);

  const handleAddTodo = async (content: string) => {
    try {
      const response = await axios.post(
        `http://${IP_ADDRESS}:3000/todos/add`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${authContext?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setTodos([...todos, response.data]);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompleteTodo = async (id: string) => {
    try {
      await axios.post(`http://${IP_ADDRESS}:3000/todos/complete/${id}`, {
        completed: true,
      }, {
        headers: {
          Authorization: `Bearer ${authContext?.token}`,
        },
      });
      fetchTodos(); // Fetch updated todos after marking a todo as complete
    } catch (error) {
      console.error('Error marking todo as complete:', error);
    }
  };

  const handleLogout = () => {
    authContext.logout();
  };

  if (!authContext?.token && !loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={styles.text}>Please <Link href={'/login'}>login</Link> to view todos</Text>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="blue" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Todos</Text>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.todoItem, item.completed && styles.completedTodo]}
            onPress={() => handleCompleteTodo(item.id)}
          >
            <Text style={styles.todoContentCompleted}>{item.content}</Text>
            {/* <Text>Completed: {item.completed ? 'Yes' : 'No'}</Text> */}
          </Pressable>
        )}
      />
      <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Add To-Do</Text>
      </Pressable>
      <AddTodoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddTodo}
      />
      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  }
  ,
  completedTodo: {
    backgroundColor: '#eee',
  },
  todoContentCompleted: {
    textDecorationLine: 'line-through',
    color: 'gray'
  },
  button: {
    width: '100%',
    backgroundColor: '#43CFC6',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});

export default TodosComponent;
