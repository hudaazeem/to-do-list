require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");

const app = express();
const PORT = 3000;


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => console.error("MongoDB Connection error:", err));

const todoSchema = new mongoose.Schema({
    text: String,
    done: Boolean
});

const Todo = mongoose.model("Todo", todoSchema);


app.use(cors());
app.use(express.json());
app.use(express.static('express-locallibrary-tutorial/public'));


app.get('/api/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

app.post('/api/todos', async (req, res) => {
    const newTodo = new Todo({
        text: req.body.text,
        done: false
  });
    await newTodo.save();
    res.status(201).json(newTodo);
});

app.put('/api/todos/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: "Not found" });

    todo.text = req.body.text !== undefined ? req.body.text : todo.text;
    todo.done = req.body.done !== undefined ? req.body.done : todo.done;
    await todo.save();
    res.json(todo);
});

app.delete('/api/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});