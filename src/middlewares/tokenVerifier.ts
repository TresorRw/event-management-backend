import { config } from "dotenv";
import jwt from "jsonwebtoken";
config()

export const encode = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' })
    return token
}

export const decode = async (token: string) => {
    jwt.verify(token, process.env.JWT_SECRET as string, function (err, decoded) {
        if (err) {
            return err.message;
        } else {
            return decoded
        }
    })
}