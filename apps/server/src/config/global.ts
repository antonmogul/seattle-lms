export const isProduction =
  process.env.NODE_ENV === "production";

export const API_PORT = isProduction ? 4043 : 4042;

export const API_URL = "/api/";

export const GRAPHQL_URL = "/api/graphql";

export const CORS_CONFIG = isProduction
  ? {
      credentials: true,
      origin: [
        "https://seattle-lms.webflow.io",
        "https://www.seattledestinationtraining.org"
      ],
    }
  : {
      credentials: true,
      origin: [
        "http://localhost:3021",
        "http://localhost:4042",
        "http://localhost:4043",
        "https://studio.apollographql.com",
        "https://seattle-lms.webflow.io",
        "https://www.seattledestinationtraining.org"
      ],
    };

export const COOKIE_PREFIX = "@slms";

export const HASH_SALT = 10;

export const JWT_SECRET = process.env.JWT_SECRET || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M";

export const POSTMARK_EMAIL_API_ENDPOINT = "https://api.postmarkapp.com";

export const POSTMARK_FROM_EMAIL = "tourism@visitseattle.org";

export const COMPANY_NAME = "Seattle LMS"

export const S3_SIGNED_URL_EXPIRATION_TIME = 60 * 60; // 1 hour

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";

export const GOOGLE_SECRET = process.env.GOOGLE_SECRET || "";

export const GOOGLE_LOGIN_CLIENT_REDIRECT = isProduction ? "https://www.seattledestinationtraining.org/user/sign-in" : "https://seattle-lms.webflow.io/user/sign-in"

export const GA_REDIRECT_URL = isProduction ? "https://seattle-lms-api.devlab.zone/ga/callback" : process.env.ENVIRONMENT === "staging" ? "https://seattle-staging-api.devlab.zone/ga/callback" : "https://seattlelms-dev-api.devlab.zone/ga/callback"

export const GA_REDIRECT_TO_ADMIN_URL = isProduction ? "https://www.seattledestinationtraining.org/admin/analytics/ga" : process.env.ENVIRONMENT === "staging" ? "https://seattle-staging.devlab.zone/admin/analytics/ga" : "https://seattle-lms.webflow.io/admin/analytics/ga";

export const GA_PROPERTY_ID = "435888634";

export const webflowCollections = {
  Courses: "65dc113ddc87e7e9e5250a6f",
  Lessons: "65dc113ddc87e7e9e5250a90",
  CourseHighlights: "65dc113ddc87e7e9e5250ab3",
  Quizzes: "65dc113ddc87e7e9e5250adb",
  Resources: "65dc113ddc87e7e9e5250af4",
  News: "65dc113ddc87e7e9e5250b0c",
  Tags: "65dc113ddc87e7e9e5250b25",
  Authors: "65dc113ddc87e7e9e5250b3a"
}

export enum webflowCMSCollections {
  Courses = "Courses",
  Lessons = "Lessons",
  CourseHighlights = "CourseHighlights",
  Quizzes = "Quizzes",
  Resources = "Resources",
  News = "News",
  Tags = "Tags",
  Authors = "Authors"
}

export const WEBFLOW_API_BASE_URL = "https://api.webflow.com/v2";

export const WEBFLOW_API_BETA_URL = "https://api.webflow.com/beta";

export const WEBFLOW_SITE_ID = "65dc113ddc87e7e9e5250a46";

export const CLIENT_URL = isProduction ? "https://www.seattledestinationtraining.org" : process.env.ENVIRONMENT === "staging" ? "https://seattle-lms-staging.devlab.zone" : "https://seattle-lms.webflow.io";

export const WELCOME_EMAIL_TEMPLATE_ID = "35123707";

export const OTP_EMAIL_TEMPLATE_ID = "35212422";

export const RESET_PASS_EMAIL_TEMPLATE_ID = "35212553";
