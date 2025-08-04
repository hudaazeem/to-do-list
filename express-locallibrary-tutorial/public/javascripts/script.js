const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

async function fetchTodos() {
    const res = await fetch("/api/todos");
    const todos = await res.json();

    list.innerHTML = "";

    todos.forEach((todo) => {
        const li = document.createElement("li");
        li.textContent = todo.text;
        list.appendChild(li);
  });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value;
    await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
  });
    input.value = "";
    fetchTodos();
});

fetchTodos();
