import jwt from 'jsonwebtoken';

const verifyToken = async (token) => {
    if (!token) {
        console.error("No token provided");
        return null; // Token is missing, return null
    }

    try {
        // Verify the token with the secret
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // Return the issuer or any other part of the token payload you need
        return decodedToken.issuer;
    } catch (error) {
        // Log the error to debug if the token verification fails
        console.error("Error verifying token:", error);

        // Return null to indicate invalid token
        return null;
    }
};

export default verifyToken;
