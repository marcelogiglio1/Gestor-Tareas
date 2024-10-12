const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'marce1234',
  database: 'tarea_manager'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

// Crear tarea
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  const query = 'INSERT INTO tasks (title, description) VALUES (?, ?)';
  db.query(query, [title, description], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error creating task');
    }
    res.status(201).send({ id: result.insertId, title, description, status: 0 });
  });
});

// Obtener todas las tareas
app.get('/tasks', (req, res) => {
  const query = 'SELECT * FROM tasks';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving tasks');
    }
    res.status(200).json(results);
  });
});

// Actualizar tarea
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const query = 'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?';
  db.query(query, [title, description, status, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error updating task');
    }
    res.status(200).send('Task updated successfully');
  });
});

// Eliminar tarea
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM tasks WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting task');
    }
    res.status(200).send('Task deleted successfully');
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});