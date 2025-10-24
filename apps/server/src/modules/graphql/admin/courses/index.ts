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
import { course, courseProgress, courseStatus, lesson, user } from "orm/generated";
import {
    Course,
    CourseProgress,
    Lesson,
    LessonProgress,
    User,
} from "orm/generated/type-graphql";
import { syncCoursesAndLessons } from "../../../services/schedule-job";

@ObjectType()
class AdminSingleCourseDetails extends Course {
    @Field(() => [Lesson], {
        nullable: true
    })
    lessons?: lesson[];
}

@ObjectType()
class AdminCourseList extends Course {
    @Field(() => [Lesson], {
        nullable: true
    })
    lessons?: lesson[];

    @Field(() => [CourseProgress], {
        nullable: true
    })
    courseProgress?: courseProgress[];
}

@ObjectType()
class AdminUserLessonDetails extends LessonProgress {
    @Field(() => Lesson, {
        nullable: true
    })
    lesson: lesson;
}

@ObjectType()
class AdminUserCourseDetails extends CourseProgress {
    @Field(() => Course, {
        nullable: true
    })
    course: course;
    @Field(() => [AdminUserLessonDetails], {
        nullable: true
    })
    lessonProgress?: AdminUserLessonDetails[];
}

@ObjectType()
class AdminUserCoursesDetails extends User {
    @Field(() => [AdminUserCourseDetails], {
        nullable: true
    })
    courseProgress?: AdminUserCourseDetails[];
}


@ObjectType()
class AdminCourseUserDetails extends Course {
    @Field(() => [AdminCourseProgressUserDetails], {
        nullable: true
    })
    courseProgress?: AdminCourseProgressUserDetails[];
}

@ObjectType()
class AdminCourseUserDetailResponse {
    @Field(() => AdminCourseUserDetails)
    data?: AdminCourseUserDetails

    @Field(() => Number)
    pageNo: number

    @Field(() => Number)
    totalRecords: number
}

@ObjectType()
class AdminUserActivityResponse {
    @Field(() => Number)
    startedCourses?: number

    @Field(() => Number)
    completedCourses?: number
}

@ObjectType()
class AdminCourseProgressUserDetails extends CourseProgress {
    @Field(() => User, {
        nullable: true
    })
    user?: user;
}

@Resolver()
export default class AdminCourseResolver {
    @Query(() => [AdminCourseList])
    @UseMiddleware(AdminAuth)
    async adminGetAllCourses(
        @Arg("searchTerm", { nullable: true }) searchTerm: string,
        @Arg("courseStartStartDate", { nullable: true }) courseStartStartDate: string,
        @Arg("courseStartEndDate", { nullable: true }) courseStartEndDate: string,
        @Arg("courseCompleteStartDate", { nullable: true }) courseCompleteStartDate: string,
        @Arg("courseCompleteEndDate", { nullable: true }) courseCompleteEndDate: string,
        @Arg("sortFilter", { nullable: true }) sortFilter: string
    ): Promise<AdminCourseList[]> {
        const query: any = {
            orderBy: null,
            where: null,
            include: {
                lessons: true,
                courseProgress: {
                    where: {
                        createdAt: null,
                        completedAt: null
                    }
                }
            }
        };
        if (!sortFilter) {
            query.orderBy = {
                createdAt: "desc",
            };
        } else {
            switch(sortFilter) {
                case "AtoZ":
                    query.orderBy = {
                        name: "asc"
                    }
                    break;
                case "ZtoA":
                    query.orderBy = {
                        name: "desc"
                    }
                    break;
                case "LessonsASC":
                    query.orderBy = {
                        lessonCount: "asc"
                    }
                    break;
                case "LessonsDESC":
                    query.orderBy = {
                        lessonCount: "desc"
                    }
                    break;
            }
        }
        if (searchTerm) {
            query.where = {
                name: null
            }
            query.where.name = {
                contains: searchTerm,
                mode: "insensitive"
            }
        }

        if (courseStartStartDate && courseStartEndDate) {
            query.include.courseProgress.where.createdAt = {
                gte: new Date(courseStartStartDate),
                lte: new Date(courseStartEndDate)
            }
        } else {
            delete query.include.courseProgress.where.createdAt;
        }

        if (courseCompleteStartDate && courseCompleteEndDate) {
            query.include.courseProgress.where.completedAt = {
                gte: new Date(courseCompleteStartDate),
                lte: new Date(courseCompleteEndDate)
            }
        } else {
            delete query.include.courseProgress.where.completedAt;
        }

        if (!query.include.courseProgress.where || (!query.include.courseProgress.where.createdAt && !query.include.courseProgress.where.completedAt)) {
            delete query.include.courseProgress.where;
            query.include = { lessons: true, courseProgress: true };
        }

        if (!query.where || isEmptyObject(query.where)) {
            delete query.where;
        }
        const courses: any = await prisma.course.findMany(query);

        return courses;
    }

    @Query(() => AdminSingleCourseDetails)
    @UseMiddleware(AdminAuth)
    async adminGetCourse(
        @Arg("courseId") courseId: string
    ): Promise<AdminSingleCourseDetails>{
        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
            },
            include: {
                lessons: true
            },
        });
        if (!course) {
            throw new Error("Course not found");
        }

        return course;
    }

    @Query(() => AdminCourseUserDetailResponse)
    @UseMiddleware(AdminAuth)
    async adminGetCourseUserDetails(
        @Arg("courseId") courseId: string,
        @Arg("courseStatus", { nullable: true }) courseStatus: courseStatus,
        @Arg("userStatus", { nullable: true }) userStatus: boolean,
        @Arg("lastLoginStartDate", { nullable: true }) lastLoginStartDate: string,
        @Arg("lastLoginEndDate", { nullable: true }) lastLoginEndDate: string,
        @Arg("joiningStartDate", { nullable: true }) joiningStartDate: string,
        @Arg("joiningEndDate", { nullable: true }) joiningEndDate: string,
        @Arg("pageNo") pageNo: number,
        @Arg("noOfRecords") noOfRecords: number,
        @Arg("searchTerm", { nullable: true}) searchTerm: string
    ): Promise<AdminCourseUserDetailResponse> {
        const skip = (pageNo - 1) * noOfRecords;
        const query = {
            where: {
                id: courseId
            },
            include: {
                courseProgress: {
                    where: {
                        status: null,
                        user: {
                            enabled: true,
                            lastLoginAt: null,
                            createdAt: null,
                            firstName: null
                        }
                    },
                    include: {
                        user: true
                    },
                    skip,
                    take: noOfRecords
                }
            }
        };
        if (courseStatus !== null) {
            query.include.courseProgress.where.status = courseStatus;
        } else {
            delete query.include.courseProgress.where.status;
        }

        if (userStatus !== null) {
            query.include.courseProgress.where.user.enabled = userStatus;
        } else {
            delete query.include.courseProgress.where.user;
        }

        if (lastLoginStartDate && lastLoginEndDate) {
            query.include.courseProgress.where.user.lastLoginAt = {
                gte: new Date(lastLoginStartDate),
                lte: new Date(lastLoginEndDate)
            }
        } else {
            delete query.include.courseProgress.where.user.lastLoginAt;
        }

        if (joiningStartDate && joiningEndDate) {
            query.include.courseProgress.where.user.createdAt = {
                gte: new Date(joiningStartDate),
                lte: new Date(joiningEndDate)
            }
        } else {
            delete query.include.courseProgress.where.user.createdAt;
        }

        if (searchTerm) {
            query.include.courseProgress.where.user.firstName = {
                    contains: searchTerm,
                    mode: "insensitive"
            }
        } else {
            delete query.include.courseProgress.where.user.firstName;
        }

        if (!query.include.courseProgress.where || isEmptyObject(query.include.courseProgress.where)) {
            delete query.include.courseProgress.where;
        }
        const countQuery = {...query.include.courseProgress};
        delete countQuery.include;
        delete countQuery.skip;
        delete countQuery.take;
        const _courseProgresses = await prisma.courseProgress.count({
            where: query.include.courseProgress.where
        });
        const _course = await prisma.course.findUnique(query);

        if (!_course) {
            throw new Error("Unable to locate course!");
        }

        return {
            data: _course,
            pageNo,
            totalRecords: _courseProgresses
        };
    }

    @Query(() => AdminUserCoursesDetails)
    @UseMiddleware(AdminAuth)
    async adminGetUserProgress(
        @Arg("userId") userId: string,
        @Arg("courseStatus", { nullable: true }) courseStatus: courseStatus
    ): Promise<AdminUserCoursesDetails> {
        const query = {
            where: {
                id: userId,
            },
            include: {
                courseProgress: {
                    where: {
                        status: null
                    },
                    include: {
                        course: true,
                        lessonProgress: {
                            include: {
                                lesson: true
                            }
                        },
                    }
                }
            }
        };

        if (courseStatus !== null) {
            query.include.courseProgress.where.status = courseStatus
        } else {
            delete query.include.courseProgress.where;
        }

        const _user = await prisma.user.findUnique(query);

        if (!_user) {
            throw new Error("Unable to locate user!");
        }
        console.log("🚀 ~ AdminCourseResolver ~ _user:", _user)

        return _user;
    }

    @Query(() => AdminUserActivityResponse)
    @UseMiddleware(AdminAuth)
    async adminUserActivityCourseDetails(
        @Arg("courseId") courseId: string,
        @Arg("courseStartStartDate", { nullable: true }) courseStartStartDate: string,
        @Arg("courseStartEndDate", { nullable: true }) courseStartEndDate: string,
        @Arg("courseCompleteStartDate", { nullable: true }) courseCompleteStartDate: string,
        @Arg("courseCompleteEndDate", { nullable: true }) courseCompleteEndDate: string
    ): Promise<AdminUserActivityResponse> {
        const query: {
            where: {
                id: string
            },
            include: {
                courseProgress: any
            }
        } = {
            where: {
                id: courseId
            },
            include: {
                courseProgress: {
                    where: {
                        completedAt: null,
                        createdAt: null
                    },
                    include: {
                        user: true
                    }
                }
            }
        };

        if (courseStartStartDate && courseStartEndDate) {
            query.include.courseProgress.where.createdAt = {
                gte: new Date(courseStartStartDate),
                lte: new Date(courseStartEndDate)
            }
        } else {
            delete query.include.courseProgress.where.createdAt;
        }

        if (courseCompleteStartDate && courseCompleteEndDate) {
            query.include.courseProgress.where.completedAt = {
                gte: new Date(courseCompleteStartDate),
                lte: new Date(courseCompleteEndDate)
            }
        } else {
            delete query.include.courseProgress.where.completedAt;
        }

        if (!query.include.courseProgress.where || (!query.include.courseProgress.where.createdAt && !query.include.courseProgress.where.completedAt)) {
            delete query.include.courseProgress.where;
            query.include = { courseProgress: true };
        }

        if (!query.include.courseProgress.where || isEmptyObject(query.include.courseProgress.where)) {
            delete query.include.courseProgress.where;
        }

        const _course = await prisma.course.findUnique(query);
        const startedCourses = _course.courseProgress.filter((cp: any) => cp.status === "IN_PROGRESS").length;
        const completedCourses = _course.courseProgress.filter((cp: any) => cp.status === "COMPLETE").length;
        if (!_course) {
            throw new Error("Unable to locate course!");
        }

        return {
            completedCourses,
            startedCourses
        };
    }

    @Mutation(() => Boolean)
    @UseMiddleware(AdminAuth)
    async adminManualSyncTrigger() : Promise<boolean> {
        await syncCoursesAndLessons();
        return true;
    }
}

const isEmptyObject = (obj) => {
    let name: any;
    for (name in obj) {
        if (obj.hasOwnProperty(name)) {
            return false;
        }
    }
    return true;
}
