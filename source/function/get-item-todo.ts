const tableName = process.env.TODO_TABLE_NAME;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();


exports.getItemTodoHandler = async (event: any,context:any) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`Get All Todos only accept GET Method, you tried : ${event.httpMethod}`)
    }
    console.info('received:', event)

    var params = {
        TableName: tableName
    };
    const data = await docClient.scan(params).promise();
    const items = data.Items;
    //console.log('items contains: ',items)
    //console.log('Stringified items contains: ',JSON.stringify(items))
    //console.log(`Body is ${items[0].body}`)
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(items)
    };

    console.info(`response from : ${event.path} statusCode:${response.statusCode} body:${response.body}`);
    return response;


}