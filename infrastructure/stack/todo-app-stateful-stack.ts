import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {CfnOutput, Fn, Stack} from "aws-cdk-lib";
import {Bucket, HttpMethods} from "aws-cdk-lib/aws-s3";
import {Effect, PolicyStatement} from "aws-cdk-lib/aws-iam";


export class TodoAppStatefulStack extends Stack {
    private suffix: string;
    public todosPhotoBucket: Bucket;
    public uploadTodoPhotosPolicy: PolicyStatement;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        this.initializeSuffix()
        this.initializeTodosPhotosBucket()
    }

    private initializeSuffix() {
        const shortStackId = Fn.select(2, Fn.split('/', this.stackId));
        const Suffix = Fn.select(4, Fn.split('-', shortStackId));
        this.suffix = Suffix;
    }

    private initializeTodosPhotosBucket() {
        this.todosPhotoBucket = new Bucket(this, 'todo-photos', {
            bucketName: 'todo-photos-' + this.suffix,
            cors: [{
                allowedMethods: [
                    HttpMethods.HEAD,
                    HttpMethods.GET,
                    HttpMethods.PUT
                ],
                allowedOrigins: ['*'],
                allowedHeaders: ['*']
            }]
        });
        new CfnOutput(this, 'todo-photos-bucket-name', {
            value: this.todosPhotoBucket.bucketName
        })
    }

    private initializeBucketPolicies() {
        this.uploadTodoPhotosPolicy = new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                's3:PutObject',
                's3:PutObjectAcl'
            ],
            resources: [this.todosPhotoBucket.bucketArn + '/*']
        });
    }
}
