import mongoose from "mongoose";

const userCollection = "users"

const userSchema = new mongoose.Schema({
    id: Object,
    name: String,
    lastName: String,
    email: { type: String, unique: true },
    username: String,
    password: String,
    fecharegistro: String
   
})

export const userModel = mongoose.model(userCollection, userSchema)