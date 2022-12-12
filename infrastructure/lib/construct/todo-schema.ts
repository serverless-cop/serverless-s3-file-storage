import {JsonSchemaType} from "aws-cdk-lib/aws-apigateway";

export const createTodoSchema = {
    type: JsonSchemaType.OBJECT,
    required: ["description"],
    properties: {
        description: {
            type: JsonSchemaType.STRING
        },
    },
}

export const editTodoSchema = {
    type: JsonSchemaType.OBJECT,
    required: ["description", "id"],
    properties: {
        description: {
            type: JsonSchemaType.STRING
        },
        id: {
            type: JsonSchemaType.STRING
        },
    },
}
