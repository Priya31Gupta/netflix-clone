import jwt from 'jsonwebtoken';

const verifyToken = async (token) => {
    if(token){
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        return decodedToken.issuer;
    }else{
        return null;
    }
}

export default verifyToken;