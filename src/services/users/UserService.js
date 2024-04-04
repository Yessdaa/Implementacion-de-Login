import { userModel } from '../models/user.model.js'
import moment from 'moment'
import crypto from 'crypto'
import { BadRequestError, NotFoundError } from '../../utils/errors.js'
import dotenv from 'dotenv';
import mongoose from "mongoose";

dotenv.config();
const { ObjectId } = mongoose.Types;
export class UserManager {
    encryptionKey = process.env.ENCRYPTION_KEY;
    encryptionIV = process.env.ENCRYPTION_IV;
    

    getAllUser = async () => {
        const users = await userModel.find()
        return users
    }

    saveUser = async (newUser) => {
        const isDuplicateEmail = await userModel.findOne({ email: newUser.email })
        if (isDuplicateEmail) {
            throw new BadRequestError(`Ya existe un usuario con ese mismo email: ${newUser.email}`)
        }
        const isDuplicateUsername = await userModel.findOne({ username: newUser.username })
        if (isDuplicateUsername) {
            throw new BadRequestError(`Ya existe un usuario con ese nombre de usuario: ${newUser.username}`)
        }
        const encryptedPassword = this.encrypt(newUser.password)
        newUser.fecharegistro = moment().format()
        const user = await userModel.create({ ...newUser, password: encryptedPassword })
        console.log(encryptedPassword)
        return user;
    }

    getUserById = async (_id) => {
       const userId = ObjectId.isValid(_id) ? new ObjectId(_id) : null;
       if (!userId) {
           throw new BadRequestError('No se proporcionó un ID de usuario válido');
       }   
       const user = await userModel.findOne({ _id: userId });   
       if (!user) {
           throw new NotFoundError('No existe un usuario con ese ID');
       }   
       return user;
    }

    encrypt(password) {
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.encryptionKey, 'hex'), Buffer.from(this.encryptionIV, 'hex'));
        let encrypted = cipher.update(password);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('hex');
    }
}