import { WFComponent, navigate } from "@xatom/core";
import { PUBLIC_PATHS } from "../../config";
import { publicQL } from "../../graphql";
import { GetCourseProgressByCourseIdDocument } from "../../graphql/graphql";
import { curtainLoader } from "client-utils/curtain-loader";

export const courseHighlights = () => {
    if (document.referrer === '') {
        navigate({
            to: PUBLIC_PATHS.courseList,
            type: "replace",
        });
        return;
    }
    curtainLoader().hide();
    const highlightHeader = new WFComponent(`[xa-type="highlight-header"]`);
    const lessonsList = highlightHeader.getChildAsComponents(`[xa-type="lesson-item"]`);
    const headerRevisitBtn = highlightHeader.getChildAsComponent(`[xa-type="header-restart-button"]`);
    const footerRevisitBtn = new WFComponent(`[xa-type="footer-restart-button"]`);
    const revisitLink = lessonsList[0].getAttribute("xa-lesson-slug");
    // const getCourseProgressByCourseIdReq = publicQL.query(GetCourseProgressByCourseIdDocument);
    // const courseReadTimeContainer = highlightHeader.getChildAsComponent(`[xa-type="read-duration"]`);
    const courseSlug = highlightHeader.getChildAsComponent(`a`).getAttribute("href").split("/")[3];
    // getCourseProgressByCourseIdReq.onData((data) => {
    //     // courseReadTimeContainer.setText(`${data.getCourseProgressByCourseId.course.readTime || 0} mins`);
    // });

    if (!revisitLink) {
        headerRevisitBtn.addCssClass("hide");
        footerRevisitBtn.addCssClass("hide");
        curtainLoader().hide();
    } else {
        curtainLoader().hide();
        headerRevisitBtn.on("click", () => {
            navigate(`${PUBLIC_PATHS.lessonDetailRoute}/${revisitLink}`);
        });
    
        footerRevisitBtn.on("click", () => {
            navigate(`${PUBLIC_PATHS.lessonDetailRoute}/${revisitLink}`);
        });
    }
    // getCourseProgressByCourseIdReq.fetch({
    //     courseId:courseSlug
    // });
}