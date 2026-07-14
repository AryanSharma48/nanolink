import {FastifyRequest, FastifyReply} from 'fastify'

import {createTable, getAllRows, getRedirectId, insertIntoDb } from '../model/db'
import { randomUrl } from "../utils/crypto"

//shows all rows from db
export async function allRows(req : FastifyRequest, reply: FastifyReply) : Promise<void> {
    const result = await getAllRows();
    reply.send({
        'RESULT' : result.rows
    })
}

export async function addToDb(req: FastifyRequest, reply: FastifyReply) : Promise<void> {

    const {url} = req.body as {url : string};
    if (url) {
        //randomizing new url
        const token : string = randomUrl();
        await insertIntoDb(url, token);
        reply.send({ "Shortened URL" : `http://localhost:3000/${token}` });
    }   
    else{
        reply.send("No url submitted, Try again!");
    } 
}

export async function redirectId(req: FastifyRequest<{ Params: {shortId: string}}>, reply: FastifyReply){
    const shortId = req.params.shortId as string;
    const redirect = await getRedirectId(shortId);
    if (redirect)
    reply.redirect(redirect);
}