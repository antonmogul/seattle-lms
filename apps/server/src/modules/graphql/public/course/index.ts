import prisma, { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "orm";
import { courseStatus, lessonStatus } from "orm/generated";
import { Course, CourseProgress, Lesson, LessonProgress } from "orm/generated/type-graphql";
import { PublicAuth } from "../../../../modules/middleware/public";
import { ContextType } from "../../../../types/ContextType";

@ObjectType()
class PublicLessonProgressResponse extends LessonProgress {
    @Field(() => CourseProgress, {
        nullable: true
    })
    courseProgress?: CourseProgress;

    @Field(() => Lesson, {
        nullable: true
    })
    lesson?: Lesson;
}

@ObjectType()
class PublicLessonProgressLesson extends LessonProgress {
    @Field(() => Lesson, {
        nullable: true
    })
    lesson?: Lesson;
}

@ObjectType()
class PublicCourseProgressResponse extends CourseProgress {
    @Field(() => [PublicLessonProgressLesson], {
        nullable: true
    })
    lessonProgress?: PublicLessonProgressLesson[];
    @Field(() => Course, {
        nullable: true
    })
    course?: Course;
}

@Resolver()
export default class PublicCourseResolver {
    @Mutation(() => Boolean)
    @UseMiddleware(PublicAuth)
    async startLesson(
        @Arg("lessonId") lessonId: string,
        @Arg("courseId") courseId: string,
        @Ctx() ctx: ContextType
    ): Promise<boolean> {
        console.log("🚀 ~ PublicCourseResolver ~ courseId:", courseId)
        console.log("🚀 ~ PublicCourseResolver ~ lessonId:", lessonId)
        const userId = ctx.user;
        const _lesson = await prisma.lesson.findFirst({
            where: {
                slug: lessonId
            }
        });
        console.log("🚀 ~ PublicCourseResolver ~ _lesson:", _lesson)
        const _course = await prisma.course.findFirst({
            where: {
                slug: courseId
            }
        });
        console.log("🚀 ~ PublicCourseResolver ~ _course:", _course)

        const _courseCheck = await prisma.courseProgress.findFirst({
            where: {
                courseId: _course.id,
                userId
            },
            include: {
                lessonProgress: true
            }
        });
        let _lessonCheck = null;
        if (_courseCheck) {
            _lessonCheck = await prisma.lessonProgress.findFirst({
                where: {
                    lessonId: _lesson.id,
                    courseProgressId: _courseCheck.id,
                    userId
                }
            });
        }
        
        if (_lessonCheck && _lessonCheck.status !== "NOT_STARTED") {
            throw new Error(`Lesson is already ${(_lessonCheck.status === "COMPLETE") ? "completed" : "in progress" }`);
        }

        let _courseProgressId = null;

        if (!_courseCheck) {
            const _newCourse = await prisma.courseProgress.create({
                data: {
                    courseWId: _course.wid,
                    status: courseStatus.IN_PROGRESS,
                    userId,
                    courseId: _course.id
                }
            });
            _courseProgressId = _newCourse.id;
        } else {
            if (_courseCheck && _courseCheck.status === courseStatus.COMPLETE) {
                await prisma.courseProgress.update({
                    where: {
                        id: _courseCheck.id
                    },
                    data: {
                        courseId: _course.id,
                        status: courseStatus.IN_PROGRESS,
                        userId,
                        updatedAt: new Date()
                    }
                });
            }
            _courseProgressId = _courseCheck.id;
        }

        await prisma.lessonProgress.create({
            data: {
                lessonWId: _lesson.wid,
                lessonId: _lesson.id,
                userId,
                courseProgressId: _courseProgressId,
                status: lessonStatus.IN_PROGRESS
            }
        });

        return true;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(PublicAuth)
    async updateLessonStatus(
        @Arg("lessonId") lessonId: string,
        @Arg("courseId") courseId: string,
        @Arg("status") status: lessonStatus,
        @Arg("isLastLesson", { nullable: true }) isLastLesson: boolean,
        @Ctx() ctx: ContextType
    ) : Promise<boolean> {
        const userId = ctx.user;
        const _lesson = await prisma.lesson.findFirst({
            where: {
                slug: lessonId
            }
        });
        const _course = await prisma.course.findFirst({
            where: {
                slug: courseId
            },
            include: {
                courseProgress: {
                    where: {
                        userId: ctx.user
                    }
                }
            }
        });
        const _lessonCheck = await prisma.lessonProgress.findFirst({
            where: {
                lessonId: _lesson.id,
                userId: ctx.user,
                courseProgressId: _course.courseProgress[0].id
            }
        });
        
        if (!_lessonCheck) {
            throw new Error(`Unable to locate the given lesson's progress!`);
        }

        if (status === "COMPLETE") {
            await prisma.lessonProgress.update({
                where: {
                    id: _lessonCheck.id
                },
                data: {
                    status,
                    completedAt: new Date(),
                }
            });
        } else {
            await prisma.lessonProgress.update({
                where: {
                    id: _lessonCheck.id
                },
                data: {
                    status,
                    updatedAt: new Date(),
                }
            });
        }
        
        if (isLastLesson && status === lessonStatus.COMPLETE) {
            const _courseCheck = await prisma.courseProgress.findFirst({
                where: {
                    courseId: _course.id,
                    userId
                },
                include: {
                    lessonProgress: true
                }
            });
            if (_courseCheck && _courseCheck.lessonProgress.every(lp => lp.status === "COMPLETE")) {
                await prisma.courseProgress.update({
                    where: {
                        id: _courseCheck.id
                    },
                    data: {
                        status: courseStatus.COMPLETE,
                        completedAt: new Date()
                    }
                });
            }
        }

        return true;
    }

    @Query(() => [PublicCourseProgressResponse])
    @UseMiddleware(PublicAuth)
    async getAllCoursesProgress(
        @Ctx() ctx: ContextType
    ): Promise<PublicCourseProgressResponse[]> {
        const userId = ctx.user
        const _allCourses = await prisma.courseProgress.findMany({
            where: {
                userId
            }, 
            include: {
                lessonProgress: true,
                course: true
            }
        });

        return _allCourses;
    }

    @Query(() => [PublicLessonProgressResponse])
    @UseMiddleware(PublicAuth)
    async getAllLessonsProgress(
        @Arg("courseId") courseId: string,
        @Ctx() ctx: ContextType
    ): Promise<PublicLessonProgressResponse[]> {
        const userId = ctx.user;
        const _course = await prisma.course.findFirst({
            where: {
                slug: courseId
            },
            include: {
                courseProgress: {
                    where: {
                        userId: ctx.user
                    }
                }
            }
        });
        const _allLessons = await prisma.lessonProgress.findMany({
            where: {
                userId,
                courseProgressId: _course.courseProgress[0].id
            }, 
            include: {
                courseProgress: true
            }
        });

        return _allLessons;
    }

    @Query(() => PublicCourseProgressResponse)
    @UseMiddleware(PublicAuth)
    async getCourseProgressByCourseId(
        @Arg("courseId") courseId: string,
        @Ctx() ctx: ContextType,
    ): Promise<PublicCourseProgressResponse> {
        const userId = ctx.user;
        const _course = await prisma.course.findFirst({
            where: {
                slug: courseId
            }
        });
        const _courseProgress = await prisma.courseProgress.findFirst({
            where: {
                userId,
                courseId: _course.id
            }, 
            include: {
                lessonProgress: {
                    include: {
                        lesson: true
                    }
                },
                course: true
            }
        });

        if (!_courseProgress) {
            throw new Error("Unable to locate course progress!");
        }

        return _courseProgress;
    }

    @Query(() => PublicLessonProgressResponse)
    @UseMiddleware(PublicAuth)
    async getLessonProgressById(
        @Arg("courseId") courseId: string,
        @Arg("lessonId") lessonId: string,
        @Ctx() ctx: ContextType,
    ): Promise<PublicLessonProgressResponse> {
        const userId = ctx.user;
        const _lesson = await prisma.lesson.findFirst({
            where: {
                slug: lessonId
            }
        });
        const _course = await prisma.course.findFirst({
            where: {
                slug: courseId
            },
            include: {
                courseProgress: {
                    where: {
                        userId
                    }
                }
            }
        });
        const _lessonProgress = await prisma.lessonProgress.findFirst({
            where: {
                userId,
                lessonId: _lesson.id,
                courseProgressId: _course.courseProgress[0].id
            }, 
            include: {
                courseProgress: true,
                lesson: true
            }
        });

        if (!_lessonProgress) {
            throw new Error("Unable to locate lesson progress!");
        }

        return _lessonProgress;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(PublicAuth)
    async updateReadTime(
        @Arg("lessonId") lessonId: string,
        @Arg("courseId") courseId: string,
        @Arg("readTime") readTime: number
    ): Promise<boolean> {
        const _lesson = await prisma.lesson.findFirst({
            where: {
                slug: lessonId
            }
        });

        if (_lesson) {
            await prisma.lesson.update({
                where: {
                    id: _lesson.id
                },
                data: {
                    readTime
                }
            });
    
            const _course = await prisma.course.findFirst({
                where: {
                    slug: courseId
                }
            });

            if (_course) {
                const _lessons = await prisma.lesson.findMany({
                    where: {
                        courseId: _course.id
                    }
                });

                let totalReadTime = 0;
                for (const l of _lessons) {
                    totalReadTime += l.readTime;
                }

                await prisma.course.update({
                    where: {
                        id: _course.id
                    },
                    data: {
                        readTime: totalReadTime
                    }
                });
            }
        }

        return true;
    }

    @Query(() => Boolean)
    @UseMiddleware(PublicAuth)
    async checkAllCoursesCompleted(
        @Ctx() ctx: ContextType,
    ): Promise<boolean> {
        const userId = ctx.user;
        const _allCourses = await prisma.course.count();
        console.log("🚀 ~ PublicCourseResolver ~ _allCourses:", _allCourses)
        const _allCompletedUserCourses = await prisma.courseProgress.count({
            where: {
                userId: userId,
                status: "COMPLETE"
            }
        });
        console.log("🚀 ~ PublicCourseResolver ~ _allCompletedUserCourses:", _allCompletedUserCourses)

        return (_allCourses === _allCompletedUserCourses);
    }
}