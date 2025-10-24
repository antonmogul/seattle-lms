import { JWT_SECRET } from "../../../config/global";
import { sign, verify } from "jsonwebtoken";

export const generateToken = (
	data: any,
	expiresIn: string | number = "7d",
) => {
	return sign(data, JWT_SECRET, {
		expiresIn,
		algorithm: "HS256",
	});
};

export const verifyToken = <T = any>(
	token: string,
) => {
	return verify(token, JWT_SECRET, {
		algorithms: ["HS256"],
	}) as any as T;
};
