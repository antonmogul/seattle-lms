import { WFComponent } from "@xatom/core";
import { adminQL } from "../../graphql"
import { GetCourseCompletionReportDocument, GetCoursesReportDataDocument } from "../../graphql/graphql"
import { Chart, configBarChart, configPieChart, formatCount } from "client-utils/chartjs";
import { generateCourseAxes } from "client-utils/utility-functions";
import { curtainLoader } from "client-utils/curtain-loader";

export const courseReportsPage = () => {
    const courseDetailsReq = adminQL.query(GetCoursesReportDataDocument);
    const courseCompletionReq = adminQL.query(GetCourseCompletionReportDocument);

    const promises = [
        courseDetailsReq.fetch(),
        courseCompletionReq.fetch()
    ];

    courseDetailsReq.onData((data) => {
        if (data && data.getCoursesReportData) {
            const _data = data.getCoursesReportData;
            const chartData = [_data.coursesNotStarted, _data.coursesNotCompleted, _data.coursesCompleted];
            const courseDetailsChart = new Chart(document.getElementById('courseDetailsPIE'), configPieChart(chartData));
            const courseDetailsBlock = new WFComponent(`[xa-type="course-details-block"]`);
            courseDetailsBlock.updateTextViaAttrVar({
                "not-started": formatCount(_data.coursesNotStarted),
                "in-progress": formatCount(_data.coursesNotCompleted),
                "completed": formatCount(_data.coursesCompleted)
            });

        }
    });

    courseCompletionReq.onData((data) => {
        console.log(data);
        if (data && data.getCourseCompletionReport) {
            let yValues = data.getCourseCompletionReport.map(u => u.completions);
            let xValues = generateCourseAxes(data.getCourseCompletionReport.length);
            const newSignupsCTX = (document.getElementById('courseCompletion') as HTMLCanvasElement).getContext("2d");
            const newSignupsConfig = configBarChart(newSignupsCTX, yValues, xValues, 2);
            const newSignupsChart = new Chart(newSignupsCTX, newSignupsConfig);
        }
    });

    Promise.all(promises).then((data) => {
        curtainLoader().hide();
    })
}