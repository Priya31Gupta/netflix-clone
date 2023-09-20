import magicAdmin from '../../lib/magic';
import { removeTokenCookies } from '../../lib/cookies'; 
import verifyToken from '../../lib/utils';

export default async function login(req, res) {
    try {
        if(!req.cookies.token){
            return res.status(401).json({ message: "Not logged in" });
        }
        const token = req.cookies.token;
        const issuer = await verifyToken(token);
        const cookie = removeTokenCookies(res);
        try{
            const loggingOut = await magicAdmin.users.logoutByIssuer(issuer);
        }catch(err){
            res.status(500).send({ err });
        }
        res.status(200).send({loggedOut: true});
    } catch (error) {
        console.error("Something went wrong logging out", error);
        res.status(500).send({ error: error.message });
    }
}