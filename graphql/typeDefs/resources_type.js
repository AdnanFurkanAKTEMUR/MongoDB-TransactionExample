const { gql } = require('apollo-server')

module.exports = gql`
type Resources {
    _id: String
    resources: String
    counter: Int
}

input getResourcesInput {
  resources:String!
}

type Query {
  getAllResources: [Resources]
  getResources(input: getResourcesInput): Resources
}
type Mutation {
  updateResources(input: getResourcesInput): Resources
  deleteResources(input: getResourcesInput): Resources
  createResources(input: getResourcesInput): Resources
  insertMultiDocument: [Resources]
}
`