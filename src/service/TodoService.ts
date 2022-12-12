import { v4 as uuidv4 } from 'uuid'
import { TodoEntity} from "./types";
import {S3} from "aws-sdk";
const AWS = require('aws-sdk');


interface TodoServiceProps{
    bucketName: string
}

export class TodoService {

    private props: TodoServiceProps
    private s3: S3
    private bucketName: string

    public constructor(props: TodoServiceProps){
        this.props = props
        this.s3 = new AWS.S3();
        this.bucketName = props.bucketName
    }

    async upload(params: TodoEntity): Promise<TodoEntity> {
        const entity = {
            id: uuidv4(),
            ...params,
        }
        await this.s3.putObject({
            Bucket: this.bucketName,
            Key: params.fileName,
            ACL: 'public-read',
            Body: params.data
        }).promise()
        return entity
    }

}