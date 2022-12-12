import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {Stack} from "aws-cdk-lib";
import {GenericDynamoTable} from "../lib/generic/GenericDynamoTable";


export class TodoAppStatefulStack extends Stack {
    public todoTable: GenericDynamoTable

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.todoTable = new GenericDynamoTable(this, 'TodoDynamoDBTable', {
            tableName: 'Todo',
            primaryKey: 'id'
        })
    }
}
