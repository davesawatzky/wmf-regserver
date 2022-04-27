import fs from 'fs'
import 'dotenv/config'
import config from './config'
import { ApolloServer, gql } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { PrismaClient, Prisma } from '@prisma/client'
import express from 'express'
import http from 'http'
// import cors from 'cors'
import { Query, Mutation } from './graphql/index'
import { getUserFromToken } from './utils/getUserFromToken'

const db = new PrismaClient()
export interface Context {
  db: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
  userInfo: {
    userID: number
    staff: boolean
    admin: boolean
  } | null
}

const typeDefs = gql(
  fs.readFileSync('./src/graphql/schema.graphql', { encoding: 'utf8' })
)

async function startApolloServer(typeDefs: any, queries: any, mutations: any) {
  const app = express()
  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .disable('x-powered-by')
  // .use(cors(config.cors))

  const httpServer = http.createServer(app)

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers: {
      ...queries,
      ...mutations,
    },
    context: async ({ req }: any): Promise<Context> => {
      const userInfo = await getUserFromToken(req.headers.authorization)
      return {
        db,
        userInfo,
      }
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })
  await apolloServer.start()
  apolloServer.applyMiddleware({ app, path: '/graphql' })
  await httpServer.listen(config.port, config.ip, () => {
    console.log(
      `Server is running at http://${config.ip} on port ${config.port}.`
    )
  })
  return { apolloServer, app }
}

startApolloServer(typeDefs, Query, Mutation)
