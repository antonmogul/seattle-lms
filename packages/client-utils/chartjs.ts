import { WFComponent } from "@xatom/core";

export const Chart = (window as any).Chart;

const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

const chartTooltips = {
    backgroundColor: 'black',
    displayColors: false,
    titleFont: { family: 'Gothic A1', weight: '400' },
    bodyFont: { family: 'Gothic A1', weight: '400' },
    padding: 12,
    cornerRadius: 0
};

const yTicks = { precision: 0, maxTicksLimit: 5, font: { family: 'Gothic A1', size: 14 } };
const xTicks = { font: { family: 'Gothic A1', size: 14 } };

const createAreaGradient1 = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, "rgba(0, 184, 180, .4)");
    gradient.addColorStop(1, "rgba(0, 184, 180, .1)");
    return gradient;
}

const createBarGradient1 = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, 'rgba(106, 153, 174, .8)');
    gradient.addColorStop(1, 'rgba(106, 153, 174, 1)');
    return gradient;
}

const createBarGradient2 = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, ' rgba(241, 148, 104, .8)');
    gradient.addColorStop(1, ' rgba(241, 148, 104, 1)');
    return gradient;
}

export const configAreaChart = (ctx, _data, xValues = null) => {
    const gradient = createAreaGradient1(ctx);
    const areaChartData = {
        labels: xValues ? xValues : ["Jan", "Mar", "May", "Jul", "Sep", "Nov", "Dec"],
        datasets: [{
            borderColor: "#00B8B4",
            pointBorderColor: "#00B8B4",
            pointBackgroundColor: "#00B8B4",
            pointHoverBackgroundColor: "#00B8B4",
            pointHoverBorderColor: "#00B8B4",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 1,
            pointRadius: 3,
            fill: true,
            lineTension: 0.4,
            backgroundColor: gradient,
            borderWidth: 2,
            data: _data
        }]
    };

    const config = {
        type: 'line',
        data: areaChartData,
        options: {
            layout: {
                padding: 0
            },
            legend: {
                position: "bottom",
                labels: {
                    font: {
                        family: "inherit",
                        size: 14,
                        weight: 'normal',
                        lineHeight: 1.5
                    }
                }
            },
            plugins: { legend: { display: false }, tooltip: chartTooltips },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false,
                    },
                    border: { display: false },
                    ticks: yTicks
                },

                x: {
                    grid: {
                        display: false,
                    },
                    border: { display: false },
                    ticks: xTicks
                }
            }
        }
    };
    return config;
};

export const configPieChart = (_data) => {
    const chartData = {
        labels: [
            'Not Started',
            'In Progress',
            'Completed'
        ],
        datasets: [{
            label: '',
            data: _data,
            backgroundColor: [
                '#F19468',
                '#E2A325',
                '#00B8B4'
            ],
        }]
    };

    const config = {
        type: 'pie',
        data: chartData,
        options: {
            plugins: {
                legend: { display: false },
                tooltip: chartTooltips,
            },
            animation: false
        }
    };

    return config;
};

export const configBarChart = (ctx, _data, xValues, variant) => {
    const gradient = (variant === 1) ? createBarGradient1(ctx) : createBarGradient2(ctx);
    const maxValueArray = [];
    const chartData = {
        labels: xValues,
        datasets: [{
            label: '',
            data: _data,
            backgroundColor: gradient,
            borderRadius: 0,
            borderSkipped: false,
            barPercentage: .5
        }
        /*{
            label: '',
            data: [100, 100, 100, 100, 100, 100],
            backgroundColor: "#f0f5f7",
            borderRadius: 0,
            borderSkipped: false,
            barPercentage: .5
        }*/]
    };

    const config = {
        scaleLineColor: "rgba(0,0,0,0)",
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }, tooltip: chartTooltips
            },
            animation: false,
            scales: {
                y: {
                    stacked: true,
                    beginAtZero: true,
                    grid: {
                        display: false,
                    },
                    border: { display: false },
                    ticks: yTicks
                },

                x: {
                    stacked: true,
                    grid: {
                        display: false,
                    },
                    border: { display: false },
                    ticks: xTicks
                }
            }
        }
    }

    return config;
}

export const configDoughnutChart1 = (container: WFComponent<HTMLElement>, val1: number, val2: number) => {
    let chart = container.getChildAsComponent(".circular-progress");
    let progressStartValue = 0,
        speed = 10;
    const progressPercentage = (val2 * 100) / val1;
    let progress = setInterval(() => {
        progressStartValue++;
        chart.getElement().style.background = `conic-gradient(#00B8B4 ${progressStartValue * 3.6}deg, rgba(0, 184, 180, .1) 0deg)`
        if (progressStartValue >= progressPercentage) {
            clearInterval(progress);
        }
    }, speed);
}

export const formatCount = (num) => {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + ' B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + ' M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + ' k';
    }
    return num.toString();
}