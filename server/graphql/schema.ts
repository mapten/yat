import { buildSchema } from 'graphql';

module.exports = buildSchema(`
  type RootQuery {

  }

  schema {
    query: RootQuery
  }
`);