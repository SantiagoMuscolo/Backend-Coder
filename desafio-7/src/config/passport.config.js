const Passport = require('passport');
const Local = require('passport-local');
const GitHubStrategy = require('passport-github2');
const UserModel = require('../dao/models/user.model');
const userModel = require('../dao/models/user.model');
const bcrypt = require("bcrypt");

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

const LocalStrategy = Local.Strategy;
const initializePassport = () => {
    Passport.use(
        "register",
        new LocalStrategy(
            { passReqToCallback: true, usernameField: "email" },
            async (req, username, password, done) => {
                const { first_name, last_name, email, age } = req.body;

                try {
                    let user = await UserModel.findOne({ email: username });
                    if (user) {
                        console.log("El usuario " + email + " ya se encuentra registrado!");
                        return done(null, false);
                    }

                    const hashedPassword = createHash(password); 

                    user = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: hashedPassword, 
                    };

                    console.log(user);

                    if (user.email == "adminCoder@coder.com") {
                        user.role = "admin";
                    }

                    let result = await UserModel.create(user);

                    if (result) {
                        return done(null, result);
                    }
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    Passport.use("/", new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (username, password, done) => {
        try {
            let user = await userModel.findOne({ email: username });
            console.log(user);

            if (!user) {
                console.log("Error! El usuario no existe!");
                return done(null, false);
            }

            if (!isValidPassword(user, password)) {
                console.log("Error! La contraseña es inválida!");
                return done(null, false);
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    Passport.use("github", new GitHubStrategy({
        clientID: "Iv1.150877ba9d848d6a",
        clientSecret: "34cd8e43f3dcd56707a368a3d49be8a23209b84f",
        callbackURL: "http://localhost:8080/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await UserModel.findOne({ email: profile._json.email });

            if (user) {
                return done(null, user);
            } else {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    email: profile._json.email,
                    age: 100,
                    password: ""
                }

                let result = await UserModel.create(newUser);

                return done(null, result);
            }
        } catch (error) {
            return done(error);
        }
    }));

    Passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    Passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById(id);
        done(null, user);
    });
}

module.exports = initializePassport;