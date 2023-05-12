import Attendance from "../models/Attendance.js";
import Events from "../models/Event.js";
import Users from "../models/User.js";

const resolvers = {
    Query: {
        async getUsers() {
            const data = await Users.find();
            return data;
        },
        async getEvents() {
            const events = await Events.find();
            return events
        },
        async getAttendance() {
            const attendance = await Attendance.find()
            return attendance
        },
    },
    Mutation: {
        async registerUser(parent, args) {
            const newUser = { username: args.username, password: args.password, userType: args.userType, contact: args.contact };
            const checkExistance = await Users.findOne({ username: args.username });
            if (checkExistance) {
                return { message: "Username is already taken, change it!" }
            } else {
                try {
                    const db_response = await Users.create(newUser);
                    return { message: "Registration succesfully!", data: db_response }
                } catch (error) {
                    return { message: "Something went wrong! try again" }
                }
            }
        }
    }
};

export default resolvers;
