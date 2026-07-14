import Fastify from 'fastify'; 
import cors from '@fastify/cors'

import {createTable } from './model/db'
import urlRoutes from './routes/urlRoutes'; 

const fastify = Fastify({
  logger: true
});

fastify.register(cors);
fastify.register(urlRoutes);


const PORT = 3000;

fastify.get('/', (req, reply) => {
    reply.send({
        "Status" : "OK"
    })
})

async function start(){
    createTable();
    try{
        await fastify.listen({ 
            port: 3000,
            host:'0.0.0.0',
        }); 
    } catch(err){
        fastify.log.error(err);
        process.exit(1); 
    }
}


start();


