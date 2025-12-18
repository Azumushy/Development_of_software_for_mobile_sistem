import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

export default function Index() {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);

  const addTask = (text) => {
    if (!text.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now().toString(),
        text,
        completed: false
      }
    ]);
    setInputText('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const editTask = (id, newText) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: newText } : task
    ));
    setEditingId(null);
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    if (filter === 'active') {
      filtered = filtered.filter(task => !task.completed);
    }

    if (filter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }

    if (searchText.trim()) {
      filtered = filtered.filter(task =>
        task.text.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filtered;
  };

  const getTasksStats = () => {
    const completed = tasks.filter(t => t.completed).length;
    const active = tasks.length - completed;
    return { completed, active };
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const stats = getTasksStats();

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Менеджер задач</Text>
        <Text style={styles.counter}>
          Активные: {stats.active} | Выполненные: {stats.completed}
        </Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Новая задача"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addTask(inputText)}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Поиск"
        value={searchText}
        onChangeText={setSearchText}
      />

      <View>
        {getFilteredTasks().map(task => (
          <View key={task.id} style={styles.taskItem}>
            <TouchableOpacity onPress={() => toggleTask(task.id)}>
              <Text
                style={[
                  styles.taskText,
                  task.completed && styles.completed
                ]}
              >
                {task.text}
              </Text>
            </TouchableOpacity>

            <View style={styles.taskButtons}>
              <TouchableOpacity onPress={() => setEditingId(task.id)}>
                <Text style={styles.edit}>✎</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(task.id)}>
                <Text style={styles.delete}>✕</Text>
              </TouchableOpacity>
            </View>

            {editingId === task.id && (
              <TextInput
                style={styles.editInput}
                defaultValue={task.text}
                onSubmitEditing={(e) =>
                  editTask(task.id, e.nativeEvent.text)
                }
              />
            )}
          </View>
        ))}
      </View>

      <View style={styles.filters}>
        <TouchableOpacity onPress={() => setFilter('all')}>
          <Text style={styles.filter}>Все</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('active')}>
          <Text style={styles.filter}>Активные</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('completed')}>
          <Text style={styles.filter}>Выполненные</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={clearCompleted}
        style={styles.clearButton}
      >
        <Text style={styles.clearText}>
          Очистить выполненные
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5'
  },
  header: {
    marginBottom: 15
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  counter: {
    color: '#555'
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 10
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 5
  },
  addButton: {
    marginLeft: 5,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    borderRadius: 5
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20
  },
  search: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 8,
    marginBottom: 10,
    borderRadius: 5
  },
  taskItem: {
    backgroundColor: '#FFF',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5
  },
  taskText: {
    fontSize: 16
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#999'
  },
  taskButtons: {
    flexDirection: 'row',
    position: 'absolute',
    right: 10,
    top: 10
  },
  edit: {
    marginRight: 10,
    color: '#2196F3'
  },
  delete: {
    color: '#F44336'
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 5,
    marginTop: 5
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10
  },
  filter: {
    color: '#2196F3'
  },
  clearButton: {
    marginTop: 10,
    alignItems: 'center'
  },
  clearText: {
    color: '#F44336'
  }
});
