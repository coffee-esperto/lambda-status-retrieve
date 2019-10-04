const AWS = require('aws-sdk');
require('dotenv/config');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE = process.env.TABLE_DYNAMODB;
const REGION = process.env.REGION;

AWS.config.update({
  region: REGION,
});

const getByLocation = (location) => {
  var params = {
    TableName: TABLE,
    IndexName: "location-createdAt-index",
    FilterExpression: "#location = :location",
    ExpressionAttributeNames: {"#location": "location"},
    ExpressionAttributeValues: {":location": location}
  };
  
  return new Promise((resolve, reject) => {
    dynamoDb.scan(params, (error, data) => {
      if (error) {
        return reject(error);
      }
      
      data.Items.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        }
        
        if (a.createdAt < b.createdAt) {
          return 1;
        }
        
        return 0;
      });
      
      data.Items.forEach((itemdata) => {
        resolve(itemdata);
      });
      
      resolve(undefined);
    });
  });
};

module.exports = {
  getByLocation,
};