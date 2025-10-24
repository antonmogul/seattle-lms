import { WFRoute, navigate } from "@xatom/core";
import { PUBLIC_PATHS } from "../../config";
import { publicAuth, publicMiddleware } from "../../auth/public";
import { userSidebar } from "../../modules/public/userSidebar";

const publicRoutes = () => {
    new WFRoute(PUBLIC_PATHS.landingPage).execute(() => import("../../modules/public/landing").then(({ landing }) => { landing() }));

    new WFRoute(PUBLIC_PATHS.signIn)
        .withMiddleware(publicMiddleware, "NONE", "allow", {
            onError: () => {
                console.log("err");
                navigate({
                    to: PUBLIC_PATHS.dashboard,
                    type: "replace",
                });
            },
        })
        .execute((param: any) => import("../../modules/public/userSignIn").then(({userSignIn}) => {userSignIn(param)}));


    new WFRoute(PUBLIC_PATHS.signUp).withMiddleware(publicMiddleware, "NONE", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: PUBLIC_PATHS.dashboard,
                type: "replace",
            });
        },
    }).execute(
        () => import("../../modules/public/userSignUp").then(({userSignup}) => {userSignup()})
    );


    new WFRoute(PUBLIC_PATHS.forgotPassword).withMiddleware(publicMiddleware, "NONE", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: PUBLIC_PATHS.dashboard,
                type: "replace",
            });
        },
    }).execute(
        () => import("../../modules/public/forgotPassword").then(({userForgotPassword}) => {userForgotPassword()})
    );

    new WFRoute(PUBLIC_PATHS.resetPassword).withMiddleware(publicMiddleware, "NONE", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: PUBLIC_PATHS.dashboard,
                type: "replace",
            });
        },
    }).execute(
        (param: any) => import("../../modules/public/resetPassword").then(({userResetPassword}) => {userResetPassword(param)})
    );

    new WFRoute(PUBLIC_PATHS.userVerification).withMiddleware(publicMiddleware, "NONE", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: PUBLIC_PATHS.dashboard,
                type: "replace",
            });
        },
    }).execute(
        (param: any) => import("../../modules/public/userVerification").then(({userVerification}) => {userVerification(param)})
    );

    if (publicAuth.isLoggedIn()) {
        userSidebar();
    }
    
    new WFRoute(PUBLIC_PATHS.dashboard).withMiddleware(publicMiddleware, "USER", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: PUBLIC_PATHS.signIn,
                type: "replace",
            });
        },
    }).execute(
        () => import("../../modules/public/dashboard").then(({userDashboard}) => {userDashboard()})
    );

    new WFRoute(PUBLIC_PATHS.settings).withMiddleware(publicMiddleware, "USER", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: PUBLIC_PATHS.signIn,
                type: "replace",
            });
        },
    }).execute(
        () => import("../../modules/public/userSettings").then(({userSettings}) => {userSettings()})
    );

    new WFRoute(PUBLIC_PATHS.courseHighlight).withMiddleware(publicMiddleware, "USER", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: PUBLIC_PATHS.signIn,
                type: "replace",
            });
        },
    }).execute(
        () => import("../../modules/public/courseHighlights").then(({courseHighlights}) => {courseHighlights()})
    );

    new WFRoute(PUBLIC_PATHS.lessonDetail).withMiddleware(publicMiddleware, "USER", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: PUBLIC_PATHS.signIn,
                type: "replace",
            });
        },
    }).execute(
        () => import("../../modules/public/lessonDetail").then(({lessonDetail}) => {lessonDetail()})
    );
    
    new WFRoute(PUBLIC_PATHS.courseDetail).withMiddleware(publicMiddleware, "USER", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: PUBLIC_PATHS.signIn,
                type: "replace",
            });
        },
    }).execute(
        () => import("../../modules/public/courseDetail").then(({courseDetail}) => {courseDetail()})
    );

    new WFRoute(PUBLIC_PATHS.courseList).withMiddleware(publicMiddleware, "USER", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: PUBLIC_PATHS.signIn,
                type: "replace",
            });
        },
    }).execute(
        () => import("../../modules/public/courseList").then(({courseList}) => {courseList()})
    );
    

    new WFRoute(PUBLIC_PATHS.newsDetail).execute(
        () => import("../../modules/public/newsDetails").then(({newsDetails}) => {newsDetails()})
    );
    
    new WFRoute(PUBLIC_PATHS.newsList).execute(
        () => import("../../modules/public/newsList").then(({newsList}) => {newsList()})
    );

    new WFRoute(PUBLIC_PATHS.resources).withMiddleware(publicMiddleware, "USER", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: PUBLIC_PATHS.signIn,
                type: "replace",
            });
        },
    }).execute(
        () => import("../../modules/public/blank").then(({blankPage}) => {blankPage()})
    );

    new WFRoute(PUBLIC_PATHS.support).withMiddleware(publicMiddleware, "USER", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: PUBLIC_PATHS.signIn,
                type: "replace",
            });
        },
    }).execute(
        () => import("../../modules/public/blank").then(({blankPage}) => {blankPage()})
    );

    new WFRoute(PUBLIC_PATHS.aiAssistant).withMiddleware(publicMiddleware, "USER", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: PUBLIC_PATHS.signIn,
                type: "replace",
            });
        },
    }).execute(
        () => import("../../modules/public/blank").then(({blankPage}) => {blankPage()})
    );
};

export default publicRoutes;
