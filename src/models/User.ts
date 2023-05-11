import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    contact: String,
    userType: String
})

userSchema.pre('save', async function (next) {
    const salt = bcrypt.genSalt();
    this.password= await bcrypt.hash(this.password, salt)
    next();
})

const Users = mongoose.model('users', userSchema);

export default Users