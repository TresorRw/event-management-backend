import { config } from "dotenv";
import jwt from "jsonwebtoken";
config()

export const encode = (payload):string => {
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' })
    return token
}

export const decode = (token: string) => {
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET as string)
        return data;
    } catch (error) {
        throw Error('Error while verifying token');
    }
}