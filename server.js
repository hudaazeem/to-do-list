const express = require('express');
const cors = require("cors");
const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());

app.use(express.static('express-locallibrary-tutorial/public'));

let todos =[];

app.get('/api/todos', (req, res) => {
    res.json(todos);
})  

app.post('/api/todos', (req, res) => {
    const newTodo = {
        id: Date.now(),
        text: req.body.text,
        done: false
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

app.put('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    if (!todo) return res.status(404).json({error:"Not found"});

    todo.text = req.body.text !== undefined ? req.body.text : todo.text;
    todo.done = req.body.done !== undefined ? req.body.done : todo.done;
    res.json(todo);
});



app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    todos = todos.filter(t => t.id !== id);
    res.json({message: "Deleted"});
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});