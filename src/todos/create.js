'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.text !== 'string') {
    console.error('Validation Failed'); // eslint-disable-line no-console
    callback(new Error('Couldn\'t create the todo item.'));
    return;
  }

  const params = {
	// PCJ: Minor change from original, use environment variable for stage sensitive table name
    TableName: process.env.TABLE_NAME,
    Item: {
      id: uuid.v1(),
      text: data.text,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  // write the todo to the database
  dynamoDb.put(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error); // eslint-disable-line no-console
      callback(new Error('Couldn\'t create the todo item.'));
      return;
    }

    // create a resonse
    const response = {
      statusCode: 200,
		// PCJ: Minor change from original, return full item inserted instead of empty result
		// body: JSON.stringify(result.Item),
		body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
