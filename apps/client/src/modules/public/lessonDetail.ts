import { WFComponent, WFDynamicList, navigate } from "@xatom/core";
import { publicQL } from "../../graphql"
import { GetCourseProgressByCourseIdDocument, StartLessonDocument, UpdateLessonStatusDocument, UpdateReadTimeDocument } from "../../graphql/graphql"
import { PUBLIC_PATHS } from "../../config";
import { getSlugs } from "client-utils/slugs";
import htmx from "htmx.org";
import { curtainLoader } from "client-utils/curtain-loader";
import { WFSlider } from "@xatom/slider";
import { Swiper } from "swiper"
import { Navigation, Pagination } from 'swiper/modules';

export const lessonDetail = async () => {
    try {
        const slugs = getSlugs();
        const courseSlug = slugs.courseSlug
        const currentLessonSlug = slugs.currentLessonSlug
        calculateReadTime(courseSlug, currentLessonSlug);
        const courseCompletePBtn = new WFComponent(`[xa-type="course-success-primary-btn"]`);
        const courseCompleteSBtn = new WFComponent(`[xa-type="course-success-secondary-btn"]`);
        const viewHighlightsButton = new WFComponent(`[xa-type="course-highlights-button"]`);
        const highlightId = new WFComponent(`[xa-type="course-highlights-slug"]`).getAttribute("xa-value");
        const lessonProgressUpdateReq = publicQL.mutation(UpdateLessonStatusDocument);
        const startLessonReq = publicQL.mutation(StartLessonDocument);
        handleQuiz2();

        courseCompletePBtn.on("click", () => {
            viewHighlightsButton.setText("Please wait...");
            lessonProgressUpdateReq.onData((data) => {
                if (data) {
                    navigate(`${PUBLIC_PATHS.courseHighlightRoute}/${highlightId}`);
                }
            });
            lessonProgressUpdateReq.fetch({
                courseId: courseSlug,
                lessonId: currentLessonSlug,
                isLastLesson: true,
                status: "COMPLETE"
            });
        })

        viewHighlightsButton.on("click", () => {
            viewHighlightsButton.setText("Please wait...");
            lessonProgressUpdateReq.onData((data) => {
                if (data) {
                    navigate(`${PUBLIC_PATHS.courseHighlightRoute}/${highlightId}`);
                }
            });
            lessonProgressUpdateReq.fetch({
                courseId: courseSlug,
                lessonId: currentLessonSlug,
                isLastLesson: true,
                status: "COMPLETE"
            });
        })
        startLessonReq.onData(() => {
            //TODO: On Start Lesson Response
        });
        startLessonReq.fetch({
            courseId: courseSlug,
            lessonId: currentLessonSlug
        });
        const nextLessonButton = new WFComponent(`[xa-type="next-lesson-btn"]`);
        if (nextLessonButton) {
            const nextLessonId = nextLessonButton.getAttribute("xa-next-lesson-slug");
            lessonProgressUpdateReq.onData((data) => {
                if (data) {
                    nextLessonButton.setText("Redirecting");
                    navigate(`${PUBLIC_PATHS.lessonDetailRoute}/${nextLessonId}`);
                }
            });

            lessonProgressUpdateReq.onError((e) => {
                console.log("Hit an error while completing lesson", e.message);
            });

            nextLessonButton.on("click", (e) => {
                e.preventDefault();
                nextLessonButton.setText("Please wait...");
                nextLessonButton.addCssClass("is-disabled");
                lessonProgressUpdateReq.fetch({
                    courseId: courseSlug,
                    lessonId: currentLessonSlug,
                    isLastLesson: false,
                    status: "COMPLETE"
                });
            });
        }

        courseCompleteSBtn.on("click", () => {
            lessonProgressUpdateReq.onData((data) => {
                if (data) {
                    navigate(`${PUBLIC_PATHS.courseList}`);
                }
            });
            lessonProgressUpdateReq.fetch({
                courseId: courseSlug,
                lessonId: currentLessonSlug,
                isLastLesson: true,
                status: "COMPLETE"
            });
        })

        const courseDirectoryButton = new WFComponent(`[xa-type="course-directory-button"]`);
        courseDirectoryButton.on("click", () => {
            lessonProgressUpdateReq.onData((data) => {
                if (data) {
                    navigate(`${PUBLIC_PATHS.courseList}`);
                }
            });
            lessonProgressUpdateReq.fetch({
                courseId: courseSlug,
                lessonId: currentLessonSlug,
                isLastLesson: true,
                status: "COMPLETE"
            });
        })
        htmx.ajax('GET', `/user/courses/${courseSlug}`, { target: '#lesson-links', swap: 'outerHTML', select: "#lesson-sidebar-links" }).then(data => {
            setSidebarLinks();
        }).catch(err => {
            console.log("Lesson Detail Error: ", err);
        })
        curtainLoader().hide();
    } catch (err) {
        console.log("Lesson Detail Error: ", err);
    }
}

const setSidebarLinks = () => {
    const slugs = getSlugs();
    const currentCourseSlug = slugs.courseSlug
    const LessonSlug = slugs.currentLessonSlug
    const getCoursesProgressByIdReq = publicQL.query(GetCourseProgressByCourseIdDocument);
    const sidebarLinkWrapper = new WFComponent(`[xa-type="sidebar-links"]`);
    const sidebarLinks = sidebarLinkWrapper.getChildAsComponents(`[xa-type="sidebar-link-wrap"]`);

    const lessonRichTextContainer = new WFComponent(`[xa-type="lesson-rich-text"]`);
    const aiVideoSection = new WFComponent(`[xa-type="ai-video-section"]`);
    const quizSection = new WFComponent(`#quiz-button`);
    // const readDuration = new WFComponent(`[xa-type="read-duration"]`);
    let headingHTMLTags: WFComponent[] = [];
    const sidebarElements: { id: string, text: string }[] = []
    if (aiVideoSection && !aiVideoSection.getElement().classList.contains("w-condition-invisible")) {
        aiVideoSection.setAttribute("id", `aiVideo`);
        sidebarElements.push({ id: `aiVideo`, text: "Intro Video" });
    }
    for (let i = 2; i <= 4; i++) {
        headingHTMLTags.push(...lessonRichTextContainer.getChildAsComponents(`h${i}`));
    }
    headingHTMLTags.forEach((tag, i) => {
        tag.setAttribute("id", `heading${i}`);
        sidebarElements.push({ id: `heading${i}`, text: tag.getText() })
    });
    if (quizSection && !quizSection.getElement().classList.contains("w-condition-invisible")) {
        sidebarElements.push({ id: `quiz-button`, text: "Take a quiz" });
    }

    const secondaryLinksList = new WFDynamicList<
        {
            id: string;
            text: string;
        }
    >(`[xa-list="${LessonSlug}"]`, {
        rowSelector: `[xa-type="list-item"]`
    });

    secondaryLinksList.rowRenderer(({ rowData, rowElement }) => {
        const textContainer = rowElement.getChildAsComponent('div');
        textContainer.setText(rowData.text);
        rowElement.setAttribute('href', `#${rowData.id}`)
        return rowElement;
    });

    secondaryLinksList.setData(sidebarElements);
    secondaryLinksList.removeCssClass("hide");

    getCoursesProgressByIdReq.onData(data => {
        const lessonProgress = data.getCourseProgressByCourseId.lessonProgress;
        // readDuration.setText(`${data.getCourseProgressByCourseId?.course?.readTime || 0 } mins`)
        if (sidebarLinks) {
            sidebarLinks.forEach(link => {
                const currentLessonSlug = link.getAttribute("xa-lesson-slug");
                const currentLesson = lessonProgress.find(d => d.lesson.slug === currentLessonSlug)
                if (currentLesson) {
                    if (currentLesson.status === 'COMPLETE') {
                        if (currentLesson.lesson.slug === LessonSlug) {
                            link.getChildAsComponent(`[xa-type="sidebar-link"]`).addCssClass("in-progress");
                        } else {
                            link.getChildAsComponent(`[xa-type="sidebar-link"]`).addCssClass("complete");
                        }
                    } else if (currentLesson.status === 'IN_PROGRESS') {
                        if (currentLesson.lesson.slug === LessonSlug) {
                            link.getChildAsComponent(`[xa-type="sidebar-link"]`).addCssClass("in-progress");
                        } else {
                            link.getChildAsComponent(`[xa-type="sidebar-link"]`).addCssClass("not-started");
                        }
                    }
                } else {
                    if (currentLessonSlug === LessonSlug) {
                        link.getChildAsComponent(`[xa-type="sidebar-link"]`).addCssClass("in-progress");
                    } else {
                        link.getChildAsComponent(`[xa-type="sidebar-link"]`).addCssClass("not-started");
                    }

                }
            })
        }
    })
    getCoursesProgressByIdReq.fetch({
        courseId: currentCourseSlug
    });

    var links = secondaryLinksList.getElement().querySelectorAll(`[xa-type="list-item"]`);
    links[0].classList.add('active');
    document.addEventListener('scroll', function () {
        // Get all link elements

        // Remove the 'active-link' class from all links
        links.forEach(function (link) {
            link.classList.remove('active');
        });

        links.forEach(function (link) {
            // Get the target section id from the href attribute
            var targetId = link.getAttribute('href').substring(1);
            var targetSection = document.getElementById(targetId);

            // Check if the target section is in the viewport
            var isInViewport = targetSection.getBoundingClientRect().top <= window.innerHeight && targetSection.getBoundingClientRect().bottom >= 0;

            // Add the 'active-link' class if the section is in the viewport
            if (isInViewport) {
                links.forEach(function (link) {
                    link.classList.remove('active');
                });
                link.classList.add('active');
            }
        });
    });
}

const calculateReadTime = (courseId: string, lessonId: string) => {
    const updateReadTimeReq = publicQL.mutation(UpdateReadTimeDocument);
    const lessonText = new WFComponent(`[xa-type="lesson-rich-text"]`).getText();
    const wordsArray = lessonText.split(' ');
    const wordCount = wordsArray.length;
    const wordsPerMinute = 200;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    updateReadTimeReq.onData((res) => {
        console.log(`Read Time Updated: ${res.updateReadTime}`);
    });
    updateReadTimeReq.fetch({
        courseId,
        lessonId,
        readTime
    });
}

const handleQuiz = () => {
    let selectedOptionWrapper, isCorrect, progress;
    const quizModal = new WFComponent(`[xa-type="quiz-modal"]`);
    const quizQuestionItems = quizModal.getChildAsComponents(`.quiz_question-item`);
    const quizOptionWrappers = quizModal.getChildAsComponents(`.quiz_option-wrapper`);
    const quizOptionCircles = quizModal.getChildAsComponents(`.quiz_option-circle`);
    const quizExplanations = quizModal.getChildAsComponents(`.quiz_question-explanation`);
    const quizAppreciations = quizModal.getChildAsComponents(`.quiz_question-correct`);
    const quizNextBtn = quizModal.getChildAsComponent(`#quiz-next`);
    const quizClose = quizModal.getChildAsComponent(`#quiz-modal-close`);
    const quizProgressBar = quizModal.getChildAsComponent(`.quiz_progress-bar`);
    const quizSlider = new WFSlider(`[xa-type="quiz-slider"]`);
    const allQuestionSlides = quizSlider.getAllSlides();
    const quizNextLesson = quizModal.getChildAsComponent(`#quiz-next-lesson`);
    // const quizCompleteCourse = quizModal.getChildAsComponent(`#quiz-complete-course`);
    const quizSuccess = quizModal.getChildAsComponent(`.quiz-modal_success-wrap`);
    const quizBody = quizModal.getChildAsComponent(`.quiz-modal_body-wrap`);
    const identifyNextLesson = quizModal.getChildAsComponent(`.identify-next-lesson`);
    const quizFooter = quizModal.getChildAsComponent(`.quiz-modal_footer`);
    const quizSliderMask = quizSlider.getChildAsComponent(`.quiz_slider-mask`);

    quizOptionWrappers.forEach((optionWrapper) => {
        optionWrapper.on("click", () => {
            const optionCircle = optionWrapper.getChildAsComponent(`.quiz_option-circle`);

            quizOptionWrappers.forEach(ow => { ow.getElement().classList.remove("selected", "correct", "wrong"); });
            quizOptionCircles.forEach(oc => { oc.getElement().classList.remove("selected", "correct", "wrong"); });
            quizExplanations.forEach(qe => { qe.getElement().classList.remove("show"); });
            quizAppreciations.forEach(qa => { qa.getElement().classList.remove("show"); });

            optionWrapper.addCssClass("selected");
            optionCircle.addCssClass("selected");

            quizNextBtn.removeCssClass("is-disabled");
            quizNextBtn.removeAttribute("disabled");
        });
    });

    quizClose.on("click", () => {
        progress = 0;
        quizProgressBar.setStyle({ width: "1%" });
        quizQuestionItems.forEach(qi => { qi.getElement().classList.remove("answered"); });
        quizOptionWrappers.forEach(ow => { ow.getElement().classList.remove("selected", "correct", "wrong"); });
        quizOptionCircles.forEach(oc => { oc.getElement().classList.remove("selected", "correct", "wrong"); });
        quizExplanations.forEach(qe => { qe.getElement().classList.remove("show"); });
        quizAppreciations.forEach(qa => { qa.getElement().classList.remove("show"); });
        quizSlider.goToIndex(0);
    });

    quizNextBtn.on("click", () => {
        quizNextBtn.addCssClass("is-disabled");
        quizNextBtn.setAttribute("disabled", "true");

        selectedOptionWrapper = quizModal.getChildAsComponent(`.quiz_option-wrapper.selected`);
        const selectedOptionCircle = selectedOptionWrapper.getChildAsComponent(`.quiz_option-circle`);
        const currentQuestion = selectedOptionWrapper.getElement().closest(`.quiz_question-item`);
        const quizCorrectAlert = currentQuestion.querySelector(`.quiz_question-correct`);
        const quizWrongAlert = currentQuestion.querySelector(`.quiz_question-explanation`);
        isCorrect = selectedOptionWrapper.getElement().querySelector('.correct') !== null;

        selectedOptionWrapper.removeCssClass("selected");
        selectedOptionCircle.removeCssClass("selected");

        if (isCorrect) {
            selectedOptionWrapper.addCssClass("correct");
            selectedOptionCircle.addCssClass("correct");
            currentQuestion.classList.add("answered");
            quizCorrectAlert.classList.add("show");

            updateProgress(() => {
                console.log(progress);
                setTimeout(() => {
                    if (progress === 100) {
                        completeQuiz();
                    } else {
                        navToNextQuestion();
                    }
                }, 1050);
            });
        } else {
            selectedOptionWrapper.addCssClass("wrong");
            selectedOptionCircle.addCssClass("wrong");
            quizWrongAlert.classList.add("show");
            quizNextBtn.addCssClass('is-disabled');
            quizNextBtn.setAttribute("disabled", "true");
        }
    });

    const updateProgress = (cb: () => void) => {
        const answeredQuestions = quizModal.getChildAsComponents(`.answered`)
        progress = (answeredQuestions.length / quizQuestionItems.length) * 100;
        quizProgressBar.setStyle({ width: `${progress}%` });
        cb();
    }

    const completeQuiz = () => {
        quizNextBtn.addCssClass('hide'); quizNextBtn.setAttribute("disabled", "true");
        quizClose.addCssClass("hide");
        quizNextLesson.removeCssClass("hide");
        // quizCompleteCourse.removeCssClass("hide");
        quizSuccess.addCssClass("show");
        quizBody.addCssClass("hide");
        if (identifyNextLesson.getTextContent().trim() === '') {
            quizFooter.addCssClass("hide");
        }
        console.log("Quiz Completed");
    }

    const navToNextQuestion = () => {
        if (quizSlider.getActiveSlideIndex() !== allQuestionSlides.length) {
            requestAnimationFrame(() => {
                quizSlider.goNext();
                quizSliderMask.getElement().scrollTop = 0;
            })
            console.log("Went to next question");
        }
    }
}

const handleQuiz2 = () => {
    try {
        let selectedOptionWrapper, isCorrect, progress;
        const quizModal = new WFComponent(`[xa-type="quiz-modal-2"]`);
        const quizSwiper = new Swiper('.swiper', {
            direction: 'horizontal',
            allowTouchMove: false,

        });
        const quizQuestionItems = quizModal.getChildAsComponents(`.quiz_question-item`);
        const quizOptionWrappers = quizModal.getChildAsComponents(`.quiz_option-wrapper`);
        const quizOptionCircles = quizModal.getChildAsComponents(`.quiz_option-circle`);
        const quizExplanations = quizModal.getChildAsComponents(`.quiz_question-explanation`);
        const quizAppreciations = quizModal.getChildAsComponents(`.quiz_question-correct`);
        const quizNextBtn = quizModal.getChildAsComponent(`#quiz-next`);
        const quizClose = quizModal.getChildAsComponent(`#quiz-modal-close`);
        const quizProgressBar = quizModal.getChildAsComponent(`.quiz_progress-bar`);
        const quizNextLesson = quizModal.getChildAsComponent(`#quiz-next-lesson`);
        // const quizCompleteCourse = quizModal.getChildAsComponent(`#quiz-complete-course`);
        const quizSuccess = quizModal.getChildAsComponent(`.quiz-modal_success-wrap`);
        const quizBody = quizModal.getChildAsComponent(`.quiz-modal_body-wrap`);
        const identifyNextLesson = quizModal.getChildAsComponent(`.identify-next-lesson`);
        const quizFooter = quizModal.getChildAsComponent(`.quiz-modal_footer`);

        quizOptionWrappers.forEach((optionWrapper) => {
            optionWrapper.on("click", () => {
                const optionCircle = optionWrapper.getChildAsComponent(`.quiz_option-circle`);

                quizOptionWrappers.forEach(ow => { ow.getElement().classList.remove("selected", "correct", "wrong"); });
                quizOptionCircles.forEach(oc => { oc.getElement().classList.remove("selected", "correct", "wrong"); });
                quizExplanations.forEach(qe => { qe.getElement().classList.remove("show"); });
                quizAppreciations.forEach(qa => { qa.getElement().classList.remove("show"); });

                optionWrapper.addCssClass("selected");
                optionCircle.addCssClass("selected");

                quizNextBtn.removeCssClass("is-disabled");
                quizNextBtn.removeAttribute("disabled");
            });
        });

        quizClose.on("click", () => {
            progress = 0;
            quizProgressBar.setStyle({ width: "1%" });
            quizQuestionItems.forEach(qi => { qi.getElement().classList.remove("answered"); });
            quizOptionWrappers.forEach(ow => { ow.getElement().classList.remove("selected", "correct", "wrong"); });
            quizOptionCircles.forEach(oc => { oc.getElement().classList.remove("selected", "correct", "wrong"); });
            quizExplanations.forEach(qe => { qe.getElement().classList.remove("show"); });
            quizAppreciations.forEach(qa => { qa.getElement().classList.remove("show"); });
            // quizSlider.goToIndex(0);
            quizSwiper.slideTo(0);
        });

        quizNextBtn.on("click", () => {
            quizNextBtn.addCssClass("is-disabled");
            quizNextBtn.setAttribute("disabled", "true");

            selectedOptionWrapper = quizModal.getChildAsComponent(`.quiz_option-wrapper.selected`);
            const selectedOptionCircle = selectedOptionWrapper.getChildAsComponent(`.quiz_option-circle`);
            const currentQuestion = selectedOptionWrapper.getElement().closest(`.quiz_question-item`);
            const quizCorrectAlert = currentQuestion.querySelector(`.quiz_question-correct`);
            const quizWrongAlert = currentQuestion.querySelector(`.quiz_question-explanation`);
            isCorrect = selectedOptionWrapper.getElement().querySelector('.correct') !== null;

            selectedOptionWrapper.removeCssClass("selected");
            selectedOptionCircle.removeCssClass("selected");

            if (isCorrect) {
                selectedOptionWrapper.addCssClass("correct");
                selectedOptionCircle.addCssClass("correct");
                currentQuestion.classList.add("answered");
                quizCorrectAlert.classList.add("show");

                updateProgress(() => {
                    console.log(progress);
                    setTimeout(() => {
                        if (progress === 100) {
                            completeQuiz();
                        } else {
                            navToNextQuestion();
                        }
                    }, 1050);
                });
            } else {
                selectedOptionWrapper.addCssClass("wrong");
                selectedOptionCircle.addCssClass("wrong");
                quizWrongAlert.classList.add("show");
                quizNextBtn.addCssClass('is-disabled');
                quizNextBtn.setAttribute("disabled", "true");
            }
        });

        const updateProgress = (cb: () => void) => {
            const answeredQuestions = quizModal.getChildAsComponents(`.answered`)
            progress = (answeredQuestions.length / quizQuestionItems.length) * 100;
            quizProgressBar.setStyle({ width: `${progress}%` });
            cb();
        }

        const completeQuiz = () => {
            quizNextBtn.addCssClass('hide'); quizNextBtn.setAttribute("disabled", "true");
            quizClose.addCssClass("hide");
            quizNextLesson.removeCssClass("hide");
            // quizCompleteCourse.removeCssClass("hide");
            quizSuccess.addCssClass("show");
            quizBody.addCssClass("hide");
            if (identifyNextLesson.getTextContent().trim() === '') {
                quizFooter.addCssClass("hide");
            }
            console.log("Quiz Completed");
        }

        const navToNextQuestion = () => {
            if (quizSwiper.activeIndex !== quizSwiper.slides.length) {
                requestAnimationFrame(() => {
                    quizSwiper.slideNext();
                    quizSwiper.wrapperEl.scrollTop = 0;
                })
                console.log("Went to next question");
            }
        }
    } catch (error) {
        console.log("We think this lesson does not have a quiz.", error.message);
        return;
    }

}