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

    async upload(params: any){
        await this.s3.putObject({
            Bucket: this.bucketName,
            Key: uuidv4() + params.data.filename,
            Body: params.data.content.data
        }).promise()
    }

}