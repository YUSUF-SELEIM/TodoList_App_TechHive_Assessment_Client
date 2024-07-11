import React, { useState, useEffect, useContext } from 'react';
import { Text, FlatList, ActivityIndicator, StyleSheet, Pressable, SafeAreaView, View } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../AuthProvider';
import { Link } from 'expo-router';
import AddTodoModal from '../modal';
import { Ionicons } from '@expo/vector-icons';
import { IP_ADDRESS } from '@/ip';

const TodosComponent = () => {
  const [todos, setTodos] = useState<{ id: string; title: string; content: string; completed: boolean; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<{ id: string; title: string; content: string; completed: boolean; } | null>(null);
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

  const handleAddOrUpdateTodo = async (content: string) => {
    if (selectedTodo) {
      // Update existing todo
      try {
        const response = await axios.post(
          `http://${IP_ADDRESS}:3000/todos/update/${selectedTodo.id}`,
          { content },
          {
            headers: {
              Authorization: `Bearer ${authContext?.token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setTodos(todos.map(todo => todo.id === selectedTodo.id ? response.data : todo));
        setModalVisible(false);
        setSelectedTodo(null);
      } catch (error) {
        console.error(error);
      }
    } else {
      // Add new todo
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
    }
  };

  const handleToggleCompleteTodo = async (id: string, completed: boolean) => {
    try {
      await axios.post(`http://${IP_ADDRESS}:3000/todos/toggle-complete/${id}`, {
        completed: !completed,
      }, {
        headers: {
          Authorization: `Bearer ${authContext?.token}`,
        },
      });
      fetchTodos(); //refetch
    } catch (error) {
      console.error('Error toggling todo completion status:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await axios.delete(`http://${IP_ADDRESS}:3000/todos/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${authContext?.token}`,
        },
      });
      fetchTodos(); // refetch
    } catch (error) {
      console.error('Error deleting todo:', error);
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
      <View style={styles.container}>
        <Text style={styles.title}>Todos</Text>
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.todoItem, item.completed && styles.completedTodo]}
              onPress={() => handleToggleCompleteTodo(item.id, item.completed)}
            >
              <Text style={item.completed ? styles.todoContentCompleted : styles.todoContent}>{item.content}</Text>
              <View style={styles.iconContainer}>
                <Pressable onPress={() => {
                  setSelectedTodo(item);
                  setModalVisible(true);
                }}>
                  <Ionicons name="create-outline" size={24} color="black" />
                </Pressable>
                <Pressable onPress={() => handleDeleteTodo(item.id)}>
                  <Ionicons name="trash-outline" size={24} color="black" />
                </Pressable>
              </View>
            </Pressable>
          )}
        />
        <Pressable style={styles.button} onPress={() => {
          setSelectedTodo(null);
          setModalVisible(true);
        }}>
          <Text style={styles.buttonText}>Add To-Do</Text>
        </Pressable>
        <AddTodoModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={handleAddOrUpdateTodo}
          todo={selectedTodo}
        />
        <Pressable style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingHorizontal: 10,
    paddingTop: 10
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
  },
  completedTodo: {
    backgroundColor: '#eee',
  },
  todoContentCompleted: {
    textDecorationLine: 'line-through',
    color: 'gray'
  },
  todoContent: {
    color: 'black'
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
