import express from "express";
import { urlencoded } from "body-parser";
import {
    API_PORT,
    COMPANY_NAME,
    CORS_CONFIG,
    GA_REDIRECT_TO_ADMIN_URL,
    GOOGLE_LOGIN_CLIENT_REDIRECT
} from "../../../config/global";
import { PrismaClient } from "orm/generated";
import apolloServer from "../../apollo";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { getUserInfoFromTokenId } from "../google-auth";
import prisma from "orm";
import { getAuthTokens } from "../google-oauth";
import { emailTemplates, sendEmailWithTemplate } from "../email-service";

const app = express();
app.use(cors(CORS_CONFIG));
app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

async function connectPrisma() {
    const prisma = new PrismaClient();
    await prisma.$connect();
}

app.use("/static",
    express.static(
        path.join(__dirname, "../../../../../client/dist")
    )
);

app.post("/google-auth", async (req, res) => {
    const data: {
        name: string,
        email: string,
        userId: string
    } = await getUserInfoFromTokenId(req.body.credential);
    
    const _userCheck = await prisma.user.findFirst({
        where: {
            email: data.email
        }
    });

    let user, nameSplit = data.name.split(" ");
    if (!_userCheck) {
        user = await prisma.user.create({
            data: {
                email: data.email,
                firstName: nameSplit[0],
                lastName: nameSplit[1] || "",
                isGoogleLogin: true,
                avatar: ""
            }
        });
        await sendEmailWithTemplate(user.email, emailTemplates.WELCOME_EMAIL, {
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            companyName: COMPANY_NAME
        });
    }

    res.redirect(`${GOOGLE_LOGIN_CLIENT_REDIRECT}?glogin=1&e=${Buffer.from(data.email).toString("base64")}`)
});

app.get("/ga/callback", async (req, res) => {
    const code = req.query.code;
    try {
        try {
            const authTokenResult = await getAuthTokens(code.toString());
            res.redirect(`${GA_REDIRECT_TO_ADMIN_URL}?status=${authTokenResult}`);
        } catch(err) {
            console.log("Google Auth Token Error: ", err.message);
            res.redirect(`${GA_REDIRECT_TO_ADMIN_URL}?status=false`);
        }
    } catch(err) {
        console.log("🚀 ~ app.get ~ err:", err)
    }
});

connectPrisma().catch(console.error);
const apiServer = (cb: () => void = () => { }) => {
    apolloServer(app)
        .then(() => {
            console.log("GraphQL Loaded");
            app.listen(API_PORT, () => {
                console.log(`🚀 API Server Started at port ${API_PORT}`);
                cb();
            });
        })
        .catch((err) => {
            console.error(err);
        });
};

export default apiServer;
