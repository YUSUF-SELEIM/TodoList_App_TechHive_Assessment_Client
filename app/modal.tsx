import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Modal, Dimensions } from 'react-native';

interface AddTodoModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (content: string) => void;
  todo?: { id: string; content: string; completed: boolean } | null;
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({ visible, onClose, onAdd, todo }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (todo) {
      setContent(todo.content);
    } else {
      setContent('');
    }
  }, [todo]);

  const handleSubmit = () => {
    onAdd(content);
    setContent('');
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{todo ? 'Edit To-Do' : 'Add To-Do'}</Text>
          <TextInput
            style={styles.input}
            placeholder={todo ? 'Edit To-Do' : 'Clean The Hive'}
            placeholderTextColor="#888888"
            value={content}
            onChangeText={setContent}
          />
          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{todo ? 'Update' : 'Add'}</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    width: '100%',
    height: height / 2,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 18,
  },
  button: {
    width: '100%',
    backgroundColor: '#43CFC6',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#FF6347',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default AddTodoModal;
