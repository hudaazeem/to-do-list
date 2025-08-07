require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error("MONGODB_URI is not defined in environment variables!");
  process.exit(1); 
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => {
    console.error("MongoDB Connection error:", err);
    process.exit(1); 
  });

const todoSchema = new mongoose.Schema({
  text: String,
  done: Boolean
});

const Todo = mongoose.model("Todo", todoSchema);

app.use(cors());
app.use(express.json());
app.use(express.static('express-locallibrary-tutorial/public'));

// REST API Endpoints
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const newTodo = new Todo({
      text: req.body.text,
      done: false
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: "Not found" });

    todo.text = req.body.text !== undefined ? req.body.text : todo.text;
    todo.done = req.body.done !== undefined ? req.body.done : todo.done;
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
