require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.get('/', (req, res) => {
  res.send('Hello from backend root');
});
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend-vercel')));

app.get('/health', (req, res) => {
  res.send('Backend is running and healthy.');
});

mongoose.connect(process.env.MONGODB_URI, { dbName: 'todoDB' })
  .then(() => {
    console.log("Connected to MongoDB Atlas");

    const todoSchema = new mongoose.Schema({
      text: String,
      done: Boolean
    });
    const Todo = mongoose.model("Todo", todoSchema);

    app.get('/api/todos', async (req, res) => {
      const todos = await Todo.find();
      res.json(todos);
    });

    app.post('/api/todos', async (req, res) => {
      const newTodo = new Todo({ text: req.body.text, done: false });
      await newTodo.save();
      res.status(201).json(newTodo);
    });

    app.put('/api/todos/:id', async (req, res) => {
      const todo = await Todo.findById(req.params.id);
      if (!todo) return res.status(404).json({ error: "Not found" });

      todo.text = req.body.text ?? todo.text;
      todo.done = req.body.done ?? todo.done;
      await todo.save();
      res.json(todo);
    });

    app.delete('/api/todos/:id', async (req, res) => {
      await Todo.findByIdAndDelete(req.params.id);
      res.json({ message: "Deleted" });
    });

    const frontendPath = path.join(__dirname, 'frontend-vercel', 'index.html');
    app.get('/*splat', (req, res) => {
      res.sendFile(frontendPath, (err) => {
        if (err) {
          res.status(500).send('Error loading frontend.');
        }
      });
    });

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });

  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1); 
  });
