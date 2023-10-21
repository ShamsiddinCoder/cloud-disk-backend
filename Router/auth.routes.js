const Router = require('express');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const router = new Router();
const User = require('../models/UserModels');
const authMiddleWare = require('../Middleware/auth.middleware');
const config = require('config');
const FileServices = require('../fileServices/FileServices');
const File = require('../models/Files');

router.post('/registration', 
    [
        check('email', 'Uncorrect email').isEmail(),
        check('password', 'Password must be longer than 3 ans shorter than 12').isLength({min: 3, max: 12})
    ],

    async (req, res) => {
        try {
            const error = validationResult(req);
            if(!error.isEmpty()){
                return res.status(400).json({message: 'Uncorrect request', error});
            }

            const {email, password} = req.body;
            const candidate = await User.findOne({email});
            if(candidate){
                return res.status(400).json({message: `User with email ${email} already exist`});
            }

            const hashPassword = await bcrypt.hash(password, 8);

            const user = new User({email, password: hashPassword});
            await user.save();
            await FileServices.createDir(req, new File({user: user.id, name: ''}));
            return res.json({message: 'Registratsiya ok!'});
        } catch (error) {
            console.log(error);
            res.end({message: 'Server error'});
        }
    }
);

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: 'User not found'});
        }
        const isPassValid = bcrypt.compareSync(password, user.password);
        if(!isPassValid){
            return res.status(400).json({message: 'Invalid password'});
        }

        const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: '1h'});

        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                usedSpace: user.usedSpace,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.log(error);
        res.send({message: 'Server error'});
    }
});

router.get('/auth', authMiddleWare, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.user.id});

        const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: '1h'});
        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                diskspace: user.diskSpace,
                usedSpace: user.usedSpace,
                avatar: user.avatar
            }
        })
    } catch (error) {
        console.log(error);
        res.send({message: 'Server error'});
    }
});

module.exports = router;