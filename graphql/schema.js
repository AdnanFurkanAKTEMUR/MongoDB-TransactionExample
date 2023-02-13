const { makeExecutableSchema } = require('@graphql-tools/schema')

const resourcesTypeDefs = require("./typeDefs/resources_type")
const resourcesResolvers = require("./resolvers/resources_resolvers")
const schema = makeExecutableSchema({
  typeDefs: [resourcesTypeDefs],
  resolvers: [resourcesResolvers]
})

module.exports = schema