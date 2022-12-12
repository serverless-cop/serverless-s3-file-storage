import {
    Context,
    APIGatewayProxyResult,
    APIGatewayProxyEvent
} from 'aws-lambda';
import {extractFile, FileData} from "../lib/utils";
import {Env} from "../lib/env";
import {TodoService} from "../service/TodoService";

const bucket = Env.get('TODO_BUCKET')
const todoService = new TodoService({
    bucketName: bucket
})

export async function handler(event: APIGatewayProxyEvent, context: Context):
    Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Empty!'
    }
    try {
        const fileData = extractFile(event) as FileData
        const todo = await todoService.upload(fileData)
        result.body = JSON.stringify(todo)
    } catch (error) {
        result.statusCode = 500
        result.body = error.message
    }
    return result
}