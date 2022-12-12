import {
    JsonSchema,
    JsonSchemaType,
    LambdaIntegration,
    Model,
    RequestValidator,
    RestApi
} from "aws-cdk-lib/aws-apigateway";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {join} from "path";
import config from "../../config/config";
import * as cdk from "aws-cdk-lib";
import {Construct} from "constructs";
import {Resource} from "aws-cdk-lib/aws-apigateway/lib/resource";

export interface Methodprops {
    functionName: string
    handlerName: string
    verb: string
    resource: Resource
    environment: any
    bodySchema?: JsonSchema
    validateRequestBody: boolean
}

export abstract class GenericApi extends Construct {
    public lambdaIntegration: LambdaIntegration;
    protected api: RestApi
    protected functions = new Map<string,NodejsFunction>()
    protected model: Model
    protected requestValidator: RequestValidator

    // private docs: GenerateOpenApiSpecProps

    protected constructor(scope: Construct, id: string, props?: cdk.StackProps){
        super(scope, id);
        this.api = new RestApi(this, id)
    }

    protected addMethod(props: Methodprops): NodejsFunction{
        const apiId = config.account + '-' + config.env + '-' + props.functionName
        let options: any = {}
        if(props.validateRequestBody && props.bodySchema){
            this.model = new Model(this, apiId + '-model-validator',
                {
                restApi: this.api,
                contentType: "application/json",
                description: "To validate the request body",
                schema: props.bodySchema
            })
            this.requestValidator = new RequestValidator(this, apiId + '-body-validator',
                {
                restApi: this.api,
                validateRequestBody: props.validateRequestBody,
            })
            options.requestValidator = this.requestValidator
            options.requestModels = {
                "application/json": this.model,
            }
        }

        const lambda = new NodejsFunction(this, apiId, {
            entry: join(__dirname, '..', '..', '..','src', 'handler', props.handlerName),
            handler: 'handler',
            functionName: apiId,
            environment: props.environment
        })
        this.functions.set(apiId,lambda)
        this.lambdaIntegration = new LambdaIntegration(lambda)
        props.resource.addMethod(props.verb, this.lambdaIntegration, options)
        return lambda;
    }

    public generateDocs(){
        // TODO
    }

}