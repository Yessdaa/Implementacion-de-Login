import { BadRequestError, NotFoundError } from "../../../utils/index.js";
import moment from 'moment';
import { messageModel } from '../models/message.model.js';

export class Messages {
    
    getAllMessage = async () => {
        const getMessage = await messageModel.find()
        return getMessage
    }

    saveMessage = async (msg) => {
        console.log(msg)
        const saveMessage = await messageModel.create(msg)
        return saveMessage;
    }

}