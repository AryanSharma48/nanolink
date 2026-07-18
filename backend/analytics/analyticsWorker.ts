import {Kafka,  KafkaConfig, Consumer, EachMessagePayload } from 'kafkajs';
import { pool } from '../model/db'
import type { LinkClickPayload } from '../model/kafka'

const kafkaConfig: KafkaConfig = {
    clientId : 'my-app', 
    brokers : [ process.env.KAFKA_BROKERS || 'localhost:9092' ],
}

const kafka = new Kafka(kafkaConfig);

const consumer: Consumer = kafka.consumer({
    groupId: 'analytics-worker-group',
})

async function runWorker(): Promise<void> {
    await consumer.connect();
    await consumer.subscribe({
        topic: 'link-clicks',
        fromBeginning : true,
    })
    await consumer.run({
        eachMessage: async ( { topic, partition, message}: EachMessagePayload ) => {
            try {
                const rawValue = message.value?.toString();
                
                const payload : LinkClickPayload = JSON.parse(rawValue as string); 

                // Add data to db
                await pool.query('INSERT INTO analytics (short_code, ip, user_agent) VALUES ($1, $2, $3)', [payload.shortId, payload.ip, payload.userAgent]);
            } catch(error){
                console.error('Inserting event anayltics failed', error);
            }
        }
    })
}

runWorker();