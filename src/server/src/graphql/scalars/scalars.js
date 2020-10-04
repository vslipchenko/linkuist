const {VoidTypeDefinition, VoidResolver} = require('./void.scalar');

module.exports = {
  scalarTypeDefinitions: [
    VoidTypeDefinition
  ],
  scalarResolvers: [
    {[VoidResolver.name]: VoidResolver}
  ]
};
