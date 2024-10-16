"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Todo = {
  _id: string
  todo: string
  isCompleted: boolean
}

const API_BASE_URL = "http://localhost:4080/todos"

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check authentication when the component is mounted
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(API_BASE_URL, {
          credentials: "include",
        })

        if (response.status === 401) {
          // User is not authenticated, redirect to login page with a message
          router.push("/login?message=Please log in to view your todos")
        } else {
          fetchTodos()
        }
      } catch (err) {
        console.log("Error checking authentication", err)
      }
    }

    checkAuth()
  }, [router])

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_BASE_URL, {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch todos")
      }

      const data = await response.json()
      setTodos(data.data || [])
    } catch (err) {
      console.log("Failed to fetch todos", err)
    } finally {
      setIsLoading(false)
    }
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo: newTodo }),
        credentials: "include",
      })

      if (response.status === 401) {
        router.push(
          "/login?message=Your session has expired. Please log in again."
        )
        return
      }

      if (!response.ok) {
        throw new Error("Failed to add todo")
      }

      const data = await response.json()
      setTodos([...todos, data.data])
      setNewTodo("")
    } catch (err) {
      setError(`Failed to add todo ${err}`)
    }
  }

  const toggleTodo = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PATCH",
        credentials: "include",
      })

      if (response.status === 401) {
        router.push(
          "/login?message=Your session has expired. Please log in again."
        )
        return
      }

      if (!response.ok) {
        throw new Error("Failed to update todo")
      }

      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
        )
      )
    } catch (err) {
      setError(`Failed to add todo ${err}`)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.status === 401) {
        router.push(
          "/login?message=Your session has expired. Please log in again."
        )
        return
      }

      if (!response.ok) {
        throw new Error("Failed to delete todo")
      }

      setTodos(todos.filter((todo) => todo._id !== id))
    } catch (err) {
      setError(`Failed to add todo ${err}`)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4080/users/logout", {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        router.push("/login?message=You have been logged out")
      } else {
        throw new Error("Logout failed")
      }
    } catch (err) {
      setError(`Failed logout ${err}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="flex justify-between items-center pb-3">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Todo List
          </CardTitle>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={addTodo} className="flex space-x-2 mb-4">
            <Input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              className="flex-grow"
            />
            <Button type="submit">Add</Button>
          </form>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className="flex items-center justify-between bg-white p-3 rounded-lg shadow"
              >
                <span
                  className={`flex-grow ${
                    todo.isCompleted ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todo.todo}
                </span>
                <div className="space-x-2">
                  <Button
                    onClick={() => toggleTodo(todo._id)}
                    variant="outline"
                    size="sm"
                  >
                    {todo.isCompleted ? "Undo" : "Complete"}
                  </Button>
                  <Button
                    onClick={() => deleteTodo(todo._id)}
                    variant="destructive"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
