import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { allRows, addToDb, redirectId } from "../controllers/urlController";

export default async function (fastify: FastifyInstance) {
    const app = fastify.withTypeProvider<ZodTypeProvider>();

    app.get('/all', allRows);

    app.post('/url', {
        schema: {
            body: z.object({
                url: z.string().url("Must be a valid URL")
            })
        },
        config: {
            rateLimit: {
                max: 10,
                timeWindow: '1 minute',
            }
        }
    }, addToDb);

    app.get('/:shortId', redirectId);
}
