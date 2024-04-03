import passport from 'passport';
import passportLocal from 'passport-local';
import { userModel } from '../services/models/user.model.js';
import { createHash, isValidPassword } from '../utils/utils.js';
import GitHubStrategy from 'passport-github2'

const localStrategy = passportLocal.Strategy;

const initializePassport = () => {
    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.4c828d9538584d1c',
            clientSecret: 'f7d756a38971cc1d000349cee2ff366ae715175e',
            callbackURL: 'http://localhost:8080/api/sessions/githubcallback', 
            scope: ['user:email']
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                const response = await fetch('https://api.github.com/user/emails', {
                    headers: {
                        'Authorization': `token ${accessToken}`
                    }
                });
                const emails = await response.json();
                const primaryEmailObj = emails.find(email => email.primary && email.verified);
                if (!primaryEmailObj) {
                    console.warn("No se encontró un correo electrónico principal y verificado.");
                    return done(null, false);
                }
                const primaryEmail = primaryEmailObj.email;

                console.log("Correo electrónico principal encontrado:", primaryEmail);

                const user = await userModel.findOne({ email: primaryEmail });

                if (!user) {
                    console.warn("No existe un usuario con ese email: " + primaryEmail);
                    let newUser = {
                        name: profile.displayName ,
                        lastName: profile._json.name, 
                        email: primaryEmail,
                        password: '', 
                        loggedBy: 'GitHub'
                    }
                    console.log("Creando nuevo usuario:", newUser);
                    const result = await userModel.create(newUser);
                    return done(null, result);
                } else {
                    return done(null, user);
                }
            } catch (error) {
                console.error("Error durante la autenticación de GitHub:", error);
                return done(error);
            }
        }
    ));

    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { name, lastName, email } = req.body
            try {
                const exists = await userModel.findOne({ email })
                if (exists) {
                    console.log("El usuario ya existe!!");
                    return done(null, false)
                }

                const user = {
                    name,
                    lastName,
                    email,
                    username,
                    password: createHash(password)
                }

                const result = await userModel.create(user);

                return done(null, result)
            } catch (error) {
                return done("Error registrando el usuario: " + error)
            }
        }
    ))

    passport.use('login', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username })
                console.log("Usuario encontrado para login:");
                console.log(user);

                if (!user) {
                    console.warn("Invalid credentials for user: " + username);
                    return done(null, false)
                }

                if (!isValidPassword(user, password)) {
                    console.warn("Invalid credentials for user: " + username);
                    return done(null, false)
                }

                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    ))


    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("Error deserializando el usuario:", error);
        }
    });
};


export default initializePassport;