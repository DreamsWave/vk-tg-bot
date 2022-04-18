import { SQS } from "aws-sdk";

export interface IYMQ {
    queueUrl: string;
    ymq: SQS;
    sendMessage(message: unknown): Promise<void>
}

export default class YMQ implements IYMQ {
    queueUrl: string;
    ymq: SQS;
    constructor(queueUrl: string) {
        this.queueUrl = queueUrl;
        this.ymq = new SQS({
            region: "ru-central1",
            endpoint: "https://message-queue.api.cloud.yandex.net",
        });
    }

    async sendMessage(message: unknown): Promise<void> {
        this.ymq.sendMessage()
        const params: SQS.SendMessageRequest = <SQS.SendMessageRequest>{
            QueueUrl: this.queueUrl,
            MessageBody: JSON.stringify(message)
        };
        try {
            const result = await this.ymq.sendMessage(params).promise();
            console.log("Message sent, ID: " + result["MessageId"]);
        } catch (error) {
            console.error(JSON.stringify(error));
        }
    }
}
