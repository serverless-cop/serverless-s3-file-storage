import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {Stack} from "aws-cdk-lib";
import {TodoApis} from "../lib/construct/todo-apis";
import {TodoAppStatefulStack} from "./todo-app-stateful-stack";


export interface TodoAppProps{
  todoAppStatefulStack: TodoAppStatefulStack
}

export class TodoAppStack extends Stack {

  public todoApis:TodoApis

  constructor(scope: Construct, id: string, todoAppProps: TodoAppProps,  props?: cdk.StackProps) {
    super(scope, id, props);
    this.todoApis = new TodoApis(this,id, {
      todoTable: todoAppProps.todoAppStatefulStack.todoTable
    })
  }


}
