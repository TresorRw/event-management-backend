const typeDefs = `#graphql
    type Hello {
        message: String!
    }

    # Queries

    type Query {
        hi: Hello!
    }

    # Mutations

`;

export default typeDefs