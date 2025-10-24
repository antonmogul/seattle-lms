import dayjs from "dayjs";
import prisma, { Arg, Field, ObjectType, Query, Resolver, UseMiddleware } from "orm";
import { AdminAuth } from "../../../../modules/middleware/admin";
import { parseDate } from "../../../../utils/common-functions";


@ObjectType()
export class UsersDataResponse {
    @Field(() => String, {
        nullable: true
    })
    date?: string

    @Field(() => Number, {
        nullable: true
    })
    month?: number

    @Field(() => String, {
        nullable: true
    })
    startDate?: string

    @Field(() => String, {
        nullable: true
    })
    endDate?: string

    @Field(() => Number)
    value: number
}

@ObjectType()
export class UsersDataResponseWithTotal {
    @Field(() => [UsersDataResponse])
    graphData: UsersDataResponse[]

    @Field(() => Number)
    totalActiveUsers: number
}

@ObjectType()
export class FullCertifiedDataResponse {
    @Field(() => Number)
    totalUsers: number

    @Field(() => Number)
    certifiedUsers: number

    @Field(() => Number)
    uncertifiedUsers: number
}

@ObjectType()
export class CoursesDataResponse {
    @Field(() => Number)
    coursesNotStarted: number

    @Field(() => Number)
    coursesNotCompleted: number

    @Field(() => Number)
    coursesCompleted: number
}
@ObjectType()
export class CourseCompletionRateResponse {
    @Field(() => String)
    courseTitle: string

    @Field(() => Number)
    completions: number
}

@Resolver()
export default class ReportsResolver {

    @Query(() => UsersDataResponseWithTotal)
    @UseMiddleware(AdminAuth)
    async getActiveUsers(
        @Arg("filter") filter: "DAILY" | "WEEKLY" | "MONTHLY"
    ): Promise<UsersDataResponseWithTotal> {
        const currentDate = new Date();
        let totalActiveUsers;
        if (filter === "DAILY") {
            const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
            const lastDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6));
            let activeUsersProgressQuery: any = {
                where: {
                    OR: {
                        updatedAt: {
                            gte: firstDayOfWeek,
                            lte: lastDayOfWeek
                        },
                        completedAt: {
                            gte: firstDayOfWeek,
                            lte: lastDayOfWeek
                        }
                    }
                },
                orderBy: {
                    updatedAt: "desc"
                },
            };
            let activeUsersProgress = await prisma.lessonProgress.findMany(activeUsersProgressQuery);
            const activeUsersCount: { date: string, value: number }[] = [];
            const userIdMonthMapping: { date: number, userId }[] = [];
            for (let i = 0; i < dayjs(lastDayOfWeek).diff(dayjs(firstDayOfWeek), "days") + 1; i++) {
                const date = parseDate(dayjs(firstDayOfWeek).add(i, "day").toISOString());
                let activeUsersObj: { date: string, value: number } = { date: null, value: null };
                activeUsersObj.date = dayjs(date).format("YYYY/MM/DD");
                activeUsersObj.value = activeUsersProgress.filter((au) => {
                    const updatedAt = parseDate(au.updatedAt.toISOString());
                    const sameUserCheck = !(userIdMonthMapping.find((u) => u.userId === au.userId && u.date === date.getDate()));
                    if (
                        updatedAt.toISOString() === date.toISOString()
                    ) {
                        userIdMonthMapping.push({ date: date.getDate(), userId: au.userId });
                    }
                    return sameUserCheck && updatedAt.toISOString() === date.toISOString()

                }).length;
                activeUsersCount.push(activeUsersObj);
            }
            totalActiveUsers = activeUsersCount.reduce((total, currValue) => {
                return (total + currValue.value)
            }, 0);
            return { totalActiveUsers, graphData: activeUsersCount };
        } else if (filter === "WEEKLY") {
            const weekDates = [];
            let day = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
            let date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDate();
            const daysInMonth = dayjs().daysInMonth();
            let remainingDays = daysInMonth;
            while (remainingDays >= 7) {
                const endDate = (day === 1) ? date + 6 : date + (7 - day);
                weekDates.push({ startDate: date, endDate });
                date = endDate + 1;
                day = 1;
                remainingDays = daysInMonth - date;
            }
            if (remainingDays > 0) {
                weekDates.push({ startDate: date, endDate: daysInMonth });
            }
            let activeUsersProgressQuery: any = {
                where: {
                    OR: {
                        updatedAt: {
                            gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
                            lte: new Date(currentDate.getFullYear(), currentDate.getMonth(), daysInMonth, 23, 59, 59)
                        }
                    }
                }
            };
            let activeUsersProgress = await prisma.lessonProgress.findMany(activeUsersProgressQuery);
            const activeUsersCount: { startDate: string, endDate: string, value: number }[] = [];
            const userIdMonthMapping: { week: number, userId }[] = [];
            weekDates.forEach((wd, i) => {
                const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), wd.startDate);
                const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), wd.endDate, 23, 59, 59);
                let value = activeUsersProgress.filter((au) => {
                    const sameUserCheck = !(userIdMonthMapping.find((u) => u.userId === au.userId && u.week === i));
                    if (
                        (au.updatedAt >= startDate && au.updatedAt <= endDate)
                    ) {
                        userIdMonthMapping.push({ week: i, userId: au.userId });
                    }
                    return sameUserCheck && (au.updatedAt >= startDate && au.updatedAt <= endDate)
                }).length;
                activeUsersCount.push({
                    startDate: dayjs(startDate).format("YYYY/MM/DD"),
                    endDate: dayjs(endDate).format("YYYY/MM/DD"),
                    value
                });
            });
            totalActiveUsers = activeUsersCount.reduce((total, currValue) => {
                return (total + currValue.value)
            }, 0);
            return { totalActiveUsers, graphData: activeUsersCount };
        } else if (filter === "MONTHLY") {
            let activeUsersProgressQuery: any = {
                where: {
                    OR: {
                        updatedAt: {
                            gte: new Date(currentDate.getFullYear(), 0, 1),
                            lte: new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59)
                        }
                    }
                },
            };
            let activeUsersProgress = await prisma.lessonProgress.findMany(activeUsersProgressQuery);
            const activeUsersCount: { month: number, value: number }[] = [];
            for (let month = 0; month <= 11; month++) {
                const daysInMonth = dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)).daysInMonth();
                const monthStart = new Date(currentDate.getFullYear(), month, 1);
                const monthEnd = new Date(currentDate.getFullYear(), month, daysInMonth, 23, 59, 59);
                const userIdMonthMapping: { month: number, userId }[] = [];
                let value = activeUsersProgress.filter((au) => {
                    const sameUserCheck = !(userIdMonthMapping.find((u) => u.userId === au.userId && u.month === month));
                    if (
                        (au.updatedAt >= monthStart && au.updatedAt <= monthEnd)
                    ) {
                        userIdMonthMapping.push({ month, userId: au.userId });
                    }
                    return sameUserCheck && ((au.updatedAt >= monthStart && au.updatedAt <= monthEnd))
                }).length;
                activeUsersCount.push({
                    month: month + 1,
                    value
                });
            }
            totalActiveUsers = activeUsersCount.reduce((total, currValue) => {
                return (total + currValue.value)
            }, 0);
            return { totalActiveUsers, graphData: activeUsersCount };
        }
    }

    @Query(() => [UsersDataResponse])
    @UseMiddleware(AdminAuth)
    async getNewSignups(
        @Arg("filter") filter: "DAILY" | "WEEKLY" | "MONTHLY"
    ): Promise<UsersDataResponse[]> {
        const currentDate = new Date();
        if (filter === "DAILY") {
            const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
            const lastDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6));
            let newSignupsQuery: any = {
                where: {
                    createdAt: {
                        gte: firstDayOfWeek,
                        lte: lastDayOfWeek
                    }
                }
            };
            const newSignups = await prisma.user.findMany(newSignupsQuery);
            const newSignupsCount: { date: string, value: number }[] = [];
            for (let i = 0; i < dayjs(lastDayOfWeek).diff(dayjs(firstDayOfWeek), "days") + 1; i++) {
                const date = parseDate(dayjs(firstDayOfWeek).add(i, "day").toISOString());
                let newSignupsObj: { date: string, value: number } = { date: null, value: null };
                newSignupsObj.date = dayjs(date).format("YYYY/MM/DD");
                newSignupsObj.value = newSignups.filter((ns) => {
                    const createdAt = parseDate(ns.createdAt.toISOString());
                    return createdAt.toISOString() === date.toISOString();
                }).length;
                newSignupsCount.push(newSignupsObj);
            }
            return newSignupsCount;
        } else if (filter === "WEEKLY") {
            const weekDates = [];
            let day = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
            let date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDate();
            const daysInMonth = dayjs().daysInMonth();
            let remainingDays = daysInMonth;
            while (remainingDays >= 7) {
                const endDate = (day === 1) ? date + 6 : date + (7 - day);
                weekDates.push({ startDate: date, endDate });
                date = endDate + 1;
                day = 1;
                remainingDays = daysInMonth - date;
            }
            if (remainingDays > 0) {
                weekDates.push({ startDate: date, endDate: daysInMonth });
            }
            let newSignupsQuery: any = {
                where: {
                    createdAt: {
                        gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
                        lte: new Date(currentDate.getFullYear(), currentDate.getMonth(), daysInMonth, 23, 59, 59)
                    }
                }
            };
            const newSignups = await prisma.user.findMany(newSignupsQuery);
            const newSignupsCount: { startDate: string, endDate: string, value: number }[] = [];
            weekDates.forEach((wd, i) => {
                const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), wd.startDate);
                const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), wd.endDate, 23, 59, 59);
                let value = newSignups.filter((ns) => {
                    return ns.createdAt >= startDate && ns.createdAt <= endDate
                }).length;
                newSignupsCount.push({
                    startDate: dayjs(startDate).format("YYYY/MM/DD"),
                    endDate: dayjs(endDate).format("YYYY/MM/DD"),
                    value
                });
            });
            return newSignupsCount;
        } else if (filter === "MONTHLY") {
            let newSignupsQuery: any = {
                where: {
                    createdAt: {
                        gte: new Date(currentDate.getFullYear(), 0, 1),
                        lte: new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59)
                    }
                }
            };
            const newSignups = await prisma.user.findMany(newSignupsQuery);
            const newSignupsCount: { month: number, value: number }[] = [];
            for (let month = 0; month <= 11; month++) {
                const daysInMonth = dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)).daysInMonth();
                const monthStart = new Date(currentDate.getFullYear(), month, 1);
                const monthEnd = new Date(currentDate.getFullYear(), month, daysInMonth, 23, 59, 59);
                let value = newSignups.filter((ns) => {
                    return ns.createdAt >= monthStart && ns.createdAt <= monthEnd
                }).length;
                newSignupsCount.push({
                    month: month + 1,
                    value
                });
            }

            return newSignupsCount;
        }
    }

    @Query(() => CoursesDataResponse)
    @UseMiddleware(AdminAuth)
    async getCoursesReportData(
        @Arg("courseId", { nullable: true }) courseId: string
    ): Promise<CoursesDataResponse> {
        const _allCoursesQuery: any = {
            select: {
                id: true
            }
        };
        if (courseId) {
            _allCoursesQuery.where = {
                id: courseId
            }
        }
        let totalNumberOfUsersQuery: any = {};
        const totalNumberOfUsers = await prisma.user.count(totalNumberOfUsersQuery);
        const _allCourses = await prisma.course.findMany(_allCoursesQuery);
        let coursesNotCompletedQuery: any = {
            where: {
                courseId: {
                    in: _allCourses.map(c => c.id)
                },
                user: {
                    enabled: true
                },
                status: {
                    in: ["IN_PROGRESS", "NOT_STARTED"]
                }
            }
        };
        let coursesNotCompleted = (await prisma.courseProgress.findMany(coursesNotCompletedQuery)).length;

        let _allCourseProgressIdsQuery: any;
        if(courseId) {
            _allCourseProgressIdsQuery = {
                select: {
                    courseId: true
                },
                where: {
                    courseId,
                    user: {
                        enabled: true
                    }
                },
                distinct: "lessonId"
            }
        } else {
            _allCourseProgressIdsQuery = {
                where: {
                    user: {
                        enabled: true
                    }
                },
                select: {
                    courseId: true
                },
                distinct: "courseId"
            }
        }

        const _allCourseProgressIds = await prisma.courseProgress.findMany(_allCourseProgressIdsQuery)

        let coursesNotStarted = (await prisma.course.findMany({
            where: {
                id: {
                    notIn: _allCourseProgressIds.map(p => p.courseId)
                }
            }
        })).length;

        let _coursesCompletedQuery: any;
        if (courseId) {
            
            _coursesCompletedQuery = {
                where: {
                    user: {
                        enabled: true
                    },
                    courseId,
                    status: "COMPLETE",
                }
            }    
        } else {
            _coursesCompletedQuery = {
                where: {
                    user: {
                        enabled: true
                    },
                    status: "COMPLETE",
                }
            }
        }

        const coursesCompleted = (await prisma.courseProgress.findMany(_coursesCompletedQuery)).length;

        coursesNotStarted = (totalNumberOfUsers * _allCourses.length) - (coursesCompleted + coursesNotCompleted);

        return { coursesCompleted, coursesNotStarted, coursesNotCompleted }
    }

    @Query(() => [CourseCompletionRateResponse])
    @UseMiddleware(AdminAuth)
    async getCourseCompletionReport(): Promise<CourseCompletionRateResponse[]> {
        const _allCourses = await prisma.course.findMany({
            select: {
                id: true,
                name: true
            }
        });

        let coursesProgressQuery: any = {
            where: {
                courseId: {
                    in: _allCourses.map(c => c.id)
                },
                status: "COMPLETE",
                user: {
                    enabled: true
                }
            }
        };
        
        let coursesProgress = await prisma.courseProgress.findMany(coursesProgressQuery);

        const courseCompletionRateData: { courseTitle: string, completions: number }[] = []
        
        for (const course of _allCourses) {
            let courseCompletionDataObj: { courseTitle: string, completions: number } = { courseTitle: "", completions: 0};
            courseCompletionDataObj.courseTitle = course.name;
            courseCompletionDataObj.completions = coursesProgress.filter(c => c.courseId === course.id).length;
            courseCompletionRateData.push(courseCompletionDataObj);
        }

        return courseCompletionRateData;
    }
}