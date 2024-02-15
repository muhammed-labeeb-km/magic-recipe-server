const jwt = require('jsonwebtoken')

const jwtMiddleware = (req,res,next)=>{
    console.log("inside the jwtMiddleware");
    try{
        const token = req.headers['authorization'].split(" ")[1]
        // console.log(token);
        if(token){      
            const jwtResponse = jwt.verify(token,process.env.JWT_SECRET_KEY)
            req.payload = jwtResponse.userId
            // console.log(req.payload);
            next()
        }
        else{
            res.status(406).json("No token provided")
        }
        
    }
    catch(err){
        res.status(401).json("Access denied...please login")
    }
    
}

module.exports = jwtMiddleware