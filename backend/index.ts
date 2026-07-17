import Fastify from 'fastify'; 
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import { config } from './utils/config';
import { pool } from './model/db';
import client, { connectRedis } from './model/redis';
import urlRoutes from './routes/urlRoutes'; 

const fastify = Fastify({
  logger: true
});

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

fastify.register(helmet);
fastify.register(cors, {
    origin: '*' // Restrict this to your frontend URL
});
fastify.register(fastifyRateLimit, {
    global: false,
});
fastify.register(urlRoutes);

fastify.setErrorHandler(function (error, request, reply) {
    if ((error as any).statusCode === 429) {
        reply.status(429).send({ error: "Too Many Requests" });
    } else if ((error as any).validation) {
        reply.status(400).send({ error: "Validation Error", details: (error as any).validation });
    } else {
        request.log.error(error);
        reply.status(500).send({ error: "Internal Server Error" });
    }
});

fastify.get('/', (req, reply) => {
    reply.send({ "Status": "OK" });
});

async function start() {
    try {
        await connectRedis();
        await fastify.listen({ 
            port: parseInt(config.PORT),
            host: '0.0.0.0',
        }); 
    } catch(err) {
        fastify.log.error(err);
        process.exit(1); 
    }
}

// Graceful shutdown
const shutdown = async (signal: string) => {
    fastify.log.info(`Received ${signal}. Shutting down gracefully...`);
    try {
        await fastify.close();
        await pool.end();
        await client.quit();
        process.exit(0);
    } catch (err) {
        fastify.log.error(err, 'Error during shutdown');
        process.exit(1);
    }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();
