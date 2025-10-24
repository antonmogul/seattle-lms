import { WFComponent } from "@xatom/core";
import { moment } from "./datePicker";

export const formatDate = (inputDate) => {
    const currentDate = new Date();
    const targetDate = new Date(inputDate);

    // Check if it's today
    if (
        targetDate.getDate() === currentDate.getDate() &&
        targetDate.getMonth() === currentDate.getMonth() &&
        targetDate.getFullYear() === currentDate.getFullYear()
    ) {
        return 'Today';
    }

    // Check if it's yesterday
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);

    if (
        targetDate.getDate() === yesterday.getDate() &&
        targetDate.getMonth() === yesterday.getMonth() &&
        targetDate.getFullYear() === yesterday.getFullYear()
    ) {
        return 'Yesterday';
    }

    // Format the date in the specified manner
    return targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}


export const sortList = (list, type, order?) => {
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
    } else if (order === 'completedFirst' && type === 'byProgress') {
        return list.sort((a, b) => {
            if (a["course-status"] === "COMPLETE" && b["course-status"] === "IN_PROGRESS") {
                return -1; // "a" should come before "b"
            } else if (a["course-status"] === "IN_PROGRESS" && b["course-status"] === "COMPLETE") {
                return 1; // "b" should come before "a"
            } else {
                return 0; // Leave order unchanged
            }
        });
    } else if (order === 'notCompletedFirst' && type === 'byProgress') {
        return list.sort((a, b) => {
            if (a["course-status"] === "IN_PROGRESS" && b["course-status"] === "COMPLETE") {
                return -1; // "a" should come before "b"
            } else if (a["course-status"] === "COMPLETE" && b["course-status"] === "IN_PROGRESS") {
                return 1; // "b" should come before "a"
            } else {
                return 0; // Leave order unchanged
            }
        });
    }
}

export const setCourseProgressRing = (courseCard: WFComponent<HTMLElement>, totalLessons: number, completedLessons: number) => {
    let circularProgress = courseCard.getChildAsComponent(".circular-progress");
    let progressStartValue = 0,
        speed = 10;
    const progressPercentage = (completedLessons * 100) / totalLessons;
    let progress = setInterval(() => {
        progressStartValue++;
        circularProgress.getElement().style.background = `conic-gradient(#00B8B4 ${progressStartValue * 3.6}deg, #ededed 0deg)`
        if (progressStartValue >= progressPercentage) {
            clearInterval(progress);
        }
    }, speed);
}

export const generateCourseAxes = (noOfCourses) => {
    let xValues = []
    for (let i = 1; i <= 6; i++) {
        if (i <= noOfCourses) {
            xValues.push(`C${i}`);
        } else {
            xValues.push("");
        }
    }
    return xValues;
}

export const defineDateRange = (rangeText: string) => {
    // console.log(rangeText)
    switch (rangeText) {
        case "Today":
            return [moment(), moment()];
            break;

        case "Yesterday":
            return [moment().subtract(1, 'days'), moment().subtract(1, 'days')];
            break;

        case "Last 7 days":

            return [moment().subtract(6, 'days'), moment()];
            break;

        case "Last 30 days":
            return [moment().subtract(30, 'days'), moment()];
            break;

        case "This Month":
            return [moment().startOf('month'), moment()];
            break;

        case "Last 90 Days":
            return [moment().subtract(89, 'days'), moment()];
            break;

        case "Last 12 Months":
            return [moment().subtract(11, 'months').startOf('month'), moment()];
            break;

        case "Last 2 Years":
            return [moment().subtract(2, 'years').startOf('year'), moment()];
            break;

        default:
            return [5, 2];
            break;
    }
}

export const setOTPInput = () => {
    const codes: any = document.querySelectorAll('.form-input-verification_code');

    codes[0].focus();

    codes.forEach((code, idx) => {
        code.addEventListener("keyup", (e) => {
            if (e.key >= 0 && e.key <= 9) {
                codes[idx].value = e.key;
                requestAnimationFrame(() => {
                    if (codes[idx + 1]) {
                        codes[idx + 1].focus();
                        // codes[idx + 1].value = "";
                    }
                });
            } else if (e.key === "Backspace") {
                requestAnimationFrame(() => {
                    if (codes[idx - 1]) {
                        codes[idx].value = "";
                        codes[idx - 1].focus();
                    }
                })
            }
        });

        code.addEventListener("paste", (e) => {
            e.preventDefault();
            const inputValue = (e.clipboardData || window.Clipboard).getData('text');
            console.log(inputValue.length);
            if (/^\d{4}$/.test(inputValue) && inputValue.length === 4) {
                console.log("executed");
                // Auto-distribute digits to the respective input fields
                codes.forEach((digitInput, i) => {
                    digitInput.value = inputValue[i];
                });

                // Focus on the last input field
                codes[codes.length - 1].focus();
            }
        });
    });
}

export const generatePaginationArray = (pageNo, totalPages) => {
    let pageNoArr: any = [];
    if (pageNo <= 2) {
        const lastPage = (pageNo + 4 < totalPages) ? pageNo + 4 : totalPages;
        for (let i = 1; i <= lastPage; i++) {
            pageNoArr.push(i);
        }
        if (pageNo === 1 && pageNo !== totalPages && totalPages > 0) {
            pageNoArr.push(6)
        }
        if (pageNo !== totalPages && totalPages > 0) {
            pageNoArr.push(totalPages);
        }
        pageNoArr = pageNoArr.map((p) => {
            return { pageNo: p }
        });
    } else if (pageNo >= totalPages - 2) {
        pageNoArr.push(1);
        for (let i = totalPages - 5; i <= totalPages; i++) {
            pageNoArr.push(i);
        }
        pageNoArr = pageNoArr.map((p) => {
            return { pageNo: p }
        });
    } else {
        for (let i = pageNo - 2; i <= pageNo + 2; i++) {
            pageNoArr.push(i);
        }
        if (!(pageNoArr.find((pne) => parseInt(pne) === 1))) {
            pageNoArr.unshift(1);
        } else {
            pageNoArr.push(pageNoArr[pageNoArr.length - 1] + 1);
        }
        if (!(pageNoArr.find((pne) => parseInt(pne) === totalPages))) {
            pageNoArr.push(totalPages);
        } else {
            pageNoArr[0] = pageNoArr[1] - 1;
            pageNoArr.unshift(1);
        }
        pageNoArr = pageNoArr.map((p) => {
            return { pageNo: p }
        });
    }
    return pageNoArr;
}