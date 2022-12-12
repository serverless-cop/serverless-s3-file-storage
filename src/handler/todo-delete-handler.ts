import {
    Context,
    APIGatewayProxyResult,
    APIGatewayProxyEvent
} from 'aws-lambda';
import {Env} from "../lib/env";
import {TodoService} from "../service/TodoService";
import {getEventBody, getPathParameter} from "../lib/utils";
import {TodoCreateParams, TodoDeleteParams} from "../service/types";

const table = Env.get('TODO_TABLE')
const todoService = new TodoService({
    table: table
})

export async function handler(event: APIGatewayProxyEvent, context: Context):
    Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello From Todo Edit Api!'
    }
    try {
        const id = getPathParameter(event, 'id')
        const todo = await todoService.delete({
            id: id
        })
        result.body = JSON.stringify(todo)
    } catch (error) {
        console.error(error.message)
        result.statusCode = 500
        result.body = error.message
    }
    return result
}