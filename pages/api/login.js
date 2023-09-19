import magicAdmin from '../../lib/magic';
import { isNewUser, createNewUser } from '../../lib/db/hasura';
import jwt from "jsonwebtoken";
import { setTokenCookie } from '../../lib/cookies'; 

export default async function login(req, res) {
    if (req.method === "POST") {
      try {
        const auth = req.headers.authorization;
        const DIDToken = auth ? auth.substr(7) : "";
  
        const metadata = await magicAdmin.users.getMetadataByToken(DIDToken);
        const token = jwt.sign(
          {
            ...metadata,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
            "https://hasura.io/jwt/claims": {
              "x-hasura-allowed-roles": ["user", "admin"],
              "x-hasura-default-role": "user",
              "x-hasura-user-id": `${metadata.issuer}`,
            },
          },
          process.env.JWT_SECRET
        );
        const isNewUserQuery = await isNewUser(token,metadata.issuer);
        if(isNewUserQuery){
          const responseNewUser = await createNewUser(token,metadata);
          const cookie = setTokenCookie(token, res);
          res.send({ done: true, responseNewUser});
        }else{
          const cookie = setTokenCookie(token, res);
          res.send({ done: true, new: false});
        } 
        
      } catch (error) {
        console.error("Something went wrong logging in", error);
        res.status(500).send({ done: false, error, header: req.headers });
      }
    } else {
      res.send({ done: false,  });
    }
}