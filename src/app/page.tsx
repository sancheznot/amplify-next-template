"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import AuthenticatorComponent from "@@/components/Authenticator"; // Ajusta la ruta si es necesario
Amplify.configure(outputs);

const client = generateClient<Schema>();

type AppProps = {
  signOut: () => void;
  user: {
    signInDetails: {
      loginId: string;
    };
    username: string;
  };
};

const App: React.FC<AppProps> = ({ signOut, user }) => {
  const [todos, setTodos] = useState<Array<Schema["Task"]["type"]>>([]);

  function listTodos() {
    client.models.Task?.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    const title = window.prompt("Todo title");
    const content = window.prompt("Todo content");
    if (title && content) {
      console.log(title, content)
      client.models.Task.create({ title, content });
    }
  }

  function deleteTodo(id: string) {
    client.models.Task.delete({ id });
  }

  return (
    <main>
      <h1>My todos</h1>
      {user && <p>Welcome, {user.signInDetails.loginId}!</p>}
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} onClick={() => deleteTodo(todo.id)}>
            {todo.content}
          </li>
        ))}
      </ul>
      <div>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    </main>
  );
};

export default function AppWithAuth() {
  return (
    <AuthenticatorComponent>
      <App
        signOut={() => {}}
        user={{
          signInDetails: {
            loginId: "",
          },
          username: "",
        }}
      />
    </AuthenticatorComponent>
  );
}
