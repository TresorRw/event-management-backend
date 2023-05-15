import { registerUser, logUser, EventDetails } from "../interfaces/GlobalInterfaces.js";
import { encode } from "../middlewares/tokenVerifier.js";
import Attendance from "../models/Attendance.js";
import Events from "../models/Event.js";
import Users from "../models/User.js";
import bcrypt from "bcrypt";
import Cookies from "js-cookie";

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
        async registerUser(parent, args: registerUser) {
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
        },
        async loginUser(parent, args: logUser) {
            const userData = { username: args.username, password: args.password }
            const checkUser = await Users.findOne({ username: userData.username });
            if (checkUser) {
                const isPasswordTrue = await bcrypt.compare(userData.password, checkUser.password as string)
                if (isPasswordTrue) {
                    const token: string = encode({ id: checkUser.id, username: checkUser.username, userType: checkUser.userType, contact: checkUser.contact });
                    Cookies.set("token", token, { expires: 7 });
                    return { message: "Login successfully!", info: { token, userType: checkUser.userType } }
                } else {
                    return { message: "Please correct your password!" }
                }
            } else {
                return { message: "Your credentals are not related to any user!" }
            }
        },
        async createEvent(parent, args: EventDetails, contextValue) {
            const user = contextValue.user;
            if (!user) {
                return {message: "You are not authenticated, please login first."}
            }
            if (user.userType !== "Organizer") {
                return { message: "You must be an event organizer" }
            } else {
                const newEvent = { name: args.name, location: args.location, duration: args.duration, date_time: args.date_time, description: args.description, organizer_id: user.id }
                const saveEvent = await Events.create(newEvent);
                if (saveEvent) {
                    return { message: "Event saved successfully", data: saveEvent }
                }
            }
        }
    }
};

export default resolvers;
