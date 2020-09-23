import { ApolloServer } from "apollo-server";
import { db } from "./db";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";

const server = new ApolloServer({
    resolvers,
    typeDefs,
    context: async () => {
        return {
            db: await db.connect(`mongodb://${process.env.db_host}:${process.env.db_port}/myapp`)
        }
    }
});

(async () => {
    const { url } = await server.listen({
        host: process.env.host,
        port: process.env.port
    });
    console.log(`Apollo Server is running at ${url}`);
})();