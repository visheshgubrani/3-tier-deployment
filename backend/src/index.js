import connectDb from "./db/connectDb.js"
import app from "./app.js"
import dotenv from "dotenv"

dotenv.config()

connectDb()
  .then(() => {
    const port = process.env.PORT || 4080
    app.listen(port, () => {
      console.log(`The server is running on http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.log(`The Server failed to run ${error}`)
  })
