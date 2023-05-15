import { config } from "dotenv";
import jwt from "jsonwebtoken";
config()

export const encode = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' })
    return token
}

export const decode = (token: string) => {
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET as string)
        return data;
    } catch (erro) {
        console.log(`Error`, erro)
    }
}