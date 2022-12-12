import {
    Context,
    APIGatewayProxyResult,
    APIGatewayProxyEvent
} from 'aws-lambda';
import {getEventBody, getPathParameter} from "../lib/utils";
import {Env} from "../lib/env";
import {TodoService} from "../service/TodoService";
import {TodoCreateParams} from "../service/types";

const table = Env.get('TODO_TABLE')
const todoService = new TodoService({
    table: table
})

export async function handler(event: APIGatewayProxyEvent, context: Context):
    Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Empty!'
    }
    try {
        const item = getEventBody(event) as TodoCreateParams;
        const todo = await todoService.create(item)
        result.body = JSON.stringify(todo)
    } catch (error) {
        result.statusCode = 500
        result.body = error.message
    }
    return result
}