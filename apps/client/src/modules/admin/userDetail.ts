import { WFComponent, WFDynamicList } from "@xatom/core";
import { adminQL } from "../../graphql"
import { AdminGetUserDocument, AdminGetUserProgressDocument, AdminUpdateUserStatusDocument } from "../../graphql/graphql"
import { S3_BASE_URL } from "../../config";
import { formatDate, setCourseProgressRing } from "client-utils/utility-functions"
import { curtainLoader } from "client-utils/curtain-loader";

export const userDetails = (pageQuery: { id: string }) => {
    const userId = pageQuery.id;
    const getUserDetailsReq = adminQL.query(AdminGetUserDocument);
    const getUserProgressReq = adminQL.query(AdminGetUserProgressDocument, {
        fetchPolicy: "network-only"
    });
    const adminUpdateUserStatusReq = adminQL.mutation(AdminUpdateUserStatusDocument);
    const userDetailsCard = new WFComponent(`[xa-type="user-detail-card"]`);
    const statusToggle = new WFComponent(`[xa-type="status-toggle"]`);
    const statusToggleMasK = statusToggle.getChildAsComponent(`[xa-type="toggle-mask"]`);
    const statusToggleDot = statusToggle.getChildAsComponent(`[xa-type="toggle-dot"]`);
    const statusDialogTrigger = new WFComponent(`[xa-type="status-dialog-trigger"]`);
    const statusDialog = new WFComponent(`[xa-type="status-change-dialog"]`);
    const statusDialogClose = statusDialog.getChildAsComponent(`[xa-type="close-button"]`);
    const confirmStatusTrigger = statusDialog.getChildAsComponent(`[xa-type="confirm-status-change"]`);
    const userImage = new WFComponent(`[xa-type="user-image"]`);
    const topbar = new WFComponent(`.topbar_component.is-admin`);
    const userSearchInput = topbar.getChildAsComponent(`[xa-type="list-search-input"]`).getElement() as HTMLInputElement;
    const courseStatusFilter = topbar.getChildAsComponent(`[xa-type="course-status-filter"]`);
    const courseProgressFilter = courseStatusFilter.getChildAsComponent(`[xa-type="progress-filter"]`);
    const courseCompletedFilter = courseStatusFilter.getChildAsComponent(`[xa-type="completed-filter"]`);
    const clearFilters = topbar.getChildAsComponent(`[xa-type="clear-all-filters"]`);
    let courseStatus = "";

    const promises = [
        getUserDetailsReq.fetch({
            userId
        }),
        getUserProgressReq.fetch({
            userId
        })
    ];

    getUserDetailsReq.onData((res) => {
        const userData = { ...res.adminGetUser.user };
        userDetailsCard.updateTextViaAttrVar({
            "user-name": `${userData.firstName} ${userData.lastName}`,
            "bc-user-name": `${userData.firstName} ${userData.lastName}`,
            "email": userData.email,
            "join-date": formatDate(new Date(userData.createdAt)),
            "login-date": formatDate(new Date(userData.lastLoginAt)),
            "status": userData.enabled ? "Enabled" : "Disabled"
        });

        if (userData.enabled) {
            statusToggleMasK.addCssClass("is-on");
            statusToggleDot.addCssClass("is-on");
        }

        adminUpdateUserStatusReq.onData(({ adminUpdateUserStatus }) => {
            userData.enabled = adminUpdateUserStatus.enabled;
            if (userData.enabled) {
                statusToggleMasK.addCssClass("is-on");
                statusToggleDot.addCssClass("is-on");
            } else {
                statusToggleMasK.removeCssClass("is-on");
                statusToggleDot.removeCssClass("is-on");
            }
            userDetailsCard.updateTextViaAttrVar({ "status": userData.enabled ? "Enabled" : "Disabled" });
            statusDialogClose.getElement().click();
        });

        adminUpdateUserStatusReq.onLoadingChange((status) => {
            if (status) {
                confirmStatusTrigger.setAttribute("disabled", "true");
                confirmStatusTrigger.addCssClass("is-disabled");
                confirmStatusTrigger.setText("Please wait...");
            } else {
                confirmStatusTrigger.setAttribute("disabled", "false");
                confirmStatusTrigger.removeCssClass("is-disabled");
                confirmStatusTrigger.setText("Yes, Disable");
            }
        });

        statusToggle.on("click", () => {
            if (userData.enabled) {
                statusDialogTrigger.getElement().click();
                confirmStatusTrigger.on("click", () => {
                    adminUpdateUserStatusReq.fetch({
                        status: (!userData.enabled),
                        userId: userData.id
                    });
                });
            } else {
                adminUpdateUserStatusReq.fetch({
                    status: (!userData.enabled),
                    userId: userData.id
                });
            }
        });

        if (userData.avatar) {
            userImage.setAttribute("src", `${S3_BASE_URL}${userData.avatar}`);
            userImage.setAttribute("srcSet", `${S3_BASE_URL}${userData.avatar}`);
        } else {
            userImage.setAttribute("src", `https://uploads-ssl.webflow.com/6556f4e9bd95ad0ca4739845/65af45f92d2c8161f27ed3bd_avatar-placeholder.jpg`);
            userImage.setAttribute("srcSet", `https://uploads-ssl.webflow.com/6556f4e9bd95ad0ca4739845/65af45f92d2c8161f27ed3bd_avatar-placeholder.jpg`);
        }
    });

    const courseProgressList = new WFDynamicList<{
        id: string
        name: string;
        lessons: number;
        duration: string;
        progress: number;
        status: string;
    },
        HTMLDivElement,
        HTMLDivElement,
        HTMLDivElement
    >(`[xa-type="user-courses-list"]`, {
        rowSelector: `[xa-type="item"]`,
        emptySelector: `[xa-type="empty-state"]`
    });


    courseProgressList.rowRenderer(({ rowData, rowElement }) => {
        rowElement.updateTextViaAttrVar({
            name: rowData.name,
            lessons: rowData.lessons.toString(),
            duration: rowData.duration,
            "completed-courses": rowData.progress.toString(),
            "status-text": rowData.status
        });
        const status = rowElement.getChildAsComponent(`[xa-type="status"]`);
        status.addCssClass((rowData.status === "COMPLETED") ? "is-completed" : "is-progress");
        setCourseProgressRing(rowElement, rowData.lessons, rowData.progress);
        return rowElement;
    });

    getUserProgressReq.onData((data) => {
        console.log(data);
        const progressData: {
            id: string
            name: string;
            lessons: number;
            duration: string;
            progress: number;
            status: string;
        }[] = data.adminGetUserProgress.courseProgress.map(u => {
            return {
                id: u.courseWId,
                name: u.course.name,
                lessons: u.course.lessonCount,
                duration: "N/A",
                progress: u.lessonProgress ? u.lessonProgress.filter(d => d.status === "COMPLETE").length : 0,
                status: (u.status === "IN_PROGRESS") ? "IN PROGRESS" : (u.status === "COMPLETE") ? "COMPLETED" : "NOT STARTED"
            }
        });
        courseProgressList.setData(progressData);


        // Search filter 
        userSearchInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                let searchTerm = userSearchInput.value;
                const filteredData = progressData.filter(function (item) {
                    return item.name.toLowerCase().includes(searchTerm);
                });

                courseProgressList.setData(filteredData);
            }
        });
    });

    //Filter by course progress status 
    courseProgressFilter.on("click", () => {
        courseProgressFilter.removeCssClass("active");
        courseCompletedFilter.removeCssClass("active");
        courseStatus = "IN_PROGRESS";
        getUserProgressReq.fetch({
            userId,
            courseStatus
        });
        courseProgressFilter.addCssClass("active");
    });

    //Filter by course complete status 
    courseCompletedFilter.on("click", () => {
        courseProgressFilter.removeCssClass("active");
        courseCompletedFilter.removeCssClass("active");
        courseStatus = "COMPLETE";
        getUserProgressReq.fetch({
            userId,
            courseStatus
        });
        courseCompletedFilter.addCssClass("active");
    });

    // Clear all filters
    clearFilters.on("click", () => {
        courseProgressFilter.removeCssClass("active");
        courseCompletedFilter.removeCssClass("active");
        userSearchInput.value = ""; //change on data
        courseStatus = "";
        getUserProgressReq.fetch({
            userId
        });
    })


    Promise.all(promises).then((data) => {
        curtainLoader().hide();
    })
}