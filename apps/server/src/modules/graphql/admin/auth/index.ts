import { AdminAuth } from "../../../middleware/admin";
import tokenGenerator from "../../../services/auth/token-generator";
import { hashString, isSameHash } from "../../../services/hash";
import prisma, {
    Arg,
    Ctx,
    Field,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    UseMiddleware,
} from "orm";
import { ContextType } from "../../../../types/ContextType";
import { generateToken, verifyToken } from "../../../../modules/services/JWT";
import dayjs from "dayjs";
import { COOKIE_PREFIX } from "../../../../config/global";
import { OTPType } from "orm/generated";
import otpGenerator from "../../../../modules/services/otp-generator";
import { getFileSize, maskEmail, validateFileExtension } from "../../../../utils/common-functions";
import { FileUpload } from "../../../../types/file-upload";
import { AWSS3Uploader } from "../../../../modules/services/s3";
import { GraphQLUpload } from "graphql-upload";
import { emailTemplates, sendEmailWithTemplate } from "../../../../modules/services/email-service";

@ObjectType()
export class AdminLoginResponse {
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
export class AdminMeResponse {
    @Field(() => String)
    firstName!: string;
    @Field(() => String)
    lastName!: string;
    @Field(() => String)
    avatar!: string;
    @Field(() => String)
    email!: string;
}

@Resolver()
export default class AdminAuthResolver {
    s3Uploader: AWSS3Uploader;

    constructor() {
        this.s3Uploader = new AWSS3Uploader({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            bucketName: process.env.AWS_S3_BUCKET_NAME,
        });
    }

    @Mutation(() => Boolean)
    async adminCreate(
        @Arg("email") email: string,
        @Arg("firstName") firstName: string,
        @Arg("lastName") lastName: string,
        @Arg("password") password: string
    ) {
        let hashedPassword = await hashString(password);
        await prisma.admin.create({
            data: {
                email,
                firstName,
                lastName,
                password: hashedPassword,
                avatar: ""
            },
        });

        return true;
    }

    @Mutation(() => AdminLoginResponse)
    async adminLogin(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() ctx: ContextType
    ): Promise<AdminLoginResponse> {
        let cookie2FA = ctx.req.cookies ? ctx.req.cookies[`${COOKIE_PREFIX}-admin-2FA`] : null;
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
            throw new Error("Invalid email!");
        }
        if (!password) {
            throw new Error("Invalid password!");
        }
        const admin = await prisma.admin.findFirst({
            where: {
                email,
            },
        });

        if (!admin) {
            throw new Error("Invalid email!");
        }

        const isSamePassword = await isSameHash(
            password,
            admin.password
        );
        if (!isSamePassword) {
            throw new Error("Invalid email or password");
        }
        if (isCookie && cookieData.rememberMe && cookieData.id === admin.id) {
            const { token } = tokenGenerator(
                "admin",
                {
                    id: admin.id,
                    version: admin.tokenVersion
                },
                ctx.res
            );

            return {
                token,
                firstName: admin.firstName,
                lastName: admin.lastName,
                id: admin.id,
                message: ""
            }
        } else {
            return this.adminResendOTP(admin.email, OTPType.ADMIN_LOGIN);
        }
    }

    @Mutation(() => AdminLoginResponse)
    async adminResendOTP(
        @Arg("email") email: string,
        @Arg("OTPType") OTPType: OTPType
    ): Promise<AdminLoginResponse> {
        const admin = await prisma.admin.findFirst({
            where: {
                email,
            },
        });

        if (admin) {
            const OTP = otpGenerator();
            await prisma.oTP.create({
                data: {
                    otp: OTP,
                    adminId: admin.id,
                    isUsed: false,
                    type: OTPType,
                },
            });

            await sendEmailWithTemplate(admin.email, emailTemplates.VERIFICATION_OTP, {
                email: admin.email,
                otp: OTP,
                name: admin.firstName
            });

            return { message: `OTP has been sent to ${maskEmail(email)}` };
        } else {
            throw new Error(
                "Unable to locate admin with given email."
            );
        }
    }

    @Mutation(() => AdminLoginResponse)
    async adminVerifyLoginOTP(
        @Arg("email") email: string,
        @Arg("otp") otp: string,
        @Arg("rememberMe") rememberMe: boolean,
        @Ctx() ctx: ContextType
    ): Promise<AdminLoginResponse> {
        if (!email) {
            throw new Error("Please enter valid email!");
        }
        if (!otp) {
            throw new Error("Please enter valid OTP!");
        }

        return this.verifyOTP(otp, email, OTPType.ADMIN_LOGIN, ctx, rememberMe);
    }

    async verifyOTP(
        otp: string,
        email: string,
        otpType: OTPType,
        ctx: ContextType,
        rememberMe: boolean
    ) {
        const admin = await prisma.admin.findFirst({
            where: {
                email,
                enabled: true
            },
        });

        const otpRequest = await prisma.oTP.findFirst({
            where: {
                otp,
                adminId: admin.id,
                isUsed: false,
                created_at: {
                    gte: dayjs().subtract(90, "minutes").toDate(),
                    lt: dayjs().toDate()
                },
                type: otpType,
            },
        });

        const { token } = tokenGenerator(
            "admin",
            {
                id: admin.id,
                version: admin.tokenVersion
            },
            ctx.res
        );

        if (rememberMe) {
            const tokens2FA = tokenGenerator(
                "admin",
                {
                    id: admin.id,
                    rememberMe: true,
                    version: admin.tokenVersion
                }
            );
            ctx.res.cookie(
                `${COOKIE_PREFIX}-admin-2FA`,
                tokens2FA.token,
                {
                    httpOnly: true,
                    expires: dayjs().add(30, "days").toDate(),
                    secure: true,
                    sameSite: "none",
                }
            );
        }

        if (!otpRequest) {
            throw new Error("Invalid OTP! Please try again.");
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
            firstName: admin.firstName,
            lastName: admin.lastName,
            id: admin.id,
            message: ""
        }
    }

    @Mutation(() => AdminLoginResponse)
    async adminForgotPassword(
        @Arg("email") email: string
    ): Promise<AdminLoginResponse> {
        if (!email) {
            throw new Error("Please enter email!");
        }
        const admin = await prisma.admin.findFirst({
            where: {
                email
            }
        });

        return this.adminResendOTP(email, OTPType.ADMIN_RESET_PASSWORD);
    }

    @Mutation(() => String)
    async adminVerifyResetPasswordOTP(
        @Arg("email") email: string,
        @Arg("otp") otp: string
    ): Promise<string> {
        const _admin = await prisma.admin.findFirst({
            where: {
                email,
                enabled: true
            },
        });

        const otpRequest = await prisma.oTP.findFirst({
            where: {
                otp,
                adminId: _admin.id,
                isUsed: false,
                created_at: {
                    gte: dayjs().subtract(90, "minutes").toDate(),
                    lt: dayjs().toDate()
                },
                type: OTPType.ADMIN_RESET_PASSWORD,
            },
        });

        if (!otpRequest) {
            throw new Error("Invalid OTP! Please try again.");
        }

        const token = await generateToken({
            id: _admin.id,
            type: "AdminResetPassword"
        });

        return token;
    }

    @Mutation(() => Boolean)
    async adminResetPassword(
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

        const _admin = await prisma.admin.findUnique({
            where: {
                id: tokenData.id
            }
        });

        if (!(_admin && tokenData.type === "AdminResetPassword")) {
            throw new Error("Invalid Token!");
        }

        let hashedPassword = await hashString(newPassword);
        await prisma.admin.update({
            where: {
                id: _admin.id,
            },
            data: {
                password: hashedPassword,
                tokenVersion: _admin.tokenVersion + 1,
            }
        });

        return true;
    }

    @Mutation(() => AdminLoginResponse)
    @UseMiddleware(AdminAuth)
    async adminChangePassword(
        @Arg("oldPassword") oldPassword: string,
        @Arg("newPassword") newPassword: string,
        @Ctx() ctx: ContextType
    ): Promise<AdminLoginResponse> {
        const admin = await prisma.admin.findFirst({
            where: {
                id: ctx.user,
            },
        });

        if (!admin) {
            throw new Error("Invalid admin");
        }

        const isSamePassword = await isSameHash(
            oldPassword,
            admin.password
        );
        if (!isSamePassword) {
            throw new Error("Invalid password");
        }
        let hashedPassword = await hashString(newPassword);
        await prisma.admin.update({
            where: {
                id: admin.id,
            },
            data: {
                password: hashedPassword,
                tokenVersion: admin.tokenVersion + 1,
            },
        });

        const { token } = tokenGenerator(
            "admin",
            {
                id: admin.id,
                version: admin.tokenVersion + 1,
            },
            ctx.res
        );

        return {
            token,
            firstName: admin.firstName,
            lastName: admin.lastName,
            message: "Password changed successfully"
        };
    }

    @Query(() => AdminMeResponse)
    @UseMiddleware(AdminAuth)
    async adminMe(@Ctx() ctx: ContextType) {
        const admin = await prisma.admin.findUnique({
            where: {
                id: ctx.user,
            },
        });

        return {
            firstName: admin.firstName,
            lastName: admin.lastName,
            avatar: admin.avatar,
            email: admin.email
        };
    }

    @Mutation(() => String)
    @UseMiddleware(AdminAuth)
    async adminUploadAvatar(
        @Arg("file", () => GraphQLUpload) file: FileUpload,
        @Ctx() ctx: ContextType
    ): Promise<string> {
        const receivedFile = await file;
        const fileSize = (await getFileSize(
            receivedFile.createReadStream
        )) / 1024;
        const filenameArr = file.filename.split('.');
        const filename = `${filenameArr[0]}-${new Date().getTime()}`;
        if (fileSize > 5 * 1024) {
            throw Error(
                "Please upload file with size less than 5MB!"
            );
        }
        validateFileExtension(receivedFile.filename, [
            "jpeg",
            "jpg",
            "png",
            "webp",
            "gif"
        ]);
        const _admin = await prisma.admin.findUnique({
            where: {
                id: ctx.user
            }
        });
        const filePath =
            this.s3Uploader.createDestinationFilePath(
                `admin/${_admin.email}-${_admin.id}`,
                filename,
                receivedFile.filename.split(".")[1]
            );
        const uploadStream =
            this.s3Uploader.createUploadStream(filePath);
        receivedFile
            .createReadStream()
            .pipe(uploadStream.writeStream);
        const result = await uploadStream.promise;

        if (_admin.avatar) {
            await this.s3Uploader.deleteFilesFromBucket([_admin.avatar]);
        }

        await prisma.admin.update({
            where: {
                id: ctx.user
            },
            data: {
                avatar: result.Key
            }
        });

        return result.Location;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(AdminAuth)
    async adminDeleteAvatar(
        @Ctx() ctx: ContextType
    ): Promise<boolean> {
        const _admin = await prisma.admin.findUnique({
            where: {
                id: ctx.user
            }
        });

        await this.s3Uploader.deleteFilesFromBucket([_admin.avatar]);

        await prisma.admin.update({
            where: {
                id: ctx.user
            },
            data: {
                avatar: ""
            }
        });

        return true;
    }
}
