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

module.exports.statusRetrive = async (event) => {
  const locations = ["Sala 1006", "Sala 1007"];
  
  let results = await getStatusFromLocations(locations);

  return {
    statusCode: 200,
    body: {
      results
    }
  };
};
