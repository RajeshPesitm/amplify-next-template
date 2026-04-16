"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {

  const { user, signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);


  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    const content = window.prompt("Todo content");

    if (!content) return;

    client.models.Todo.create({
      content,
      completed: false,
      createdAt: new Date().toISOString(),
    });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  function toggleTodo(todo: Schema["Todo"]["type"]) {
    client.models.Todo.update({
      id: todo.id,
      completed: !todo.completed,
    });
  }

  return (
    <div>
      <div style={{
        position: "fixed",
        top: 50,
        left: 50,
        right: 50,
        bottom: 50,
        display: "flex",
        flexDirection: "column",
        background: "white",
      }}>

        {/* HEADER */}
        <div style={{
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
          padding: "16px",
          borderBottom: "1px solid #ccc",
        }}>
          <button onClick={signOut}>Sign out</button>
          <h1>{user?.signInDetails?.loginId}'s todos</h1>
          <button onClick={createTodo}>+ new</button>
        </div>

        {/* SCROLL AREA (ONLY SCROLL EVER) */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px",
        }}>
          <ul style={{ listStyle: "none", padding: 20 ,     maxWidth: "600px",   // controls width
    margin: "0 auto",    // centers horizontally
    width: "100%",}}>
            {todos.map(todo => (
              <li key={todo.id}
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "8px",
                  borderBottom: "1px solid #eee"
                }}>

                <span
                  onClick={() => toggleTodo(todo)}
                  style={{
                    flex: 1,
                    cursor: "pointer",
                    textDecoration: todo.completed ? "line-through" : "none"
                  }}
                >
                  {todo.content}
                </span>



                <button onClick={() => deleteTodo(todo.id)}>
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* FOOTER */}
        <div style={{
          flexShrink: 0,
          padding: "10px",
          borderTop: "1px solid #ccc"
        }}>
          🥳 App ready
        </div>

      </div>
    </div>

  );
}




