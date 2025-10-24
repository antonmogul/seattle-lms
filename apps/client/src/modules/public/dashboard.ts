import { WFComponent, navigate} from "@xatom/core";
import { publicQL } from "../../graphql";
import { CheckAllCoursesCompletedDocument, GetAllCoursesProgressDocument, SetExpertBadgeUnlockedDocument, UserMeDocument } from "../../graphql/graphql";
import { publicAuth } from "../../auth/public";
import { curtainLoader } from "client-utils/curtain-loader";
import { EXPERT_BADGE_LINK, PUBLIC_PATHS } from "../../config";

let loaderProgress = 0;

export const userDashboard = () => {
    
    const getAllCoursesProgressReq = publicQL.query(GetAllCoursesProgressDocument);
    const checkAllCoursesCompletedReq = publicQL.query(CheckAllCoursesCompletedDocument);
    const userMeReq = publicQL.query(UserMeDocument);
    const setExpertBadgeUnlockedReq = publicQL.mutation(SetExpertBadgeUnlockedDocument);
    //Header section 
    const dashboardHeader = new WFComponent(`[xa-type="header-section"]`);
    const dynamicDataContainer = new WFComponent(`[xa-type="dynamic-data-wrap"]`);
    const profileBars = dynamicDataContainer.getChildAsComponents(`[xa-type="profile-bar"]`);
    profileBars[0].updateTextViaAttrVar({
        name: publicAuth.getUser().name,
        email: publicAuth.getUser().email
    });
    profileBars[1].updateTextViaAttrVar({
        name: publicAuth.getUser().name,
        email: publicAuth.getUser().email
    });

    const userImagePlaceholderWrap = new WFComponent(`[xa-type="user-image-placeholder-wrap-right-bar"]`);
    const userImagePlaceHolder = userImagePlaceholderWrap.getChildAsComponent(`[xa-type="user-image-placeholder-right-bar"]`);
    const userImagePlaceholderWrapTablet = new WFComponent(`[xa-type="user-image-placeholder-wrap-tablet"]`);
    const userImagePlaceHolderTablet = userImagePlaceholderWrapTablet.getChildAsComponent(`[xa-type="user-image-placeholder-tablet"]`);
    const avatarLoaderWrap = new WFComponent(`[xa-type="avatar-loader-wrap"]`);
    const avatarLoader = avatarLoaderWrap.getChildAsComponent(`[xa-type="avatar-loader"]`);
    const learningPathListTablet = new WFComponent(`[xa-type="learning-path-list-tab"]`);
    const learningPathListItemsTablet = learningPathListTablet.getChildAsComponents(`[xa-type="course-item-tablet"]`);
    const learningPathList = new WFComponent(`[xa-type="learning-path-list"]`);
    const learningPathListItems = learningPathList.getChildAsComponents(`[xa-type="course-item"]`);

    window.onload = function () {
        const loaderIntervalId = setInterval(() => {
            loaderAnimation(avatarLoader);
        }, 10);
    }

    const fullName = publicAuth.getUser().name;
    const initials = getInitials(fullName);
    const imageColors = ['#F7E5C2', '#F2E5D1', '#EFEFEE', '#F6F6F7', '#D5E2E8', '#FBE1D5'];
    userImagePlaceHolder.setText(`${initials}`);
    userImagePlaceholderWrap.getElement().style.backgroundColor = getRandomValueFromArray(imageColors);
    userImagePlaceholderWrap.removeCssClass("hide");
    userImagePlaceHolderTablet.setText(`${initials}`);
    userImagePlaceholderWrapTablet.getElement().style.backgroundColor = getRandomValueFromArray(imageColors);
    userImagePlaceholderWrapTablet.removeCssClass("hide");

    const totalCoursesCountContainer = new WFComponent(`[xa-type="dash-courses"]`);
    const inProgressCoursesCountContainer = new WFComponent(`[xa-type="dash-courses-inprogress"]`);
    const completedCoursesCountContainer = new WFComponent(`[xa-type="dash-courses-completed"]`);
    localStorage.removeItem("sc-pac");
    localStorage.removeItem("sc-voac");
    
    // Courses section
    getAllCoursesProgressReq.onData((data) => {
        const courseListContainer = new WFComponent(`[xa-type="course-list"]`);
        const courseItemContainers = courseListContainer.getChildAsComponents(`[xa-type="course-card"]`);
        const inProgressCourses = data.getAllCoursesProgress.filter(cp => cp.status === "IN_PROGRESS");
        const completedCourses = data.getAllCoursesProgress.filter(cp => cp.status === "COMPLETE");
        const totalCoursesCount = courseItemContainers.filter(c =>
            !(c.getChildAsComponents(`[xa-type="button"]`).find(b => b.getHTML() === "coming soon" &&
                !b.getCssClass().includes("w-condition-invisible")))
        ).length;
        inProgressCoursesCountContainer.updateTextViaAttrVar({
            count: inProgressCourses.length
        });
        completedCoursesCountContainer.updateTextViaAttrVar({
            count: completedCourses.length
        });
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
            const completedLessonsCount = course?.lessonProgress.filter(lp => lp.status === "COMPLETE").length || 0;
            const totalLessonsCount = courseItem.getChildAsComponent(`[xa-type="total-courses"]`).getText();
            const courseHighlightsSlug = courseItem.getAttribute("xa-highlight-slug");
            completedLessonsCountContainer.setText(completedLessonsCount);
            courseButtonContainer.setText("View Details");
            // const readDuration = courseItem.getChildAsComponent(`[xa-type="read-duration"]`)
            const readTime = data.getAllCoursesProgress?.find(cp => cp?.course?.slug === courseSlug)?.course?.readTime || 0;
            // readDuration.setText(`${readTime}`);
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
                courseButtonContainer.setText("Continue");
            } else {
                notStartedCoursesFinal.push(courseItem);
                courseButtonContainer.setText("Start Course");
            }
            setCourseProgressRing(courseItem, parseInt(totalLessonsCount), completedLessonsCount)
        });

        courseListContainer.setHTML("");
        [...inProgressCoursesFinal, ...notStartedCoursesFinal, ...comingSoonCoursesFinal, ...completedCoursesFinal].forEach((card) => {
            courseListContainer.appendChild(card);
        });

        learningPathListItemsTablet.forEach((item) => {
            const courseSlug = item.getAttribute(`xa-course-slug`);
            const courseProgressData = data.getAllCoursesProgress.find(cp => cp.course.slug === courseSlug);
            const tickIconDiv = item.getChildAsComponent(`.tick_icon`);
            if (courseProgressData && courseProgressData.status === 'COMPLETE') {
                tickIconDiv.addCssClass("is-active");
                item.addCssClass("is-active");
            } else {
                tickIconDiv.getElement().innerHTML = "";
                item.removeCssClass("is-active");
            }
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
        checkAllCoursesCompletedReq.onData((data) => {
            userMeReq.onData((userData) => {
                const downlaodExpertBadgeWrapSidebar = new WFComponent(`[xa-type="sidebar-download-badge-wrap"]`);
                const downlaodExpertBadgeLink = new WFComponent(`[xa-type="download-now-btn"]`);
                const downlaodLaterLink = new WFComponent(`[xa-type="download-later-btn"]`);
                const downlaodExpertBadgeLinkSidebar = new WFComponent(`[xa-type="sidebar-downlaod-badge-button"]`);
                const downlaodExpertBadgeModal = new WFComponent(`[xa-type="expert-badge-modal"]`);
                if(data.checkAllCoursesCompleted) {
                    if (!userData.userMe.expertBadgeUnlocked) {
                        setExpertBadgeUnlockedReq.onData((res) => {
                            //Do something on expert badge unlocked
                        });
                        downlaodExpertBadgeModal.removeCssClass("is-hidden");
                        downlaodExpertBadgeLink.on("click", () => {
                            setExpertBadgeUnlockedReq.fetch();
                            window.open(EXPERT_BADGE_LINK, "_blank");
                        });
                        downlaodLaterLink.on("click", () => {
                            setExpertBadgeUnlockedReq.fetch();
                            downlaodExpertBadgeModal.addCssClass("is-hidden");
                        });
                        
                    }
                    downlaodExpertBadgeWrapSidebar.removeCssClass("hide");
                    downlaodExpertBadgeLinkSidebar.on("click", () => {
                        window.open(EXPERT_BADGE_LINK, "_blank");
                    });
                }
            });
            userMeReq.fetch();
        });
        checkAllCoursesCompletedReq.fetch();
        curtainLoader().hide();
    });
    getAllCoursesProgressReq.onError((data) => {
        curtainLoader().hide();
    });
    getAllCoursesProgressReq.fetch();
};


export const setCourseProgressRing = (courseCard: WFComponent<HTMLElement>, totalLessons: number, completedLessons: number) => {
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



const loaderAnimation = (loader) => {
    loader.getElement().style.background = `conic-gradient(#00B8B4 ${loaderProgress * 3.6}deg, #ededed 0deg)`;
    loaderProgress = (loaderProgress + 1) % 100;
}

const getInitials = (name) => {
    const words = name.split(' ');
    const initials = words.map(word => word.charAt(0).toUpperCase()).join('');
    return initials;
}

const getRandomValueFromArray = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

