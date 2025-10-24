import { AdminAuth } from "../../../middleware/admin";
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
import { user } from "orm/generated";
import {
    CourseProgress,
    User,
} from "orm/generated/type-graphql";
import { ContextType } from "../../../../types/ContextType";

@ObjectType()
class AdminUserDetails extends User {
    @Field(() => [CourseProgress], {
        nullable: true
    })
    courseProgress?: CourseProgress[];
}

@ObjectType()
class AdminSingleUserDetails {
    @Field(() => AdminUserDetails)
    user: AdminUserDetails;
}

@ObjectType()
class UserListResponse {
    @Field(() => [User])
    data?: user[]

    @Field(() => Number)
    pageNo: number

    @Field(() => Number)
    totalRecords: number
}

@Resolver()
export default class AdminUserResolver {
    @Query(() => UserListResponse)
    @UseMiddleware(AdminAuth)
    async adminGetAllUsers(
        @Arg("pageNo") pageNo: number,
        @Arg("noOfRecords") noOfRecords: number,
        @Arg("searchTerm", { nullable: true }) searchTerm: string,
        @Arg("lastLoginStartDate", { nullable: true }) lastLoginStartDate: string,
        @Arg("lastLoginEndDate", { nullable: true }) lastLoginEndDate: string,
        @Arg("joiningStartDate", { nullable: true }) joiningStartDate: string,
        @Arg("joiningEndDate", { nullable: true }) joiningEndDate: string,
        @Arg("status", { nullable: true }) status: boolean
    ) {
        const skip = (pageNo - 1) * noOfRecords;
        const query: any = {
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: noOfRecords,
            where: {
                OR: null,
                lastLoginAt: null,
                createdAt: null,
                enabled: null
            }
        };
        if (searchTerm) {
            query.where.OR = [
                {
                    firstName: {
                        contains: searchTerm,
                        mode: "insensitive"
                    }
                },
                {
                    lastName: {
                        contains: searchTerm,
                        mode: "insensitive"
                    }
                },
                {
                    email: {
                        contains: searchTerm,
                        mode: "insensitive"
                    }
                }
            ]
        } else {
            delete query.where.OR;
        }

        if (lastLoginStartDate && lastLoginEndDate) {
            query.where.lastLoginAt = {
                gte: new Date(lastLoginStartDate),
                lte: new Date(lastLoginEndDate)
            }
        } else {
            delete query.where.lastLoginAt;
        }

        if (joiningStartDate && joiningEndDate) {
            query.where.createdAt = {
                gte: new Date(joiningStartDate),
                lte: new Date(joiningEndDate)
            }
        } else {
            delete query.where.createdAt;
        }

        if (status !== null) {
            query.where.enabled = status
        } else {
            delete query.where.enabled;
        }

        if (!query.where) {
            delete query.where;
        }
        const _countQuery = {...query};
        delete _countQuery.orderBy;
        delete _countQuery.skip;
        delete _countQuery.take;
        const userCount = await prisma.user.count(_countQuery);
        const users = await prisma.user.findMany(query);

        return {
            totalRecords: userCount,
            data: users,
            pageNo
        };
    }

    @Mutation(() => User)
    @UseMiddleware(AdminAuth)
    async adminUpdateUserStatus(
        @Arg("userId") userId: string,
        @Arg("status") status: boolean
    ) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                enabled: status,
            },
        });

        return updatedUser;
    }

    @Query(() => AdminSingleUserDetails)
    @UseMiddleware(AdminAuth)
    async adminGetUser(
        @Arg("userId") userId: string
    ) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                courseProgress: {
                    select: {
                        lessonProgress: true,
                        courseId: true,
                        id: true,
                        status: true,
                        updatedAt: true
                    }
                }
            },
        });
        if (!user) {
            throw new Error("User not found");
        }

        return {
            user
        };
    }

    @Query(() => String)
    @UseMiddleware(AdminAuth)
    async adminExportUsersCSV(
        @Arg("searchTerm", { nullable: true }) searchTerm: string,
        @Arg("lastLoginStartDate", { nullable: true }) lastLoginStartDate: string,
        @Arg("lastLoginEndDate", { nullable: true }) lastLoginEndDate: string,
        @Arg("joiningStartDate", { nullable: true }) joiningStartDate: string,
        @Arg("joiningEndDate", { nullable: true }) joiningEndDate: string,
        @Arg("status", { nullable: true }) status: boolean,
        @Ctx() ctx: ContextType
    ) {
        // Build query similar to adminGetAllUsers but without pagination
        const query: any = {
            orderBy: {
                createdAt: "desc",
            },
            where: {
                OR: null,
                lastLoginAt: null,
                createdAt: null,
                enabled: null
            }
        };

        if (searchTerm) {
            query.where.OR = [
                {
                    firstName: {
                        contains: searchTerm,
                        mode: "insensitive"
                    }
                },
                {
                    lastName: {
                        contains: searchTerm,
                        mode: "insensitive"
                    }
                },
                {
                    email: {
                        contains: searchTerm,
                        mode: "insensitive"
                    }
                }
            ]
        } else {
            delete query.where.OR;
        }

        if (lastLoginStartDate && lastLoginEndDate) {
            query.where.lastLoginAt = {
                gte: new Date(lastLoginStartDate),
                lte: new Date(lastLoginEndDate)
            }
        } else {
            delete query.where.lastLoginAt;
        }

        if (joiningStartDate && joiningEndDate) {
            query.where.createdAt = {
                gte: new Date(joiningStartDate),
                lte: new Date(joiningEndDate)
            }
        } else {
            delete query.where.createdAt;
        }

        if (status !== null) {
            query.where.enabled = status
        } else {
            delete query.where.enabled;
        }

        if (!query.where) {
            delete query.where;
        }

        // Get all users without pagination for export
        const users = await prisma.user.findMany(query);

        // Create CSV content
        const csvHeaders = [
            "ID",
            "First Name",
            "Last Name",
            "Email",
            "Company",
            "Job Title",
            "Country",
            "Newsletter Opt-In",
            "Status",
            "Google Login",
            "Expert Badge",
            "Join Date",
            "Last Login",
            "Created At",
            "Updated At"
        ];

        const csvRows = users.map(user => {
            return [
                user.id,
                user.firstName,
                user.lastName,
                user.email,
                user.company || "",
                user.jobTitle || "",
                user.country || "",
                user.newsletterOptIn ? "Yes" : "No",
                user.enabled ? "Enabled" : "Disabled",
                user.isGoogleLogin ? "Yes" : "No",
                user.expertBadgeUnlocked ? "Yes" : "No",
                new Date(user.createdAt).toLocaleDateString(),
                new Date(user.lastLoginAt).toLocaleDateString(),
                new Date(user.createdAt).toISOString(),
                new Date(user.updatedAt).toISOString()
            ].map(field => {
                // Escape fields that contain commas, quotes, or newlines
                const fieldStr = String(field);
                if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
                    return `"${fieldStr.replace(/"/g, '""')}"`;
                }
                return fieldStr;
            }).join(',');
        });

        // Combine headers and rows
        const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

        // Return base64 encoded CSV
        return Buffer.from(csvContent).toString('base64');
    }
}
