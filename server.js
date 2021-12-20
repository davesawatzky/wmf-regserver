const fs = require('fs')
const config = require('./src/config')
const { ApolloServer, gql } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const express = require('express')
const http = require('http')
// const cors = require('cors')
const apiErrorHandler = require('./src/error/api-error-handler')
const { typeDefs: scalarTypeDefs } = require('graphql-scalars')

const resolvers = require('./src/graphql/resolvers')
const myTypeDefs = gql(
  fs.readFileSync('./src/graphql/schema.graphql', { encoding: 'utf8' })
)
const typeDefs = [...scalarTypeDefs, myTypeDefs]

async function startApolloServer(typeDefs, resolvers) {
  const app = express()
  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(apiErrorHandler)
    .disable('x-powered-by')
  // .use(cors(config.cors))

  const httpServer = http.createServer(app)
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })
  await apolloServer.start()
  apolloServer.applyMiddleware({ app, path: '/graphql' })
  await httpServer.listen(config.port, config.ip, () => {
    console.log(
      `Server is running at http://${config.ip} on port ${config.port}.`
    )
  })
}

startApolloServer(typeDefs, resolvers)
