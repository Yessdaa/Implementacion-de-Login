import express from 'express'
import mongoose from 'mongoose'
import { UserManager } from '../services/users/UserService.js'
import { Users } from '../services/users/UserClass.js'
import { ApiResponse } from '../utils/apiResponse.js'


const userManager = new UserManager()
const userRoutes = express.Router()

userRoutes.get('/', async (req, res) => {
    try {
        const users = await userManager.getAllUser()
        return ApiResponse.success(res, users)
    } catch (error) {
        return ApiResponse.error(res, error)
    }
})

userRoutes.post('/', async (req, res) => {
    try {
        const { name, lastName, email, username, password } = req.body
        const newUser = new Users(name, lastName, email, username, password)
        const user = await userManager.saveUser(newUser)
        return ApiResponse.success(res, user)
    } catch (error) {
        return ApiResponse.error(res, error)
    }
})

userRoutes.get('/:id?', async (req, res) => {
    try {
        const { id } = req.params
        const user = await userManager.getUserById(id)       
        return ApiResponse.success(res, user)
    } catch (error) {
        return ApiResponse.error(res, error)

    }
})

export { userRoutes }