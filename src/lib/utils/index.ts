import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {ExternalError} from "../error";
const parseMultipart = require('parse-multipart');

export interface FileData {
    data: any
    fileName: any
}

export function generateRandomId(): string {
    return Math.random().toString(36).slice(2);
}

export function getEventBody(event: APIGatewayProxyEvent) {
    return typeof event.body == 'object' ? event.body : JSON.parse(event.body);
}

export function  getPathParameter(event: APIGatewayProxyEvent, parameter: string) {
    const value: string | undefined = event.pathParameters
        ? event['pathParameters'][parameter]
        : undefined
    if (!value) {
        throw new ExternalError(400, 'Path must contain path parameter `id`.')
    }
    return value
}

export function getQueryString(event: APIGatewayProxyEvent,
                               parameter: string) {
    let value: string | undefined
    const {queryStringParameters} = event;
    if (queryStringParameters) {
        value = queryStringParameters[parameter!];
    }
    if (!value) {
        throw new ExternalError(400, 'Path must contain path parameter `id`.')
    }
    return value
}

export function addCorsHeader(result: APIGatewayProxyResult) {
    result.headers = {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*'
    }
}

export function isIncludedInGroup(group: string, event: APIGatewayProxyEvent) {
    const groups = event.requestContext.authorizer?.claims['cognito:groups'];
    if (groups) {
        return (groups as string).includes(group)
    } else {
        return false
    }
}

export function extractFile(event: APIGatewayProxyEvent): FileData | {} {
    try {
        if(!event.body) return {}
        const boundary = parseMultipart.getBoundary(event.headers['content-type'])
        const parts = parseMultipart.Parse(Buffer.from(event.body, 'base64'), boundary);
        const [{ filename, data }] = parts
        return {
            filename,
            data
        }
    } catch (e) {
        throw new ExternalError(400, e.toString())
    }
}
