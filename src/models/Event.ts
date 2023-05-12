import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    name: String,
    date_time: String,
    duration: String,
    location: String,
    description: String,
    organizer_id: String
}, { timestamps: true });

const Events = mongoose.model("events", eventSchema);

export default Events;