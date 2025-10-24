export const GQL_ENDPOINT = window.location.hostname.includes("seattledestinationtraining.org") ? "https://seattle-lms-api.devlab.zone/api/graphql" : window.location.hostname.includes("webflow.io") ? "https://seattlelms-dev-api.devlab.zone/api/graphql" : window.location.hostname.includes("devlab.zone") ? "https://seattlelms-staging-api.devlab.zone/api/graphql" : "http://localhost:4042/api/graphql"

export const S3_BASE_URL = window.location.hostname.includes("seattledestinationtraining.org") ? "https://seattle-lms-prod.s3.amazonaws.com/" : window.location.hostname.includes("devlab.zone") ? "https://seattle-lms-dev.s3.amazonaws.com/" : "https://seattle-lms-dev.s3.amazonaws.com/";

export const ADMIN_PATHS = {
    signIn: "/admin/sign-in",
    adminVerification: "/admin/verification",
    forgotPassword: "/admin/forgot-password",
    resetPassword: "/admin/reset-password",
    dashboard: "/admin/overview",
    settings: "/admin/settings",
    userReports: "/admin/user/list",
    userListing: "/admin/user/user-listing",
    userDetails: "/admin/user/view",
    courseReports: "/admin/course/list",
    courseListing: "/admin/course/course-listing",
    courseDetail: "/admin/course/view",
    googleAnalytics: "/admin/analytics/ga",
};

export const PUBLIC_PATHS = {
    landingPage: "",
    signIn: "/user/sign-in",
    signUp: "/user/sign-up",
    userVerification: "/user/verification",
    dashboard: "/user/dashboard",
    forgotPassword: "/user/forgot-password",
    resetPassword: "/user/reset-password",
    settings: "/user/settings",
    courseList: "/user/courses",
    courseDetail: "/user/courses/(.*)",
    lessonDetail: "/lessons/(.*)",
    lessonDetailRoute: "/lessons",
    courseHighlightRoute: "/course-highlights",
    courseHighlight: "/course-highlights/(.*)",
    newsList: "/user/news",
    newsDetail: "/news/(.*)",
    newsDetailRoute: "/news",
    courseDetailRoute: "/user/courses",
    resources: "/user/resources",
    support: "/user/support",
    aiAssistant: "/user/ai-assistant"
};

const WORDS_PER_MINUTE = 200;

export const EXPERT_BADGE_LINK = "https://seattle-lms-prod.s3.us-east-2.amazonaws.com/public/Destination_Expert_Badge.png";