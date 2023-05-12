import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    event_id: String,
    attendee_id: String,
    subDate: {
        type: String, 
        default: new Date().toLocaleString()
    }
});


const Attendance = mongoose.model("attendance", attendanceSchema);

export default Attendance;