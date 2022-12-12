import {
    Context,
    APIGatewayProxyResult,
    APIGatewayProxyEvent
} from 'aws-lambda';
import {Env} from "../lib/env";
import {TodoService} from "../service/TodoService";
import {getPathParameter, getQueryString} from "../lib/utils";

const table = Env.get('TODO_TABLE')
const todoService = new TodoService({
    table: table
})

export async function handler(event: APIGatewayProxyEvent, context: Context):
    Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: ''
    }

    const todo = await todoService.list()

    result.body = JSON.stringify(todo)
    return result
}