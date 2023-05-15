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
import { resolveToken } from "./middlewares/resolveToken.js";
import { AppContext } from "./interfaces/GlobalInterfaces.js";

config();
const app: Application = express();
const port = process.env.PORT;
const DB_URL = process.env.LOCAL_DB_URL as string;
const httpServer = http.createServer(app);

// Middlewares
app.use(cors());
app.use(express.json());

const server = new ApolloServer<AppContext>({
    typeDefs, resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

// Connecting to database
await server.start();
app.use('/graphql', expressMiddleware(server, {
    context: async ({ req, res }) => {
        const token = resolveToken(req.headers.authorization);
        if (token) {
            const loggedUser = decode(token)
            return (loggedUser)? { user: loggedUser} : {user: null}
        } else {
            return { loggedUser: null }
        }
    },
}))

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions)
    .then(() => {
        app.listen(port, () => console.log(`🚀 running on http://localhost:${port}/graphql`))
    })
    .catch((error => {
        console.log(`❌ Failed to connect with database due to: ${error.message}`)
    }))
