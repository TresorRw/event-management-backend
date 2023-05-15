const typeDefs = `#graphql
    type User {
        id: String!
        username: String!
        contact: String!
        userType: String
    }

    type UserInfo {
        token: String!
        userType: String!
    }

    # user messages
    type GeneralUserMessage {
        message: String!
        data: User
        info: UserInfo
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

    # Events messages
    type GeneralEventMessage {
        message: String!
        data: Event
    }

    type Attendance {
        id: String!
        event_id: String!
        attendee_id: String!
        subDate: String!
    }

    type SearchResults {
        message: String!
        results: [Event!]
    }

    # Queries
    type Query {
        getUsers: [User!]
        getEvents: [Event!]
        getAttendance: [Attendance!]
        searchEvents(keyword: String!): SearchResults!
    }

    # Mutations
    type Mutation {
        registerUser(username:String!, password: String!, contact: String!, userType: String!): GeneralUserMessage!
        loginUser(username: String!, password: String!): GeneralUserMessage!
        createEvent(name: String!, date_time: String!, duration: String!, location: String!, description: String!): GeneralEventMessage!
        updateEvent(event_id: String!, name: String!, date_time: String!, duration: String!, location: String!, description: String!): GeneralEventMessage!
        deleteEvent(event_id: String!): GeneralEventMessage!
    }
`;

export default typeDefs