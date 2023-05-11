import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    name: String,
    date_time: String,
    duration: String,
    location: String,
    description: String
});

const Events = mongoose.model("events", eventSchema);