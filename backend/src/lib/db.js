import mongoose from "mongoose"

// Conectando con mongodb
export const connectDB = async () => {
 try{
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDb connected: ${conn.connection.host}`)
 }catch(error) {
    console.log("Mongo DB connection error:", error)
 }
}