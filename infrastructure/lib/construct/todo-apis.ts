import {Construct} from "constructs";
import {GenericDynamoTable} from "../generic/GenericDynamoTable";
import {GenericApi} from "../generic/GenericApi";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {createTodoSchema, editTodoSchema} from "./todo-schema";

export interface TodoApiProps {
    todoTable: GenericDynamoTable
}

export class TodoApis extends GenericApi {
    private props: TodoApiProps
    private listApi: NodejsFunction
    private getApi: NodejsFunction
    private createApi: NodejsFunction
    private editApi: NodejsFunction
    private deleteApi: NodejsFunction

    public constructor(scope: Construct, id: string, props: TodoApiProps) {
        super(scope, id)
        this.props = props
        this.addApis();

        this.props.todoTable.table.grantFullAccess(this.listApi.grantPrincipal)
        this.props.todoTable.table.grantFullAccess(this.getApi.grantPrincipal)
        this.props.todoTable.table.grantFullAccess(this.createApi.grantPrincipal)
        this.props.todoTable.table.grantFullAccess(this.editApi.grantPrincipal)
        this.props.todoTable.table.grantFullAccess(this.deleteApi.grantPrincipal)
    }

    private addApis(){
        const todosApiResource = this.api.root.addResource('todos')
        const todoIdResource = todosApiResource.addResource('{id}')

        this.listApi = this.addMethod({
            functionName: 'todo-list',
            handlerName: 'todo-list-handler.ts',
            verb: 'GET',
            resource: todosApiResource,
            environment: {
                TODO_TABLE: this.props.todoTable.table.tableName
            },
            validateRequestBody: false,
        })

        this.getApi = this.addMethod({
            functionName: 'todo-get',
            handlerName: 'todo-get-handler.ts',
            verb: 'GET',
            resource: todoIdResource,
            environment: {
                TODO_TABLE: this.props.todoTable.table.tableName
            },
            validateRequestBody: false,
        })

        this.createApi = this.addMethod({
            functionName: 'todo-post',
            handlerName: 'todo-create-handler.ts',
            verb: 'POST',
            resource: todosApiResource,
            environment: {
                TODO_TABLE: this.props.todoTable.table.tableName
            },
            validateRequestBody: true,
            bodySchema: createTodoSchema
        })

        this.editApi = this.addMethod({
            functionName: 'todo-put',
            handlerName: 'todo-edit-handler.ts',
            verb: 'PUT',
            resource: todosApiResource,
            environment: {
                TODO_TABLE: this.props.todoTable.table.tableName
            },
            validateRequestBody: true,
            bodySchema: editTodoSchema
        })

        this.deleteApi = this.addMethod({
            functionName: 'todo-delete',
            handlerName: 'todo-delete-handler.ts',
            verb: 'DELETE',
            resource: todoIdResource,
            environment: {
                TODO_TABLE: this.props.todoTable.table.tableName
            },
            validateRequestBody: false
        })
    }

}