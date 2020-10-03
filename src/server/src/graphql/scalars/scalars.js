const {VoidTypeDef, VoidResolver} = require('./void.scalar');

module.exports = {
  scalarTypeDefs: [
    VoidTypeDef
  ],
  scalarResolvers: [
    {[VoidResolver.name]: VoidResolver}
  ]
};
