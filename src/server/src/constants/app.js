const {parseCliFlagValue} = require('../utilities/parse-cli-flags');
const environment = parseCliFlagValue('env');
// Include dev or prod env variables file dynamically
require('dotenv').config({path: `src/environments/.env.${environment}`});

module.exports = process.env;
