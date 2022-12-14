import {
    Context,
    APIGatewayProxyResult,
    APIGatewayProxyEvent
} from 'aws-lambda';
import {getEventBody, parseFile} from "../lib/utils";
import {Env} from "../lib/env";
import {FileServiceProps, TodoService} from "../service/TodoService";

const bucket = Env.get('TODO_BUCKET')
const todoService = new TodoService({
    bucketName: bucket
})

export async function handler(event: APIGatewayProxyEvent, context: Context):
    Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify({success: true})
    }
    try {
        const fileData = getEventBody(event) as FileServiceProps
        const url = await todoService.getPresignedUrl(fileData)
        result.body = JSON.stringify({
            url: url,
            ...fileData
        })
    } catch (error) {
        result.statusCode = 500
        result.body = error.message
    }
    return result
}