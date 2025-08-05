"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from "@aws-amplify/ui-react";
import type { Schema } from "../../amplify/data/resource";
import "@aws-amplify/ui-react/styles.css";
import "./amplify-config";

const client = generateClient<Schema>();

export default function Home() {
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
    client.models.Todo.create({
      content: window.prompt("Todo content"),
      done: false,
    });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="font-sans min-h-screen p-8">
          <div className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-center mb-4">
                🚀 My First Amplify App
              </h1>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  Welcome, {user?.signInDetails?.loginId}!
                </p>
                <button
                  onClick={signOut}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Sign out
                </button>
              </div>
            </header>

            <main className="space-y-6">
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Todo List</h2>
                <button
                  onClick={createTodo}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                >
                  + Add new todo
                </button>
                <ul className="space-y-2">
                  {todos.map((todo) => (
                    <li
                      key={todo.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                      <span className="text-lg">{todo.content}</span>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">
                  🎉 Congratulations!
                </h3>
                <p className="text-gray-700">
                  You&apos;ve successfully created your first AWS Amplify app with:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li>✅ User authentication</li>
                  <li>✅ Real-time database</li>
                  <li>✅ Secure API</li>
                  <li>✅ Modern React/Next.js frontend</li>
                </ul>
              </div>
            </main>
          </div>
        </div>
      )}
    </Authenticator>
  );
}
