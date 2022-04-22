export interface Context {
    functionName?: string;
    functionVersion?: string;
    memoryLimitInMB?: number;
    requestId?: string;
    token?: {
        access_token: string;
        expires_in: number;
        token_type: string;
    };

    getRemainingTimeInMillis?: () => number;
    getPayload?: () => unknown;
}

export interface Event {
    httpMethod: string;
    headers: Record<string, string>
    multiValueHeaders: Record<string, string[]>;
    queryStringParameters: Record<string, string>;
    multiValueQueryStringParameters: Record<string, string[]>;
    isBase64Encoded: boolean;
    body: any;
    requestContext: {
        httpMethod: string;
        requestId: string;
        requestTime: string;
        requestTimeEpoch: number;
        authorizer?: Record<string, string>;
        apiGateway?: Record<string, string>;
        identity: {
            sourceIp: string;
            userAgent: string;
        }
    }
}
export interface Messages {
    messages: Array<{
        event_metadata: {
            event_id: string;
            event_type: string;
            created_at: string;
            tracing_context: null;
            cloud_id: string;
            folder_id: string;
        };
        details: {
            queue_id: string;
            message: {
                message_id: string;
                md5_of_body: string;
                body: string;
                attributes: {
                    ApproximateFirstReceiveTimestamp: string;
                    ApproximateReceiveCount: string;
                    SentTimestamp: string;
                };
                message_attributes: object;
                md5_of_message_attributes: string;
            };
        };
    }>;
}