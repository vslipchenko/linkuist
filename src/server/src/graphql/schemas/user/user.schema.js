const {userInputs} = require("./user.inputs");
const {userTypes} = require("./user.types");
const {userMutationTypeDefinitions, userMutationResolvers} = require("./user.mutations");
const {userQueryTypeDefinitions, userQueryResolvers} = require("./user.queries");

module.exports = {
    userTypeDefinitions: [userTypes, userInputs, userQueryTypeDefinitions, userMutationTypeDefinitions],
    userResolvers: [userQueryResolvers, userMutationResolvers]
};
