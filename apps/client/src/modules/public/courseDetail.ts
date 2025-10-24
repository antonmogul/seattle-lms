import { WFComponent, navigate } from "@xatom/core";
import { publicQL } from "../../graphql";
import { GetCourseProgressByCourseIdDocument, } from "../../graphql/graphql";
import { PUBLIC_PATHS } from "../../config";
import { curtainLoader } from "client-utils/curtain-loader";

export const courseDetail = () => {
    const pathNameArr = window.location.pathname.split('/')
    const courseSlug = pathNameArr[pathNameArr.length - 1];
    const getCoursesProgressByIdReq = publicQL.query(GetCourseProgressByCourseIdDocument);
    const lessonCard = new WFComponent(`[xa-type="lesson-card"]`);
    const lessonList = new WFComponent(lessonCard.getElement().parentElement);
    const lessonCardsList = lessonList.getChildAsComponents(`[xa-type="lesson-card"]`);
    const totalLessonsCount = parseInt(new WFComponent(`[xa-type="total-lessons-count"]`).getText());
    const courseHeaderCard = new WFComponent(`[xa-type="course-header-card"]`);
    // const readDurationHeader = courseHeaderCard.getChildAsComponent(`[xa-type="read-duration"]`);
    const courseHeaderCardButton = courseHeaderCard.getChildAsComponent(`[xa-type="primary-button"]`);
    const completedCoursesCountContainer = new WFComponent(`[xa-type="completed-courses"]`);
    const courseProgressContainer = new WFComponent(`.course-about_progress-wrap`);
    const highlightsSlug = courseHeaderCard.getAttribute("xa-highlight-slug");
    const aboutCourse = new WFComponent(`.course-about_top`);
    // const aboutCourseReadDuration = aboutCourse.getChildAsComponent(`[xa-type="read-duration"]`);
    getCoursesProgressByIdReq.onData((data) => {
        // readDurationHeader.setText(`${data.getCourseProgressByCourseId?.course?.readTime || 0} mins`);
        // aboutCourseReadDuration.setText(`${data.getCourseProgressByCourseId?.course?.readTime || 0} mins`);
        const completedLessons = data.getCourseProgressByCourseId.lessonProgress.filter(lp => lp.status === "COMPLETE");
        const inProgressLessons = data.getCourseProgressByCourseId.lessonProgress.filter(lp => lp.status === "IN_PROGRESS");
        completedCoursesCountContainer.setText(completedLessons.length);
        setCourseProgressRing(courseProgressContainer, totalLessonsCount, completedLessons.length);
        let nextLessonSlug = null;
        lessonCardsList.forEach((lc) => {
            const completeBadge = lc.getChildAsComponent(`[xa-type="completed-badge"]`);
            const lessonSlug = lc.getAttribute("xa-lesson-slug");
            const lessonStatus = data.getCourseProgressByCourseId?.lessonProgress.find(lp => lp?.lesson?.slug === lessonSlug)?.status;
            if (lessonStatus !== "COMPLETE") {
                if (!nextLessonSlug) {
                    nextLessonSlug = lessonSlug;
                }
                completeBadge.addCssClass("hide");
            }
            // const readDuration = lc.getChildAsComponent(`[xa-type="read-duration"]`);
            // readDuration.setText(`${ data.getCourseProgressByCourseId?.lessonProgress.find(lp => lp?.lesson?.slug === lessonSlug)?.lesson.readTime || 0 } mins`);
        });
        if (completedLessons.length === totalLessonsCount) {
            courseHeaderCardButton.setText("View Highlights");
            courseHeaderCardButton.on("click", () => {
                navigate(`${PUBLIC_PATHS.courseHighlightRoute}/${highlightsSlug}`);
            });
        } else if (inProgressLessons.length === 0 && completedLessons.length === 0) {
            courseHeaderCardButton.setText("Start Course");
            courseHeaderCardButton.on("click", () => {
                navigate(`${PUBLIC_PATHS.lessonDetailRoute}/${lessonCardsList[0].getAttribute("xa-lesson-slug")}`);
            });
        } else {
            if (inProgressLessons?.length) {
                let lessonSlug = inProgressLessons[0]?.lesson?.slug;
                let inProgressCard = new WFComponent(`[xa-lesson-slug=${inProgressLessons[0].lesson?.slug}]`);
                let lessonTag = inProgressCard.getAttribute("xa-lesson-tag");
                courseHeaderCardButton.on("click", () => {
                    navigate(`${PUBLIC_PATHS.lessonDetailRoute}/${lessonSlug}`);
                });
                courseHeaderCardButton.setText(`Continue to ${lessonTag}`);
            } else {
                courseHeaderCardButton.on("click", () => {
                    navigate(`${PUBLIC_PATHS.lessonDetailRoute}/${nextLessonSlug}`);
                });
            }
        }
        curtainLoader().hide();
    });
    getCoursesProgressByIdReq.onError((err) => {
        const courseHeaderCard = new WFComponent(`[xa-type="course-header-card"]`);
        const courseHeaderCardButton = courseHeaderCard.getChildAsComponent(`[xa-type="primary-button"]`);
        const completedCoursesCountContainer = new WFComponent(`[xa-type="completed-courses"]`);
        const courseProgressContainer = new WFComponent(`.course-about_progress-wrap`);
        completedCoursesCountContainer.setText(0);
        courseHeaderCardButton.setText("Start Course");
        setCourseProgressRing(courseProgressContainer, totalLessonsCount, 0);
        lessonCardsList.forEach((lc) => {
            const completeBadge = lc.getChildAsComponent(`[xa-type="completed-badge"]`);
            // const readDuration = lc.getChildAsComponent(`[xa-type="read-duration"]`);
            // readDuration.setText(`0 mins`);
            completeBadge.addCssClass("hide");
        });
        courseHeaderCardButton.on("click", () => {
            navigate(`${PUBLIC_PATHS.lessonDetailRoute}/${lessonCardsList[0].getAttribute("xa-lesson-slug")}`);
        });
        curtainLoader().hide();
    });
    getCoursesProgressByIdReq.fetch({
        courseId: courseSlug
    });
};

const setCourseProgressRing = (courseCard: WFComponent<HTMLElement>, totalLessons: number, completedLessons: number) => {
    console.log("executed");
    let circularProgress = courseCard.getChildAsComponent(".circular-progress.course-about");
    let progressStartValue = 0,
        speed = 10;
    const progressPercentage = (completedLessons * 100) / totalLessons;
    let progress = setInterval(() => {
        progressStartValue++;
        circularProgress.getElement().setAttribute(
            "style", 
            `background: conic-gradient(var(--primary--ephren-blue) ${progressStartValue * 3.6}deg, var(--neutral--1) 0deg) !important;`
        )
        if (progressStartValue >= progressPercentage) {
            clearInterval(progress);
        }
    }, speed);
}

