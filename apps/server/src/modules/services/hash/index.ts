import bcrypt from "bcrypt";
import { HASH_SALT } from "../../../config/global";

export const hashString = async (
    text: string
) => {
    return await bcrypt.hash(text, HASH_SALT);
};

export const isSameHash = async (
    text: string,
    hash: string
) => {
    return await bcrypt.compare(text, hash);
};
