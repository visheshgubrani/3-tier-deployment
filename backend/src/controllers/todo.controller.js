import Todo from "../models/todo.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const createTodo = asyncHandler(async (req, res) => {
  const user = req.user?._id
  const { todo } = req.body
  if (!todo) {
    throw new ApiError(400, "Todo is required")
  }

  const newTodo = await Todo.create({
    todo,
    isCompleted: false,
    createdBy: user,
  })

  if (!newTodo) {
    throw new ApiError(400, "Failed to create todo")
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Todo created successfully", newTodo))
})

const getTodos = asyncHandler(async (req, res) => {
  const user = req.user?._id
  if (!user) {
    throw new ApiError(401, "Unauthorized")
  }
  const todos = await Todo.find({ createdBy: user })

  if (!todos || todos.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, "No todos found for this user", []))
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Todos Fetched Successfully", todos))
})

const deleteTodo = asyncHandler(async (req, res) => {
  const user = req.user?._id
  const { todoId } = req.params
  if (!user) {
    throw new ApiError(401, "Unauthorized")
  }

  if (!todoId) {
    throw new ApiError(400, "Invalid Todo")
  }
  await Todo.findByIdAndDelete(todoId)

  return res
    .status(200)
    .json(new ApiResponse(200, "Todo Deleted Successfully", {}))
})

const completeTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params
  const user = req.user?._id
  if (!user) {
    throw new ApiError(401, "Unauthorized")
  }
  if (!todoId) {
    throw new ApiError(400, "Invalid Todo")
  }
  const todo = await Todo.findOne({ _id: todoId, createdBy: user })

  if (!todo) {
    throw new ApiError(
      404,
      "Todo not found or you're not authorized to access it"
    )
  }

  todo.isCompleted = !todo.isCompleted

  await todo.save()

  return res
    .status(200)
    .json(new ApiResponse(200, "Successfully Marked Complete", todo))
})

export { createTodo, getTodos, deleteTodo, completeTodo }
