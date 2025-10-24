import { adminQL } from "../../graphql";
import { GetAuthUrlDocument, GetGaConnectionStatusDocument, GetGaReportDocument, GetGaReportQuery, UnlinkGaConnectionDocument } from "../../graphql/graphql";
import { WFComponent } from "@xatom/core";
import { Chart, configAreaChart, configBarChart } from "client-utils/chartjs";
import { formatDate, sortList, defineDateRange } from "client-utils/utility-functions"
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc"
import { datePickerConfig, datePickerConfig2, moment, tempusDominus } from "client-utils/datePicker";
import { curtainLoader } from "client-utils/curtain-loader";

let isUpdate = false;
let newSignupsChart;
export const googleAnalytics = (pageQuery: { status: string }) => {
    let gstartDate = localStorage.getItem("startDate");
    let gendDate = localStorage.getItem("endDate");
    if (!(gstartDate && gendDate)) {
        gstartDate = dayjs().subtract(7, "days").toISOString();
        gendDate = dayjs().toISOString();
    }
    const _gStartDate = new Date(gstartDate);
    const _gEndDate = new Date(gendDate);
    let startDate: any = new Date(gstartDate), endDate: any = new Date(gendDate), rangeText;
    const topbar = new WFComponent(`.topbar_component.is-admin`);
    const dateFilter = topbar.getChildAsComponent(`[xa-type="global-date-range-filter"]`);
    const dateText = dateFilter.getChildAsComponent(`[xa-type="dp-text"]`);
    dateText.setText((_gStartDate.toString() !== 'Invalid Date' && _gEndDate.toString() !== 'Invalid Date') ? `${formatDate(_gStartDate)} - ${formatDate(_gEndDate)}` : "Select Date Range");
    const dateModal = new WFComponent(`[xa-type="date-picker-modal"]`);
    const dateModalBtn = dateModal.getChildAsComponent(`[xa-type="apply-date"]`);
    const dateClerBtn = dateModal.getChildAsComponent(`[xa-type="clear-dates"]`);
    const dateRanges = dateModal.getChildAsComponents(`[xa-type="date-range"]`);
    const dateModalClose = dateModal.getChildAsComponent(`[xa-type="close-button"]`);
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
        isUpdate = true;
        startDatePicker.dates.clear();
        endDatePicker.dates.clear();
        localStorage.setItem("startDate", "");
        localStorage.setItem("endDate", "");
        dateText.setText("Select Date Range");
        dateFilter.updateTextViaAttrVar({
            "tag-text": "CUSTOM"
        });
        startDate = "";
        endDate = "";
        const currentYear = new Date().getFullYear()
        getGAReportReq.fetch({
            dateRanges: [
                `${currentYear}-01-01/${currentYear}-03-31`,
                `${currentYear}-04-01/${currentYear}-06-30`,
                `${currentYear}-07-01/${currentYear}-09-30`,
                `${currentYear}-10-01/${currentYear}-12-31`
            ]
        });
    });

    // On date range set
    const subscribeStartDate = startDatePicker.subscribe(tempusDominus.Namespace.events.change, (e) => {
        startDate = new Date(e.date);
        startDateInput.value = startDate.toLocaleDateString();
    })

    const subscribeEndDate = endDatePicker.subscribe(tempusDominus.Namespace.events.change, (e) => {
        endDate = new Date(e.date);
        endDateInput.value = endDate.toLocaleDateString();
    })

    dateModalBtn.on("click", () => {
        isUpdate = true;
        dateModalBtn.setText("Please wait...");
        getGAReportReq.fetch({
            dateRanges: [
                `${dayjs(startDate).format("YYYY-MM-DD")}/${dayjs(endDate).format("YYYY-MM-DD")}`
            ]
        });
        localStorage.setItem("startDate", startDate);
        localStorage.setItem("endDate", endDate);
        dateText.setText(`${formatDate(startDate)}` + ' - ' + `${formatDate(endDate)}`);
        dateFilter.updateTextViaAttrVar({
            "tag-text": rangeText
        });
    });

    const getGAConnectionStatusReq = adminQL.query(GetGaConnectionStatusDocument);
    const getGAReportReq = adminQL.query(GetGaReportDocument);
    const connectionMessageBox = new WFComponent(`[xa-var="error-text"]`);
    const GAConnectionContainer = new WFComponent(`[xa-type="ga-not-connected"]`);
    const GAChartsContainer = new WFComponent(`[xa-type="ga-connected"]`);
    const GASettingLink = new WFComponent(`[xa-type="ga-settings"]`);
    const ModalGANotConnectedBlock = new WFComponent(`[xa-type="GANotConnectedBlock"]`);
    const ModalGAConnectedBlock = new WFComponent(`[xa-type="GAConnectedBlock"]`);
    const gaModalConnectButton = new WFComponent(`[xa-type="modal-connect-btn"]`);
    const modalErrorAlert = new WFComponent(`[xa-type="error-alert"]`);
    const unlinkGAConnectionReq = adminQL.mutation(UnlinkGaConnectionDocument);
    const gaUnlinkButton = new WFComponent(`[xa-type="modal-unlink-btn"]`);
    const gaSettingModalCloseButton = new WFComponent(`[xa-type="close-button"]`);
    const modalCloseButton = new WFComponent(`[xa-type="unlink-confirm-close-button"]`);
    const unlinkConfirmationButton = new WFComponent(`[xa-type="confirm-status-change"]`);
    let isGAConnected = true;
    if (isGAConnected) {
        GAConnectionContainer.addCssClass("hide");
        GAChartsContainer.addCssClass("hide");
    } else {
        GAConnectionContainer.removeCssClass("hide");
        GAChartsContainer.addCssClass("hide");
    }
    getGAConnectionStatusReq.onData((data) => {
        if (pageQuery && pageQuery.status) {
            modalErrorAlert.removeCssClass("hide");
            GASettingLink.getElement().click();
            if (pageQuery.status === "true" && data.getGAConnectionStatus.status === "CONNECTED") {
                connectionMessageBox.setText("Google Analytics account connected successfully.");
            } else {
                isGAConnected = false;
                connectionMessageBox.setText("Something went wrong while connecting to Google Analytics!");
            }
        } else {
            modalErrorAlert.addCssClass("hide");
        }
        if (data.getGAConnectionStatus) {
            getGAReportReq.onData((data) => {
                setCharts(data);
                dateModalBtn.setText("Apply");
                const closeLink = new WFComponent(`[xa-type="close-button"]`);
                closeLink.getElement().click();
            })
            const currentYear = new Date().getFullYear()
            if (startDate && endDate) {
                getGAReportReq.fetch({
                    dateRanges: [
                        `${dayjs(startDate).format("YYYY-MM-DD")}/${dayjs(endDate).format("YYYY-MM-DD")}`
                    ]
                });
            } else {
                getGAReportReq.fetch({
                    dateRanges: [
                        `${currentYear}-01-01/${currentYear}-03-31`,
                        `${currentYear}-04-01/${currentYear}-06-30`,
                        `${currentYear}-07-01/${currentYear}-09-30`,
                        `${currentYear}-10-01/${currentYear}-12-31`
                    ]
                });
            }
            GAConnectionContainer.addCssClass("hide");
            GAChartsContainer.removeCssClass("hide");
            ModalGANotConnectedBlock.addCssClass("hide");
            ModalGAConnectedBlock.removeCssClass("hide");
            gaModalConnectButton.updateTextViaAttrVar({
                GAConnectionEmail: data.getGAConnectionStatus.email
            });
            unlinkGAConnectionReq.onData((data) => {
                modalCloseButton.getElement().click();
                location.reload();
            });
            gaUnlinkButton.on("click", () => {
                gaSettingModalCloseButton.getElement().click();
            });
            unlinkConfirmationButton.on("click", () => {
                unlinkGAConnectionReq.fetch();
            });
        } else {
            getGoogleAuthURL();
            GAConnectionContainer.removeCssClass("hide");
            GAChartsContainer.addCssClass("hide");
            ModalGANotConnectedBlock.removeCssClass("hide");
            ModalGAConnectedBlock.addCssClass("hide");
        }
    });

    getGAConnectionStatusReq.onError((err) => {
        if (pageQuery && pageQuery.status) {
            modalErrorAlert.removeCssClass("hide");
            GASettingLink.getElement().click();
            isGAConnected = false;
            connectionMessageBox.setText("Something went wrong while connecting to Google Analytics!");
        } else {
            modalErrorAlert.addCssClass("hide");
        }
        getGoogleAuthURL();
        GAConnectionContainer.removeCssClass("hide");
        GAChartsContainer.addCssClass("hide");
        ModalGANotConnectedBlock.removeCssClass("hide");
        ModalGAConnectedBlock.addCssClass("hide");
        if (err && err.message) {
            connectionMessageBox.setText(err.message);
        } else {
            connectionMessageBox.setText("Something went wrong while connecting to Google Analytics!");
        }
    });

    getGAConnectionStatusReq.fetch();
    curtainLoader().hide();
}

const getGoogleAuthURL = () => {
    const googleAuthURLReq = adminQL.query(GetAuthUrlDocument);
    let googleAuthURL: string = "";
    const gaConnectButton = new WFComponent(`[xa-type="connect-btn"]`);
    const gaModalConnectButton = new WFComponent(`[xa-type="modal-connect-btn"]`);
    googleAuthURLReq.onData((data) => {
        googleAuthURL = data.getGoogleAuthURL;
        gaConnectButton.on("click", () => {
            window.location.href = googleAuthURL;
        });
        gaModalConnectButton.on("click", () => {
            window.location.href = googleAuthURL;
        });
    });
    googleAuthURLReq.fetch();
}

const setCharts = (data: GetGaReportQuery) => {
    dayjs.extend(duration)
    dayjs.extend(utc)
    const userChartNumbersContainer = new WFComponent(`[xa-type="userChartNumbers"]`);
    const newUsersTab = new WFComponent(`[xa-type="new-users"]`);
    const usersTab = new WFComponent(`[xa-type="users"]`);
    const usersEngagementTab = new WFComponent(`[xa-type="user-engagement"]`);
    const xValues = ["JAN-MAR", "APR-JUN", "JUL-SEP", "OCT-DEC"];
    let graphValues = [], totalUsers = [], newUsers = [];
    for(let total of data.getGAReport.totals) {
        if (total && total.metricValues && total.metricValues[0].value) {
            graphValues.push(parseInt(total.metricValues[0].value));
            totalUsers.push(parseInt(total.metricValues[0].value));
            newUsers.push(parseInt(total.metricValues[2].value))
        } else {
            graphValues.push(0);
            totalUsers.push(0);
            newUsers.push(0);
        }
    }
    let totalEngamentValue = 0;
    data.getGAReport?.totals.forEach((currValue) => {
        if (currValue.metricValues && currValue.metricValues.length) {
            totalEngamentValue += parseInt(currValue.metricValues[1].value);
        }
    });
    const dur = dayjs.duration(totalEngamentValue/4, "seconds")
    const avarageEngagementTime = dayjs.utc(dur.asMilliseconds()).format('mm:ss').split(":");
    userChartNumbersContainer.updateTextViaAttrVar({
        usersCount: totalUsers.reduce((sum, currValue) => sum + currValue,0),
        newUsersCount: newUsers.reduce((sum, currValue) => sum + currValue,0),
        avarageEngagement: `${avarageEngagementTime[0]}m ${avarageEngagementTime[1]}s` 
    });
    const totalUsersCTX = (document.getElementById('usersChart') as HTMLCanvasElement).getContext("2d");
    let totalUsersConfig = configAreaChart(totalUsersCTX, graphValues, xValues);
    if (isUpdate) {
        updateChart(newSignupsChart, xValues, graphValues)
    } else {
        newSignupsChart = new Chart(totalUsersCTX, totalUsersConfig);
    }
    newUsersTab.on("click", () =>{
        newUsersTab.addCssClass("active");
        usersTab.removeCssClass("active");
        usersEngagementTab.removeCssClass("active");
        graphValues = [];
        for(let total of data.getGAReport.totals) {
            if (total && total.metricValues && total.metricValues[2].value) {
                graphValues.push(parseInt(total.metricValues[2].value));
            } else {
                graphValues.push(0);
            }
        }
        updateChart(newSignupsChart, xValues, graphValues)
    });
    usersTab.on("click", () => {
        usersTab.addCssClass("active");
        newUsersTab.removeCssClass("active");
        usersEngagementTab.removeCssClass("active");
        graphValues = [];
        for(let total of data.getGAReport.totals) {
            if (total && total.metricValues && total.metricValues[0].value) {
                graphValues.push(parseInt(total.metricValues[0].value));
            } else {
                graphValues.push(0);
            }
        }
        updateChart(newSignupsChart, xValues, graphValues)
    });
    usersEngagementTab.on("click", () => {
        usersEngagementTab.addCssClass("active");
        usersTab.removeCssClass("active");
        newUsersTab.removeCssClass("active");
        graphValues = [];
        for(let total of data.getGAReport.totals) {
            if (total && total.metricValues && total.metricValues.length && total.metricValues[1].value) {
                const dur = dayjs.duration(parseInt(total.metricValues[1].value), "seconds")
                const avarageEngagementTime = dayjs.utc(dur.asMilliseconds()).format('mm');
                graphValues.push(avarageEngagementTime);
            } else {
                graphValues.push(0);
            }
        }
        updateChart(newSignupsChart, xValues, graphValues)
    });

    const totalUsersRuntimeContainer = new WFComponent(`[xa-var="totalUsersRuntime"]`);
    const totalRuntimeCount = [
        data.R1.rows && data.R1.rows.length && data.R1.rows[0] ? parseInt(data.R1.rows[0].metricValues[0].value): 0,
        data.R1.rows && data.R1.rows.length && data.R1.rows[1] ? parseInt(data.R1.rows[1].metricValues[0].value): 0,
        data.R2.rows && data.R2.rows.length && data.R2.rows[0] ? parseInt(data.R2.rows[0].metricValues[0].value): 0,
        data.R2.rows && data.R2.rows.length && data.R2.rows[1] ? parseInt(data.R2.rows[1].metricValues[0].value): 0,
        data.R3.rows && data.R3.rows.length && data.R3.rows[0] ? parseInt(data.R3.rows[0].metricValues[0].value): 0,
        data.R3.rows && data.R3.rows.length && data.R3.rows[1] ? parseInt(data.R3.rows[1].metricValues[0].value): 0,
    ].reduce((sum, currVal) => sum + currVal);
    totalUsersRuntimeContainer.setHTML(totalRuntimeCount.toString());

    const barChartRuntime = new WFComponent(`[xa-type="bar-chart-runtime"]`);
    const bars = barChartRuntime.getChildAsComponents(`div`);
    bars[0].setStyle({ height: `${ data.R1.rows && data.R1.rows.length && data.R1.rows[0] ? roundNearest5((parseInt(data.R1.rows[0].metricValues[0].value) * 100)/ totalRuntimeCount) : 0.5 }%`})
    bars[1].setStyle({ height: `${ data.R1.rows && data.R1.rows.length && data.R1.rows[1] ? roundNearest5((parseInt(data.R1.rows[1].metricValues[0].value) * 100)/ totalRuntimeCount) : 0.5 }%`})
    bars[2].setStyle({ height: `${ data.R2.rows && data.R2.rows.length && data.R2.rows[0] ? roundNearest5((parseInt(data.R2.rows[0].metricValues[0].value) * 100)/ totalRuntimeCount) : 0.5 }%`})
    bars[3].setStyle({ height: `${ data.R2.rows && data.R2.rows.length && data.R2.rows[1] ? roundNearest5((parseInt(data.R2.rows[1].metricValues[0].value) * 100)/ totalRuntimeCount) : 0.5 }%`})
    bars[4].setStyle({ height: `${ data.R3.rows && data.R3.rows.length && data.R3.rows[0] ? roundNearest5((parseInt(data.R3.rows[0].metricValues[0].value) * 100)/ totalRuntimeCount) : 0.5 }%`})
    bars[5].setStyle({ height: `${ data.R3.rows && data.R3.rows.length && data.R3.rows[1] ? roundNearest5((parseInt(data.R3.rows[1].metricValues[0].value) * 100)/ totalRuntimeCount) : 0.5 }%`})

    let pageViews: {page: string, views: string}[] = [];
    if (data?.getGAPageViewsReport?.rows) {
        for (let row of data.getGAPageViewsReport.rows) {
            pageViews.push({
                page: row.dimensionValues[0].value,
                views: row.metricValues[0].value
            })
        }
    } else {
        pageViews = [
            { page: "verification", views: "0" }, 
            { page: "sign-in", views: "0" },
            { page: "dashboard", views: "0" },
            { page: "landing page", views: "0" }
        ]
    }
    let defaultPages = ["verification", "sign-in", "dashboard", "landing page"];
    let defaultPageCount = 0;
    const pageViewBarContainer = new WFComponent(`[xa-type="bar-page-views"]`);
    const pageViewBars = pageViewBarContainer.getChildAsComponent(`div`).getChildAsComponents(`div.ga_bar-chart_item`);
    let totalPageViews = pageViews.map(p => parseInt(p.views)).reduce((sum, currentCount) => sum + currentCount);
    pageViewBars.forEach((page, i) => {
        let pageName: any;
        if (pageViews[i]?.page) {
            pageName = pageViews[i].page.split("/");
            pageName = pageName[pageName.length - 1];
            defaultPages = defaultPages.filter(p => p != pageName);
        } else {
            pageName = defaultPages[defaultPageCount++];
        }
        const pageViewsCount = parseInt(pageViews[i].views);
        page.updateTextViaAttrVar({
            "page-name": pageName === "" ? "landing page" : pageName,
            "views-count": pageViewsCount
        })
        const bar = page.getChildAsComponent(`div.ga_bar-chart_progress-bar`);
        let percentage = 0;
        if (pageViewsCount !== 0) {
            percentage = (pageViewsCount * 100)/totalPageViews;
        }
        bar.setStyle({width: `${ percentage === 0 ? 1 : percentage }%`});
    });

    let eventsData : { event: string, count: string }[] = [];
    if (data?.getGAEventsReport?.rows) {
        for (let row of data.getGAEventsReport.rows) {
            eventsData.push({
                event: row.dimensionValues[0].value,
                count: row.metricValues[0].value
            });
        }
    } else {
        eventsData = [
            { event: "page_view", count: "0" }, 
            { event: "user_engagement", count: "0" },
            { event: "scroll", count: "0" },
            { event: "session_start", count: "0" }
        ]
    }
    let defaultEvents = ["page_view", "user_engagement", "scroll", "session_start"];
    let defaultEventsCount = 0;
    const eventsBarContainer = new WFComponent(`[xa-type="bar-events"]`);
    const eventsBars = eventsBarContainer.getChildAsComponent(`div`).getChildAsComponents(`div.ga_bar-chart_item`);
    let totalEventCounts = eventsData.map(c => parseInt(c.count)).reduce((sum, currentCount) => sum + currentCount);
    eventsBars.forEach((event, i) => {
        let eventName;
        const eventCount = eventsData[i]?.count ? parseInt(eventsData[i].count) : 0;
        if (eventsData[i]?.event) {
            eventName = eventsData[i].event;
            defaultEvents = defaultEvents.filter(e => e !== eventName);
        } else {
            eventName = defaultEvents[defaultEventsCount++];
        }
        event.updateTextViaAttrVar({
            "eventName": eventName,
            "eventCount": eventCount
        });
        const bar = event.getChildAsComponent(`div.ga_bar-chart_progress-bar`);
        let percentage = 0;
        if (eventCount !== 0) {
            percentage = (eventCount * 100)/totalEventCounts;
        }
        bar.setStyle({width: `${ percentage === 0 ? 1 : percentage }%`});
    });

    let usersByCountryData : { country: string, usersCount: string }[] = [];
    if (data?.getGAByCountryReport?.rows) {
        for (let row of data.getGAByCountryReport.rows) {
            usersByCountryData.push({
                country: row.dimensionValues[0].value,
                usersCount: row.metricValues[0].value
            });
        }
    } else {
        usersByCountryData = [
            { country: "India", usersCount: "0" }, 
            { country: "United States", usersCount: "0" },
            { country: "Canada", usersCount: "0" },
            { country: "Spain", usersCount: "0" }
        ]
    }
    let defaultCountries = ["India", "United States", "Canada", "Spain"];
    let defaultCountriesCount = 0;
    const usersByCountryBarContainer = new WFComponent(`[xa-type="bar-user-by-country"]`);
    const usersByCountryBars = usersByCountryBarContainer.getChildAsComponent(`div`).getChildAsComponents(`div.ga_bar-chart_item`);
    let totalUserCounts = usersByCountryData.map(c => parseInt(c.usersCount)).reduce((sum, currentCount) => sum + currentCount);
    usersByCountryBars.forEach((usersByCountry, i) => {
        let countryName;
        let userCount = usersByCountryData[i]?.usersCount ? parseInt(usersByCountryData[i]?.usersCount) : 0;
        if (usersByCountryData[i]?.country) {
            countryName = usersByCountryData[i].country;
            defaultCountries = defaultCountries.filter(c => c !== countryName);
        } else {
            countryName = defaultCountries[defaultCountriesCount++];
        }
        usersByCountry.updateTextViaAttrVar({
            "countryName": countryName,
            "userCount": userCount
        });
        const bar = usersByCountry.getChildAsComponent(`div.ga_bar-chart_progress-bar`);
        let percentage = 0;
        if (userCount !== 0) {
            percentage = (userCount * 100)/totalUserCounts;
        }
        bar.setStyle({width: `${ percentage === 0 ? 1 : percentage }%`});
    });
}

const updateChart = (chart, label, newData) => {
    chart.data.labels = label
    chart.data.datasets[0].data = newData;
    chart.clear();
    chart.update();
}

const roundNearest5 = (num: number) => {
    return Math.round(num / 5) * 5;
}