import fs from 'fs'
import dotenv from 'dotenv'
import { typeDefs as scalarTypeDefs } from 'graphql-scalars'
import { ApolloServer, gql } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server'
import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
import http from 'http'
import cors from 'cors'
import { Query, Mutation, OtherQueries } from './graphql'
import { getUserFromToken } from './utils/getUserFromToken'

dotenv.config()
const PORT = process.env.PORT || 4000

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

const typeDefs = [
	...scalarTypeDefs,
	gql(fs.readFileSync('./src/graphql/schema.graphql', { encoding: 'utf8' })),
]
const resolvers = {
	Query,
	Mutation,
	...OtherQueries,
}

async function startApolloServer() {
	const app = express()
	app
		.use(express.json())
		.use(cors())
		.use(express.urlencoded({ extended: true }))
		.disable('x-powered-by')

	const httpServer = http.createServer(app)
	const corsOptions = {
		origin: [
			'https://wmf.diatonic.ca',
			'https://studio.apollographql.com',
			'*',
		],
		credentials: true,
	}
	const apolloServer = new ApolloServer({
		typeDefs,
		resolvers,
		context: async ({ req }: any): Promise<Context> => {
			const userInfo = await getUserFromToken(req.headers.authorization)
			return {
				db,
				userInfo,
			}
		},
		csrfPrevention: true,
		cache: 'bounded',
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	})
	await apolloServer.start()
	apolloServer.applyMiddleware({ app, path: '/graphql', cors: corsOptions })
	await httpServer.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}.`)
	})
	return { apolloServer, app }
}

startApolloServer()
