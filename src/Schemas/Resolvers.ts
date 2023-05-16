import { registerUser, logUser, EventDetails, SearchKeyWord } from "../interfaces/GlobalInterfaces.js";
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
        async searchEvents(_, args: SearchKeyWord) {
            const { keyword } = args;
            const newRegex = (pattern) => new RegExp(`.*${pattern}.*`);
            const searchRgx = newRegex(keyword);
            try {
                const findMatches = await Events.find({ $or: [{ name: { $regex: searchRgx, $options: "i" } }, { location: { $regex: searchRgx, $options: "i" } }] });
                return { message: `Events that math with: ${keyword}`, results: findMatches }
            } catch (error) {
                return { message: "We can not find matches" }
            }
        },
    },
    Event: {
        organizer: async (parent) => {
            const all = await Users.findById(parent.organizer_id)
            return { username: all?.username, contact: all?.contact, id: all?.id, userType: all?.userType }
        }
    },
    Attendance: {
        event: async (parent) => {
            const checkEvs = await Events.findById(parent.event_id);
            return { name: checkEvs?.name, location: checkEvs?.location, duration: checkEvs?.duration, description: checkEvs?.description, organizer_id: checkEvs?.organizer_id, date_time: checkEvs?.date_time }
        },
        subscribers: async (parent) => {
            const checkSubs = await Users.findById(parent.attendee_id)
            return { username: checkSubs?.username, contact: checkSubs?.contact, userType: checkSubs?.userType };
        }
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
                return { message: "You are not authenticated, please login first." }
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
        },
        async updateEvent(parent, args: EventDetails, contextValue) {
            const user = contextValue.user;
            if (!user) {
                return { message: "You are not authenticated, please login first." }
            }
            const eventId = args.event_id;
            if (user.userType !== "Organizer") {
                return { message: "You must be an event organizer" }
            } else {
                try {
                    const checkExistance = await Events.findOne({ _id: eventId, organizer_id: user.id });
                    const newEvent = { name: args.name, location: args.location, duration: args.duration, date_time: args.date_time, description: args.description }
                    try {
                        await checkExistance?.updateOne(newEvent);
                        return { message: "Your event has been updated" }
                    } catch (errors) {
                        return { message: "Problem while updating, try again." }
                    }
                } catch (err) {
                    return { message: "We can not find the event in your account" }
                }

            }
        },
        async deleteEvent(parent, args, contextValue) {
            const user = contextValue.user;
            if (!user) {
                return { message: "You are not authenticated, please login first." }
            }
            const eventId = args.event_id;
            if (user.userType !== "Organizer") {
                return { message: "You must be an event organizer" }
            } else {
                try {
                    const checkExistance = await Events.findOne({ _id: eventId, organizer_id: user.id });
                    await checkExistance?.deleteOne()
                    return { message: "Event is deleted successfully." }
                } catch (err) {
                    return { message: "We can not find the event in your account" }
                }

            }
        },
        async subscribeToEvent(parent, args, contextValue) {
            const user = contextValue.user;
            if (!user) {
                return { message: "You are not authenticated, please login first." }
            }
            const eventId = args.event_id;
            if (user.userType !== "Attendee") {
                return { message: "You must be an event Attendee" }
            } else {
                try {
                    await Events.findById(eventId);
                    try {
                        const checkAlready = await Attendance.find({ event_id: eventId, attendee_id: user.id });
                        if (checkAlready.length > 0) return { message: "You have already registered to this event." }
                        await Attendance.create({ event_id: eventId, attendee_id: user.id })
                        return { message: "Invitation created successfully" };
                    } catch (e) {
                        return { message: "Invitation error" }
                    }
                } catch (error) {
                    return { message: `Event ID: ${eventId} does not exist, check again!` }
                }
            }
        }
    }
};

export default resolvers;
