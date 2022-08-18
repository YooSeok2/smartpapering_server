require('dotenv').config();

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_PRIVATE_KEY;

exports.verifyAppToken = (req, res, next) =>{
    try{
        const clientToken = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(clientToken, SECRET_KEY);
        
        if(decoded){
            res.locals.userPhone = decoded.phone;
            res.locals.exp = decoded.exp
            next();
        }else{
            res.status(401).json({
                message : 'unauthorized',
                result : false
            })
        }
        
    }catch(err){
        res.status(401).json({message : 'tokenexpired', result : false})
    }
}

exports.verifyCmsToken = (req, res, next) =>{
    try{
        const clientToken = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(clientToken, SECRET_KEY);
        if(decoded){
            res.locals.id = decoded.id
            next();
        }else{
            res.status(401).json({
                error : 'unauthorized',
                result : false
            })
        }
        
    }catch(err){
        res.status(401).json({error : 'token expired', result : false})
    }
}
