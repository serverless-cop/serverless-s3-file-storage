import { v4 as uuidv4 } from 'uuid'
import {S3} from "aws-sdk";
import s3Client from 'aws-sdk/clients/s3'


interface TodoServiceProps{
    bucketName: string
}

export interface FileServiceProps{
    bucketName: string
    fileName: string
    contentType: string
    expireSeconds: number
}

export class TodoService {

    private props: TodoServiceProps
    private s3: S3
    private bucketName: string

    public constructor(props: TodoServiceProps){
        this.props = props
        this.s3 = new S3();
        this.bucketName = props.bucketName
    }

    async upload(params: any){
        await this.s3.putObject({
            Bucket: this.bucketName,
            Key: uuidv4() + params.data.filename,
            Body: params.data.content.data
        }).promise()
    }

    async getPresignedUrl(params: FileServiceProps): Promise<string> {
        const url = this.s3.getSignedUrl('putObject', {
            Bucket: params.bucketName,
            Key: params.fileName,
            Expires: params.expireSeconds,
            ContentType: params.contentType
        })
        return url;
    }

}