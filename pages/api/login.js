import magicAdmin from '../../lib/magic';
import { isNewUser, createNewUser } from '../../lib/db/hasura';
import {createHasuraClient} from '../../lib/db/hasuraClient';
import { setTokenCookie } from '../../lib/cookies'; 

export default async function login(req, res) {
    if (req.method === "POST") {
      try {
        const auth = req.headers.authorization;
        const DIDToken = auth ? auth.substr(7) : "";
  
        const metadata = await magicAdmin.users.getMetadataByToken(DIDToken);
        const { token, queryHasura } = createHasuraClient(metadata);
        const isNewUserQuery = await isNewUser(DIDToken,metadata.issuer, queryHasura);
        if(isNewUserQuery){
          const responseNewUser = await createNewUser(DIDToken,metadata,queryHasura);
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