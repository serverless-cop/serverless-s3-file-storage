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
    const id = getPathParameter(event, 'id')
    const todo = await todoService.get({
        id: id
    })

    result.body = JSON.stringify(todo)
    return result
}