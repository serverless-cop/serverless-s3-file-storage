import { DocumentClient, ScanInput } from 'aws-sdk/clients/dynamodb'
import { v4 as uuidv4 } from 'uuid'
import {ExternalError} from "../lib/error";
import {TodoCreateParams, TodoDeleteParams, TodoEditParams, TodoEntity, TodoGetParams} from "./types";

interface TodoServiceProps{
    table: string
}

export class TodoService {

    private props: TodoServiceProps
    private documentClient = new DocumentClient()

    public constructor(props: TodoServiceProps){
        this.props = props
    }

    async list(): Promise<TodoEntity[]> {

        const response = await this.documentClient
            .scan({
                TableName: this.props.table,
            }).promise()
        if (response.Items === undefined) {
            return [] as TodoEntity[]
        }
        return response.Items as TodoEntity[]
    }

    async get(params: TodoGetParams): Promise<TodoEntity> {
        const id = params.id
        const response = await this.documentClient
            .get({
                TableName: this.props.table,
                Key: {
                    id: id,
                },
            }).promise()
        if (response.Item === undefined) {
            return {} as TodoEntity
        }
        return response.Item as TodoEntity
    }

    async create(params: TodoCreateParams): Promise<TodoEntity> {
        const todo: TodoEntity = {
            id: uuidv4(),
            ...params,
        }
        const response = await this.documentClient
            .put({
                TableName: this.props.table,
                Item: todo,
            }).promise()
        return todo
    }

    async edit(params: TodoEditParams): Promise<TodoEntity> {
        const response = await this.documentClient
            .put({
                TableName: this.props.table,
                Item: params,
            }).promise()
        return params
    }

    async delete(params: TodoDeleteParams) {
        const response = await this.documentClient
            .delete({
                TableName: this.props.table,
                Key: {
                    id: params.id
                },
            }).promise()
    }

}