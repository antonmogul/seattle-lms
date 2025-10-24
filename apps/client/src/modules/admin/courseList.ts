import { WFComponent, WFDynamicList, navigate } from "@xatom/core";
import { adminQL } from "../../graphql"
import { AdminGetAllCoursesDocument } from "../../graphql/graphql"
import { ADMIN_PATHS } from "../../config";
import { defineDateRange, formatDate } from "client-utils/utility-functions";
import { datePickerConfig, datePickerConfig2, moment, tempusDominus } from "client-utils/datePicker";
import { curtainLoader } from "client-utils/curtain-loader";

export const courseListingPage = () => {
    const gstartDate = localStorage.getItem("startDate");
    const gendDate = localStorage.getItem("endDate");
    const _gStartDate = new Date(gstartDate);
    const _gEndDate = new Date(gendDate);
    const getAllCoursesReq = adminQL.query(AdminGetAllCoursesDocument, {
        fetchPolicy: "network-only"
    });
    let searchTerm = "";
    // const topbar = new WFComponent(`.topbar_component.is-admin`);
    const userSearchInput = new WFComponent(`[xa-type="course-search-input"]`).getElement() as HTMLInputElement;
    const clearFilters = new WFComponent(`[xa-type="dummy-clear-btn"]`);
    // const globalDateFilter = topbar.getChildAsComponent(`[xa-type="global-date-range-filter"]`).getElement();
    // const dateFilter = topbar.getChildAsComponent(`[xa-type="global-date-range-filter"]`);
    // const dateText = dateFilter.getChildAsComponent(`[xa-type="dp-text"]`);
    // dateText.setText((_gStartDate.toString() !== 'Invalid Date' && _gEndDate.toString() !== 'Invalid Date') ? `${formatDate(_gStartDate)} - ${formatDate(_gEndDate)}` : "Select Date Range");
    const dateModal = new WFComponent(`[xa-type="date-picker-modal"]`);
    const dateModalBtn = dateModal.getChildAsComponent(`[xa-type="apply-date"]`);
    const dateClerBtn = dateModal.getChildAsComponent(`[xa-type="clear-dates"]`);
    const dateModalClose = dateModal.getChildAsComponent(`[xa-type="close-button"]`);
    const dateRanges = dateModal.getChildAsComponents(`[xa-type="date-range"]`);
    const courseCountContainer = new WFComponent(`[xa-var="course-count"]`);
    const sortAtoZ = new WFComponent(`[xa-type="courses-a-z"]`);
    const sortZtoA = new WFComponent(`[xa-type="courses-z-a"]`);
    const sortLessonsASC = new WFComponent(`[xa-type="asc"]`);
    const sortLessonsDESC = new WFComponent(`[xa-type="des"]`); 
    const sortFilterSelection = (sort: "AtoZ" | "ZtoA" | "LessonsASC" | "LessonsDESC" | null) => {
        sortFilter = sort;
        sortAtoZ.removeCssClass("active");
        sortZtoA.removeCssClass("active");
        sortLessonsASC.removeCssClass("active");
        sortLessonsDESC.removeCssClass("active");
        switch (sortFilter) {
            case "AtoZ":
                sortAtoZ.addCssClass("active");
                break;
            case "ZtoA":
                sortZtoA.addCssClass("active");
                break;
            case "LessonsASC":
                sortLessonsASC.addCssClass("active");
                break;
            case "LessonsDESC":
                sortLessonsDESC.addCssClass("active");
                break;
            default:
                break;
        }
        getAllCoursesReq.fetch({
            searchTerm,
            courseCompleteEndDate,
            courseCompleteStartDate,
            courseStartEndDate,
            courseStartStartDate,
            sortFilter
        });
    }
    sortAtoZ.on("click", () => sortFilterSelection("AtoZ"));
    sortZtoA.on("click", () => sortFilterSelection("ZtoA"));
    sortLessonsASC.on("click", () => sortFilterSelection("LessonsASC"));
    sortLessonsDESC.on("click", () => sortFilterSelection("LessonsDESC"));
    let sortFilter = null;
    let courseCompleteEndDate = gendDate ? gendDate : "",
        courseCompleteStartDate = gstartDate ? gstartDate : "",
        courseStartEndDate = gendDate ? gendDate : "",
        courseStartStartDate = gstartDate ? gstartDate : "",
        startDate, endDate, rangeText;
    const courseList = new WFDynamicList<{
        name: string;
        lessons: number;
        totalUsers?: number;
        courseTime?: string;
        courseStarted?: number;
        courseCompleted?: number;
        id: string;
    },
        HTMLDivElement,
        HTMLDivElement,
        HTMLDivElement
    >(`[xa-type="courses-list"]`, {
        rowSelector: `[xa-type="item"]`,
        emptySelector: `[xa-type="empty-state"]`
    });

    userSearchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            searchTerm = userSearchInput.value;
            getAllCoursesReq.fetch({
                searchTerm,
                sortFilter
            });
        }
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

    courseList.rowRenderer(({ rowData, rowElement }) => {
        rowElement.updateTextViaAttrVar({
            name: rowData.name,
            lessons: rowData.lessons,
            "total-users": rowData.totalUsers,
            "course-duration": "0 min",
            "course-starts": rowData.courseStarted,
            "course-completes": rowData.courseCompleted
        });
        rowElement.on("click", () => {
            navigate(`${ADMIN_PATHS.courseDetail}?id=${rowData.id}`);
        });
        return rowElement;
    });

    getAllCoursesReq.onData((res) => {
        const coursesData: {
            name: string;
            lessons: number;
            totalUsers?: number;
            courseTime?: string;
            courseStarted?: number;
            courseCompleted?: number;
            id: string;
        }[] = res.adminGetAllCourses.map(h => {
            return {
                name: h.name,
                lessons: h.lessonCount,
                totalUsers: h.courseProgress.length,
                courseTime: "N/A",
                courseStarted: h.courseProgress.filter(d => d.status === "IN_PROGRESS").length,
                courseCompleted: h.courseProgress.filter(d => d.status === "COMPLETE").length,
                id: h.id
            }
        });
        courseCountContainer.setText(coursesData.length);
        courseList.setData(coursesData);
        curtainLoader().hide();
        dateModalClose.getElement().click();
    });

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
        startDate = "";
        endDate = "";
        courseCompleteEndDate = "",
            courseCompleteStartDate = "",
            courseStartEndDate = "",
            courseStartStartDate = "";
        getAllCoursesReq.fetch({
            searchTerm,
            sortFilter
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
        courseCompleteStartDate = startDate;
        courseStartStartDate = startDate;
        courseStartEndDate = endDate;
        courseCompleteEndDate = endDate;
        getAllCoursesReq.fetch({
            searchTerm,
            courseCompleteEndDate,
            courseCompleteStartDate,
            courseStartEndDate,
            courseStartStartDate,
            sortFilter
        });
        localStorage.setItem("startDate", startDate);
        localStorage.setItem("endDate", endDate);
        // dateText.setText(`${formatDate(startDate)}` + ' - ' + `${formatDate(endDate)}`);
        // dateFilter.updateTextViaAttrVar({
        //     "tag-text": rangeText
        // });
    });

    // Clear all filters
    clearFilters.on("click", () => {
        searchTerm = "",
            courseCompleteEndDate = "",
            courseCompleteStartDate = "",
            courseStartEndDate = "",
            courseStartStartDate = "";
        getAllCoursesReq.fetch({
            searchTerm,
            courseCompleteEndDate,
            courseCompleteStartDate,
            courseStartEndDate,
            courseStartStartDate,
            sortFilter
        })
        userSearchInput.value = "";
        localStorage.setItem("startDate", "");
        localStorage.setItem("endDate", "");
        // dateText.setText("Select Date Range");
        userSearchInput.value = ""; //change on data
    });

    getAllCoursesReq.fetch({
        searchTerm,
        courseCompleteEndDate,
        courseCompleteStartDate,
        courseStartEndDate,
        courseStartStartDate,
        sortFilter
    })
}