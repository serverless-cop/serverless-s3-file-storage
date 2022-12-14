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
    private presignedUrlApi: NodejsFunction

    public constructor(scope: Construct, id: string, props: TodoApiProps) {
        super(scope, id)
        this.props = props
        this.addApis();
        props.todoBucket.grantReadWrite(this.uploadApi)
        props.todoBucket.grantReadWrite(this.presignedUrlApi)
    }

    private addApis(){
        const todosApiResource = this.api.root.addResource('todos')
        const uploadApiResource = todosApiResource.addResource('upload')
        const presignedUrlApiResource = todosApiResource.addResource('presignedUrl')

        this.uploadApi = this.addMethod({
            functionName: 'todo-post-upload',
            handlerName: 'todo-upload-handler.ts',
            verb: 'POST',
            resource: uploadApiResource,
            environment: {
                TODO_BUCKET: this.props.todoBucket.bucketName
            },
            validateRequestBody: false,
            // bodySchema: uploadTodoSchema
        })

        this.presignedUrlApi = this.addMethod({
            functionName: 'todo-post-presigned-url',
            handlerName: 'todo-put-presigned-handler.ts',
            verb: 'POST',
            resource: presignedUrlApiResource,
            environment: {
                TODO_BUCKET: this.props.todoBucket.bucketName
            },
            validateRequestBody: false,
            // bodySchema: uploadTodoSchema
        })
    }
}