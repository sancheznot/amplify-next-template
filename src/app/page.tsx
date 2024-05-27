"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
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
      client.models.Task.create({ title, content });
    }
  }

  function deleteTodo(id: string) {
    client.models.Task.delete({ id });
  }

  return (
    <main className="w-full justify-center items-center h-full">
      <div className="w-full h-[999%] flex flex-col justify-center items-center">
        <h1 className="text-6xl sm:text-5xl font-thin self-start justify-self-start">
          My todos
        </h1>
        {user && (
          <p className="text-2xl sm:text-xl font-extralight">
            Welcome, {user.signInDetails.loginId}!
          </p>
        )}
        <button
          onClick={createTodo}
          className="w-3/12 justify-self-center sm:self-end mr-1">
          + new
        </button>
        <ul className="w-full grid grid-cols-12 bg-transparent border-none gap-2 p-2">
          {todos.map((todo) => (
            <>
              <li
                key={todo.id}
                className="col-span-3 sm:col-span-6 w-full rounded-lg"
                onClick={() => deleteTodo(todo.id)}>
                <div className="flex flex-col">
                  <h6 className="text-blue-500 text-sm font-light">Title: </h6>
                  <h5 className="text-xl font-semibold ml-2">{todo.title}</h5>
                  <p className="text-blue-500 text-sm font-light">Remember: </p>
                  <p className="font-light ml-2">{todo.content}</p>
                </div>
              </li>
            </>
          ))}
        </ul>
      </div>
      <div className="w-full flex justify-end items-end h-1/2 p-2">
        <button className="self-end" onClick={() => signOut()}>
          Sign Out
        </button>
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
