const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

const BASE_URL = window.location.origin;

async function fetchTodos() {
    const res = await fetch(`${BASE_URL}/api/todos`);
    const todos = await res.json();

    list.innerHTML = "";

    todos.forEach((todo) => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.done;
        checkbox.addEventListener("change", async () => {
            await fetch(`${BASE_URL}/api/todos/${todo.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ done: checkbox.checked }),
            });
            fetchTodos();
        });

        li.appendChild(checkbox);

        const span = document.createElement("span");
        span.textContent = todo.text;
        if (todo.done) span.style.textDecoration = "line-through";
        span.style.marginLeft = "10px";
        li.appendChild(span);

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.style.marginLeft = "10px";
        editBtn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const newText = prompt("Edit your task:", todo.text);
            if (newText !== null && newText.trim() !== "") {
                await fetch(`${BASE_URL}/api/todos/${todo.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: newText }),
                });
                fetchTodos();
            }
        });

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.style.marginLeft = "10px";
        delBtn.addEventListener("click", async (e) => {
            e.stopPropagation();
            await fetch(`${BASE_URL}/api/todos/${todo.id}`, {
                method: "DELETE"
            });
            fetchTodos();
        });

        li.appendChild(editBtn);
        li.appendChild(delBtn);
        list.appendChild(li);
    });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    await fetch(`${BASE_URL}/api/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });

    input.value = "";
    fetchTodos();
});

fetchTodos();
