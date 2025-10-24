import { WFComponent } from "@xatom/core";
import { adminQL } from "../../graphql"
import { AdminGetAllUsersDocument, GetActiveUsersDocument, GetNewSignupsDocument } from "../../graphql/graphql"
import { Chart, configAreaChart, configBarChart } from "client-utils/chartjs";
import { formatDate, generatePaginationArray } from "client-utils/utility-functions"
import { tempusDominus, datePickerConfig, moment, datePickerConfig2 } from "client-utils/datePicker"
import { curtainLoader } from "client-utils/curtain-loader";

export const userReports = () => {
    const gstartDate = localStorage.getItem("startDate");
    const gendDate = localStorage.getItem("endDate");
    const _gStartDate = new Date(gstartDate);
    const _gEndDate = new Date(gendDate);
    const getAllUserReq = adminQL.query(AdminGetAllUsersDocument, {
        fetchPolicy: "network-only"
    });
    const activeUsersReq = adminQL.query(GetActiveUsersDocument);
    const newSignupsReq = adminQL.query(GetNewSignupsDocument);

    // const topbar = new WFComponent(`.topbar_component.is-admin`);
    // const userSearchInput = topbar.getChildAsComponent(`[xa-type="list-search-input"]`).getElement() as HTMLInputElement;
    // const userStatusFilter = topbar.getChildAsComponent(`[xa-type="user-status-filter"]`);
    // const userEnabledFilter = userStatusFilter.getChildAsComponent(`[xa-type="filter-by-enabled"]`);
    // const userDisabledFilter = userStatusFilter.getChildAsComponent(`[xa-type="filter-by-disabled"]`);
    // const clearFilters = topbar.getChildAsComponent(`[xa-type="clear-all-filters"]`);
    // const userCountContainer = new WFComponent(`[xa-var="user-count"]`);
    let pageNo = 1,
        noOfRecords = 10,
        searchTerm = "",
        hotelId = "",
        joiningEndDate = gendDate ? gendDate : "",
        joiningStartDate = gstartDate ? gstartDate : "",
        lastLoginEndDate = gendDate ? gendDate : "",
        lastLoginStartDate = gstartDate ? gstartDate : "",
        status = null,
        totalPages = 1,
        pageNoArr = [],
        startDate, endDate, rangeText;
    // const userList = new WFDynamicList<{
    //     id: string
    //     name: string;
    //     email: string;
    //     hotel?: string;
    //     lastLogin: string;
    //     joinDate: string;
    //     status: boolean;
    // },
    //     HTMLDivElement,
    //     HTMLDivElement,
    //     HTMLDivElement
    // >(`[xa-type="users-list"]`, {
    //     rowSelector: `[xa-type="item"]`,
    //     emptySelector: `[xa-type="empty-state"]`
    // });
    // const listHeader = new WFComponent(`[xa-type="header-row"]`);
    // const loginSorter = listHeader.getChildAsComponent(`[xa-type="sort-by-login"]`);
    // const joinedSorter = listHeader.getChildAsComponent(`[xa-type="sort-by-joined"]`);
    // const statusSorter = listHeader.getChildAsComponent(`[xa-type="sort-by-status"]`);
    // const globalDateFilter = topbar.getChildAsComponent(`[xa-type="global-date-range-filter"]`).getElement();
    // const dateFilter = topbar.getChildAsComponent(`[xa-type="global-date-range-filter"]`);
    // const dateText = dateFilter.getChildAsComponent(`[xa-type="dp-text"]`);
    const dateModal = new WFComponent(`[xa-type="date-picker-modal"]`);
    const dateModalBtn = dateModal.getChildAsComponent(`[xa-type="apply-date"]`);
    const dateClerBtn = dateModal.getChildAsComponent(`[xa-type="clear-dates"]`);
    const dateRanges = dateModal.getChildAsComponents(`[xa-type="date-range"]`);
    const dateModalClose = dateModal.getChildAsComponent(`[xa-type="close-button"]`);
    // dateText.setText((_gStartDate.toString() !== 'Invalid Date' && _gEndDate.toString() !== 'Invalid Date') ? `${formatDate(_gStartDate)} - ${formatDate(_gEndDate)}` : "Select Date Range");

    // const paginationList = new WFDynamicList<{
    //     pageNo: number;
    // },
    //     HTMLDivElement,
    //     HTMLDivElement,
    //     HTMLDivElement
    // >(`[xa-type="pagination-list"]`, {
    //     rowSelector: `[xa-type="pagination-item"]`
    // });

    // const prevButton = new WFComponent(`[xa-type="prev"]`);
    // const nextButton = new WFComponent(`[xa-type="next"]`);

    const promises = [
        getAllUserReq.fetch({
            pageNo,
            noOfRecords,
            searchTerm,
            joiningEndDate,
            joiningStartDate,
            lastLoginEndDate,
            lastLoginStartDate,
            status
        }),
        activeUsersReq.fetch({
            filter: "MONTHLY"
        }),
        newSignupsReq.fetch({
            filter: "MONTHLY"
        })
    ];

    // prevButton.on("click", () => {
    //     pageNo = pageNo - 1;
    //     if (pageNo >= 1) {
    //         getAllUserReq.fetch({
    //             pageNo,
    //             noOfRecords,
    //             searchTerm,
    //             joiningEndDate,
    //             joiningStartDate,
    //             lastLoginEndDate,
    //             lastLoginStartDate,
    //             status
    //         })
    //     }
    // });

    // nextButton.on("click", () => {
    //     pageNo = pageNo + 1;
    //     if (pageNo <= totalPages) {
    //         getAllUserReq.fetch({
    //             pageNo,
    //             noOfRecords,
    //             searchTerm,
    //             joiningEndDate,
    //             joiningStartDate,
    //             lastLoginEndDate,
    //             lastLoginStartDate,
    //             status
    //         })
    //     }
    // })

    // paginationList.rowRenderer(({ rowData, rowElement }) => {
    //     rowElement.getChildAsComponent(`div`).setText(rowData.pageNo);
    //     if (pageNo === rowData.pageNo) {
    //         rowElement.addCssClass("active");
    //     }
    //     rowElement.on("click", () => {
    //         pageNo = rowData.pageNo;
    //         getAllUserReq.fetch({
    //             pageNo,
    //             noOfRecords,
    //             searchTerm,
    //             joiningEndDate,
    //             joiningStartDate,
    //             lastLoginEndDate,
    //             lastLoginStartDate,
    //             status
    //         })
    //     });
    //     return rowElement;
    // });

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
        }) ;
    });
    const endDateSubscription = endDatePicker.subscribe(tempusDominus.Namespace.events.change, (e) => {
        startDatePicker.updateOptions({
            restrictions: {
                maxDate: e.date
            }
        }) ;
    });
    startDatePicker.dates.formatInput = function(date) { {return moment(date).format('MM/DD/YYYY') } }
    endDatePicker.dates.formatInput = function(date) { {return moment(date).format('MM/DD/YYYY') } }

    activeUsersReq.onData((data) => {
        if (data.getActiveUsers && data.getActiveUsers.graphData) {
            const _data = data.getActiveUsers.graphData;
            const indexes = [0, 2, 4, 6, 8, 10, 11];
            const graphData = _data.filter((elt, idx) => indexes.includes(idx));
            let graphValues = [];
            graphData.forEach((month) => {
                graphValues.push(month.value);
            })

            const activeUsersCTX = (document.getElementById('activeUsersAREA') as HTMLCanvasElement).getContext('2d');
            const activeUsersConfig = configAreaChart(activeUsersCTX, graphValues);
            const activeUsersChart = new Chart(activeUsersCTX, activeUsersConfig);
        }
    });

    newSignupsReq.onData((data) => {
        if (data.getNewSignups) {
            console.log(data);
            const _data = data.getNewSignups;
            const indexes = [0, 1, 2, 3, 4, 5];
            const xValues = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"]
            const graphData = _data.filter((elt, idx) => indexes.includes(idx));
            let graphValues = [];
            graphData.forEach((month) => {
                graphValues.push(month.value);
            })
            const newSignupsCTX = (document.getElementById('newSignUps') as HTMLCanvasElement).getContext("2d");
            const newSignupsConfig = configBarChart(newSignupsCTX, graphValues, xValues, 1);
            const newSignupsChart = new Chart(newSignupsCTX, newSignupsConfig);
        }
    });

    // userList.rowRenderer(({ rowData, rowElement }) => {
    //     if (rowData.status) {
    //         rowElement.getChildAsComponent(`[xa-type="status"]`).addCssClass("is-enabled");
    //     } else {
    //         rowElement.getChildAsComponent(`[xa-type="status"]`).addCssClass("is-disabled");
    //     }
    //     rowElement.updateTextViaAttrVar({
    //         name: rowData.name,
    //         email: rowData.email,
    //         hotel: rowData.hotel,
    //         login: rowData.lastLogin,
    //         joined: rowData.joinDate,
    //         status: rowData.status ? "Enabled" : "Disabled"
    //     });
    //     rowElement.on("click", () => {
    //         navigate(`${ADMIN_PATHS.userDetails}?id=${rowData.id}`);
    //     });
    //     return rowElement;
    // });

    getAllUserReq.onData((res) => {
        const usersData: {
            id: string;
            name: string;
            email: string;
            hotel?: string;
            lastLogin: string;
            joinDate: string;
            status: boolean;
        }[] = res.adminGetAllUsers.data.map(u => {
            totalPages = Math.ceil(res.adminGetAllUsers.totalRecords / noOfRecords);
            pageNoArr = generatePaginationArray(pageNo, totalPages);
            // paginationList.setData(pageNoArr);
            return {
                id: u.id,
                name: `${u.firstName} ${u.lastName}`,
                email: u.email,
                hotel: `N/A`,
                joinDate: formatDate(new Date(u.createdAt)),
                lastLogin: formatDate(new Date(u.lastLoginAt)),
                status: u.enabled
            }
        });
        // userCountContainer.setText(usersData.length);
        // userList.setData(usersData);
        dateModalClose.getElement().click();

        // Sort by last login
        let isLoginAsc: boolean;
        // loginSorter.on("click", () => {
        //     joinedSorter.removeCssClass("down");
        //     loginSorter.removeCssClass("down");
        //     statusSorter.removeCssClass("down");
        //     if (!isLoginAsc) {
        //         const sortedList = sortList(usersData, 'byLastLogin', 'asc');
        //         // userList.setData(sortedList);
        //         loginSorter.addCssClass("down");
        //         isLoginAsc = true;
        //     } else {
        //         console.log("exec");
        //         const sortedList = sortList(usersData, 'byLastLogin', 'desc');
        //         // userList.setData(sortedList);
        //         loginSorter.removeCssClass("down");
        //         isLoginAsc = false;
        //     }
        // });

        // Sort by join date
        let isJoinedAsc: boolean;
        // joinedSorter.on("click", () => {
        //     joinedSorter.removeCssClass("down");
        //     loginSorter.removeCssClass("down");
        //     statusSorter.removeCssClass("down");
        //     if (!isJoinedAsc) {
        //         const sortedList = sortList(usersData, 'byJoinedDate', 'asc');
        //         // userList.setData(sortedList);
        //         joinedSorter.addCssClass("down");
        //         isJoinedAsc = true;
        //     } else {
        //         console.log("exec");
        //         const sortedList = sortList(usersData, 'byJoinedDate', 'desc');
        //         // userList.setData(sortedList);
        //         joinedSorter.removeCssClass("down");
        //         isJoinedAsc = false;
        //     }
        // });

        // Sort by status
        let isEnabledFirst: boolean;
        // statusSorter.on("click", () => {
        //     joinedSorter.removeCssClass("down");
        //     loginSorter.removeCssClass("down");
        //     statusSorter.removeCssClass("down");
        //     if (!isEnabledFirst) {
        //         const sortedList = sortList(usersData, 'byStatus', 'enabledFirst');
        //         // userList.setData(sortedList);
        //         statusSorter.addCssClass("down");
        //         isEnabledFirst = true;
        //     } else {
        //         const sortedList = sortList(usersData, 'byStatus', 'disabledFirst');
        //         // userList.setData(sortedList);
        //         statusSorter.removeCssClass("down");
        //         isEnabledFirst = false;
        //     }
        // });
    // });

    // On date range set
    // dateRanges.forEach(dr => {
    //     dr.on("click", () => {
    //         rangeText =  dr.getTextContent();
    //         let range = defineDateRange(rangeText);
    //         startDate = new Date(range[0]);
    //         endDate = new Date(range[1]);
    //         startDatePicker.dates.setValue(tempusDominus.DateTime.convert(startDate));
    //         endDatePicker.dates.setValue(tempusDominus.DateTime.convert(endDate));
    //     });
    // });

    // On date range clear 
    // dateClerBtn.on("click", () => {
    //     startDatePicker.dates.clear();
    //     endDatePicker.dates.clear();
    //     localStorage.setItem("startDate", "");
    //     localStorage.setItem("endDate", "");
    //     dateText.setText("Select Date Range");
    //     dateFilter.updateTextViaAttrVar({
    //         "tag-text": "CUSTOM"
    //     });
    //     joiningEndDate = "",
    //         joiningStartDate = "",
    //         lastLoginEndDate = "",
    //         lastLoginStartDate = "";
    //     startDate = "";
    //     endDate = "";
    //     getAllUserReq.fetch({
    //         pageNo,
    //         noOfRecords,
    //         searchTerm,
    //         joiningEndDate,
    //         joiningStartDate,
    //         lastLoginEndDate,
    //         lastLoginStartDate,
    //     });
    // });
    
    // const subscribeStartDate = startDatePicker.subscribe(tempusDominus.Namespace.events.change, (e) => {
    //     startDate = new Date(e.date);
    //     startDateInput.value = startDate.toLocaleDateString();

    // })

    // const subscribeEndDate = endDatePicker.subscribe(tempusDominus.Namespace.events.change, (e) => {
    //     endDate = new Date(e.date);
    //     endDateInput.value = endDate.toLocaleDateString();
    // })

    // dateModalBtn.on("click", () => {
    //     joiningStartDate = startDate;
    //     lastLoginStartDate = startDate;
    //     joiningEndDate = endDate;
    //     lastLoginEndDate = endDate;
    //     getAllUserReq.fetch({
    //         pageNo,
    //         noOfRecords,
    //         searchTerm,
    //         joiningEndDate,
    //         joiningStartDate,
    //         lastLoginEndDate,
    //         lastLoginStartDate,
    //         status
    //     });
    //     localStorage.setItem("startDate", startDate);
    //     localStorage.setItem("endDate", endDate);
    //     dateText.setText(`${formatDate(startDate)}` + ' - ' + `${formatDate(endDate)}`);
    //     dateFilter.updateTextViaAttrVar({
    //         "tag-text": rangeText
    //     });

    });

    // userSearchInput.addEventListener("keyup", (e) => {
    //     if (e.key === "Enter") {
    //         e.preventDefault();
    //         searchTerm = userSearchInput.value;
    //         getAllUserReq.fetch({
    //             pageNo,
    //             noOfRecords,
    //             searchTerm,
    //             joiningEndDate,
    //             joiningStartDate,
    //             lastLoginEndDate,
    //             lastLoginStartDate,
    //             status
    //         });
    //     }
    // });


    //Filter by status 
    // userEnabledFilter.on("click", () => {
    //     userEnabledFilter.removeCssClass("active");
    //     userDisabledFilter.removeCssClass("active");
    //     statusSorter.addCssClass("hide");
    //     status = true;
    //     getAllUserReq.fetch({
    //         pageNo,
    //         noOfRecords,
    //         searchTerm,
    //         joiningEndDate,
    //         joiningStartDate,
    //         lastLoginEndDate,
    //         lastLoginStartDate,
    //         status
    //     });
    //     userEnabledFilter.addCssClass("active");
    // });

    // userDisabledFilter.on("click", () => {
    //     userEnabledFilter.removeCssClass("active");
    //     userDisabledFilter.removeCssClass("active");
    //     statusSorter.addCssClass("hide");
    //     status = false;
    //     getAllUserReq.fetch({
    //         pageNo,
    //         noOfRecords,
    //         searchTerm,
    //         joiningEndDate,
    //         joiningStartDate,
    //         lastLoginEndDate,
    //         lastLoginStartDate,
    //         status
    //     });
    //     userDisabledFilter.addCssClass("active");
    // })

    // Clear all filters
    // clearFilters.on("click", () => {
    //     pageNo = 1,
    //         noOfRecords = 10,
    //         searchTerm = "",
    //         hotelId = "",
    //         joiningEndDate = "",
    //         joiningStartDate = "",
    //         lastLoginEndDate = "",
    //         lastLoginStartDate = "";
    //     statusSorter.removeCssClass("hide");
    //     getAllUserReq.fetch({
    //         pageNo,
    //         noOfRecords,
    //         searchTerm,
    //         joiningEndDate,
    //         joiningStartDate,
    //         lastLoginEndDate,
    //         lastLoginStartDate,
    //     });
    //     localStorage.setItem("startDate", "");
    //     localStorage.setItem("endDate", "");
    //     dateText.setText("Select Date Range");
    //     userSearchInput.value = ""; //change on data
    //     userEnabledFilter.removeCssClass("active"); //change on data
    //     userDisabledFilter.removeCssClass("active"); //change on data
    // })

    Promise.all(promises).then((data) => {
        curtainLoader().hide();
    })
}
