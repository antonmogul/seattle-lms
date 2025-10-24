import { WFComponent, WFDynamicList, navigate } from "@xatom/core";
import { adminQL } from "../../graphql";
import { AdminGetAllCoursesDocument, AdminGetAllUsersDocument, AdminMeDocument, GetActiveUsersDocument, GetCoursesReportDataDocument, GetGaConnectionStatusDocument, GetGaReportDocument, } from "../../graphql/graphql";
import { ADMIN_PATHS, S3_BASE_URL } from "../../config";
import { Chart, configAreaChart, configPieChart, formatCount } from "client-utils/chartjs"
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc"
import { curtainLoader } from "client-utils/curtain-loader";

export const adminDashboard = () => {
    const adminDataReq = adminQL.query(AdminMeDocument);
    const getAllUserReq = adminQL.query(AdminGetAllUsersDocument);
    const getAllCoursesReq = adminQL.query(AdminGetAllCoursesDocument);
    const activeUsersReq = adminQL.query(GetActiveUsersDocument);
    const courseDetailsReq = adminQL.query(GetCoursesReportDataDocument);
    const getGAConnectionStatusReq = adminQL.query(GetGaConnectionStatusDocument);
    const getGAReportReq = adminQL.query(GetGaReportDocument);
    const GANotConnectedBlock = new WFComponent(`[xa-type="ga-not-connected-block"]`);
    const GAConnectedBlock = new WFComponent(`[xa-type="real-time-users"]`);
    
    getGAConnectionStatusReq.onData((data) => {
        if (data.getGAConnectionStatus) {
            getGAReportReq.onData((data) => {
                dayjs.extend(duration)
                dayjs.extend(utc)
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
    bars[0].addCssClass(
        `is-${
            data.R1.rows && data.R1.rows.length && data.R1.rows[0] 
            ? roundNearest5((parseInt(data.R1.rows[0].metricValues[0].value) * 100)/totalRuntimeCount): 
            0
        }`
    );
    bars[1].addCssClass(
        `is-${
            data.R1.rows && data.R1.rows.length && data.R1.rows[1] 
            ? roundNearest5((parseInt(data.R1.rows[1].metricValues[0].value) * 100)/totalRuntimeCount): 
            0
        }`
    );
    bars[2].addCssClass(
        `is-${
            data.R2.rows && data.R2.rows.length && data.R2.rows[0] 
            ? roundNearest5((parseInt(data.R2.rows[0].metricValues[0].value) * 100)/totalRuntimeCount): 
            0
        }`
    );
    bars[3].addCssClass(
        `is-${
            data.R2.rows && data.R2.rows.length && data.R2.rows[1] 
            ? roundNearest5((parseInt(data.R2.rows[1].metricValues[0].value) * 100)/totalRuntimeCount): 
            0
        }`
    );
    bars[4].addCssClass(
        `is-${
            data.R3.rows && data.R3.rows.length && data.R3.rows[0] 
            ? roundNearest5((parseInt(data.R3.rows[0].metricValues[0].value) * 100)/totalRuntimeCount): 
            0
        }`
    );
    bars[5].addCssClass(
        `is-${
            data.R3.rows && data.R3.rows.length && data.R3.rows[1] 
            ? roundNearest5((parseInt(data.R3.rows[1].metricValues[0].value) * 100)/totalRuntimeCount): 
            0
        }`
    );
            });
            const currentYear = new Date().getFullYear()
            getGAReportReq.fetch({
                dateRanges: [
                    `${currentYear}-01-01/${currentYear}-03-31`,
                    `${currentYear}-04-01/${currentYear}-06-30`,
                    `${currentYear}-07-01/${currentYear}-09-30`,
                    `${currentYear}-10-01/${currentYear}-12-31`
                ]
            });
            GANotConnectedBlock.addCssClass("hide");
            GAConnectedBlock.removeCssClass("hide");
        } else {
            GANotConnectedBlock.removeCssClass("hide");
            GAConnectedBlock.addCssClass("hide");
        }
    });
    getGAConnectionStatusReq.fetch();
    const userList = new WFDynamicList<{
        id: string
        name: string;
        status: boolean;
    },
        HTMLDivElement,
        HTMLDivElement,
        HTMLDivElement
    >(`[xa-type="users-list"]`, {
        rowSelector: `[xa-type="list-item"]`,
        emptySelector: `[xa-type="empty-state"]`
    });
    const courseList = new WFDynamicList<{
        name: string;
        lessons: number;
    },
        HTMLDivElement,
        HTMLDivElement,
        HTMLDivElement
    >(`[xa-type="courses-list"]`, {
        rowSelector: `[xa-type="list-item"]`,
        emptySelector: `[xa-type="empty-state"]`
    });

    const promises = [
        activeUsersReq.fetch({
            filter: "MONTHLY"
        }),
        getAllUserReq.fetch({
            pageNo: 1,
            noOfRecords: 4,
            searchTerm: "",
            joiningEndDate: "",
            joiningStartDate: "",
            lastLoginEndDate: "",
            lastLoginStartDate: ""
        }),
        courseDetailsReq.fetch(),
        getAllCoursesReq.fetch({
            searchTerm: ""
        }),
    ]

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

    courseDetailsReq.onData((data) => {
        if (data && data.getCoursesReportData) {
            const _data = data.getCoursesReportData;
            const chartData = [_data.coursesNotStarted, _data.coursesNotCompleted, _data.coursesCompleted];
            const courseDetailsChart = new Chart(document.getElementById('coursesPIE'), configPieChart(chartData));
            const courseDetailsBlock = new WFComponent(`[xa-type="course-details-block"]`);
            courseDetailsBlock.updateTextViaAttrVar({
                "not-started": formatCount(_data.coursesNotStarted),
                "in-progress": formatCount(_data.coursesNotCompleted),
                "completed": formatCount(_data.coursesCompleted)
            });
            
        }
    });

    userList.rowRenderer(({ rowData, rowElement }) => {
        if (rowData.status) {
            rowElement.getChildAsComponent(`[xa-type="status"]`).addCssClass("is-enabled");
        } else {
            rowElement.getChildAsComponent(`[xa-type="status"]`).addCssClass("is-disabled");
        }
        rowElement.updateTextViaAttrVar({
            name: rowData.name,
            "status-type": rowData.status ? "Enabled" : "Disabled"
        });
        rowElement.on("click", () => {
            navigate(`${ADMIN_PATHS.userDetails}?id=${rowData.id}`);
        });
        return rowElement;
    });

    courseList.rowRenderer(({ rowData, rowElement }) => {
        rowElement.updateTextViaAttrVar({
            name: rowData.name,
            lessons: rowData.lessons,
        });

        return rowElement;
    });

    activeUsersReq.onData((data) => {

    });

    getAllUserReq.onData((data) => {
        const usersData: {
            id: string;
            name: string;
            status: boolean;
        }[] = data.adminGetAllUsers.data.map(u => {
            return {
                id: u.id,
                name: u.firstName,
                status: u.enabled
            }
        });
        userList.setData(usersData);


        // Sort by status
        const usersBlock = new WFComponent(`[xa-type="users-block"]`);
        const statusSorter = usersBlock.getChildAsComponent(`[xa-type="status-sorter"]`);
        let isEnabledFirst: boolean;
        statusSorter.on("click", () => {
            statusSorter.removeCssClass("down");
            if (!isEnabledFirst) {
                console.log("exec");
                const sortedList = sortList(usersData, 'byStatus', 'enabledFirst');
                userList.setData(sortedList);
                statusSorter.addCssClass("down");
                isEnabledFirst = true;
            } else {
                console.log("exec");
                const sortedList = sortList(usersData, 'byStatus', 'disabledFirst');
                userList.setData(sortedList);
                statusSorter.removeCssClass("down");
                isEnabledFirst = false;
            }
        });
    });

    getAllCoursesReq.onData((res) => {
        const coursesData: {
            name: string;
            lessons: number;
        }[] = res.adminGetAllCourses.map(h => {
            return {
                name: h.name,
                lessons: h.lessonCount,
            }
        });

        const filteredData = (coursesData && coursesData.length >= 4) ? coursesData.slice(4) : coursesData;
        courseList.setData(filteredData);

    })

    Promise.all(promises).then((data) => {
        curtainLoader().hide();
    })
}


function sortList(list, type, order?) {
    if (order && order === 'asc') {
        if (type === 'byLastLogin') {
            return list.sort((a, b) => {
                const dateA = new Date(b.lastLogin.split('/').reverse().join('/')) as any;
                const dateB = new Date(a.lastLogin.split('/').reverse().join('/')) as any;
                return dateB - dateA;
            });
        } else if (type === 'byJoinedDate') {
            return list.sort((a, b) => {
                const dateA = new Date(b.joinDate.split('/').reverse().join('/')) as any;
                const dateB = new Date(a.joinDate.split('/').reverse().join('/')) as any;
                return dateB - dateA;
            });
        }
    } else if (order && order === 'desc') {
        if (type === 'byLastLogin') {
            return list.sort((a, b) => {
                const dateA = new Date(b.lastLogin.split('/').reverse().join('/')) as any;
                const dateB = new Date(a.lastLogin.split('/').reverse().join('/')) as any;
                return dateA - dateB;
            });
        } else if (type === 'byJoinedDate') {
            return list.sort((a, b) => {
                const dateA = new Date(b.joinDate.split('/').reverse().join('/')) as any;
                const dateB = new Date(a.joinDate.split('/').reverse().join('/')) as any;
                return dateA - dateB;
            });
        }
    } else if (order === 'enabledFirst' && type === 'byStatus') {
        return list.sort((a, b) => {
            return b.status - a.status;
        });
    } else if (order === 'disabledFirst' && type === 'byStatus') {
        return list.sort((a, b) => {
            return a.status - b.status;
        });
    }
}

const roundNearest5 = (num: number) => {
    return Math.round(num / 5) * 5;
}