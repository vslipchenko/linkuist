const {userInputs} = require("./user.inputs");
const {userTypes} = require("./user.types");
const {userMutationTypeDefs} = require("./user.mutations");
const {userMutationResolvers} = require("./user.mutations");

module.exports = {
    userTypeDefs: [userTypes, userInputs, userMutationTypeDefs],
    userResolvers: [userMutationResolvers]
};
