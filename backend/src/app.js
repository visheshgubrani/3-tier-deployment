import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import todoRouter from "./routes/todo.routes.js"

const app = express()
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())

// Routes
app.use("/api/users", userRouter)
app.use("/api/todos", todoRouter)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" })
})
export default app
