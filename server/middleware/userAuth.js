import jwt from 'jsonwebtoken';

const userAuth = async(req,res,next)=>{
    // Try to get token from cookies first, then from Authorization header
    let token = req.cookies.token;
    
    if(!token && req.headers.authorization){
        // Extract token from "Bearer <token>" format
        token = req.headers.authorization.replace('Bearer ', '');
    }

    if(!token){
        return res.status(401).json({success:false,message:"Not authorized login again"});
    }

    try{
       
        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);

        if(tokenDecode.id){
            req.user = { userId: tokenDecode.id };
        }
        else{
            return res.status(401).json({success:false, message:"Not authorized login again"});
        }

        next();
    }

    catch(error){
        return res.status(401).json({success:false,message:error.message});
    }
};

export default userAuth;