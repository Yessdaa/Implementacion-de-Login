
import multer from 'multer'
import { __dirname } from '../dirname.js'

const storage = multer.diskStorage({
  
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/public/up`)
    },


    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

export const uploader = multer({
    storage,
  
    onError: function (err, next) {
        console.log(err);
        next();
    }
})