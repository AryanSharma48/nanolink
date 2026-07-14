import { FastifyInstance } from "fastify";
import { allRows, addToDb, redirectId } from "../controllers/urlController";

export default async function (fastify: FastifyInstance){
    fastify.get('/all', allRows);
    fastify.post('/url', addToDb );
    fastify.get('/:shortId', redirectId);

}



