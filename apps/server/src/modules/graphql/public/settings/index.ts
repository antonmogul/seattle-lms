import prisma, { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "orm";
import { PublicAuth } from "../../../../modules/middleware/public";
import tokenGenerator from "../../../../modules/services/auth/token-generator";
import { hashString, isSameHash } from "../../../../modules/services/hash";
import { AWSS3Uploader } from "../../../../modules/services/s3";
import { ContextType } from "../../../../types/ContextType";
import { GraphQLUpload } from "graphql-upload";
import { FileUpload } from "../../../../types/file-upload";
import { getFileSize, validateFileExtension } from "../../../../utils/common-functions";

@ObjectType()
export class PublicChangePasswordResponse {
    @Field(() => String)
    token!: string;
    @Field(() => String)
    firstName!: string;
    @Field(() => String)
    lastName!: string;
}

@ObjectType()
export class UserMeResponse {
    @Field(() => String)
    firstName!: string;
    @Field(() => String)
    lastName!: string;
    @Field(() => String)
    email!: string;
    @Field(() => String)
    avatar!: string;
    @Field(() => Boolean)
    enabled!: boolean;
    @Field(() => Boolean)
    isGoogleLogin!: boolean;
    @Field(() => Boolean)
    expertBadgeUnlocked!: boolean;
    @Field(() => String, { nullable: true })
    company?: string;
    @Field(() => String, { nullable: true })
    jobTitle?: string;
    @Field(() => String, { nullable: true })
    country?: string;
    @Field(() => Boolean)
    newsletterOptIn!: boolean;
}

@Resolver()
export default class PublicSettingsResolver {
    s3Uploader: AWSS3Uploader;

    constructor() {
        this.s3Uploader = new AWSS3Uploader({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            bucketName: process.env.AWS_S3_BUCKET_NAME,
        });
    }

    @Mutation(() => PublicChangePasswordResponse)
    @UseMiddleware(PublicAuth)
    async publicChangePassword(
        @Arg("oldPassword") oldPassword: string,
        @Arg("newPassword") newPassword: string,
        @Ctx() ctx: ContextType
    ): Promise<PublicChangePasswordResponse> {
        const user = await prisma.user.findFirst({
            where: {
                id: ctx.user,
                enabled: true
            },
        });

        if (!user) {
            throw new Error("Invalid user");
        }

        const isSamePassword = await isSameHash(
            oldPassword,
            user.password
        );
        if (!isSamePassword) {
            throw new Error("Invalid password");
        }
        let hashedPassword = await hashString(newPassword);
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
                tokenVersion: user.tokenVersion + 1,
            },
        });

        const { token } = tokenGenerator(
            "user",
            {
                id: user.id,
                version: user.tokenVersion + 1,
            },
            ctx.res
        );

        return {
            token,
            firstName: user.firstName,
            lastName: user.lastName,
        };
    }

    @Mutation(() => String)
    @UseMiddleware(PublicAuth)
    async publicUploadAvatar(
        @Arg("file", () => GraphQLUpload) file: FileUpload,
        @Ctx() ctx: ContextType
    ): Promise<string> {
        console.log("🚀 ~ file: index.ts:107 ~ PublicSettingsResolver ~ ctx:", ctx)
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
        const _user = await prisma.user.findUnique({
            where: {
                id: ctx.user
            }
        });
        const filePath =
            this.s3Uploader.createDestinationFilePath(
                `${_user.email}-${_user.id}`,
                filename,
                receivedFile.filename.split(".")[1]
            );
        const uploadStream =
            this.s3Uploader.createUploadStream(filePath);
        receivedFile
            .createReadStream()
            .pipe(uploadStream.writeStream);
        const result = await uploadStream.promise;

        if (_user.avatar) {
            await this.s3Uploader.deleteFilesFromBucket([_user.avatar]);
        }

        await prisma.user.update({
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
    @UseMiddleware(PublicAuth)
    async publicDeleteAvatar(
        @Ctx() ctx: ContextType
    ): Promise<boolean> {
        const _user = await prisma.user.findUnique({
            where: {
                id: ctx.user
            }
        });

        await this.s3Uploader.deleteFilesFromBucket([_user.avatar]);

        await prisma.user.update({
            where: {
                id: ctx.user
            },
            data: {
                avatar: ""
            }
        });

        return true;
    }

    @Query(() => UserMeResponse)
    @UseMiddleware(PublicAuth)
    async userMe(@Ctx() ctx: ContextType) {
        const user = await prisma.user.findUnique({
            where: {
                id: ctx.user,
            }
        });

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar,
            enabled: user.enabled,
            isGoogleLogin: user.isGoogleLogin,
            expertBadgeUnlocked: user.expertBadgeUnlocked,
            company: user.company,
            jobTitle: user.jobTitle,
            country: user.country,
            newsletterOptIn: user.newsletterOptIn
        };
    }



    @Mutation(() => Boolean)
    @UseMiddleware(PublicAuth)
    async setExpertBadgeUnlocked(
        @Ctx() ctx: ContextType,
    ): Promise<boolean> {
        const userId = ctx.user;
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                expertBadgeUnlocked: true
            }
        });

        return true;
    }
}