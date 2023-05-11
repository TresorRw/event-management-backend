import express, { Application } from "express"
import cors from "cors";
import { config } from "dotenv";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import resolvers from "./Schemas/Resolvers.js";
import typeDefs from "./Schemas/typeDefs.js";

config();
const app: Application = express();
const port = process.env.PORT
const httpServer = http.createServer(app);

// Middlewares
app.use(cors());
app.use(express.json());

const server = new ApolloServer({
    typeDefs, resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

await server.start();
app.use('/graphql', expressMiddleware(server))

app.listen(port, () => console.log(`🚀 running on http://localhost:${port}/graphql`))