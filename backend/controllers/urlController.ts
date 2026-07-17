import { FastifyRequest, FastifyReply } from 'fastify'

import { getAllRows, getRedirectId, insertIntoDb } from '../model/db'
import { randomUrl } from "../utils/crypto"
import client from "../model/redis"

//shows all rows from db with pagination
export async function allRows(req: FastifyRequest<{ Querystring: { page?: string, limit?: string } }>, reply: FastifyReply): Promise<void> {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "50", 10);
    const offset = (page - 1) * limit;

    const result = await getAllRows(limit, offset);
    reply.send({
        'RESULT': result.rows,
        'page': page,
        'limit': limit
    });
}

export async function addToDb(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    // Body is already validated by Zod at the route level
    const { url } = req.body as { url: string };
    
    let isInserted = false;
    let token: string = "";
    
    //Preventing collision due to base62 token
    while (!isInserted) {
        try {
            token = randomUrl();
            await insertIntoDb(url, token);
            reply.send({ "Shortened URL": `http://localhost:3000/${token}` });
            isInserted = true;

        } catch (error) {
            if ((error as any).code === '23505') {
                //do nothing, let it loop to the next iteration
            } else {
                // Let the centralized error handler catch this
                throw error;
            }
        }   
    }
}

export async function redirectId(req: FastifyRequest<{ Params: { shortId: string } }>, reply: FastifyReply) {
    const shortId = req.params.shortId as string;
    let redirect = await client.get(shortId);
    
    if (redirect) {
        if (redirect === "NOT_FOUND") {
            return reply.status(404).send("URL not found!");
        }
        return reply.redirect(redirect);
    } else {
        redirect = await getRedirectId(shortId);
        if (redirect) {
            await client.setEx(shortId, 86400, redirect);
            return reply.redirect(redirect);
        } else {
            // Cache penetration protection: Cache the negative result for 60 seconds
            await client.setEx(shortId, 60, "NOT_FOUND");
            return reply.status(404).send("URL not found!");
        }
    }
}