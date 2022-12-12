import {Construct} from "constructs";
import {GenericApi} from "../generic/GenericApi";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {uploadTodoSchema} from "./todo-schema";
import {Bucket} from "aws-cdk-lib/aws-s3";

export interface TodoApiProps {
    todoBucket: Bucket
}

export class TodoApis extends GenericApi {
    private props: TodoApiProps
    private uploadApi: NodejsFunction


    public constructor(scope: Construct, id: string, props: TodoApiProps) {
        super(scope, id)
        this.props = props
        this.addApis();
        props.todoBucket.grantPut(this.uploadApi)
    }

    private addApis(){
        const todosApiResource = this.api.root.addResource('todos')

        this.uploadApi = this.addMethod({
            functionName: 'todo-post-upload',
            handlerName: 'todo-upload-handler.ts',
            verb: 'POST',
            resource: todosApiResource,
            environment: {
                TODO_BUCKET: this.props.todoBucket.bucketName
            },
            validateRequestBody: false,
            // bodySchema: uploadTodoSchema
        })

    }

}