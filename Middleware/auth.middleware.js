const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    if(req.method === 'OPTION'){
        next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({message: 'Auth error'});
        }else {
            const decoded = jwt.verify(token, config.get('secretKey'));
            req.user = decoded;
            next();
        }
        
    } catch (e) {
        return res.status(402).json({message: 'Auth error'});
    }
}