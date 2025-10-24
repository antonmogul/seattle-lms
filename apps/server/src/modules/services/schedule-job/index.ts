import prisma from "orm";
import { CLIENT_URL, webflowCMSCollections, webflowCollections } from "../../../config/global";
import { listAllCollectionItems, listCollectionItems, publishCollectionItems, updateCollectionItems } from "../webflow-api";
import cron from "node-cron";


export const coursesSyncCronjob = async () => {
    cron.schedule("0 0 * * *", async () => {
        await resetUsersAdminsOTPLimit();
        await syncCoursesAndLessons(true);
    });
    await syncCoursesAndLessons(true);
}

export const emailsCronJob = async () => {
    // cron.schedule("0 0 * * *", async () => {
    //     await sendCourseReminderEmails();
    //     await sendCourseProgressEmails();
    //     await sendOnboardingEmails();
    // });
}

export const syncCoursesAndLessons = async (cron: boolean = false) => {
    await syncCourses();
    await syncLessons();
    if (!cron) await syncCourseDurations();
}

export const syncCourses = async () => {
    let offset = 0, total = 1, noOfRecords = 100;
    const coursesToUpdate = [];
    const _allWFCourseWIDs: string[] = [];
    while (offset <= total) {
        const coursesData = (await (await listCollectionItems(webflowCMSCollections.Courses, offset)).json());
        if (coursesData && coursesData.items) {
            _allWFCourseWIDs.push(...coursesData.items.map(cd => cd.id));
            let mappedCourses = [];
            for (const cd of coursesData.items) {
                const _courseExist = await checkCourseInDB(cd.id);
                if (_courseExist) {
                    coursesToUpdate.push(cd);
                } else {
                    mappedCourses.push({
                        wid: cd.id,
                        name: cd.fieldData.name,
                        slug: cd.fieldData.slug,
                        comingSoon: cd.fieldData["coming-soon"],
                        lessonCount: cd.fieldData["lesson-count"],
                        createdAt: cd.createdOn,
                        updatedAt: cd.lastUpdated
                    });
                }
            }
            mappedCourses = mappedCourses.filter(c => c);
            if (mappedCourses && mappedCourses.length) {
                await prisma.course.createMany({
                    data: mappedCourses
                });
            }
            total = coursesData.pagination.total;
            offset += (noOfRecords);
        }
    }
    for (let ctu of coursesToUpdate) {
        const _currentCourse = await prisma.course.findFirst({
            where: {
                wid: ctu.id
            }
        });
        await prisma.course.updateMany({
            where: {
                wid: ctu.id
            },
            data: {
                wid: ctu.id,
                name: ctu.fieldData.name,
                slug: ctu.fieldData.slug,
                readTime: _currentCourse.readTime,
                comingSoon: ctu.fieldData["coming-soon"],
                lessonCount: ctu.fieldData["lesson-count"],
                createdAt: ctu.createdOn,
                updatedAt: ctu.lastUpdated
            }
        });
    }
    console.log("🚀 ~ syncCourses ~ _allWFCourseWIDs:", _allWFCourseWIDs)
    const _courseIdsToDelete = (await prisma.course.findMany({
        where: {
            wid: {
                notIn: _allWFCourseWIDs
            }
        },
        select: {
            id: true
        }
    })).map(ctd => ctd.id);
    console.log("🚀 ~ syncCourses ~ _courseIdsToDelete:", _courseIdsToDelete)
    const _courseProgressIdsToDelete = (await prisma.courseProgress.findMany({
        where: {
            courseId: {
                in: _courseIdsToDelete
            }
        },
        select: {
            id: true
        }
    })).map(cptd => cptd.id);
    console.log("🚀 ~ syncCourses ~ _courseProgressIdsToDelete:", _courseProgressIdsToDelete)
    await prisma.lessonProgress.deleteMany({
        where: {
            courseProgressId: {
                in: _courseProgressIdsToDelete
            }
        }
    });
    await prisma.lesson.deleteMany({
        where: {
            courseId: {
                in: _courseIdsToDelete
            }
        }
    });
    await prisma.courseProgress.deleteMany({
        where: {
            id: {
                in: _courseProgressIdsToDelete
            }
        }
    });
    await prisma.course.deleteMany({
        where: {
            id: {
                in: _courseIdsToDelete
            }
        }
    });
}

const checkCourseInDB = async (courseWebflowId: string) => {
    const isCourseExist = await prisma.course.count({
        where: {
            wid: courseWebflowId
        }
    });
    return isCourseExist > 0;
}

export const syncLessons = async () => {
    let offset = 0, total = 1, noOfRecords = 100;
    const lessonsToUpdate = [];
    const _allWFLessonWIDs: string[] = [];
    while (offset <= total) {
        const lessonsData = (await (await listCollectionItems(webflowCMSCollections.Lessons, offset)).json());
        _allWFLessonWIDs.push(...lessonsData.items.map(cd => cd.id));
        if (lessonsData && lessonsData.items) {
            let mappedLessons = [];
            for (const ld of lessonsData.items) {
                const _lessonExist = await checkLessonInDB(ld.id);
                if (_lessonExist) {
                    lessonsToUpdate.push(ld);
                } else {
                    const courseId = (await prisma.course.findFirst({
                        where: {
                            wid: ld.fieldData.course
                        }
                    })).id;
                    mappedLessons.push({
                        wid: ld.id,
                        name: ld.fieldData.name,
                        slug: ld.fieldData.slug,
                        tag: ld.fieldData.tag,
                        lessonContent: ld.fieldData["lesson-content-temp"] || undefined,
                        courseId,
                        createdAt: ld.createdOn,
                        updatedAt: ld.lastUpdated
                    });
                }
            }
            mappedLessons = mappedLessons.filter(c => c);
            if (mappedLessons && mappedLessons.length) {
                await prisma.lesson.createMany({
                    data: mappedLessons
                });
            }
            total = lessonsData.pagination.total;
            offset += (noOfRecords);
        }
    }
    lessonsToUpdate.forEach(async ltu => {
        const courseId = (await prisma.course.findFirst({
            where: {
                wid: ltu.fieldData.course
            }
        })).id;
        const _currentLesson = await prisma.lesson.findFirst({
            where: {
                wid: ltu.id
            }
        });
        await prisma.lesson.updateMany({
            where: {
                wid: ltu.id
            },
            data: {
                wid: ltu.id,
                name: ltu.fieldData.name,
                slug: ltu.fieldData.slug,
                tag: ltu.fieldData.tag,
                lessonContent: ltu.fieldData["lesson-content-temp"] || undefined,
                readTime: _currentLesson.readTime,
                courseId,
                createdAt: ltu.createdOn,
                updatedAt: ltu.lastUpdated
            }
        });
    });
    const _lessonIdsToDelete = (await prisma.lesson.findMany({
        where: {
            wid: {
                notIn: _allWFLessonWIDs
            }
        },
        select: {
            id: true
        }
    })).map(ltd => ltd.id);

    await prisma.lessonProgress.deleteMany({
        where: {
            lessonId: {
                in: _lessonIdsToDelete
            }
        }
    });
    await prisma.lesson.deleteMany({
        where: {
            id: {
                in: _lessonIdsToDelete
            }
        }
    });
}

const checkLessonInDB = async (lessonWebflowId: string) => {
    const isLessonExist = await prisma.lesson.count({
        where: {
            wid: lessonWebflowId
        }
    });

    return isLessonExist > 0;
}

const findOrCreateInDB = async (name: string, dbTable: string) => {
    let data = null;
    switch (dbTable) {
        case "region":
            data = await prisma.region.findFirst({
                where: {
                    name
                }
            });
            if (!data) {
                data = await prisma.region.create({
                    data: {
                        name,
                    }
                });
            }
            break;
        case "country":
            data = await prisma.country.findFirst({
                where: {
                    name,
                }
            });
            if (!data) {
                data = await prisma.country.create({
                    data: {
                        name,
                    }
                });
            }
            break;
        case "state":
            data = await prisma.state.findFirst({
                where: {
                    name
                }
            });
            if (!data) {
                data = await prisma.state.create({
                    data: {
                        name,
                    }
                });
            }
            break;
        case "city":
            data = await prisma.city.findFirst({
                where: {
                    name
                }
            });
            if (!data) {
                data = await prisma.city.create({
                    data: {
                        name,
                    }
                });
            }
            break;
    }

    return data.id || null;
}

// const sendCourseReminderEmails = async () => {
//     const users = await prisma.user.findMany({
//         include: {
//             courseProgress: {
//                 where: {
//                     updatedAt: {
//                         lte: dayjs().subtract(7, "days").toDate()
//                     },
//                     status: "IN_PROGRESS"
//                 },
//                 include: {
//                     course: true
//                 }
//             }
//         }
//     });

//     for (const user of users) {
//         if (user.courseProgress && user.courseProgress.length) {
//             for (const cp of user.courseProgress) {
//                 const courseTitle = cp.course.name;
//                 const courseLastAccess = new Date(cp.updatedAt).toLocaleDateString();
//                 const courseLink = `${CLIENT_URL}/user/courses/${cp.course.slug}`;
//                 console.log(cp.course.name)
//                 await sendEmailWithTemplate(user.email, emailTemplates.COURSE_REMINDER_EMAIL, {
//                     email: user.email,
//                     name: user.firstName,
//                     courseTitle: courseTitle,
//                     lastAccessed: courseLastAccess,
//                     link: courseLink
//                 });
//             }
//         }
//     }
// }

// const sendCourseProgressEmails = async () => {
//     const startOfLastWeek = dayjs().subtract(1, 'week').startOf('week').toDate();
//     const endOfLastWeek = dayjs().subtract(1, 'week').endOf('week').toDate();

//     const users = await prisma.user.findMany({
//         include: {
//             courseProgress: {
//                 where: {
//                     updatedAt: {
//                         gte: startOfLastWeek,
//                         lte: endOfLastWeek
//                     }
//                 },
//                 include: {
//                     course: {
//                         include: {
//                             lessons: {
//                                 include: {
//                                     lessonProgress: true
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     });


//     const allCourses = await prisma.course.findMany({
//         where: {
//             comingSoon: false
//         }
//     });



//     for (const user of users) {
//         let completed, inProgress, nextMilestone;
//         if (user.courseProgress) {
//             completed = user.courseProgress.filter(d => d.status === "COMPLETE").length;
//             inProgress = user.courseProgress.filter(d => d.status === "IN_PROGRESS").length;
//             let notStartedCourses = allCourses.filter(d => !user.courseProgress.map(c => c.id).includes(d.id));
//             let inProgressCourses = user.courseProgress.filter(d => d.status === "IN_PROGRESS");
//             if (inProgressCourses.length) {
//                 const inProgressLessons = inProgressCourses[0].course.lessons.filter(d => d.lessonProgress.filter(lp => lp.status === "IN_PROGRESS"));
//                 if (inProgressLessons && inProgressLessons.length) {
//                     nextMilestone = `${inProgressLessons[0].name} in ${inProgressCourses[0].course.name}`;
//                 } else {
//                     const notStartedLessons = inProgressCourses[0].course.lessons.filter(d => d.lessonProgress.filter(lp => lp.status === "NOT_STARTED"));
//                     nextMilestone = `${notStartedLessons[0].name} - ${inProgressCourses[0].course.name}`;
//                 }
//             } else if (notStartedCourses.length) {
//                 nextMilestone = `${notStartedCourses[0].name} (Course)`;
//             } else {
//                 nextMilestone = "All courses completed";
//             }
//             console.log(completed, inProgress, nextMilestone)

//             await sendEmailWithTemplate(user.email, emailTemplates.COURSE_PROGRESS_EMAIL, {
//                 email: user.email,
//                 name: user.firstName,
//                 completedCourses: completed,
//                 inProgressCourses: inProgress,
//                 nextMilestone
//             });
//         }
//     }

// }

// const sendOnboardingEmails = async () => {
//     const users = await prisma.user.findMany({
//         where: {
//             createdAt: {
//                 lte: dayjs().subtract(5, "days").toDate(),
//                 gte: dayjs().subtract(4, "days").toDate()
//             }
//         }
//     });

//     users.forEach(async user => {
//         await sendEmailWithTemplate(user.email, emailTemplates.ONBOARDING_EMAIL, {
//             email: user.email,
//             name: user.firstName
//         });
//     })
// }

const resetUsersAdminsOTPLimit = async () => {
    await prisma.user.updateMany({
        data: {
            numberOfOTPSent: 0
        }
    });

    await prisma.admin.updateMany({
        data: {
            numberOfOTPSent: 0
        }
    });
}

export const syncCourseDurations = async () => {
    const lessonsData: any[] = await listAllCollectionItems(webflowCMSCollections.Lessons);
    const coursesData: any[] = await listAllCollectionItems(webflowCMSCollections.Courses);
    const courses: object = {};
    const updatedLessonIds = [], updatedCourseIds = [];
    let lessonsToUpdate = [], coursesToUpdate = [];

    // Format lesson data to update
    for (let lesson of lessonsData) {
        if (!lesson.isDraft) {
            if (!courses.hasOwnProperty(lesson.fieldData['course'])) {
                courses[lesson.fieldData['course']] = [];
            }
            
            const lessonDuration = calculateReadTime(lesson.fieldData['lesson-content-temp']);

            //Add lesson to lessonsToUpdate Array
            lessonsToUpdate.push({
                id: lesson.id,
                fieldData: {
                    "lesson-duration": lessonDuration
                }
            })
            updatedLessonIds.push(lesson.id)
            courses[lesson.fieldData['course']].push(lessonDuration);

        }
    }
    
    // Update & Publish lesson items
    if (lessonsToUpdate.length) {
        await updateCollectionItems(webflowCollections[webflowCMSCollections.Lessons], lessonsToUpdate);
    }

    for (let course in courses) {
        const courseDuration = courses[course].reduce((acc, curr) => acc + curr, 0);

        const courseItem = coursesData.find(c => c.id === course);

        if (courseItem && !courseItem.isDraft) {
            coursesToUpdate.push({
                id: course,
                fieldData: {
                    "course-duration": courseDuration
                }
            });
            updatedCourseIds.push(courseItem.id)
        }
    }

    if (coursesToUpdate.length) {
        await updateCollectionItems(webflowCollections[webflowCMSCollections.Courses], coursesToUpdate);
    }

    if (updatedLessonIds.length && updatedCourseIds.length) {
        await publishCollectionItems(webflowCollections[webflowCMSCollections.Lessons], updatedLessonIds);
        await publishCollectionItems(webflowCollections[webflowCMSCollections.Courses], updatedCourseIds);
    }
}

const calculateReadTime = (lessonText: string) => {
    const cleanedLessonText = lessonText?.replace(/<[^>]+>/g, '') || '';
    const wordsArray = cleanedLessonText.split(' ');
    const wordCount = wordsArray.length;
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute);
}