let xRay = require("aws-xray-sdk");
let AWS = xRay.captureAWS(require('aws-sdk'));
const sns = new AWS.SNS();
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = function (event, context, callback) {

    ddb.put({
        TableName: 'BTMenu',
        Item: { 'itemCode': 1 }
    }).promise()
        .then((data) => {
            console.log("Successfully saved entry");
            sendSNSNotification("Successfully saved entry", callback);
        })
        .catch((err) => {
            console.log("Failed to save entry", err);
            sendSNSNotification("Failed to save entry", callback);
        });
}

function sendSNSNotification(message, callback) {
    sns.publish({
        Message: message,
        MessageAttributes: {},
        MessageStructure: 'String',
        TopicArn: 'arn:aws:sns:us-east-1:318300609668:udith-test'
    }).promise()
        .then(data => {
            console.log("Sent notification", message);
            callback(null, "Sent notification");
        })
        .catch(err => {
            console.log("Failed to send notification", message);
            callback(null, "Notification sending failed");
        });
}