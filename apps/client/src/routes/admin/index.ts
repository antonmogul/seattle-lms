import { WFRoute, navigate } from "@xatom/core"
import { ADMIN_PATHS } from "../../config"
import { adminAuth, adminMiddleware } from "../../auth/admin"
import { adminSidebar } from "../../modules/admin/adminSidebar";

const adminRoutes = () => {
    new WFRoute(ADMIN_PATHS.signIn).withMiddleware(adminMiddleware, "NONE", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: ADMIN_PATHS.dashboard,
                type: "replace",
            });
        },
    }).execute(
        () => import("../../modules/admin/adminSignIn").then(({adminSignIn}) => {adminSignIn()})
    );

    new WFRoute(ADMIN_PATHS.forgotPassword).withMiddleware(adminMiddleware, "NONE", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: ADMIN_PATHS.dashboard,
                type: "replace",
            });
        },
    }).execute(
        () => import("../../modules/admin/forgotPassword").then(({adminForgotPassword}) => {adminForgotPassword()})
    );

    new WFRoute(ADMIN_PATHS.resetPassword).withMiddleware(adminMiddleware, "NONE", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: ADMIN_PATHS.dashboard,
                type: "replace",
            });
        },
    }).execute(
        () => import("../../modules/admin/resetPassword").then(({adminResetPassword}) => {adminResetPassword()})
    );

    new WFRoute(ADMIN_PATHS.adminVerification).withMiddleware(adminMiddleware, "NONE", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: ADMIN_PATHS.dashboard,
                type: "replace",
            });
        },
    }).execute(
        (param: any) => import("../../modules/admin/adminVerification").then(({adminVerification}) => {adminVerification(param)})
    );
    
    if (adminAuth.isLoggedIn()) {
        adminSidebar();
    }
    
    new WFRoute(ADMIN_PATHS.dashboard).withMiddleware(adminMiddleware, "ADMIN", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: ADMIN_PATHS.signIn,
                type: "replace",
            });
        },
    }).execute(
        () => import("../../modules/admin/dashboard").then(({adminDashboard}) => { adminDashboard()})
    );

    new WFRoute(ADMIN_PATHS.settings).withMiddleware(adminMiddleware, "ADMIN", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: ADMIN_PATHS.signIn,
                type: "replace",
            });
        },
    }).execute(
        () => import("../../modules/admin/adminSettings").then(({adminSettings}) => {adminSettings()})
    );
    
    new WFRoute(ADMIN_PATHS.googleAnalytics).withMiddleware(adminMiddleware, "ADMIN", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: ADMIN_PATHS.signIn,
                type: "replace",
            });
        },
    }).execute(
        (param: any) => import("../../modules/admin/googleAnalytics").then(({googleAnalytics}) => {googleAnalytics(param)})
    );

    new WFRoute(ADMIN_PATHS.userReports).withMiddleware(adminMiddleware, "ADMIN", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: ADMIN_PATHS.signIn,
                type: "replace",
            });
        },
    }).execute(
        () => import("../../modules/admin/userReports").then(({userReports}) => {userReports()})
    );

    new WFRoute(ADMIN_PATHS.userListing).withMiddleware(adminMiddleware, "ADMIN", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: ADMIN_PATHS.signIn,
                type: "replace",
            });
        },
    }).execute(
        () => import("../../modules/admin/userList").then(({userList}) => {userList()})
    );

    new WFRoute(ADMIN_PATHS.userDetails).withMiddleware(adminMiddleware, "ADMIN", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: ADMIN_PATHS.signIn,
                type: "replace",
            });
        },
    }).execute(
        (param: any) => import("../../modules/admin/userDetail").then(({userDetails}) => {userDetails(param)})
    );

    new WFRoute(ADMIN_PATHS.courseReports).withMiddleware(adminMiddleware, "ADMIN", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: ADMIN_PATHS.signIn,
                type: "replace",
            });
        },
    }).execute(
        () => import("../../modules/admin/courseReports").then(({courseReportsPage}) => {courseReportsPage()})
    );

    new WFRoute(ADMIN_PATHS.courseListing).withMiddleware(adminMiddleware, "ADMIN", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: ADMIN_PATHS.signIn,
                type: "replace",
            });
        },
    }).execute(
        () => import("../../modules/admin/courseList").then(({courseListingPage}) => {courseListingPage()})
    );

    new WFRoute(ADMIN_PATHS.courseDetail).withMiddleware(adminMiddleware, "ADMIN", "allow", {
        onError: () => {
            console.log("err");
            navigate({
                to: ADMIN_PATHS.signIn,
                type: "replace",
            });
        },
    }).execute(
        (param: any) => import("../../modules/admin/courseDetail").then(({courseDetailPage}) => {courseDetailPage(param)})
    );
    
}


export default adminRoutes;