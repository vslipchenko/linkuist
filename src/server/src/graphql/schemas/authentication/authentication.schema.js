const {authenticationInputs} = require('./authentication.inputs');
const {authenticationTypes} = require('./authentication.types');
const {authenticationQueryTypeDefinitions, authenticationQueryResolvers} = require('./authentication.query');

module.exports = {
  authenticationTypeDefinitions: [authenticationTypes, authenticationInputs, authenticationQueryTypeDefinitions],
  authenticationResolvers: [authenticationQueryResolvers]
};
