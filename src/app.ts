import express, { Application } from "express"
import cors from "cors";
import { config } from "dotenv";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import resolvers from "./Schemas/Resolvers.js";
import typeDefs from "./Schemas/typeDefs.js";
import mongoose, { ConnectOptions } from "mongoose";
import { decode } from "./middlewares/tokenVerifier.js";

config();
const app: Application = express();
const port = process.env.PORT;
const DB_URL = process.env.LOCAL_DB_URL as string;
const httpServer = http.createServer(app);

function resolveToken(authorizationHeader?: string) {
    if (!authorizationHeader) {
        return undefined;
    }
    let token = authorizationHeader.replace(/^Bearer /i, '');
    if (authorizationHeader.includes("Bearer")) {
        token = authorizationHeader.replace(/^Bearer/i, '')
    } else {
        token = authorizationHeader
    }
    return token;
}


// Middlewares
app.use(cors());
app.use(express.json());

interface AppContext {
    token?: String;
}

const server = new ApolloServer<AppContext>({
    typeDefs, resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

// Connecting to database
await server.start();
app.use('/graphql', expressMiddleware(server, {
    context: async ({ req, res }) => {
        const token = resolveToken(req.headers["authorization"]);
        const user = await decode(token as string);
        return { user };
    },
}))

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions)
    .then(() => {
        app.listen(port, () => console.log(`🚀 running on http://localhost:${port}/graphql`))
    })
    .catch((error => {
        console.log(`❌ Failed to connect with database due to: ${error.message}`)
    }))
