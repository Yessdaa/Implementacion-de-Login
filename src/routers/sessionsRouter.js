import { Router } from "express";
import { userModel } from "../services/models/user.model.js";
import { Users } from '../services/users/UsersClass.js'

const sessionRouterView = Router()


sessionRouterView.post('/register', async (req, res) => {
    const { name, lastName, email, username, password } = req.body;
    const userExists = await userModel.findOne({ email })
    if (userExists) {
        return res.status(402).send({ status: 'error', message: 'El usuario ya existe.' })
    }

    const user = new Users(name, lastName, email, username, password)
    const result = await userModel.create(user)
    res.send({ status: 'success', message: 'Usuario creado con exito con ID:' + result.id })
})

sessionRouterView.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)

    const user = await userModel.findOne({ email, password })
    if (!user) return res.status(401).send({ status: 'error', error: 'Crecenciales Incorrectas.' })

    const findAdmin = await userModel.findOne({ email: 'adminCoder@coder.com' })
    console.log(findAdmin)
    if (findAdmin) {        
        req.session.user = {
            name: `${user.name} ${user.lastName}`,
            email: user.email,
            role: 'administrador'
        }
    }
    else{
        req.session.role = 'usuario'
        req.session.user = {
            name: `${user.name} ${user.lastName}`,
            email: user.email,
            role:'Usuario'
        }
    }

    res.send({ status: 'success', payload: req.session.user, message: 'Login Aceptado' })
})

sessionRouterView.get("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error) {
            res.json({ error: "error logout", mensaje: "Error al cerrar la sesion" });
        }
        res.send("Sesion cerrada correctamente.");
    });
});

export { sessionRouterView }