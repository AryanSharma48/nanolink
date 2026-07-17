import {FastifyRequest, FastifyReply} from 'fastify'

import {createTable, getAllRows, getRedirectId, insertIntoDb } from '../model/db'
import { randomUrl } from "../utils/crypto"
import { isValidUrl } from "../utils/urlCheck"

//shows all rows from db
export async function allRows(req : FastifyRequest, reply: FastifyReply) : Promise<void> {
    const result = await getAllRows();
    reply.send({
        'RESULT' : result.rows
    })
}

export async function addToDb(req: FastifyRequest, reply: FastifyReply) : Promise<void> {

    const {url} = req.body as {url : string};
    const validURL = isValidUrl(url);
    if (validURL) {

        let isInserted = false;
        let token : string = "";
        
        //Preventing collision due to base62 token
        while(!isInserted){
            try {
                token = randomUrl();
                await insertIntoDb(url, token);
                reply.send({ "Shortened URL" : `http://localhost:3000/${token}` });
                isInserted = true;

            } catch (error){
                if((error as any).code === '23505'){
                    //do nothing, let is loop to the next iteration
                }
                else{
                    console.error(error);
                    reply.status(500).send("Internal Server Error");
                    isInserted = true;
                }
            }   
        }
    }   
    else{
        reply.status(400).send("Invalid URL, Try again!");
    } 
}

export async function redirectId(req: FastifyRequest<{ Params: {shortId: string}}>, reply: FastifyReply){
    const shortId = req.params.shortId as string;
    const redirect = await getRedirectId(shortId);
    if (redirect)
        reply.redirect(redirect);
    else {   
        reply.status(404).send("URL not found!");
    }
}