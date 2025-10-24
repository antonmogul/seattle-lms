import { AdminGetCourseUserDetailsDocument, AdminUserActivityCourseDetailsDocument } from "../../graphql/graphql";
import { adminQL } from "../../graphql";
import { WFComponent, WFDynamicList } from "@xatom/core";
import { defineDateRange, formatDate, generatePaginationArray, sortList } from "client-utils/utility-functions";
import { datePickerConfig, datePickerConfig2, moment, tempusDominus } from "client-utils/datePicker";
import { configDoughnutChart1, formatCount } from "client-utils/chartjs";
import { curtainLoader } from "client-utils/curtain-loader";


export const courseDetailPage = (pageQuery: { id: string }) => {
    const gstartDate = localStorage.getItem("startDate");
    const gendDate = localStorage.getItem("endDate");
    const _gStartDate = new Date(gstartDate);
    const _gEndDate = new Date(gendDate);
    const courseId = pageQuery.id;
    const courseUsersReq = adminQL.query(AdminGetCourseUserDetailsDocument, {
        fetchPolicy: "network-only"
    });
    const courseActivityReq = adminQL.query(AdminUserActivityCourseDetailsDocument);
    const headerCourseName = new WFComponent(`[xa-type="page-title"]`);
    const userCountContainer = new WFComponent(`[xa-var="user-count"]`);
    const userList = new WFDynamicList<{
        id: string;
        name: string;
        email: string;
        lastLogin: string;
        joinDate: string;
        status: boolean;
        "course-status": string;
    },
        HTMLDivElement,
        HTMLDivElement,
        HTMLDivElement
    >(`[xa-type="users-list"]`, {
        rowSelector: `[xa-type="item"]`,
        emptySelector: `[xa-type="empty-state"]`
    });

    // const topbar = new WFComponent(`.topbar_component.is-admin`);
    // const userSearchInput = topbar.getChildAsComponent(`[xa-type="list-search-input"]`).getElement() as HTMLInputElement;
    // const courseStatusFilter = topbar.getChildAsComponent(`[xa-type="course-status-filter"]`);
    // const courseProgressFilter = courseStatusFilter.getChildAsComponent(`[xa-type="progress-filter"]`);
    // const courseCompletedFilter = courseStatusFilter.getChildAsComponent(`[xa-type="completed-filter"]`);
    // const userStatusFilter = topbar.getChildAsComponent(`[xa-type="user-status-filter"]`);
    // const userEnabledFilter = userStatusFilter.getChildAsComponent(`[xa-type="filter-by-enabled"]`);
    // const userDisabledFilter = userStatusFilter.getChildAsComponent(`[xa-type="filter-by-disabled"]`);
    // const clearFilters = topbar.getChildAsComponent(`[xa-type="clear-all-filters"]`);
    // const globalDateFilter = topbar.getChildAsComponent(`[xa-type="global-date-range-filter"]`).getElement();
    // const dateFilter = topbar.getChildAsComponent(`[xa-type="global-date-range-filter"]`);
    // const dateText = dateFilter.getChildAsComponent(`[xa-type="dp-text"]`);
    // dateText.setText((_gStartDate.toString() !== 'Invalid Date' && _gEndDate.toString() !== 'Invalid Date') ? `${formatDate(_gStartDate)} - ${formatDate(_gEndDate)}` : "Select Date Range");
    const dateModal = new WFComponent(`[xa-type="date-picker-modal"]`);
    const dateModalBtn = dateModal.getChildAsComponent(`[xa-type="apply-date"]`);
    const dateClerBtn = dateModal.getChildAsComponent(`[xa-type="clear-dates"]`);
    const dateRanges = dateModal.getChildAsComponents(`[xa-type="date-range"]`);
    const dateModalClose = dateModal.getChildAsComponent(`[xa-type="close-button"]`);
    const listHeader = new WFComponent(`[xa-type="header-row"]`);
    const loginSorter = listHeader.getChildAsComponent(`[xa-type="sort-by-login"]`);
    const joinedSorter = listHeader.getChildAsComponent(`[xa-type="sort-by-joined"]`);
    const statusSorter = listHeader.getChildAsComponent(`[xa-type="sort-by-status"]`);
    const progressSorter = listHeader.getChildAsComponent(`[xa-type="sort-by-progress"]`);
    const courseActivityBlock = new WFComponent(`[xa-type="course-activity-block"]`);
    let searchTerm = "",
        pageNo = 1,
        noOfRecords = 50,
        courseStatus = "",
        status = null,
        totalPages = 1,
        pageNoArr = [],
        joiningEndDate = gendDate ? gendDate : "",
        joiningStartDate = gstartDate ? gstartDate : "",
        lastLoginEndDate = gendDate ? gendDate : "",
        lastLoginStartDate = gstartDate ? gstartDate : "",
        startDate, endDate, rangeText;
    const promises = [
        courseUsersReq.fetch({
            courseId,
            searchTerm,
            pageNo,
            noOfRecords,
            joiningEndDate,
            joiningStartDate,
            lastLoginEndDate,
            lastLoginStartDate,
        }),
        courseActivityReq.fetch({
            courseId
        })
    ];

    const paginationList = new WFDynamicList<{
        pageNo: number;
    },
        HTMLDivElement,
        HTMLDivElement,
        HTMLDivElement
    >(`[xa-type="pagination-list"]`, {
        rowSelector: `[xa-type="pagination-item"]`
    });
    const prevButton = new WFComponent(`[xa-type="prev"]`);
    const nextButton = new WFComponent(`[xa-type="next"]`);

    prevButton.on("click", () => {
        pageNo = pageNo - 1;
        if (pageNo >= 1) {
            courseUsersReq.fetch({
                courseId,
                searchTerm,
                pageNo,
                noOfRecords
            })
        }
    });

    nextButton.on("click", () => {
        pageNo = pageNo + 1;
        if (pageNo <= totalPages) {
            courseUsersReq.fetch({
                courseId,
                searchTerm,
                pageNo,
                noOfRecords
            })
        }
    })

    paginationList.rowRenderer(({ rowData, rowElement }) => {
        rowElement.getChildAsComponent(`div`).setText(rowData.pageNo);
        if (pageNo === rowData.pageNo) {
            rowElement.addCssClass("active");
        }
        rowElement.on("click", () => {
            pageNo = rowData.pageNo;
            courseUsersReq.fetch({
                courseId,
                searchTerm,
                pageNo,
                noOfRecords
            })
        });
        return rowElement;
    });

    // date picker
    const startDateInput = document.getElementById('start-date') as HTMLInputElement;
    const endDateInput = document.getElementById('end-date') as HTMLInputElement;
    const startDatePicker = new tempusDominus.TempusDominus(startDateInput, datePickerConfig);
    const endDatePicker = new tempusDominus.TempusDominus(endDateInput, datePickerConfig2);
    startDateInput.addEventListener(tempusDominus.Namespace.events.change, (e) => {
        endDatePicker.updateOptions({
            restrictions: {
                minDate: e.detail.date
            }
        });
    });
    const endDateSubscription = endDatePicker.subscribe(tempusDominus.Namespace.events.change, (e) => {
        startDatePicker.updateOptions({
            restrictions: {
                maxDate: e.date
            }
        });
    });
    startDatePicker.dates.formatInput = function (date) { { return moment(date).format('MM/DD/YYYY') } }
    endDatePicker.dates.formatInput = function (date) { { return moment(date).format('MM/DD/YYYY') } }

    courseActivityReq.onData((data) => {
        if (data && data.adminUserActivityCourseDetails) {
            const started = data.adminUserActivityCourseDetails.startedCourses;
            const completed = data.adminUserActivityCourseDetails.completedCourses;
            configDoughnutChart1(courseActivityBlock, started, completed);
            courseActivityBlock.updateTextViaAttrVar({
                "course-starts": formatCount(started),
                "course-completes": formatCount(completed)
            });
        }
    });

    userList.rowRenderer(({ rowData, rowElement }) => {
        rowElement.updateTextViaAttrVar({
            name: rowData.name,
            email: rowData.email,
            login: rowData.lastLogin,
            joined: rowData.joinDate,
            "progress-text": (rowData["course-status"] === "COMPLETED") ? "COMPLETED" : "IN PROGRESS",
            "status-text": rowData.status ? "ENABLED" : "DISABLED"
        });
        const courseProgress = rowElement.getChildAsComponent(`[xa-type="course-progress"]`);
        const status = rowElement.getChildAsComponent(`[xa-type="status"]`);
        courseProgress.addCssClass((rowData["course-status"] === "COMPLETED") ? "is-completed" : "is-progress");
        status.addCssClass(rowData.status ? "is-enabled" : "is-disabled");
        return rowElement;
    })

    courseUsersReq.onData((res) => {
        const courseUsersData: {
            id: string;
            name: string;
            email: string;
            lastLogin: string;
            joinDate: string;
            status: boolean;
            "course-status": string;
        }[] = res.adminGetCourseUserDetails.data.courseProgress.map(u => {
            totalPages = Math.ceil(res.adminGetCourseUserDetails.totalRecords / noOfRecords);
            pageNoArr = generatePaginationArray(pageNo, totalPages);
            paginationList.setData(pageNoArr);
            courseActivityBlock.updateTextViaAttrVar({
                "total-users": formatCount(res.adminGetCourseUserDetails.totalRecords)
            });
            return {
                id: u.user.id,
                name: `${u.user.firstName} ${u.user.lastName}`,
                email: u.user.email,
                lastLogin: formatDate(new Date(u.user.lastLoginAt)),
                joinDate: formatDate(new Date(u.user.createdAt)),
                status: u.user.enabled,
                "course-status": u.status
            }
        });
        headerCourseName.setText(res.adminGetCourseUserDetails.data.name);
        userCountContainer.setText(courseUsersData.length);
        userList.setData(courseUsersData);
        dateModalClose.getElement().click();


        // Sort by last login
        let isLoginAsc: boolean;
        loginSorter.on("click", () => {
            joinedSorter.removeCssClass("down");
            loginSorter.removeCssClass("down");
            statusSorter.removeCssClass("down");
            progressSorter.removeCssClass("down");
            if (!isLoginAsc) {
                const sortedList = sortList(courseUsersData, 'byLastLogin', 'asc');
                userList.setData(sortedList);
                loginSorter.addCssClass("down");
                isLoginAsc = true;
            } else {
                console.log("exec");
                const sortedList = sortList(courseUsersData, 'byLastLogin', 'desc');
                userList.setData(sortedList);
                loginSorter.removeCssClass("down");
                isLoginAsc = false;
            }
        });

        // Sort by join date
        let isJoinedAsc: boolean;
        joinedSorter.on("click", () => {
            joinedSorter.removeCssClass("down");
            loginSorter.removeCssClass("down");
            statusSorter.removeCssClass("down");
            progressSorter.removeCssClass("down");
            if (!isJoinedAsc) {
                const sortedList = sortList(courseUsersData, 'byJoinedDate', 'asc');
                userList.setData(sortedList);
                joinedSorter.addCssClass("down");
                isJoinedAsc = true;
            } else {
                console.log("exec");
                const sortedList = sortList(courseUsersData, 'byJoinedDate', 'desc');
                userList.setData(sortedList);
                joinedSorter.removeCssClass("down");
                isJoinedAsc = false;
            }
        });

        // Sort by status
        let isEnabledFirst: boolean;
        statusSorter.on("click", () => {
            joinedSorter.removeCssClass("down");
            loginSorter.removeCssClass("down");
            statusSorter.removeCssClass("down");
            progressSorter.removeCssClass("down");
            if (!isEnabledFirst) {
                const sortedList = sortList(courseUsersData, 'byStatus', 'enabledFirst');
                userList.setData(sortedList);
                statusSorter.addCssClass("down");
                isEnabledFirst = true;
            } else {
                const sortedList = sortList(courseUsersData, 'byStatus', 'disabledFirst');
                userList.setData(sortedList);
                statusSorter.removeCssClass("down");
                isEnabledFirst = false;
            }
        });

        // Sort by progress
        let isCompletedFirst: boolean;
        progressSorter.on("click", () => {
            joinedSorter.removeCssClass("down");
            loginSorter.removeCssClass("down");
            statusSorter.removeCssClass("down");
            progressSorter.removeCssClass("down");
            if (!isCompletedFirst) {
                const sortedList = sortList(courseUsersData, 'byProgress', 'completedFirst');
                userList.setData(sortedList);
                progressSorter.addCssClass("down");
                isCompletedFirst = true;
            } else {
                const sortedList = sortList(courseUsersData, 'byProgress', 'notCompletedFirst');
                userList.setData(sortedList);
                progressSorter.removeCssClass("down");
                isCompletedFirst = false;
            }
        });
    });

    // userSearchInput.addEventListener("keyup", (e) => {
    //     if (e.key === "Enter") {
    //         e.preventDefault();
    //         searchTerm = userSearchInput.value;
    //         courseUsersReq.fetch({
    //             courseId,
    //             searchTerm,
    //             pageNo,
    //             noOfRecords
    //         })
    //     }
    // });

    // //Filter by course progress status 
    // courseProgressFilter.on("click", () => {
    //     courseProgressFilter.removeCssClass("active");
    //     courseCompletedFilter.removeCssClass("active");
    //     courseStatus = "IN_PROGRESS";
    //     courseUsersReq.fetch({
    //         courseId,
    //         searchTerm,
    //         pageNo,
    //         noOfRecords,
    //         courseStatus
    //     })
    //     courseProgressFilter.addCssClass("active");
    // });

    // //Filter by course complete status 
    // courseCompletedFilter.on("click", () => {
    //     courseProgressFilter.removeCssClass("active");
    //     courseCompletedFilter.removeCssClass("active");
    //     courseStatus = "COMPLETE";
    //     courseUsersReq.fetch({
    //         courseId,
    //         searchTerm,
    //         pageNo,
    //         noOfRecords,
    //         courseStatus
    //     })
    //     courseCompletedFilter.addCssClass("active");
    // });

    // //Filter by status - enabled
    // userEnabledFilter.on("click", () => {
    //     userEnabledFilter.removeCssClass("active");
    //     userDisabledFilter.removeCssClass("active");
    //     statusSorter.addCssClass("hide");
    //     status = true;
    //     courseUsersReq.fetch({
    //         courseId,
    //         searchTerm,
    //         pageNo,
    //         noOfRecords,
    //         userStatus: status
    //     })
    //     userEnabledFilter.addCssClass("active");
    // });

    // //Filter by status - disabled
    // userDisabledFilter.on("click", () => {
    //     userEnabledFilter.removeCssClass("active");
    //     userDisabledFilter.removeCssClass("active");
    //     statusSorter.addCssClass("hide");
    //     status = false;
    //     courseUsersReq.fetch({
    //         courseId,
    //         searchTerm,
    //         pageNo,
    //         noOfRecords,
    //         userStatus: status
    //     })
    //     userDisabledFilter.addCssClass("active");
    // })

    // On date range set
    dateRanges.forEach(dr => {
        dr.on("click", () => {
            rangeText = dr.getTextContent();
            let range = defineDateRange(rangeText);
            startDate = new Date(range[0]);
            endDate = new Date(range[1]);
            startDatePicker.dates.setValue(tempusDominus.DateTime.convert(startDate));
            endDatePicker.dates.setValue(tempusDominus.DateTime.convert(endDate));
        });
    });

        // On date range clear 
        dateClerBtn.on("click", () => {
            startDatePicker.dates.clear();
            endDatePicker.dates.clear();
            localStorage.setItem("startDate", "");
            localStorage.setItem("endDate", "");
            // dateText.setText("Select Date Range");
            // dateFilter.updateTextViaAttrVar({
            //     "tag-text": "CUSTOM"
            // });
            joiningEndDate = "",
                joiningStartDate = "",
                lastLoginEndDate = "",
                lastLoginStartDate = "";
            startDate = "";
            endDate = "";
            courseUsersReq.fetch({
                courseId,
                searchTerm,
                pageNo,
                noOfRecords,
            })
        });

    // On date range set
    const subscribeStartDate = startDatePicker.subscribe(tempusDominus.Namespace.events.change, (e) => {
        console.log(e.date);
        startDate = new Date(e.date);
        startDateInput.value = startDate.toLocaleDateString();

    })

    const subscribeEndDate = endDatePicker.subscribe(tempusDominus.Namespace.events.change, (e) => {
        console.log(e.date);
        endDate = new Date(e.date);
        endDateInput.value = endDate.toLocaleDateString();
    })

    dateModalBtn.on("click", () => {
        joiningStartDate = startDate;
        lastLoginStartDate = startDate;
        joiningEndDate = endDate;
        lastLoginEndDate = endDate;
        courseUsersReq.fetch({
            courseId,
            searchTerm,
            pageNo,
            noOfRecords,
            joiningEndDate,
            joiningStartDate,
            lastLoginEndDate,
            lastLoginStartDate,
        })
        localStorage.setItem("startDate", startDate);
        localStorage.setItem("endDate", endDate);
        // dateText.setText(`${formatDate(startDate)}` + ' - ' + `${formatDate(endDate)}`);
        // dateFilter.updateTextViaAttrVar({
        //     "tag-text": rangeText
        // });
    });


    // Clear all filters
    // clearFilters.on("click", () => {
    //     courseProgressFilter.removeCssClass("active");
    //     courseCompletedFilter.removeCssClass("active");
    //     userEnabledFilter.removeCssClass("active");
    //     userDisabledFilter.removeCssClass("active");
    //     searchTerm = "",
    //         pageNo = 1,
    //         noOfRecords = 50,
    //         courseStatus = "";
    //     status = null;
    //     courseUsersReq.fetch({
    //         courseId,
    //         searchTerm,
    //         pageNo,
    //         noOfRecords,
    //     })
    // })

    Promise.all(promises).then((data) => {
        curtainLoader().hide();

    });
}