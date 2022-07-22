import { IdentitySource } from "aws-cdk-lib/aws-apigateway";


const dynamodb = require('aws-sdk/clients/dynamodb');
const doClient = new dynamodb.DocumentClient();

const tablename = process.env.TODO_TABLE_NAME;


exports.putItemTodoHandler = async (event: any) => {
    if(event.httpMethod !== 'POST') {
        throw new Error (`Get All Todos only accept POST Method, you tried : ${event.httpMethod}`)
    }
    console.info('received:',event)

    const body = JSON.parse(event.body);
    const id = body.id;
    const name = body.name;
    var params = {
        TableName: tablename,
        Item: { id: id , name: name }
    };
    const data = await doClient.put(params).promise();
    const items = data.Items;

    const response = {
        statusCode: 200,
        body: JSON.stringify(items)
    };

    console.info(`response from : ${event.path} statusCode:${response.statusCode} body:${response.body}`);
    return response;

    
}