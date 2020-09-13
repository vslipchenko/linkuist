const {userInputs} = require("./user.inputs");
const {userTypes} = require("./user.types");
const {userMutationTypeDefs, userMutationResolvers} = require("./user.mutations");
const {userQueryTypeDefs, userQueryResolvers} = require("./user.queries");

module.exports = {
    userTypeDefs: [userTypes, userInputs, userQueryTypeDefs, userMutationTypeDefs],
    userResolvers: [userQueryResolvers, userMutationResolvers]
};
