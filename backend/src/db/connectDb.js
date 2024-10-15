import mongoose from "mongoose"

const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/todos`)
  } catch (error) {
    console.log(`Database Connection Error: ${error}`)
    process.exit(1)
  }
}

export default connectDb
