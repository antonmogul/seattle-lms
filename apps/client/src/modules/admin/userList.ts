import { WFComponent, WFDynamicList, navigate } from "@xatom/core";
import { adminQL } from "../../graphql"
import { AdminGetAllUsersDocument, AdminExportUsersCsvDocument } from "../../graphql/graphql"
import { ADMIN_PATHS } from "../../config";
import { formatDate, sortList, defineDateRange, generatePaginationArray } from "client-utils/utility-functions"
import { tempusDominus, datePickerConfig, moment, datePickerConfig2 } from "client-utils/datePicker"
import { curtainLoader } from "client-utils/curtain-loader";

export const userList = () => {
    const gstartDate = localStorage.getItem("startDate");
    const gendDate = localStorage.getItem("endDate");
    const _gStartDate = new Date(gstartDate);
    const _gEndDate = new Date(gendDate);
    const getAllUserReq = adminQL.query(AdminGetAllUsersDocument, {
        fetchPolicy: "network-only"
    });
    const exportUsersReq = adminQL.query(AdminExportUsersCsvDocument, {
        fetchPolicy: "network-only"
    });

    const topbar = new WFComponent(`.topbar_component.is-admin`);
    const userSearchInput = new WFComponent(`[xa-type="user-search-input"]`).getElement() as HTMLInputElement;
    // const userStatusFilter = topbar.getChildAsComponent(`[xa-type="user-status-filter"]`);
    // const userEnabledFilter = userStatusFilter.getChildAsComponent(`[xa-type="filter-by-enabled"]`);
    // const userDisabledFilter = userStatusFilter.getChildAsComponent(`[xa-type="filter-by-disabled"]`);
    // const clearFilters = topbar.getChildAsComponent(`[xa-type="clear-all-filters"]`);
    const dummyClearFilters = new WFComponent(`[xa-type="dummy-clear-btn"]`);
    const userCountContainer = new WFComponent(`[xa-var="user-count"]`);
    const lastLoginFilter = new WFComponent(`[xa-type="mem-login-date-range"]`);
    const joiningDateFilter = new WFComponent(`[xa-type="mem-joining-date-range"]`);
    
    // Export button - Try to find existing button or create one
    let exportButton: WFComponent;
    try {
        exportButton = new WFComponent(`[xa-type="export-csv-btn"]`);
    } catch {
        // If button doesn't exist in Webflow, create it dynamically
        const topbarActions = topbar.getElement().querySelector('.topbar-actions') || topbar.getElement();
        const exportBtnEl = document.createElement('button');
        exportBtnEl.className = 'button is-export';
        exportBtnEl.textContent = 'Export CSV';
        exportBtnEl.setAttribute('xa-type', 'export-csv-btn');
        exportBtnEl.style.marginLeft = '10px';
        topbarActions.appendChild(exportBtnEl);
        exportButton = new WFComponent(exportBtnEl);
    }
    let currentDateFilter: "LAST_LOGIN" | "JOIN_DATE" | null = null;
    lastLoginFilter.on("click", () => {
        currentDateFilter = "LAST_LOGIN";
    });
    joiningDateFilter.on("click", () => {
        currentDateFilter = "JOIN_DATE";
    });
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
    const userList = new WFDynamicList<{
        id: string
        name: string;
        email: string;
        hotel?: string;
        lastLogin: string;
        joinDate: string;
        status: boolean;
    },
        HTMLDivElement,
        HTMLDivElement,
        HTMLDivElement
    >(`[xa-type="users-list"]`, {
        rowSelector: `[xa-type="item"]`,
        emptySelector: `[xa-type="empty-state"]`
    });
    const listHeader = new WFComponent(`[xa-type="header-row"]`);
    const loginSorter = listHeader.getChildAsComponent(`[xa-type="sort-by-login"]`);
    const joinedSorter = listHeader.getChildAsComponent(`[xa-type="sort-by-joined"]`);
    const statusSorter = listHeader.getChildAsComponent(`[xa-type="sort-by-status"]`);
    // const globalDateFilter = topbar.getChildAsComponent(`[xa-type="global-date-range-filter"]`).getElement();
    // const dateFilter = topbar.getChildAsComponent(`[xa-type="global-date-range-filter"]`);
    // const dateText = dateFilter.getChildAsComponent(`[xa-type="dp-text"]`);
    const dateModal = new WFComponent(`[xa-type="date-picker-modal"]`);
    const dateModalBtn = dateModal.getChildAsComponent(`[xa-type="apply-date"]`);
    // const dateClerBtn = dateModal.getChildAsComponent(`[xa-type="clear-dates"]`);
    const dateRanges = dateModal.getChildAsComponents(`[xa-type="date-range"]`);
    const dateModalClose = dateModal.getChildAsComponent(`[xa-type="close-button"]`);
    // dateText.setText((_gStartDate.toString() !== 'Invalid Date' && _gEndDate.toString() !== 'Invalid Date') ? `${formatDate(_gStartDate)} - ${formatDate(_gEndDate)}` : "Select Date Range");

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
        })
    ];

    prevButton.on("click", () => {
        pageNo = pageNo - 1;
        if (pageNo >= 1) {
            getAllUserReq.fetch({
                pageNo,
                noOfRecords,
                searchTerm,
                joiningEndDate,
                joiningStartDate,
                lastLoginEndDate,
                lastLoginStartDate,
                status
            })
        }
    });

    nextButton.on("click", () => {
        pageNo = pageNo + 1;
        if (pageNo <= totalPages) {
            getAllUserReq.fetch({
                pageNo,
                noOfRecords,
                searchTerm,
                joiningEndDate,
                joiningStartDate,
                lastLoginEndDate,
                lastLoginStartDate,
                status
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
            getAllUserReq.fetch({
                pageNo,
                noOfRecords,
                searchTerm,
                joiningEndDate,
                joiningStartDate,
                lastLoginEndDate,
                lastLoginStartDate,
                status
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

    userList.rowRenderer(({ rowData, rowElement }) => {
        if (rowData.status) {
            rowElement.getChildAsComponent(`[xa-type="status"]`).addCssClass("is-enabled");
        } else {
            rowElement.getChildAsComponent(`[xa-type="status"]`).addCssClass("is-disabled");
        }
        rowElement.updateTextViaAttrVar({
            name: rowData.name,
            email: rowData.email,
            hotel: rowData.hotel,
            login: rowData.lastLogin,
            joined: rowData.joinDate,
            status: rowData.status ? "Enabled" : "Disabled"
        });
        rowElement.on("click", () => {
            navigate(`${ADMIN_PATHS.userDetails}?id=${rowData.id}`);
        });
        return rowElement;
    });

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
            paginationList.setData(pageNoArr);
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
        userCountContainer.setText(usersData.length);
        userList.setData(usersData);
        dateModalClose.getElement().click();
        if (joiningStartDate && joiningEndDate) {
            joiningDateFilter.setText(`${new Date(joiningStartDate).toLocaleDateString()} - ${new Date(joiningEndDate).toLocaleDateString()}`);
        } else {
            joiningDateFilter.setText("Joining Date");
        }
        if (lastLoginStartDate && lastLoginEndDate) {
            lastLoginFilter.setText(`${new Date(lastLoginStartDate).toLocaleDateString()} - ${new Date(lastLoginEndDate).toLocaleDateString()}`);
        } else {
            lastLoginFilter.setText("Last Login");
        }
        // Sort by last login
        let isLoginAsc: boolean;
        loginSorter.on("click", () => {
            joinedSorter.removeCssClass("down");
            loginSorter.removeCssClass("down");
            statusSorter.removeCssClass("down");
            if (!isLoginAsc) {
                const sortedList = sortList(usersData, 'byLastLogin', 'asc');
                userList.setData(sortedList);
                loginSorter.addCssClass("down");
                isLoginAsc = true;
            } else {
                const sortedList = sortList(usersData, 'byLastLogin', 'desc');
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
            if (!isJoinedAsc) {
                const sortedList = sortList(usersData, 'byJoinedDate', 'asc');
                userList.setData(sortedList);
                joinedSorter.addCssClass("down");
                isJoinedAsc = true;
            } else {
                const sortedList = sortList(usersData, 'byJoinedDate', 'desc');
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
            if (!isEnabledFirst) {
                const sortedList = sortList(usersData, 'byStatus', 'enabledFirst');
                userList.setData(sortedList);
                statusSorter.addCssClass("down");
                isEnabledFirst = true;
            } else {
                const sortedList = sortList(usersData, 'byStatus', 'disabledFirst');
                userList.setData(sortedList);
                statusSorter.removeCssClass("down");
                isEnabledFirst = false;
            }
        });
    });

    // On date range set
    dateRanges.forEach(dr => {
        dr.on("click", () => {
            rangeText =  dr.getTextContent();
            let range = defineDateRange(rangeText);
            startDate = new Date(range[0]);
            endDate = new Date(range[1]);
            startDatePicker.dates.setValue(tempusDominus.DateTime.convert(startDate));
            endDatePicker.dates.setValue(tempusDominus.DateTime.convert(endDate));
        });
    });

    // On date range clear 
    // dateClerBtn.on("click", () => {
    //     currentDateFilter = null;
    //     startDatePicker.dates.clear();
    //     endDatePicker.dates.clear();
    //     localStorage.setItem("startDate", "");
    //     localStorage.setItem("endDate", "");
    //     dateText.setText("Select Date Range");
    //     dateFilter.updateTextViaAttrVar({
    //         "tag-text": "CUSTOM"
    //     });
    //     joiningEndDate = "",
    //     joiningStartDate = "",
    //     lastLoginEndDate = "",
    //     lastLoginStartDate = "";
    //     startDate = "";
    //     endDate = "";
    //     searchTerm = "";
    //     userSearchInput.value = "";
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

    // dummyClearFilters.on("click", () => {
    //     dateClerBtn.getElement().click();
    // });
    
    const subscribeStartDate = startDatePicker.subscribe(tempusDominus.Namespace.events.change, (e) => {
        startDate = new Date(e.date);
        startDateInput.value = startDate.toLocaleDateString();

    })

    const subscribeEndDate = endDatePicker.subscribe(tempusDominus.Namespace.events.change, (e) => {
        endDate = new Date(e.date);
        endDateInput.value = endDate.toLocaleDateString();
    });

    dateModalBtn.on("click", () => {
        if (currentDateFilter === "LAST_LOGIN") {
            lastLoginEndDate = endDate;
            lastLoginStartDate = startDate;
        } else if (currentDateFilter === "JOIN_DATE") {
            joiningStartDate = startDate;
            joiningEndDate = endDate;
        }
        getAllUserReq.fetch({
            pageNo,
            noOfRecords,
            searchTerm,
            joiningEndDate,
            joiningStartDate,
            lastLoginEndDate,
            lastLoginStartDate,
            status
        });
        localStorage.setItem("startDate", startDate);
        localStorage.setItem("endDate", endDate);
        // dateText.setText(`${formatDate(startDate)}` + ' - ' + `${formatDate(endDate)}`);
        // dateFilter.updateTextViaAttrVar({
        //     "tag-text": rangeText
        // });

    });

    userSearchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            searchTerm = userSearchInput.value;
            getAllUserReq.fetch({
                pageNo,
                noOfRecords,
                searchTerm,
                joiningEndDate,
                joiningStartDate,
                lastLoginEndDate,
                lastLoginStartDate,
                status
            });
        }
    });

    // Export CSV functionality
    exportButton.on("click", () => {
        exportButton.setText("Exporting...");
        exportButton.getElement().setAttribute("disabled", "true");
        
        exportUsersReq.fetch({
            searchTerm,
            joiningEndDate,
            joiningStartDate,
            lastLoginEndDate,
            lastLoginStartDate,
            status
        });
    });

    exportUsersReq.onData(async (res) => {
        try {
            const base64Data = res.adminExportUsersCSV;

            if (!base64Data) {
                throw new Error("No CSV data received");
            }

            const csvContent = atob(base64Data);

            // Generate filename with current date
            const now = new Date();
            const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            const filename = `users-export-${dateStr}.csv`;

            // Create blob
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

            // Try multiple download methods for better browser compatibility
            let downloadSuccess = false;

            // Method 1: Check if File System Access API is available (Chrome 86+)
            if ('showSaveFilePicker' in window) {
                try {
                    const fileHandle = await (window as any).showSaveFilePicker({
                        suggestedName: filename,
                        types: [{
                            description: 'CSV files',
                            accept: { 'text/csv': ['.csv'] }
                        }]
                    });

                    const writable = await fileHandle.createWritable();
                    await writable.write(csvContent);
                    await writable.close();

                    downloadSuccess = true;
                } catch (e) {
                }
            }

            // Method 2: Direct download using data URL (works better in some browsers)
            if (!downloadSuccess) {
                try {
                    const dataURL = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
                    const link = document.createElement('a');
                    link.href = dataURL;
                    link.download = filename;
                    link.style.display = 'none';
                    document.body.appendChild(link);

                    // Force click event with user gesture
                    const clickEvent = new MouseEvent('click', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });

                    link.dispatchEvent(clickEvent);
                    document.body.removeChild(link);
                    downloadSuccess = true;
                } catch (e) {
                }
            }

            // Method 3: Fallback to blob URL if data URL failed
            if (!downloadSuccess) {
                try {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');

                    link.href = url;
                    link.download = filename;
                    link.style.display = 'none';
                    document.body.appendChild(link);

                    // Try to simulate user click
                    link.click();

                    setTimeout(() => {
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                    }, 100);

                } catch (e) {
                    // Show user a message as final fallback
                    alert("Download failed. Please try again.");
                }
            }

            exportButton.setText("Export CSV");
            exportButton.getElement().removeAttribute("disabled");
        } catch (error) {
            exportButton.setText("Export Failed");
            setTimeout(() => {
                exportButton.setText("Export CSV");
                exportButton.getElement().removeAttribute("disabled");
            }, 2000);
        }
    });

    exportUsersReq.onError((error) => {
        exportButton.setText("Export Failed");
        setTimeout(() => {
            exportButton.setText("Export CSV");
            exportButton.getElement().removeAttribute("disabled");
        }, 2000);
    });


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
    dummyClearFilters.on("click", () => {
        pageNo = 1,
            noOfRecords = 10,
            searchTerm = "",
            hotelId = "",
            joiningEndDate = "",
            joiningStartDate = "",
            lastLoginEndDate = "",
            lastLoginStartDate = "";
        statusSorter.removeCssClass("hide");
        getAllUserReq.fetch({
            pageNo,
            noOfRecords,
            searchTerm,
            joiningEndDate,
            joiningStartDate,
            lastLoginEndDate,
            lastLoginStartDate,
        });
        localStorage.setItem("startDate", "");
        localStorage.setItem("endDate", "");
        // dateText.setText("Select Date Range");
        userSearchInput.value = ""; //change on data
        // userEnabledFilter.removeCssClass("active"); //change on data
        // userDisabledFilter.removeCssClass("active"); //change on data
    })

    Promise.all(promises).then((data) => {
        curtainLoader().hide();
    })
}
