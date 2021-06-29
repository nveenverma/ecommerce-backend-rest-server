const User = require('../../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const shortid = require('shortid')

// Admin Signup Logic
exports.signup = (req, res) => {
    User.findOne({ email : req.body.email })
    .exec( async ( error, user ) => {
        // If admin doesn't exists
        if (user) {
            return res.status(400).json({
                message : 'Admin already registered'
            })
        }
    
        const {
            firstName,
            lastName,
            email,
            password
        } = req.body;

        const hash_password = await bcrypt.hash(password, 10);

        const _user = new User({
            firstName,
            lastName,
            email,
            hash_password,
            username : shortid.generate(),
            role: 'admin'
        })
        
        _user.save((error, data) => {
            if (error) {
                res.status(400).json({
                    message : 'Something went wrong'
                })
            }
            
            if (data) {
                res.status(201).json({
                    message : 'Admin created successfully...!'
                })
            }
        });
    });
}

// Signin Logic
exports.signin = (req, res) => {
    User.findOne({ email : req.body.email })
    .exec(async (error, user) => {
        if (error) return res.status(400).json({ error });
        if (user) {
            const isPassword = await user.authenticate(req.body.password)

            if (isPassword && user.role=='admin') {
                
                // Generating JSON Web Token from the id returned
                const token = jwt.sign({ _id : user._id, role : user.role }, process.env.JWT_TOKEN, { expiresIn : '1d' });
                const { _id, firstName, lastName, email, role, fullName } = user;
                res.cookie('token', token, { expiresIn : '1d' });
                
                // Return JSON Web Token along with the user profile
                return res.status(200).json({
                    token,
                    user : { _id, firstName, lastName, email, role, fullName }
                })
            } else {
                return res.status(400).json({
                    message : "Invalid Password"
                })
            }
        } else {
            return res.status(400).json({ message : 'Something went wrong' });
        }
    })
}

// Signout Logic
exports.signout = (req, res) => {

    res.clearCookie('token');
    res.status(200).json({
        message : 'Signout Successfully'
    });
    
}