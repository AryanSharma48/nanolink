import { Kafka, KafkaConfig, Producer, Consumer } from 'kafkajs';

const kafkaConfig: KafkaConfig = ({
    clientId: 'my-app',
    brokers: [process.env.KAFKA_BROKERS || 'localhost:9092']
})

const kafka = new Kafka(kafkaConfig);

export const producer: Producer = kafka.producer();

export async function initKafka(): Promise<void> {
    try {
        await producer.connect();
        console.log("Succesfully connected to Kafka brokers!")
    } catch (error){
        console.error('Failed to connect to Kafka client: ', error);
    }
}

export interface LinkClickPayload {
  shortId: string;
  ip: string;
  userAgent: string;
}

export async function publishClickEvent(shortId: string, ip: string, userAgent: string): Promise<void> {

    const payload: LinkClickPayload = {
        shortId : shortId,
        ip : ip,
        userAgent : userAgent,
    }

    try {
        await producer.send({
            topic: 'link-clicks',
            messages : [
                {
                    value: JSON.stringify(payload),
                }
            ]
        });
        console.log("Successfully sent payload to client");

    } catch (error){
        console.error("Failed to send payload: ", error);
    }
}