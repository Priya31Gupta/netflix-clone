import  jwt  from "jsonwebtoken";
import { findVideoByUser, insertStats, updateStats } from '../../lib/db/hasura';
import {createHasuraClient} from '../../lib/db/hasuraClient';

export default async function stats(req, res) {
    const {token} = req.cookies;
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
    const {queryHasura} = createHasuraClient(decodedToken);
    if (req.method === "POST") {
        try{
            if(req.cookies.token){

                const { videoId, favourited, watched = true } = req.body;
                const findVideoId = await findVideoByUser(token, decodedToken.issuer, videoId, queryHasura);

                if(findVideoId?.data?.stats.length !== 0){
                    const updatedStatsRes = await updateStats(token, {
                        videoId, 
                        userId: decodedToken.issuer,
                        watched, 
                        favourited
                    },queryHasura);
                    res.status(200).send({message: 'Posted', decodedToken, findVideoId, updatedStatsRes});
                }else{
                    const insertStatsRes = await insertStats(token,{
                        watched,
                        userId: decodedToken.issuer,
                        videoId,
                        favourited
                    },queryHasura);
                    res.status(200).send({message: 'Posted', findVideoId,insertStatsRes });
                }
            }else{
                res.status(403).send("Not authorized")
            }
        }catch(err){
            res.status(404).send({err: err.message})
        }
    }else if(req.method === "GET"){
        try{
            if(req.cookies.token){
                const token = req.cookies.token;
                const decodedToken = jwt.decode(token);
                const {videoId} = req.query;
                const userVideos = await await findVideoByUser(token, decodedToken.issuer, videoId,queryHasura);
                res.status(201).send({userVideos : userVideos })

            }else{
                res.status(403).send({message: 'Token is required'})
            }

        }catch(err){
            res.status(404).send({ err: err.message  });
        }
    }
    else{
        res.status(500).send({ message: 'Not Posted',  });
    }
}