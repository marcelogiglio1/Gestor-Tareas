import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editTask, setEditTask] = useState(null); // Estado para manejar la tarea que se está editando
  const [theme, setTheme] = useState('light'); // Tema por defecto

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get('http://localhost:5000/tasks');
    setTasks(response.data);
  };

  const createTask = async () => {
    if (newTask.title && newTask.description) {
      await axios.post('http://localhost:5000/tasks', newTask);
      setNewTask({ title: '', description: '' });
      fetchTasks();
    }
  };

  const updateTask = async (id, updatedTask) => {
    await axios.put(`http://localhost:5000/tasks/${id}`, updatedTask);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  const toggleStatus = async (task) => {
    task.status = !task.status;
    updateTask(task.id, task);
  };

  const startEditingTask = (task) => {
    setEditTask(task);
    setNewTask({ title: task.title, description: task.description });  // Carga la tarea seleccionada en el formulario
  };

  const saveTask = async () => {
    if (editTask) {
      await axios.put(`http://localhost:5000/tasks/${editTask.id}`, {
        title: newTask.title,
        description: newTask.description,
        status: editTask.status
      });
      setEditTask(null);  // Limpiar después de guardar
    } else {
      createTask();  // Si no hay tarea en edición, crea una nueva
    }
    setNewTask({ title: '', description: '' });  // Limpia el formulario
    fetchTasks();
  };

  const switchTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const getThemeClass = () => {
    switch (theme) {
      case 'dark':
        return 'bg-dark text-white';
      case 'high-contrast':
        return 'bg-high-contrast text-black';
      default:
        return 'bg-light text-dark';
    }
  };

  

  return (

    <div className={`container mt-4 p-2 border border-black ${getThemeClass()}`}>
      <h1 className="mb-4 ">Task Manager</h1>

      {/* Botones para cambiar de tema */}
      <div className="mb-3">
        <Button variant="secondary" onClick={() => switchTheme('light')} className="me-2">
          Modo Claro
        </Button>
        <Button variant="dark" onClick={() => switchTheme('dark')} className="me-2 border border-white">
          Modo Oscuro
        </Button>
        <Button variant="warning" onClick={() => switchTheme('high-contrast')}>
          Alto Contraste
        </Button>
      </div>

      {/* Formulario para agregar/editar tareas */}
      <Form className="mb-3 p-2 border border-black">
        <Form.Group>
          <Form.Label>Título de la tarea</Form.Label>
          <Form.Control
            type="text"
            placeholder="Título"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mt-2">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Descripción"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
        </Form.Group>
        <Button variant="primary" className="mt-3" onClick={saveTask}>
          {editTask ? 'Guardar Cambios' : 'Agregar Tarea'}
        </Button>
      </Form>

      {/* Tabla de tareas */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.status ? 'Completada' : 'Pendiente'}</td>
              <td>
                <Button variant="success" onClick={() => toggleStatus(task)} className="me-2">
                  {task.status ? 'Deshacer' : 'Completar'}
                </Button>
                <Button variant="warning" onClick={() => startEditingTask(task)} className="me-2">
                  Editar
                </Button>
                <Button variant="danger" onClick={() => deleteTask(task.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default App;