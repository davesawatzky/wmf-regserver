"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const graphql_scalars_1 = require("graphql-scalars");
const apollo_server_express_1 = require("apollo-server-express");
const apollo_server_core_1 = require("apollo-server-core");
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const graphql_1 = require("./graphql");
const getUserFromToken_1 = require("./utils/getUserFromToken");
dotenv_1.default.config();
const PORT = process.env.PORT || 4000;
const db = new client_1.PrismaClient();
const typeDefs = [
    ...graphql_scalars_1.typeDefs,
    (0, apollo_server_express_1.gql)(fs_1.default.readFileSync('./src/graphql/schema.graphql', { encoding: 'utf8' })),
];
const resolvers = Object.assign({ Query: graphql_1.Query,
    Mutation: graphql_1.Mutation }, graphql_1.OtherQueries);
function startApolloServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app
            .use(express_1.default.json())
            .use((0, cors_1.default)())
            .use(express_1.default.urlencoded({ extended: true }))
            .disable('x-powered-by');
        const httpServer = http_1.default.createServer(app);
        const corsOptions = {
            origin: [
                'https://wmf.diatonic.ca',
                'https://studio.apollographql.com',
                '*',
            ],
            credentials: true,
        };
        const apolloServer = new apollo_server_express_1.ApolloServer({
            typeDefs,
            resolvers,
            context: ({ req }) => __awaiter(this, void 0, void 0, function* () {
                const userInfo = yield (0, getUserFromToken_1.getUserFromToken)(req.headers.authorization);
                return {
                    db,
                    userInfo,
                };
            }),
            csrfPrevention: true,
            cache: 'bounded',
            plugins: [(0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
        });
        yield apolloServer.start();
        apolloServer.applyMiddleware({ app, path: '/graphql', cors: corsOptions });
        yield httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
        return { apolloServer, app };
    });
}
startApolloServer();
//# sourceMappingURL=server.js.map