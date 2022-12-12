#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TodoAppStack } from '../stack/todo-app-stack';
import {TodoAppStatefulStack} from "../stack/todo-app-stateful-stack";

const app = new cdk.App();

const statefulStack = new TodoAppStatefulStack(app, 'TodoStatefulStack')
new TodoAppStack(app, 'TodoApiStack', {
    todoAppStatefulStack: statefulStack
});