'use strict';

const dynamoDb = require('./services/dynamoDb');

async function getStatusFromLocation(location) {
  let result = await dynamoDb.getByLocation(location);
  
  if (!result) {
    return {};
  }
  
  const date = new Date(result.createdAt);
  
  return {
    location: location,
    hasCoffee: result.message.data.hasCoffee,
    createdAt: result.createdAt,
    date: date.toLocaleDateString("en-US", {timeZone: "America/Sao_Paulo"}),
    time: date.toLocaleTimeString("en-US", {timeZone: "America/Sao_Paulo"})
  };
}

async function getStatusFromLocations(locations) {
  let results = [];
  
  for (const location of locations) {
    let result = await getStatusFromLocation(location);
    
    results.push(result);
  }
  
  return results;
}

function isSlack(event) {
  return event.hasOwnProperty('formparams');
}

function buildResponseSlack(results) {
  let message = {
    attachments: [],
  }
  
  results.forEach((item) => {
    message.attachments.push({
      title: item.location,
      text: (item.hasCoffee ? "tem café! :coffee:" : "acabou o café! :x:"),
      color: (item.hasCoffee ? 'good' : 'danger'),
      ts: Math.floor(item.createdAt/1000)
    });
  });
  
  return message;
}

module.exports.statusRetrive = async (event) => {
  const locations = ["Sala 1006", "Sala 1007"];
  
  let results = await getStatusFromLocations(locations);
  
  if (isSlack(event)) {
    return buildResponseSlack(results);
  }
  
  return {
    statusCode: 200,
    body: {
      results
    }
  };
};
