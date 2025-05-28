// for creating, reading, updating, and deleting users
const {Router} = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const userDAO = require('../daos/auth');
const bcrypt = require('bcrypt');

// make sure to come back to this and set up a real secret
// this is just for testing; don't ever do this for real!
const secret = process.env.JWT_SECRET;

// reusable component for authentication
async function authMiddleware(req, res, next) {
    try {
        // grab whatever is in the header for authorization (hopefully a token is in there)
        const authHeader = req.headers.authorization;

        // error out if there's no header or no token in it
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({error: `Auth header missing or problematic`});
        }

        // split the authHeader by spaces, creating an array 
        // where the first item is "Bearer"
        // then get the second item in the array, which should be the token
        const token = authHeader.split(' ')[1];

        // use the secret to verify the token (I think?)
        try {
            // verify the token
            const decoded = jwt.verify(token, secret);
            req.user = decoded;

            // user is authenticated, proceed
            next();

        } catch(err) {
            return res.status(401).json({ err: 'invalid or old token' })
        }


    } catch (error) {
        console.error(error);
        return res.status(401).json({error: `Stuck at the guard shack; you shall not pass`})
    }
}

// function to create a json web token
function createToken(user) {
    // identify the things you want to take in for a new user
    const payload = {
        _id: user._id,
        email: user.email,
        roles: user.roles,
    };

    // create a variable called token which stores the result
    // of jsonwebtoken signing off on the inputs the user has provided
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });
    return token; 
}

// new user signup
router.post("/signup", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({error: `email and password aren't optional`});
        }

        // if the email and password match an existing user's email and password
        // then put up a 409 error (if someone tries to sign in via the sign up)
        const existingUser = await userDAO.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'are you already signed up? This user already exists' })
        }

        // hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // create the user
        const newUser = await userDAO.createUser({email, passwordHash});

        if(!newUser) {
            return res.status(400).json({error: `Someone already created an account with that email. Maybe it was you?`})
        }

        const token = createToken(newUser);

        res.status(200).json({token})
    } catch(err){
        console.error(err, "signup error");
        res.status(500).json({err: "Peter says this was internal server error"});
    }
});

// login
router.post("/login", async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({error: `need both an email and a password`});
        }

        const user = await userDAO.login(email, password);

        if(!user) {
            return res.status(401).json({error: `Invalid email or password`});
        }

        const token = createToken(user);

        // send the token back to the client
        res.json({token});
    } catch (err) {
        next(err);
    }
});

// logout
function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout failed:', err);
            return res.status(500).send('Logout failed');
        }
        res.clearCookie('connect.sid'); // name of the session cookie
        res.send('Logged out successfully');
    });
}

// update password
router.put("/password", authMiddleware, async (req, res, next) => {
    try {
        const {email, password} = req.body;

        // if the provided password is empty, then reject it
        if(password === '' || password === null) {
            return res.status(400).json({error: `empty password field`});
        }

        if(!password) {
            return res.status(401).json({error: `you can't edit a password that doesn't exist`});
        }

        const user = await userDAO.getUserById(req.user._id);
        if (!user) {
            return res.status(401).json({ error: `Invalid email or missing user` });
        }

        // generate a new hash of the new password
        const passwordHash = await bcrypt.hash(password, 10);

        await userDAO.updateUserPassword(user._id, passwordHash);

        const token = createToken(user);

        res.status(200).json({token});

    } catch (err) {
        next(err);
    }
});

module.exports = { router, authMiddleware }