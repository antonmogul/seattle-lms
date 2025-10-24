import { WFComponent, navigate } from "@xatom/core";
import { publicQL } from "../../graphql";
import { GetAllCoursesProgressDocument } from "../../graphql/graphql";
import { PUBLIC_PATHS } from "../../config";
import { curtainLoader } from "client-utils/curtain-loader";

export const courseList = () => {
    const getAllCoursesProgressReq = publicQL.query(GetAllCoursesProgressDocument);

    getAllCoursesProgressReq.onError((err) => {
        console.log("Course List Error: ", err);
    });
    const completedCoursesCountContainerHead = new WFComponent(`[xa-type="completed-courses"]`);
    const totalCoursesCountContainerHead = new WFComponent(`[xa-type="total-courses"]`);
    const totalCoursesCountContainer = new WFComponent(`[xa-type="dash-courses"]`);
    const inProgressCoursesCountContainer = new WFComponent(`[xa-type="dash-courses-inprogress"]`);
    const completedCoursesCountContainer = new WFComponent(`[xa-type="dash-courses-completed"]`);
    const learningPathList = new WFComponent(`[xa-type="learning-path-list"]`);
    const learningPathListItems = learningPathList.getChildAsComponents(`[xa-type="course-item"]`);
    const courseGrid = new WFComponent(`[xa-type="course-grid"]`);
    const courseGrindCompletedCourses = courseGrid.getChildAsComponent(`[xa-type="completed-courses"]`);
    const featuredCourseBlock = new WFComponent(`[xa-type="featured-course-card"]`);

    // Courses section
    getAllCoursesProgressReq.onData((data) => {
        const courseListContainer = new WFComponent(`[xa-type="course-list"]`);
        const courseItemContainers = courseListContainer.getChildAsComponents(`[xa-type="course-card"]`);
        const completedCourses = data.getAllCoursesProgress.filter(cp => cp.status === "COMPLETE");
        const inProgressCourses = data.getAllCoursesProgress.filter(cp => cp.status === "IN_PROGRESS");
        completedCoursesCountContainerHead.setText(completedCourses.length);
        const totalCoursesCount = courseItemContainers.filter(c =>
            !(c.getChildAsComponents(`[xa-type="button"]`).find(b => b.getHTML() === "coming soon" &&
                !b.getCssClass().includes("w-condition-invisible")))
        ).length;
        totalCoursesCountContainerHead.setText(totalCoursesCount);
        inProgressCoursesCountContainer.updateTextViaAttrVar({
            count: inProgressCourses.length
        });
        completedCoursesCountContainer.updateTextViaAttrVar({
            count: completedCourses.length
        });
        courseGrindCompletedCourses.setText(completedCourses.length);
        totalCoursesCountContainer.updateTextViaAttrVar({
            count: totalCoursesCount
        });
        const inProgressCoursesFinal = [];
        const comingSoonCoursesFinal = [];
        const completedCoursesFinal = [];
        const notStartedCoursesFinal = [];
        courseItemContainers.forEach((courseItem) => {
            let circularProgress = courseItem.getChildAsComponent(".circular-progress");
            circularProgress.addCssClass("hide");
            const courseSlug = courseItem.getAttribute("xa-course-slug");
            const courseButtonContainer = courseItem.getChildAsComponent(`[xa-type="button"]`);
            const course = data.getAllCoursesProgress.find(cp => cp.course.slug === courseSlug);
            const completedLessonsCountContainer = courseItem.getChildAsComponent(`[xa-type="completed-courses"]`);
            const completedCoursesCount = course?.lessonProgress.filter(lp => lp.status === "COMPLETE").length || 0;
            const completedLessonsCount = course?.lessonProgress.filter(lp => lp.status === "COMPLETE").length || 0;
            const totalLessonsCount = courseItem.getChildAsComponent(`[xa-type="total-courses"]`).getText();
            const courseHighlightsSlug = courseItem.getAttribute("xa-highlight-slug");
            completedLessonsCountContainer.setText(completedCoursesCount);
            courseButtonContainer.setText("View Details");
            // const readDuration = courseItem.getChildAsComponent(`[xa-type="read-duration"]`);
            const readTime = data.getAllCoursesProgress?.find(cp => cp?.course?.slug === courseSlug)?.course?.readTime || 0;
            // readDuration.setText(`${readTime} mins`);
            if (course?.status === "COMPLETE") {
                completedCoursesFinal.push(courseItem);
                courseButtonContainer.setText("View Highlights");
                courseButtonContainer.on("click", (e) => {
                    e.preventDefault();
                    navigate(`${PUBLIC_PATHS.courseHighlightRoute}/${courseHighlightsSlug}`);
                });
            } else if (
                courseItem.getChildAsComponents(`[xa-type="button"]`).find(b => b.getHTML() === "coming soon" &&
                    !b.getCssClass().includes("w-condition-invisible"))
            ) {
                comingSoonCoursesFinal.push(courseItem);
                courseItem.getChildAsComponent(`.courses-grid_metatag-list`).addCssClass("hide");
            } else if (course?.status) {
                inProgressCoursesFinal.push(courseItem);
            } else {
                notStartedCoursesFinal.push(courseItem)
            }
            setCourseProgressRing(courseItem, parseInt(totalLessonsCount), completedLessonsCount)
        });
        let courseCard, featuredCourseSlug = "";
        if (data?.getAllCoursesProgress?.find(cp => cp.status === "IN_PROGRESS")) {
            featuredCourseSlug = data?.getAllCoursesProgress?.find(cp => cp.status === "IN_PROGRESS").course.slug;
        } else if (totalCoursesCount === data?.getAllCoursesProgress?.length) {
            featuredCourseSlug = data?.getAllCoursesProgress[0].course.slug;
        } else {
            featuredCourseSlug = notStartedCoursesFinal[0].getAttribute("xa-course-slug");
        }
        courseCard = courseListContainer.getChildAsComponent(`[xa-course-slug="${featuredCourseSlug}"]`);
        courseListContainer.setHTML("");
        [...inProgressCoursesFinal, ...notStartedCoursesFinal, ...comingSoonCoursesFinal, ...completedCoursesFinal].forEach((card) => {
            courseListContainer.appendChild(card);
        });

        learningPathListItems.forEach((item) => {
            const courseSlug = item.getAttribute(`xa-course-slug`);
            const courseProgressData = data.getAllCoursesProgress.find(cp => cp.course.slug === courseSlug);
            const tickIconDiv = item.getChildAsComponent(`.tick_icon`);
            if (courseProgressData && courseProgressData.status === 'COMPLETE') {
                tickIconDiv.addCssClass("is-active");
                item.addCssClass("is-active");
            } else {
                tickIconDiv.removeCssClass("is-active");
                item.removeCssClass("is-active");
            }
        });
        if (totalCoursesCount === 1 || totalCoursesCount === 0) {
            featuredCourseBlock.addCssClass("hide");
        }
        courseCard.addCssClass("hide");
        setFeatureCourseCard(courseCard);
        curtainLoader().hide()
    });
    getAllCoursesProgressReq.onError((data) => {
        curtainLoader().hide()
    });
    getAllCoursesProgressReq.fetch();
};

const setFeatureCourseCard = (courseCard: WFComponent) => {
    const courseCardImageURL = courseCard.getChildAsComponent(`[xa-type="image"]`).getAttribute("src");
    console.log(courseCard);
    const courseCardTotalLessons = courseCard.getChildAsComponent(`[xa-type="total-courses"]`).getText();
    const courseCardCompletedLessons = courseCard.getChildAsComponent(`[xa-type="completed-courses"]`).getText();
    const courseCardTitle = courseCard.getChildAsComponent(`[xa-type="course-title"]`).getText();
    const courseCardDesc = courseCard.getChildAsComponent(`[xa-type="course-desc"]`).getText();
    const courseCardLessonsCount = courseCard.getChildAsComponent(`[xa-type="course-lesson-count"]`).getText();
    const courseReadDuration = courseCard.getChildAsComponent(`[xa-type="read-duration"]`).getText();
    const featuredCourseCard = new WFComponent(`[xa-type="featured-course-card"]`);
    const featuredCourseCardImageContainer = featuredCourseCard.getChildAsComponent(`[xa-type="image"]`);
    const featuredCourseCardTitleContainer = featuredCourseCard.getChildAsComponent(`[xa-type="course-title"]`);
    const featuredCourseCardDescContainer = featuredCourseCard.getChildAsComponent(`[xa-type="course-desc"]`);
    const featuredCourseCardNoOfLessonsContainer = featuredCourseCard.getChildAsComponent(`[xa-type="featured-course-lessons-count"]`);
    const featuredCourseButton = featuredCourseCard.getChildAsComponent(`[xa-type="button"]`);
    const featuredReadDuration = featuredCourseCard.getChildAsComponent(`[xa-type="read-duration"]`);
    const featuredCourseCardProgress = featuredCourseCard.getChildAsComponent(`[xa-type="total-lessons"]`);
    featuredCourseCardProgress.setText(courseCardTotalLessons);
    const featuredCourseCardCompletedLessons = featuredCourseCard.getChildAsComponent(`[xa-type="completed-courses"]`);
    featuredCourseCardCompletedLessons.setText(courseCardCompletedLessons);
    featuredCourseCardImageContainer.setAttribute("src", courseCardImageURL);
    featuredCourseCardTitleContainer.setText(courseCardTitle);
    featuredCourseCardDescContainer.setText(courseCardDesc);
    featuredCourseCardNoOfLessonsContainer.setText(`${courseCardLessonsCount} Lessons`);
    featuredCourseButton.setText(courseCard.getChildAsComponent(`[xa-type="button"]`).getText());
    featuredCourseButton.setAttribute("href", courseCard.getChildAsComponent(`[xa-type="button"]`).getAttribute("href"));
    featuredReadDuration.setText(`${courseReadDuration} min`);
    setCourseProgressRing(featuredCourseCard, parseInt(courseCardTotalLessons), parseInt(courseCardCompletedLessons));
}

const setCourseProgressRing = (courseCard: WFComponent<HTMLElement>, totalLessons: number, completedLessons: number) => {
    let circularProgress = courseCard.getChildAsComponent(".circular-progress");
    let progressStartValue = 0,
        speed = 10;
    const progressPercentage = (completedLessons * 100) / totalLessons;
    let progress = setInterval(() => {
        progressStartValue++;
        circularProgress.getElement().style.background = `conic-gradient(#00B8B4 ${progressStartValue * 3.6}deg, #ededed 0deg)`
        if (progressStartValue >= progressPercentage) {
            clearInterval(progress);
        }
    }, speed);
    if (completedLessons > 0)
        circularProgress.removeCssClass("hide");
}

