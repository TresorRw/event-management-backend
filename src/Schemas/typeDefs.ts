const typeDefs = `#graphql
    type User {
        id: String!
        username: String!
        contact: String!
        userType: String
    }

    # user messages
    type GeneralUserMessage {
        message: String!
        data: User
    }

    type Event {
        id: String!
        name: String!
        date_time: String!
        duration: String!
        location: String!
        description: String!
        organizer_id: String!
    }

    type Attendance {
        id: String!
        event_id: String!
        attendee_id: String!
        subDate: String!
    }

    # Queries
    type Query {
        getUsers: [User!]
        getEvents: [Event!]
        getAttendance: [Attendance!]
    }

    # Mutations
    type Mutation {
        registerUser(username:String!, password: String!, contact: String!, userType: String!): GeneralUserMessage!
    }
`;

export default typeDefs