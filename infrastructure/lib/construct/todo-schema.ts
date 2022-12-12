import {JsonSchemaType} from "aws-cdk-lib/aws-apigateway";

export const uploadTodoSchema = {
    type: JsonSchemaType.OBJECT,
    required: ["description"],
    properties: {
        description: {
            type: JsonSchemaType.STRING
        },
    },
}
