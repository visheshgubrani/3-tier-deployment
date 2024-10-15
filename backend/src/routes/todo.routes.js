import { Router } from "express"
import {
  completeTodo,
  createTodo,
  deleteTodo,
  getTodos,
} from "../controllers/todo.controller.js"
import verifyJwt from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJwt)
router.route("/").get(getTodos).post(createTodo)
router.route("/:todoId").delete(deleteTodo).patch(completeTodo)

export default router
