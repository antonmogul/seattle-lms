import { COMPANY_NAME, COOKIE_PREFIX } from "../../../../config/global";
import { generateToken, verifyToken } from "../../../services/JWT";
import tokenGenerator from "../../../services/auth/token-generator";
import { hashString, isSameHash } from "../../../services/hash";
import otpGenerator from "../../../services/otp-generator";
import { maskEmail } from "../../../../utils/common-functions";
import dayjs from "dayjs";
import prisma, { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from "orm";
import { OTPType } from "orm/generated";
import { ContextType } from "../../../../types/ContextType";
import { emailTemplates, sendEmailWithTemplate } from "../../../../modules/services/email-service";
import { getUserInfoFromTokenId } from "../../../services/google-auth";
import { User } from "orm/generated/type-graphql";

@ObjectType()
export class PublicLoginResponse {
    @Field(() => String, {
        nullable: true
    })
    id?: string;
    @Field(() => String, {
        nullable: true
    })
    token?: string;
    @Field(() => String, {
        nullable: true
    })
    firstName?: string;
    @Field(() => String, {
        nullable: true
    })
    lastName?: string;

    @Field(() => String)
    message: string
}

@ObjectType()
export class PublicAuthResponse {
    @Field(() => User)
    data?: User;
    @Field(() => String)
    token?: string;
}

@Resolver()
export default class PublicAuthResolver {
    @Mutation(() => PublicLoginResponse)
    async publicLogin(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() ctx: ContextType
    ): Promise<PublicLoginResponse> {
        let cookie2FA = ctx.req.cookies ? ctx.req.cookies[`${COOKIE_PREFIX}-2FA`] : null;
        let cookieData: {
            id: string,
            version: number,
            refreshToken: boolean,
            rememberMe: boolean,
            type: string,
            iat: number,
            exp: number
        }, isCookie: boolean;

        if (cookie2FA) {
            cookieData = verifyToken<{
                id: string,
                version: number,
                refreshToken: boolean,
                rememberMe: boolean,
                type: string,
                iat: number,
                exp: number
            }>(cookie2FA);
            isCookie = true;
        } else {
            isCookie = false
        }
        if (!email) {
            throw new Error("Please enter email!");
        } else {
            const emailValidationRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (!emailValidationRegex.test(email)) {
                throw new Error("Please enter valid email!");
            }
        }
        email = email.toLowerCase();
        if (!password) {
            throw new Error("Please enter password!");
        }
        const user = await prisma.user.findFirst({
            where: {
                email,
                enabled: true,
                isGoogleLogin: false
            },
        });

        if (!user) {
            const _userDisableCheck = await prisma.user.findFirst({
                where: {
                    email,
                    enabled: false
                },
            });
            if (_userDisableCheck) {
                throw new Error("User disabled. Contact admin");
            } else {
                throw new Error("Invalid email or password!");
            }
        }

        const isSamePassword = await isSameHash(
            password,
            user.password
        );
        if (!isSamePassword) {
            throw new Error("Invalid email or password");
        }
        if (isCookie && cookieData.rememberMe && cookieData.id === user.id) {
            const { token } = tokenGenerator(
                "user",
                {
                    id: user.id,
                    version: user.tokenVersion
                },
                ctx.res
            );

            return {
                token,
                firstName: user.firstName,
                lastName: user.lastName,
                id: user.id,
                message: ""
            }
        } else {
            return this.publicResendOTP(user.email, OTPType.LOGIN);
        }
    }

    @Mutation(() => PublicLoginResponse)
    async publicSSOLogin(
        @Arg("email") email: string,
        @Ctx() ctx: ContextType
    ): Promise<PublicLoginResponse> {
        if (!email) {
            throw new Error("Please enter email!");
        } else {
            const emailValidationRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (!emailValidationRegex.test(email)) {
                throw new Error("Please enter valid email!");
            }
        }

        email = email.toLowerCase();
        
        const user = await prisma.user.findFirst({
            where: {
                email,
                enabled: true,
                isGoogleLogin: true
            },
        });

        if (!user) {
            const _userDisableCheck = await prisma.user.findFirst({
                where: {
                    email,
                    enabled: false
                },
            });
            if (_userDisableCheck) {
                throw new Error("User disabled. Contact admin");
            } else {
                throw new Error("Invalid email or password!");
            }
        }

        const { token } = tokenGenerator(
            "user",
            {
                id: user.id,
                version: user.tokenVersion
            },
            ctx.res
        );

        return {
            token,
            firstName: user.firstName,
            lastName: user.lastName,
            id: user.id,
            message: ""
        }
    }

    @Mutation(() => PublicLoginResponse)
    async publicSignup(
        @Arg("email") email: string,
        @Arg("firstName") firstName: string,
        @Arg("lastName", {nullable: true}) lastName: string = null,
        @Arg("password", {nullable: true}) password: string = null,
        @Arg("company", {nullable: true}) company: string = null,
        @Arg("jobTitle", {nullable: true}) jobTitle: string = null,
        @Arg("country", {nullable: true}) country: string = null,
        @Arg("newsletterOptIn", {nullable: true}) newsletterOptIn: boolean = false
    ): Promise<PublicLoginResponse> {
        if (!email) {
            throw new Error("Invalid email!");
        } else {
            const emailValidationRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (!emailValidationRegex.test(email)) {
                throw new Error("Please enter valid email!");
            }
        }
        if (!firstName) {
            throw new Error("Invalid firstname!");
        }
        if (!lastName) {
            throw new Error("Invalid lastname!");
        }
        if (!password) {
            throw new Error("Invalid password!");
        }
        
        // Validate optional fields
        if (company && company.length > 100) {
            throw new Error("Company name is too long (max 100 characters)");
        }
        if (jobTitle && jobTitle.length > 100) {
            throw new Error("Job title is too long (max 100 characters)");
        }
        if (country && country.length > 100) {
            throw new Error("Country name is too long (max 100 characters)");
        }

        email = email.toLowerCase();

        const emailExist = await prisma.user.count({
            where: {
                email
            }
        });
        if (emailExist) {
            throw new Error("User with this email already exist!");
        }
        let hashedPassword = await hashString(password);
        const _newUser = await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                password: hashedPassword,
                avatar: "",
                company,
                jobTitle,
                country,
                newsletterOptIn,
            },
        });

        await sendEmailWithTemplate(_newUser.email, emailTemplates.WELCOME_EMAIL, {
            email: _newUser.email,
            name: `${_newUser.firstName} ${_newUser.lastName}`,
            companyName: COMPANY_NAME
        });

        return { message: "User created successfully" };
    }

    @Mutation(() => PublicLoginResponse)
    async publicResendOTP(
        @Arg("email") email: string,
        @Arg("OTPType") OTPType: OTPType
    ): Promise<PublicLoginResponse> {
        const user = await prisma.user.findFirst({
            where: {
                email,
                enabled: true
            },
        });

        if (user) {
            const OTP = otpGenerator();
            await prisma.oTP.create({
                data: {
                    otp: OTP,
                    userId: user.id,
                    isUsed: false,
                    type: OTPType,
                },
            });

            try {
                await sendEmailWithTemplate(user.email, emailTemplates.VERIFICATION_OTP, {
                    email: user.email,
                    otp: OTP,
                    name: user.firstName
                });
            } catch (emailError) {
                console.error("Email sending failed:", emailError);
                // Continue anyway - OTP was created in database
            }

            return { message: `OTP has been sent to your email` };
        } else {
            throw new Error(
                "Unable to locate user with given email."
            );
        }
    }

    @Mutation(() => PublicLoginResponse)
    async verifySignupOTP(
        @Arg("email") email: string,
        @Arg("otp") otp: string,
        @Arg("rememberMe") rememberMe: boolean,
        @Ctx() ctx: ContextType
    ): Promise<PublicLoginResponse> {
        if (!email) {
            throw new Error("Please enter email!");
        } else {
            const emailValidationRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (!emailValidationRegex.test(email)) {
                throw new Error("Please enter valid email!");
            }
        }

        email = email.toLowerCase();

        if (!otp) {
            throw new Error("Please enter valid OTP!");
        }

        return this.verifyOTP(otp, email, OTPType.SIGNUP, ctx, rememberMe);
    }

    @Mutation(() => PublicLoginResponse)
    async verifyLoginOTP(
        @Arg("email") email: string,
        @Arg("otp") otp: string,
        @Arg("rememberMe") rememberMe: boolean,
        @Ctx() ctx: ContextType
    ): Promise<PublicLoginResponse> {
        if (!email) {
            throw new Error("Please enter email!");
        } else {
            const emailValidationRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (!emailValidationRegex.test(email)) {
                throw new Error("Please enter valid email!");
            }
        }

        email = email.toLowerCase();

        if (!otp) {
            throw new Error("Please enter valid OTP!");
        }

        return this.verifyOTP(otp, email, OTPType.LOGIN, ctx, rememberMe);
    }

    async verifyOTP(
        otp: string,
        email: string,
        otpType: OTPType,
        ctx: ContextType,
        rememberMe: boolean
    ) {
        const user = await prisma.user.findFirst({
            where: {
                email,
                enabled: true
            },
        });

        if (user) {
            const otpRequest = await prisma.oTP.findFirst({
                where: {
                    otp,
                    userId: user.id,
                    isUsed: false,
                    created_at: {
                        gte: dayjs().subtract(90, "minutes").toDate(),
                        lt: dayjs().toDate()
                    },
                    type: otpType,
                },
            });

            if (!otpRequest) {
                throw new Error("Invalid OTP! Please try again.");
            }

            const { token } = tokenGenerator(
                "user",
                {
                    id: user.id,
                    version: user.tokenVersion
                },
                ctx.res
            );

            if (rememberMe) {
                const tokens2FA = tokenGenerator(
                    "user",
                    {
                        id: user.id,
                        rememberMe: true,
                        version: user.tokenVersion
                    }
                );
                ctx.res.cookie(
                    `${COOKIE_PREFIX}-2FA`,
                    tokens2FA.token,
                    {
                        httpOnly: true,
                        expires: dayjs().add(30, "days").toDate(),
                        secure: true,
                        sameSite: "none",
                    }
                );
            }

            await prisma.oTP.update({
                where: {
                    id: otpRequest.id
                },
                data: {
                    isUsed: true
                }
            });

            return {
                token,
                firstName: user.firstName,
                lastName: user.lastName,
                id: user.id,
                message: ""
            }
        } else {
            throw new Error("Something went wrong! Please try again.");
        }
    }

    @Mutation(() => PublicLoginResponse)
    async publicForgotPassword(
        @Arg("email") email: string
    ): Promise<PublicLoginResponse> {
        if (!email) {
            throw new Error("Please enter email!");
        } else {
            const emailValidationRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (!emailValidationRegex.test(email)) {
                throw new Error("Please enter valid email!");
            }
        }

        email = email.toLowerCase();

        const user = await prisma.user.findFirst({
            where: {
                email,
                enabled: true
            }
        });
        if (user) {
            return this.publicResendOTP(user.email, OTPType.RESET_PASSWORD);
        } else {
            throw new Error("Please enter registered email!");
        }
    }

    @Mutation(() => String)
    async publicVerifyResetPasswordOTP(
        @Arg("email") email: string,
        @Arg("otp") otp: string
    ): Promise<string> {
        if (!email) {
            throw new Error("Please enter email!");
        } else {
            const emailValidationRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (!emailValidationRegex.test(email)) {
                throw new Error("Please enter valid email!");
            }
        }

        email = email.toLowerCase();

        const _user = await prisma.user.findFirst({
            where: {
                email,
                enabled: true
            },
        });

        if (_user) {
            const otpRequest = await prisma.oTP.findFirst({
                where: {
                    otp,
                    userId: _user.id,
                    isUsed: false,
                    created_at: {
                        gte: dayjs().subtract(90, "minutes").toDate(),
                        lt: dayjs().toDate()
                    },
                    type: OTPType.RESET_PASSWORD,
                },
            });

            if (!otpRequest) {
                throw new Error("Invalid OTP! Please try again.");
            }

            const token = await generateToken({
                id: _user.id,
                type: "UserResetPassword"
            });

            return token;
        } else {
            throw new Error("Something went wrong! Please try again.");
        }
    }

    @Mutation(() => Boolean)
    async publicResetPassword(
        @Arg("token") token: string,
        @Arg("newPassword") newPassword: string
    ): Promise<boolean> {
        if (!token) {
            throw new Error("Invalid token!");
        }
        if (!newPassword) {
            throw new Error("Invalid new password!");
        }
        const tokenData = verifyToken<{
            id: string;
            type: string;
        }>(token);

        const _user = await prisma.user.findUnique({
            where: {
                id: tokenData.id
            }
        });

        if (!(_user && tokenData.type === "UserResetPassword")) {
            throw new Error("Invalid Token!");
        }

        let hashedPassword = await hashString(newPassword);
        await prisma.user.update({
            where: {
                id: _user.id,
            },
            data: {
                password: hashedPassword,
                tokenVersion: _user.tokenVersion + 1,
            }
        });

        return true;
    }

    @Mutation(() => PublicAuthResponse)
    async signUpWithGoogle(
        @Arg("token") token: string,
        @Ctx() ctx: ContextType
    ) {
        const _userData = await getUserInfoFromTokenId(token);

        return await this.publicSignup(
            _userData.email,
            _userData.name,
            null, // lastName
            null, // password
            null, // company
            null, // jobTitle
            null, // country
            false // newsletterOptIn
        );
    }
    @Mutation(() => PublicAuthResponse)
    async signInWithGoogle(
        @Arg("token") token: string,
        @Ctx() ctx: ContextType
    ) {
        const _userData = await getUserInfoFromTokenId(token);

        const _user = await prisma.user.findFirst({
            where: {
                email: _userData.email,
            },
        });

        if (!_user) {
            throw new Error(
                `No account found linked with ${_userData.email}. please create a new account`
            );
        }

        const tokenGen = tokenGenerator(
            "user",
            {
                id: _user.id,
                version: _user.tokenVersion,
            },
            ctx.res
        );

        return { token: tokenGen.token, data: _user };
    }
}