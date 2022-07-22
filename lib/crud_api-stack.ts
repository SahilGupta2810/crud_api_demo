import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Function, FunctionAttributes, Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class CrudApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    //Create a DynamoDB Table
    //Create a Lambda Function
    //Grant Read write access to Lambda on DynamoDB table
    //Create an API Gateway and config it


    const todoTable = new Table(this, "Todo-Table" , {
      tableName: "Todo-Table",
      partitionKey: { 
        name: "name" , 
        type: AttributeType.STRING
      },
      removalPolicy: RemovalPolicy.DESTROY
    })

    const getItem = new Function(this, "Get-Item", {
      runtime: Runtime.NODEJS_16_X,
      functionName: 'get-item-todo',
      description: 'Lambda to fetch all todo`s',
      code: Code.fromAsset(path.join(__dirname,'../source/function')),
      handler: "get-item-todo.getItemTodoHandler",
      environment: {
        TODO_TABLE_NAME : todoTable.tableName
      }
    })

    todoTable.grantReadWriteData(getItem);

    const putItem = new Function(this, "Put-Item", {
      runtime: Runtime.NODEJS_16_X,
      functionName: 'put-item-todo',
      description: 'Lambda to add item in todo`s table',
      code: Code.fromAsset(path.join(__dirname,'../source/function')),
      handler: "put-item-todo.putItemTodoHandler",
      environment: {
        TODO_TABLE_NAME : todoTable.tableName
      }
    })

    todoTable.grantReadWriteData(putItem)
     
    //Create a API Gateway method and path
    const api = new RestApi(this, 'todo-api');
    //define resources and methods
    api.root
      .resourceForPath('todo')
      .addMethod("GET",new LambdaIntegration(getItem))

    api.root
      .resourceForPath('todo')
      .addMethod("POST",new LambdaIntegration(putItem))    


    new CfnOutput(this, "API URL", {
      value: api.url ?? "Something went wrong"
    });
  }
}


