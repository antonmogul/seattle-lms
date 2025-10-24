import { GOOGLE_CLIENT_ID } from "../../../config/global";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();
export const getUserInfoFromTokenId = async (
    tokenId: string
) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return {
            name: payload.name,
            email: payload.email,
            userId: payload.sub,
        };
    } catch (err) {
        console.log(err);
        throw new Error(
            "Failed to fetch user info from google service"
        );
    }
};