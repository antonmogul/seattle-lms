import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: File;
};

export type AdminCourseList = {
  __typename?: 'AdminCourseList';
  _count?: Maybe<CourseCount>;
  comingSoon: Scalars['Boolean'];
  courseProgress?: Maybe<Array<CourseProgress>>;
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  lessonCount: Scalars['Int'];
  lessons?: Maybe<Array<Lesson>>;
  name: Scalars['String'];
  readTime?: Maybe<Scalars['Int']>;
  slug: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  wid: Scalars['String'];
};

export type AdminCourseProgressUserDetails = {
  __typename?: 'AdminCourseProgressUserDetails';
  _count?: Maybe<CourseProgressCount>;
  completedAt?: Maybe<Scalars['DateTime']>;
  courseId: Scalars['String'];
  courseWId: Scalars['String'];
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  status: CourseStatus;
  updatedAt?: Maybe<Scalars['DateTime']>;
  user?: Maybe<User>;
  userId: Scalars['String'];
};

export type AdminCourseUserDetailResponse = {
  __typename?: 'AdminCourseUserDetailResponse';
  data: AdminCourseUserDetails;
  pageNo: Scalars['Float'];
  totalRecords: Scalars['Float'];
};

export type AdminCourseUserDetails = {
  __typename?: 'AdminCourseUserDetails';
  _count?: Maybe<CourseCount>;
  comingSoon: Scalars['Boolean'];
  courseProgress?: Maybe<Array<AdminCourseProgressUserDetails>>;
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  lessonCount: Scalars['Int'];
  name: Scalars['String'];
  readTime?: Maybe<Scalars['Int']>;
  slug: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  wid: Scalars['String'];
};

export type AdminLoginResponse = {
  __typename?: 'AdminLoginResponse';
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  message: Scalars['String'];
  token?: Maybe<Scalars['String']>;
};

export type AdminMeResponse = {
  __typename?: 'AdminMeResponse';
  avatar: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};

export type AdminSingleCourseDetails = {
  __typename?: 'AdminSingleCourseDetails';
  _count?: Maybe<CourseCount>;
  comingSoon: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  lessonCount: Scalars['Int'];
  lessons?: Maybe<Array<Lesson>>;
  name: Scalars['String'];
  readTime?: Maybe<Scalars['Int']>;
  slug: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  wid: Scalars['String'];
};

export type AdminSingleUserDetails = {
  __typename?: 'AdminSingleUserDetails';
  user: AdminUserDetails;
};

export type AdminUserActivityResponse = {
  __typename?: 'AdminUserActivityResponse';
  completedCourses: Scalars['Float'];
  startedCourses: Scalars['Float'];
};

export type AdminUserCourseDetails = {
  __typename?: 'AdminUserCourseDetails';
  _count?: Maybe<CourseProgressCount>;
  completedAt?: Maybe<Scalars['DateTime']>;
  course?: Maybe<Course>;
  courseId: Scalars['String'];
  courseWId: Scalars['String'];
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  lessonProgress?: Maybe<Array<AdminUserLessonDetails>>;
  status: CourseStatus;
  updatedAt?: Maybe<Scalars['DateTime']>;
  userId: Scalars['String'];
};

export type AdminUserCoursesDetails = {
  __typename?: 'AdminUserCoursesDetails';
  _count?: Maybe<UserCount>;
  avatar: Scalars['String'];
  company?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  courseProgress?: Maybe<Array<AdminUserCourseDetails>>;
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  enabled: Scalars['Boolean'];
  expertBadgeUnlocked: Scalars['Boolean'];
  firstName: Scalars['String'];
  id: Scalars['String'];
  isGoogleLogin: Scalars['Boolean'];
  jobTitle?: Maybe<Scalars['String']>;
  lastLoginAt: Scalars['DateTime'];
  lastName: Scalars['String'];
  newsletterOptIn: Scalars['Boolean'];
  numberOfOTPSent: Scalars['Int'];
  password?: Maybe<Scalars['String']>;
  tokenVersion: Scalars['Int'];
  updatedAt: Scalars['DateTime'];
};

export type AdminUserDetails = {
  __typename?: 'AdminUserDetails';
  _count?: Maybe<UserCount>;
  avatar: Scalars['String'];
  company?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  courseProgress?: Maybe<Array<CourseProgress>>;
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  enabled: Scalars['Boolean'];
  expertBadgeUnlocked: Scalars['Boolean'];
  firstName: Scalars['String'];
  id: Scalars['String'];
  isGoogleLogin: Scalars['Boolean'];
  jobTitle?: Maybe<Scalars['String']>;
  lastLoginAt: Scalars['DateTime'];
  lastName: Scalars['String'];
  newsletterOptIn: Scalars['Boolean'];
  numberOfOTPSent: Scalars['Int'];
  password?: Maybe<Scalars['String']>;
  tokenVersion: Scalars['Int'];
  updatedAt: Scalars['DateTime'];
};

export type AdminUserLessonDetails = {
  __typename?: 'AdminUserLessonDetails';
  completedAt?: Maybe<Scalars['DateTime']>;
  courseProgressId: Scalars['String'];
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  lesson?: Maybe<Lesson>;
  lessonId: Scalars['String'];
  lessonWId: Scalars['String'];
  status: LessonStatus;
  updatedAt?: Maybe<Scalars['DateTime']>;
  userId: Scalars['String'];
};

export type Course = {
  __typename?: 'Course';
  _count?: Maybe<CourseCount>;
  comingSoon: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  lessonCount: Scalars['Int'];
  name: Scalars['String'];
  readTime?: Maybe<Scalars['Int']>;
  slug: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  wid: Scalars['String'];
};

export type CourseCompletionRateResponse = {
  __typename?: 'CourseCompletionRateResponse';
  completions: Scalars['Float'];
  courseTitle: Scalars['String'];
};

export type CourseCount = {
  __typename?: 'CourseCount';
  courseProgress: Scalars['Int'];
  lessons: Scalars['Int'];
};

export type CourseProgress = {
  __typename?: 'CourseProgress';
  _count?: Maybe<CourseProgressCount>;
  completedAt?: Maybe<Scalars['DateTime']>;
  courseId: Scalars['String'];
  courseWId: Scalars['String'];
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  status: CourseStatus;
  updatedAt?: Maybe<Scalars['DateTime']>;
  userId: Scalars['String'];
};

export type CourseProgressCount = {
  __typename?: 'CourseProgressCount';
  lessonProgress: Scalars['Int'];
};

export type CoursesDataResponse = {
  __typename?: 'CoursesDataResponse';
  coursesCompleted: Scalars['Float'];
  coursesNotCompleted: Scalars['Float'];
  coursesNotStarted: Scalars['Float'];
};

export type GaConnection = {
  __typename?: 'GAConnection';
  access_token: Scalars['String'];
  created_at: Scalars['DateTime'];
  email: Scalars['String'];
  expiry_date: Scalars['String'];
  id: Scalars['String'];
  refresh_token: Scalars['String'];
  status: GaConnectionStatuses;
  updated_at: Scalars['DateTime'];
};

export enum GaConnectionStatuses {
  Connected = 'CONNECTED',
  Disconnected = 'DISCONNECTED',
  Error = 'ERROR'
}

export type GaReportHeaders = {
  __typename?: 'GAReportHeaders';
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type GaReportMetaData = {
  __typename?: 'GAReportMetaData';
  currencyCode?: Maybe<Scalars['String']>;
  timeZone?: Maybe<Scalars['String']>;
};

export type GaReportResponse = {
  __typename?: 'GAReportResponse';
  dimensionHeaders?: Maybe<Array<GaReportHeaders>>;
  kind?: Maybe<Scalars['String']>;
  metadata?: Maybe<GaReportMetaData>;
  metricHeaders?: Maybe<Array<GaReportHeaders>>;
  rowCount?: Maybe<Scalars['Float']>;
  rows?: Maybe<Array<GaReportValues>>;
  totals?: Maybe<Array<GaReportValues>>;
};

export type GaReportValues = {
  __typename?: 'GAReportValues';
  dimensionValues?: Maybe<Array<GaReportValuesMetaData>>;
  metricValues?: Maybe<Array<GaReportValuesMetaData>>;
};

export type GaReportValuesMetaData = {
  __typename?: 'GAReportValuesMetaData';
  value?: Maybe<Scalars['String']>;
};

export type Lesson = {
  __typename?: 'Lesson';
  _count?: Maybe<LessonCount>;
  courseId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  lessonContent: Scalars['String'];
  name: Scalars['String'];
  readTime?: Maybe<Scalars['Int']>;
  slug: Scalars['String'];
  tag: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  wid: Scalars['String'];
};

export type LessonCount = {
  __typename?: 'LessonCount';
  lessonProgress: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  adminChangePassword: AdminLoginResponse;
  adminCreate: Scalars['Boolean'];
  adminDeleteAvatar: Scalars['Boolean'];
  adminForgotPassword: AdminLoginResponse;
  adminLogin: AdminLoginResponse;
  adminManualSyncTrigger: Scalars['Boolean'];
  adminResendOTP: AdminLoginResponse;
  adminResetPassword: Scalars['Boolean'];
  adminUpdateUserStatus: User;
  adminUploadAvatar: Scalars['String'];
  adminVerifyLoginOTP: AdminLoginResponse;
  adminVerifyResetPasswordOTP: Scalars['String'];
  publicChangePassword: PublicChangePasswordResponse;
  publicDeleteAvatar: Scalars['Boolean'];
  publicForgotPassword: PublicLoginResponse;
  publicLogin: PublicLoginResponse;
  publicResendOTP: PublicLoginResponse;
  publicResetPassword: Scalars['Boolean'];
  publicSSOLogin: PublicLoginResponse;
  publicSignup: PublicLoginResponse;
  publicUploadAvatar: Scalars['String'];
  publicVerifyResetPasswordOTP: Scalars['String'];
  setExpertBadgeUnlocked: Scalars['Boolean'];
  signInWithGoogle: PublicAuthResponse;
  signUpWithGoogle: PublicAuthResponse;
  startLesson: Scalars['Boolean'];
  unlinkGAConnection: Scalars['Boolean'];
  updateLessonStatus: Scalars['Boolean'];
  updateReadTime: Scalars['Boolean'];
  verifyLoginOTP: PublicLoginResponse;
  verifySignupOTP: PublicLoginResponse;
};


export type MutationAdminChangePasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type MutationAdminCreateArgs = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
};


export type MutationAdminForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationAdminLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationAdminResendOtpArgs = {
  OTPType: Scalars['String'];
  email: Scalars['String'];
};


export type MutationAdminResetPasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationAdminUpdateUserStatusArgs = {
  status: Scalars['Boolean'];
  userId: Scalars['String'];
};


export type MutationAdminUploadAvatarArgs = {
  file: Scalars['Upload'];
};


export type MutationAdminVerifyLoginOtpArgs = {
  email: Scalars['String'];
  otp: Scalars['String'];
  rememberMe: Scalars['Boolean'];
};


export type MutationAdminVerifyResetPasswordOtpArgs = {
  email: Scalars['String'];
  otp: Scalars['String'];
};


export type MutationPublicChangePasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type MutationPublicForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationPublicLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationPublicResendOtpArgs = {
  OTPType: Scalars['String'];
  email: Scalars['String'];
};


export type MutationPublicResetPasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationPublicSsoLoginArgs = {
  email: Scalars['String'];
};


export type MutationPublicSignupArgs = {
  company?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  firstName: Scalars['String'];
  jobTitle?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  newsletterOptIn?: InputMaybe<Scalars['Boolean']>;
  password?: InputMaybe<Scalars['String']>;
};


export type MutationPublicUploadAvatarArgs = {
  file: Scalars['Upload'];
};


export type MutationPublicVerifyResetPasswordOtpArgs = {
  email: Scalars['String'];
  otp: Scalars['String'];
};


export type MutationSignInWithGoogleArgs = {
  token: Scalars['String'];
};


export type MutationSignUpWithGoogleArgs = {
  token: Scalars['String'];
};


export type MutationStartLessonArgs = {
  courseId: Scalars['String'];
  lessonId: Scalars['String'];
};


export type MutationUpdateLessonStatusArgs = {
  courseId: Scalars['String'];
  isLastLesson?: InputMaybe<Scalars['Boolean']>;
  lessonId: Scalars['String'];
  status: Scalars['String'];
};


export type MutationUpdateReadTimeArgs = {
  courseId: Scalars['String'];
  lessonId: Scalars['String'];
  readTime: Scalars['Float'];
};


export type MutationVerifyLoginOtpArgs = {
  email: Scalars['String'];
  otp: Scalars['String'];
  rememberMe: Scalars['Boolean'];
};


export type MutationVerifySignupOtpArgs = {
  email: Scalars['String'];
  otp: Scalars['String'];
  rememberMe: Scalars['Boolean'];
};

export type PublicAuthResponse = {
  __typename?: 'PublicAuthResponse';
  data: User;
  token: Scalars['String'];
};

export type PublicChangePasswordResponse = {
  __typename?: 'PublicChangePasswordResponse';
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  token: Scalars['String'];
};

export type PublicCourseProgressResponse = {
  __typename?: 'PublicCourseProgressResponse';
  _count?: Maybe<CourseProgressCount>;
  completedAt?: Maybe<Scalars['DateTime']>;
  course?: Maybe<Course>;
  courseId: Scalars['String'];
  courseWId: Scalars['String'];
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  lessonProgress?: Maybe<Array<PublicLessonProgressLesson>>;
  status: CourseStatus;
  updatedAt?: Maybe<Scalars['DateTime']>;
  userId: Scalars['String'];
};

export type PublicLessonProgressLesson = {
  __typename?: 'PublicLessonProgressLesson';
  completedAt?: Maybe<Scalars['DateTime']>;
  courseProgressId: Scalars['String'];
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  lesson?: Maybe<Lesson>;
  lessonId: Scalars['String'];
  lessonWId: Scalars['String'];
  status: LessonStatus;
  updatedAt?: Maybe<Scalars['DateTime']>;
  userId: Scalars['String'];
};

export type PublicLessonProgressResponse = {
  __typename?: 'PublicLessonProgressResponse';
  completedAt?: Maybe<Scalars['DateTime']>;
  courseProgress?: Maybe<CourseProgress>;
  courseProgressId: Scalars['String'];
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  lesson?: Maybe<Lesson>;
  lessonId: Scalars['String'];
  lessonWId: Scalars['String'];
  status: LessonStatus;
  updatedAt?: Maybe<Scalars['DateTime']>;
  userId: Scalars['String'];
};

export type PublicLoginResponse = {
  __typename?: 'PublicLoginResponse';
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  message: Scalars['String'];
  token?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  adminExportUsersCSV: Scalars['String'];
  adminGetAllCourses: Array<AdminCourseList>;
  adminGetAllUsers: UserListResponse;
  adminGetCourse: AdminSingleCourseDetails;
  adminGetCourseUserDetails: AdminCourseUserDetailResponse;
  adminGetUser: AdminSingleUserDetails;
  adminGetUserProgress: AdminUserCoursesDetails;
  adminMe: AdminMeResponse;
  adminUserActivityCourseDetails: AdminUserActivityResponse;
  checkAllCoursesCompleted: Scalars['Boolean'];
  getActiveUsers: UsersDataResponseWithTotal;
  getAllCoursesProgress: Array<PublicCourseProgressResponse>;
  getAllLessonsProgress: Array<PublicLessonProgressResponse>;
  getCourseCompletionReport: Array<CourseCompletionRateResponse>;
  getCourseProgressByCourseId: PublicCourseProgressResponse;
  getCoursesReportData: CoursesDataResponse;
  getGAByCountryReport: GaReportResponse;
  getGAConnectionStatus: GaConnection;
  getGAEventsReport: GaReportResponse;
  getGAPageViewsReport: GaReportResponse;
  getGAReport: GaReportResponse;
  getGARunTimeReport: GaReportResponse;
  getGoogleAuthURL: Scalars['String'];
  getLessonProgressById: PublicLessonProgressResponse;
  getNewSignups: Array<UsersDataResponse>;
  userMe: UserMeResponse;
};


export type QueryAdminExportUsersCsvArgs = {
  joiningEndDate?: InputMaybe<Scalars['String']>;
  joiningStartDate?: InputMaybe<Scalars['String']>;
  lastLoginEndDate?: InputMaybe<Scalars['String']>;
  lastLoginStartDate?: InputMaybe<Scalars['String']>;
  searchTerm?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['Boolean']>;
};


export type QueryAdminGetAllCoursesArgs = {
  courseCompleteEndDate?: InputMaybe<Scalars['String']>;
  courseCompleteStartDate?: InputMaybe<Scalars['String']>;
  courseStartEndDate?: InputMaybe<Scalars['String']>;
  courseStartStartDate?: InputMaybe<Scalars['String']>;
  searchTerm?: InputMaybe<Scalars['String']>;
  sortFilter?: InputMaybe<Scalars['String']>;
};


export type QueryAdminGetAllUsersArgs = {
  joiningEndDate?: InputMaybe<Scalars['String']>;
  joiningStartDate?: InputMaybe<Scalars['String']>;
  lastLoginEndDate?: InputMaybe<Scalars['String']>;
  lastLoginStartDate?: InputMaybe<Scalars['String']>;
  noOfRecords: Scalars['Float'];
  pageNo: Scalars['Float'];
  searchTerm?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['Boolean']>;
};


export type QueryAdminGetCourseArgs = {
  courseId: Scalars['String'];
};


export type QueryAdminGetCourseUserDetailsArgs = {
  courseId: Scalars['String'];
  courseStatus?: InputMaybe<Scalars['String']>;
  joiningEndDate?: InputMaybe<Scalars['String']>;
  joiningStartDate?: InputMaybe<Scalars['String']>;
  lastLoginEndDate?: InputMaybe<Scalars['String']>;
  lastLoginStartDate?: InputMaybe<Scalars['String']>;
  noOfRecords: Scalars['Float'];
  pageNo: Scalars['Float'];
  searchTerm?: InputMaybe<Scalars['String']>;
  userStatus?: InputMaybe<Scalars['Boolean']>;
};


export type QueryAdminGetUserArgs = {
  userId: Scalars['String'];
};


export type QueryAdminGetUserProgressArgs = {
  courseStatus?: InputMaybe<Scalars['String']>;
  userId: Scalars['String'];
};


export type QueryAdminUserActivityCourseDetailsArgs = {
  courseCompleteEndDate?: InputMaybe<Scalars['String']>;
  courseCompleteStartDate?: InputMaybe<Scalars['String']>;
  courseId: Scalars['String'];
  courseStartEndDate?: InputMaybe<Scalars['String']>;
  courseStartStartDate?: InputMaybe<Scalars['String']>;
};


export type QueryGetActiveUsersArgs = {
  filter: Scalars['String'];
};


export type QueryGetAllLessonsProgressArgs = {
  courseId: Scalars['String'];
};


export type QueryGetCourseProgressByCourseIdArgs = {
  courseId: Scalars['String'];
};


export type QueryGetCoursesReportDataArgs = {
  courseId?: InputMaybe<Scalars['String']>;
};


export type QueryGetGaByCountryReportArgs = {
  dateRanges: Array<Scalars['String']>;
};


export type QueryGetGaEventsReportArgs = {
  dateRanges: Array<Scalars['String']>;
};


export type QueryGetGaPageViewsReportArgs = {
  dateRanges: Array<Scalars['String']>;
};


export type QueryGetGaReportArgs = {
  dateRanges: Array<Scalars['String']>;
};


export type QueryGetGaRunTimeReportArgs = {
  minuteRanges: Array<Scalars['String']>;
};


export type QueryGetLessonProgressByIdArgs = {
  courseId: Scalars['String'];
  lessonId: Scalars['String'];
};


export type QueryGetNewSignupsArgs = {
  filter: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  _count?: Maybe<UserCount>;
  avatar: Scalars['String'];
  company?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  enabled: Scalars['Boolean'];
  expertBadgeUnlocked: Scalars['Boolean'];
  firstName: Scalars['String'];
  id: Scalars['String'];
  isGoogleLogin: Scalars['Boolean'];
  jobTitle?: Maybe<Scalars['String']>;
  lastLoginAt: Scalars['DateTime'];
  lastName: Scalars['String'];
  newsletterOptIn: Scalars['Boolean'];
  numberOfOTPSent: Scalars['Int'];
  password?: Maybe<Scalars['String']>;
  tokenVersion: Scalars['Int'];
  updatedAt: Scalars['DateTime'];
};

export type UserCount = {
  __typename?: 'UserCount';
  courseProgress: Scalars['Int'];
  lessonProgress: Scalars['Int'];
};

export type UserListResponse = {
  __typename?: 'UserListResponse';
  data: Array<User>;
  pageNo: Scalars['Float'];
  totalRecords: Scalars['Float'];
};

export type UserMeResponse = {
  __typename?: 'UserMeResponse';
  avatar: Scalars['String'];
  company?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  enabled: Scalars['Boolean'];
  expertBadgeUnlocked: Scalars['Boolean'];
  firstName: Scalars['String'];
  isGoogleLogin: Scalars['Boolean'];
  jobTitle?: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  newsletterOptIn: Scalars['Boolean'];
};

export type UsersDataResponse = {
  __typename?: 'UsersDataResponse';
  date?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  month?: Maybe<Scalars['Float']>;
  startDate?: Maybe<Scalars['String']>;
  value: Scalars['Float'];
};

export type UsersDataResponseWithTotal = {
  __typename?: 'UsersDataResponseWithTotal';
  graphData: Array<UsersDataResponse>;
  totalActiveUsers: Scalars['Float'];
};

export enum CourseStatus {
  Complete = 'COMPLETE',
  InProgress = 'IN_PROGRESS',
  NotStarted = 'NOT_STARTED'
}

export enum LessonStatus {
  Complete = 'COMPLETE',
  InProgress = 'IN_PROGRESS',
  NotStarted = 'NOT_STARTED'
}

export type AdminLoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type AdminLoginMutation = { __typename?: 'Mutation', adminLogin: { __typename?: 'AdminLoginResponse', id?: string | null, token?: string | null, firstName?: string | null, lastName?: string | null, message: string } };

export type AdminResendLoginOtpMutationVariables = Exact<{
  email: Scalars['String'];
  OTPType: Scalars['String'];
}>;


export type AdminResendLoginOtpMutation = { __typename?: 'Mutation', adminResendOTP: { __typename?: 'AdminLoginResponse', id?: string | null, token?: string | null, firstName?: string | null, lastName?: string | null, message: string } };

export type AdminVerifyLoginOtpMutationVariables = Exact<{
  rememberMe: Scalars['Boolean'];
  otp: Scalars['String'];
  email: Scalars['String'];
}>;


export type AdminVerifyLoginOtpMutation = { __typename?: 'Mutation', adminVerifyLoginOTP: { __typename?: 'AdminLoginResponse', id?: string | null, token?: string | null, firstName?: string | null, lastName?: string | null, message: string } };

export type AdminForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type AdminForgotPasswordMutation = { __typename?: 'Mutation', adminForgotPassword: { __typename?: 'AdminLoginResponse', id?: string | null, token?: string | null, firstName?: string | null, lastName?: string | null, message: string } };

export type AdminResetPasswordMutationVariables = Exact<{
  newPassword: Scalars['String'];
  token: Scalars['String'];
}>;


export type AdminResetPasswordMutation = { __typename?: 'Mutation', adminResetPassword: boolean };

export type AdminVerifyResetPasswordOtpMutationVariables = Exact<{
  email: Scalars['String'];
  otp: Scalars['String'];
}>;


export type AdminVerifyResetPasswordOtpMutation = { __typename?: 'Mutation', adminVerifyResetPasswordOTP: string };

export type AdminMeQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminMeQuery = { __typename?: 'Query', adminMe: { __typename?: 'AdminMeResponse', firstName: string, lastName: string, email: string, avatar: string } };

export type AdminUploadAvatarMutationVariables = Exact<{
  imageFile: Scalars['Upload'];
}>;


export type AdminUploadAvatarMutation = { __typename?: 'Mutation', adminUploadAvatar: string };

export type AdminChangePasswordMutationVariables = Exact<{
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
}>;


export type AdminChangePasswordMutation = { __typename?: 'Mutation', adminChangePassword: { __typename?: 'AdminLoginResponse', token?: string | null, firstName?: string | null, lastName?: string | null } };

export type AdminGetAllCoursesQueryVariables = Exact<{
  courseCompleteEndDate?: InputMaybe<Scalars['String']>;
  courseCompleteStartDate?: InputMaybe<Scalars['String']>;
  courseStartEndDate?: InputMaybe<Scalars['String']>;
  courseStartStartDate?: InputMaybe<Scalars['String']>;
  searchTerm?: InputMaybe<Scalars['String']>;
  sortFilter?: InputMaybe<Scalars['String']>;
}>;


export type AdminGetAllCoursesQuery = { __typename?: 'Query', adminGetAllCourses: Array<{ __typename?: 'AdminCourseList', id: string, wid: string, name: string, slug: string, comingSoon: boolean, lessonCount: number, createdAt: any, updatedAt: any, lessons?: Array<{ __typename?: 'Lesson', id: string, wid: string, name: string, slug: string, tag: string, lessonContent: string, courseId: string, createdAt: any, updatedAt: any }> | null, courseProgress?: Array<{ __typename?: 'CourseProgress', id: string, courseWId: string, userId: string, courseId: string, status: CourseStatus, createdAt?: any | null, updatedAt?: any | null, completedAt?: any | null, _count?: { __typename?: 'CourseProgressCount', lessonProgress: number } | null }> | null }> };

export type AdminGetCourseQueryVariables = Exact<{
  courseId: Scalars['String'];
}>;


export type AdminGetCourseQuery = { __typename?: 'Query', adminGetCourse: { __typename?: 'AdminSingleCourseDetails', id: string, wid: string, name: string, slug: string, comingSoon: boolean, lessonCount: number, createdAt: any, updatedAt: any, lessons?: Array<{ __typename?: 'Lesson', id: string, wid: string, name: string, slug: string, lessonContent: string, courseId: string, createdAt: any, updatedAt: any }> | null } };

export type AdminGetCourseUserDetailsQueryVariables = Exact<{
  joiningEndDate?: InputMaybe<Scalars['String']>;
  joiningStartDate?: InputMaybe<Scalars['String']>;
  lastLoginEndDate?: InputMaybe<Scalars['String']>;
  lastLoginStartDate?: InputMaybe<Scalars['String']>;
  userStatus?: InputMaybe<Scalars['Boolean']>;
  courseStatus?: InputMaybe<Scalars['String']>;
  courseId: Scalars['String'];
  pageNo: Scalars['Float'];
  searchTerm?: InputMaybe<Scalars['String']>;
  noOfRecords: Scalars['Float'];
}>;


export type AdminGetCourseUserDetailsQuery = { __typename?: 'Query', adminGetCourseUserDetails: { __typename?: 'AdminCourseUserDetailResponse', pageNo: number, totalRecords: number, data: { __typename?: 'AdminCourseUserDetails', id: string, wid: string, name: string, slug: string, comingSoon: boolean, lessonCount: number, createdAt: any, updatedAt: any, courseProgress?: Array<{ __typename?: 'AdminCourseProgressUserDetails', id: string, courseWId: string, userId: string, courseId: string, status: CourseStatus, updatedAt?: any | null, user?: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, avatar: string, enabled: boolean, password?: string | null, tokenVersion: number, createdAt: any, updatedAt: any, lastLoginAt: any } | null }> | null } } };

export type AdminUserActivityCourseDetailsQueryVariables = Exact<{
  courseCompleteEndDate?: InputMaybe<Scalars['String']>;
  courseCompleteStartDate?: InputMaybe<Scalars['String']>;
  courseStartEndDate?: InputMaybe<Scalars['String']>;
  courseStartStartDate?: InputMaybe<Scalars['String']>;
  courseId: Scalars['String'];
}>;


export type AdminUserActivityCourseDetailsQuery = { __typename?: 'Query', adminUserActivityCourseDetails: { __typename?: 'AdminUserActivityResponse', startedCourses: number, completedCourses: number } };

export type AdminManualSyncTriggerMutationVariables = Exact<{ [key: string]: never; }>;


export type AdminManualSyncTriggerMutation = { __typename?: 'Mutation', adminManualSyncTrigger: boolean };

export type GetActiveUsersQueryVariables = Exact<{
  filter: Scalars['String'];
}>;


export type GetActiveUsersQuery = { __typename?: 'Query', getActiveUsers: { __typename?: 'UsersDataResponseWithTotal', totalActiveUsers: number, graphData: Array<{ __typename?: 'UsersDataResponse', date?: string | null, month?: number | null, startDate?: string | null, endDate?: string | null, value: number }> } };

export type GetNewSignupsQueryVariables = Exact<{
  filter: Scalars['String'];
}>;


export type GetNewSignupsQuery = { __typename?: 'Query', getNewSignups: Array<{ __typename?: 'UsersDataResponse', date?: string | null, month?: number | null, startDate?: string | null, endDate?: string | null, value: number }> };

export type GetCoursesReportDataQueryVariables = Exact<{
  courseId?: InputMaybe<Scalars['String']>;
}>;


export type GetCoursesReportDataQuery = { __typename?: 'Query', getCoursesReportData: { __typename?: 'CoursesDataResponse', coursesNotStarted: number, coursesNotCompleted: number, coursesCompleted: number } };

export type GetCourseCompletionReportQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCourseCompletionReportQuery = { __typename?: 'Query', getCourseCompletionReport: Array<{ __typename?: 'CourseCompletionRateResponse', courseTitle: string, completions: number }> };

export type GetAuthUrlQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAuthUrlQuery = { __typename?: 'Query', getGoogleAuthURL: string };

export type GetGaConnectionStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGaConnectionStatusQuery = { __typename?: 'Query', getGAConnectionStatus: { __typename?: 'GAConnection', id: string, email: string, created_at: any, updated_at: any, status: GaConnectionStatuses } };

export type UnlinkGaConnectionMutationVariables = Exact<{ [key: string]: never; }>;


export type UnlinkGaConnectionMutation = { __typename?: 'Mutation', unlinkGAConnection: boolean };

export type GetGaReportQueryVariables = Exact<{
  dateRanges: Array<Scalars['String']> | Scalars['String'];
}>;


export type GetGaReportQuery = { __typename?: 'Query', getGAReport: { __typename?: 'GAReportResponse', rowCount?: number | null, kind?: string | null, metadata?: { __typename?: 'GAReportMetaData', currencyCode?: string | null, timeZone?: string | null } | null, totals?: Array<{ __typename?: 'GAReportValues', dimensionValues?: Array<{ __typename?: 'GAReportValuesMetaData', value?: string | null }> | null, metricValues?: Array<{ __typename?: 'GAReportValuesMetaData', value?: string | null }> | null }> | null, rows?: Array<{ __typename?: 'GAReportValues', dimensionValues?: Array<{ __typename?: 'GAReportValuesMetaData', value?: string | null }> | null, metricValues?: Array<{ __typename?: 'GAReportValuesMetaData', value?: string | null }> | null }> | null, metricHeaders?: Array<{ __typename?: 'GAReportHeaders', name?: string | null, type?: string | null }> | null, dimensionHeaders?: Array<{ __typename?: 'GAReportHeaders', name?: string | null, type?: string | null }> | null }, getGAByCountryReport: { __typename?: 'GAReportResponse', rowCount?: number | null, kind?: string | null, metadata?: { __typename?: 'GAReportMetaData', currencyCode?: string | null, timeZone?: string | null } | null, totals?: Array<{ __typename?: 'GAReportValues', dimensionValues?: Array<{ __typename?: 'GAReportValuesMetaData', value?: string | null }> | null, metricValues?: Array<{ __typename?: 'GAReportValuesMetaData', value?: string | null }> | null }> | null, rows?: Array<{ __typename?: 'GAReportValues', dimensionValues?: Array<{ __typename?: 'GAReportValuesMetaData', value?: string | null }> | null, metricValues?: Array<{ __typename?: 'GAReportValuesMetaData', value?: string | null }> | null }> | null, metricHeaders?: Array<{ __typename?: 'GAReportHeaders', name?: string | null, type?: string | null }> | null, dimensionHeaders?: Array<{ __typename?: 'GAReportHeaders', name?: string | null, type?: string | null }> | null }, R1: { __typename?: 'GAReportResponse', rowCount?: number | null, kind?: string | null, rows?: Array<{ __typename?: 'GAReportValues', dimensionValues?: Array<{ __typename?: 'GAReportValuesMetaData', value?: string | null }> | null, metricValues?: Array<{ __typename?: 'GAReportValuesMetaData', value?: string | null }> | null }> | null, metricHeaders?: Array<{ __typename?: 'GAReportHeaders', name?: string | null, type?: string | null }> | null, dimensionHeaders?: Array<{ __typename?: 'GAReportHeaders', name?: string | null, type?: string | null }> | null }, R2: { __typename?: 'GAReportResponse', rowCount?: number | null, kind?: string | null, rows?: Array<{ __typename?: 'GAReportValues', dimensionValues?: Array<{ __typename?: 'GAReportValuesMetaData', value?: string | null }> | null, metricValues?: Array<{ __typename?: 'GAReportValuesMetaData', value?: string | null }> | null }> | null, metricHeaders?: Array<{ __typename?: 'GAReportHeaders', name?: string | null, type?: string | null }> | null, dimensionHeaders?: Array<{ __typename?: 'GAReportHeaders', name?: string | null, type?: string | null }> | null }, R3: { __typename?: 'GAReportResponse', rowCount?: number | null, kind?: string | null, rows?: Array<{ __typename?: 'GAReportValues', dimensionValues?: Array<{ __typename?: 'GAReportValuesMetaData', value?: string | null }> | null, metricValues?: Array<{ __typename?: 'GAReportValuesMetaData', value?: string | null }> | null }> | null, metricHeaders?: Array<{ __typename?: 'GAReportHeaders', name?: string | null, type?: string | null }> | null, dimensionHeaders?: Array<{ __typename?: 'GAReportHeaders', name?: string | null, type?: string | null }> | null }, getGAPageViewsReport: { __typename?: 'GAReportResponse', rowCount?: number | null, kind?: string | null, rows?: Array<{ __typename?: 'GAReportValues', dimensionValues?: Array<{ __typename?: 'GAReportValuesMetaData', value?: string | null }> | null, metricValues?: Array<{ __typename?: 'GAReportValuesMetaData', value?: string | null }> | null }> | null, metricHeaders?: Array<{ __typename?: 'GAReportHeaders', name?: string | null, type?: string | null }> | null, dimensionHeaders?: Array<{ __typename?: 'GAReportHeaders', name?: string | null, type?: string | null }> | null }, getGAEventsReport: { __typename?: 'GAReportResponse', rowCount?: number | null, kind?: string | null, rows?: Array<{ __typename?: 'GAReportValues', dimensionValues?: Array<{ __typename?: 'GAReportValuesMetaData', value?: string | null }> | null, metricValues?: Array<{ __typename?: 'GAReportValuesMetaData', value?: string | null }> | null }> | null, metricHeaders?: Array<{ __typename?: 'GAReportHeaders', name?: string | null, type?: string | null }> | null, dimensionHeaders?: Array<{ __typename?: 'GAReportHeaders', name?: string | null, type?: string | null }> | null } };

export type AdminGetAllUsersQueryVariables = Exact<{
  status?: InputMaybe<Scalars['Boolean']>;
  joiningEndDate: Scalars['String'];
  joiningStartDate: Scalars['String'];
  lastLoginEndDate: Scalars['String'];
  lastLoginStartDate: Scalars['String'];
  searchTerm: Scalars['String'];
  noOfRecords: Scalars['Float'];
  pageNo: Scalars['Float'];
}>;


export type AdminGetAllUsersQuery = { __typename?: 'Query', adminGetAllUsers: { __typename?: 'UserListResponse', totalRecords: number, data: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, email: string, avatar: string, enabled: boolean, password?: string | null, tokenVersion: number, createdAt: any, updatedAt: any, lastLoginAt: any }> } };

export type AdminGetUserQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type AdminGetUserQuery = { __typename?: 'Query', adminGetUser: { __typename?: 'AdminSingleUserDetails', user: { __typename?: 'AdminUserDetails', id: string, firstName: string, lastName: string, email: string, avatar: string, enabled: boolean, password?: string | null, tokenVersion: number, createdAt: any, updatedAt: any, lastLoginAt: any, courseProgress?: Array<{ __typename?: 'CourseProgress', id: string, courseId: string, status: CourseStatus, updatedAt?: any | null }> | null } } };

export type AdminUpdateUserStatusMutationVariables = Exact<{
  status: Scalars['Boolean'];
  userId: Scalars['String'];
}>;


export type AdminUpdateUserStatusMutation = { __typename?: 'Mutation', adminUpdateUserStatus: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, avatar: string, enabled: boolean, password?: string | null, tokenVersion: number, createdAt: any, updatedAt: any, lastLoginAt: any } };

export type AdminGetUserProgressQueryVariables = Exact<{
  courseStatus?: InputMaybe<Scalars['String']>;
  userId: Scalars['String'];
}>;


export type AdminGetUserProgressQuery = { __typename?: 'Query', adminGetUserProgress: { __typename?: 'AdminUserCoursesDetails', id: string, firstName: string, lastName: string, email: string, avatar: string, enabled: boolean, password?: string | null, tokenVersion: number, createdAt: any, updatedAt: any, lastLoginAt: any, _count?: { __typename?: 'UserCount', lessonProgress: number } | null, courseProgress?: Array<{ __typename?: 'AdminUserCourseDetails', id: string, courseWId: string, userId: string, courseId: string, status: CourseStatus, updatedAt?: any | null, _count?: { __typename?: 'CourseProgressCount', lessonProgress: number } | null, course?: { __typename?: 'Course', id: string, wid: string, name: string, slug: string, comingSoon: boolean, lessonCount: number, createdAt: any, updatedAt: any, _count?: { __typename?: 'CourseCount', lessons: number, courseProgress: number } | null } | null, lessonProgress?: Array<{ __typename?: 'AdminUserLessonDetails', id: string, lessonWId: string, lessonId: string, userId: string, courseProgressId: string, status: LessonStatus, updatedAt?: any | null, lesson?: { __typename?: 'Lesson', id: string, wid: string, name: string, slug: string, tag: string, lessonContent: string, courseId: string, createdAt: any, updatedAt: any, _count?: { __typename?: 'LessonCount', lessonProgress: number } | null } | null }> | null }> | null } };

export type AdminExportUsersCsvQueryVariables = Exact<{
  status?: InputMaybe<Scalars['Boolean']>;
  joiningEndDate?: InputMaybe<Scalars['String']>;
  joiningStartDate?: InputMaybe<Scalars['String']>;
  lastLoginEndDate?: InputMaybe<Scalars['String']>;
  lastLoginStartDate?: InputMaybe<Scalars['String']>;
  searchTerm?: InputMaybe<Scalars['String']>;
}>;


export type AdminExportUsersCsvQuery = { __typename?: 'Query', adminExportUsersCSV: string };

export type PublicLoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type PublicLoginMutation = { __typename?: 'Mutation', publicLogin: { __typename?: 'PublicLoginResponse', id?: string | null, token?: string | null, firstName?: string | null, lastName?: string | null, message: string } };

export type PublicSsoLoginMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type PublicSsoLoginMutation = { __typename?: 'Mutation', publicSSOLogin: { __typename?: 'PublicLoginResponse', id?: string | null, token?: string | null, firstName?: string | null, lastName?: string | null, message: string } };

export type PublicForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type PublicForgotPasswordMutation = { __typename?: 'Mutation', publicForgotPassword: { __typename?: 'PublicLoginResponse', id?: string | null, token?: string | null, firstName?: string | null, lastName?: string | null, message: string } };

export type PublicResetPasswordMutationVariables = Exact<{
  newPassword: Scalars['String'];
  token: Scalars['String'];
}>;


export type PublicResetPasswordMutation = { __typename?: 'Mutation', publicResetPassword: boolean };

export type PublicSignupMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  company?: InputMaybe<Scalars['String']>;
  jobTitle?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  newsletterOptIn?: InputMaybe<Scalars['Boolean']>;
}>;


export type PublicSignupMutation = { __typename?: 'Mutation', publicSignup: { __typename?: 'PublicLoginResponse', id?: string | null, token?: string | null, firstName?: string | null, lastName?: string | null, message: string } };

export type PublicResendOtpMutationVariables = Exact<{
  email: Scalars['String'];
  OTPType: Scalars['String'];
}>;


export type PublicResendOtpMutation = { __typename?: 'Mutation', publicResendOTP: { __typename?: 'PublicLoginResponse', id?: string | null, token?: string | null, firstName?: string | null, lastName?: string | null, message: string } };

export type VerifySignupOtpMutationVariables = Exact<{
  email: Scalars['String'];
  otp: Scalars['String'];
  rememberMe: Scalars['Boolean'];
}>;


export type VerifySignupOtpMutation = { __typename?: 'Mutation', verifySignupOTP: { __typename?: 'PublicLoginResponse', id?: string | null, token?: string | null, firstName?: string | null, lastName?: string | null, message: string } };

export type VerifyLoginOtpMutationVariables = Exact<{
  email: Scalars['String'];
  otp: Scalars['String'];
  rememberMe: Scalars['Boolean'];
}>;


export type VerifyLoginOtpMutation = { __typename?: 'Mutation', verifyLoginOTP: { __typename?: 'PublicLoginResponse', id?: string | null, token?: string | null, firstName?: string | null, lastName?: string | null, message: string } };

export type VerifyResetPasswordOtpMutationVariables = Exact<{
  email: Scalars['String'];
  otp: Scalars['String'];
}>;


export type VerifyResetPasswordOtpMutation = { __typename?: 'Mutation', publicVerifyResetPasswordOTP: string };

export type UserMeQueryVariables = Exact<{ [key: string]: never; }>;


export type UserMeQuery = { __typename?: 'Query', userMe: { __typename?: 'UserMeResponse', firstName: string, lastName: string, email: string, avatar: string, enabled: boolean, isGoogleLogin: boolean, expertBadgeUnlocked: boolean, company?: string | null, jobTitle?: string | null, country?: string | null, newsletterOptIn: boolean } };

export type PublicUploadAvatarMutationVariables = Exact<{
  imageFile: Scalars['Upload'];
}>;


export type PublicUploadAvatarMutation = { __typename?: 'Mutation', publicUploadAvatar: string };

export type SetExpertBadgeUnlockedMutationVariables = Exact<{ [key: string]: never; }>;


export type SetExpertBadgeUnlockedMutation = { __typename?: 'Mutation', setExpertBadgeUnlocked: boolean };

export type GetAllCoursesProgressQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCoursesProgressQuery = { __typename?: 'Query', getAllCoursesProgress: Array<{ __typename?: 'PublicCourseProgressResponse', id: string, courseId: string, userId: string, status: CourseStatus, updatedAt?: any | null, lessonProgress?: Array<{ __typename?: 'PublicLessonProgressLesson', id: string, lessonId: string, userId: string, courseProgressId: string, status: LessonStatus, updatedAt?: any | null }> | null, course?: { __typename?: 'Course', wid: string, slug: string, readTime?: number | null } | null }> };

export type GetAllLessonsProgressQueryVariables = Exact<{
  courseId: Scalars['String'];
}>;


export type GetAllLessonsProgressQuery = { __typename?: 'Query', getAllLessonsProgress: Array<{ __typename?: 'PublicLessonProgressResponse', id: string, lessonId: string, userId: string, courseProgressId: string, status: LessonStatus, courseProgress?: { __typename?: 'CourseProgress', id: string, courseId: string, userId: string, status: CourseStatus } | null, lesson?: { __typename?: 'Lesson', readTime?: number | null } | null }> };

export type GetCourseProgressByCourseIdQueryVariables = Exact<{
  courseId: Scalars['String'];
}>;


export type GetCourseProgressByCourseIdQuery = { __typename?: 'Query', getCourseProgressByCourseId: { __typename?: 'PublicCourseProgressResponse', id: string, userId: string, courseId: string, status: CourseStatus, updatedAt?: any | null, lessonProgress?: Array<{ __typename?: 'PublicLessonProgressLesson', id: string, lessonId: string, userId: string, courseProgressId: string, status: LessonStatus, updatedAt?: any | null, lesson?: { __typename?: 'Lesson', slug: string, readTime?: number | null } | null }> | null, course?: { __typename?: 'Course', readTime?: number | null } | null } };

export type GetLessonProgressByIdQueryVariables = Exact<{
  lessonId: Scalars['String'];
  courseId: Scalars['String'];
}>;


export type GetLessonProgressByIdQuery = { __typename?: 'Query', getLessonProgressById: { __typename?: 'PublicLessonProgressResponse', id: string, lessonId: string, userId: string, courseProgressId: string, status: LessonStatus, updatedAt?: any | null, courseProgress?: { __typename?: 'CourseProgress', id: string, courseId: string, userId: string, status: CourseStatus, updatedAt?: any | null } | null, lesson?: { __typename?: 'Lesson', slug: string } | null } };

export type StartLessonMutationVariables = Exact<{
  courseId: Scalars['String'];
  lessonId: Scalars['String'];
}>;


export type StartLessonMutation = { __typename?: 'Mutation', startLesson: boolean };

export type UpdateLessonStatusMutationVariables = Exact<{
  courseId: Scalars['String'];
  lessonId: Scalars['String'];
  status: Scalars['String'];
  isLastLesson: Scalars['Boolean'];
}>;


export type UpdateLessonStatusMutation = { __typename?: 'Mutation', updateLessonStatus: boolean };

export type UpdateReadTimeMutationVariables = Exact<{
  courseId: Scalars['String'];
  lessonId: Scalars['String'];
  readTime: Scalars['Float'];
}>;


export type UpdateReadTimeMutation = { __typename?: 'Mutation', updateReadTime: boolean };

export type CheckAllCoursesCompletedQueryVariables = Exact<{ [key: string]: never; }>;


export type CheckAllCoursesCompletedQuery = { __typename?: 'Query', checkAllCoursesCompleted: boolean };

export type PublicChangePasswordMutationVariables = Exact<{
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
}>;


export type PublicChangePasswordMutation = { __typename?: 'Mutation', publicChangePassword: { __typename?: 'PublicChangePasswordResponse', token: string, firstName: string, lastName: string } };


export const AdminLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<AdminLoginMutation, AdminLoginMutationVariables>;
export const AdminResendLoginOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminResendLoginOTP"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"OTPType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminResendOTP"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"OTPType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"OTPType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<AdminResendLoginOtpMutation, AdminResendLoginOtpMutationVariables>;
export const AdminVerifyLoginOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminVerifyLoginOTP"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rememberMe"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminVerifyLoginOTP"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"rememberMe"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rememberMe"}}},{"kind":"Argument","name":{"kind":"Name","value":"otp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otp"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<AdminVerifyLoginOtpMutation, AdminVerifyLoginOtpMutationVariables>;
export const AdminForgotPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminForgotPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminForgotPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<AdminForgotPasswordMutation, AdminForgotPasswordMutationVariables>;
export const AdminResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminResetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode<AdminResetPasswordMutation, AdminResetPasswordMutationVariables>;
export const AdminVerifyResetPasswordOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminVerifyResetPasswordOTP"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminVerifyResetPasswordOTP"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"otp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otp"}}}]}]}}]} as unknown as DocumentNode<AdminVerifyResetPasswordOtpMutation, AdminVerifyResetPasswordOtpMutationVariables>;
export const AdminMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]} as unknown as DocumentNode<AdminMeQuery, AdminMeQueryVariables>;
export const AdminUploadAvatarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminUploadAvatar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imageFile"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminUploadAvatar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"file"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imageFile"}}}]}]}}]} as unknown as DocumentNode<AdminUploadAvatarMutation, AdminUploadAvatarMutationVariables>;
export const AdminChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminChangePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminChangePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"oldPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<AdminChangePasswordMutation, AdminChangePasswordMutationVariables>;
export const AdminGetAllCoursesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminGetAllCourses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseCompleteEndDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseCompleteStartDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseStartEndDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseStartStartDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortFilter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminGetAllCourses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseCompleteEndDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseCompleteEndDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseCompleteStartDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseCompleteStartDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseStartEndDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseStartEndDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseStartStartDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseStartStartDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchTerm"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"wid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"comingSoon"}},{"kind":"Field","name":{"kind":"Name","value":"lessonCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lessons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"wid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}},{"kind":"Field","name":{"kind":"Name","value":"lessonContent"}},{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"courseProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"courseWId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}},{"kind":"Field","name":{"kind":"Name","value":"_count"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lessonProgress"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AdminGetAllCoursesQuery, AdminGetAllCoursesQueryVariables>;
export const AdminGetCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminGetCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminGetCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"wid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"comingSoon"}},{"kind":"Field","name":{"kind":"Name","value":"lessonCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lessons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"wid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"lessonContent"}},{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<AdminGetCourseQuery, AdminGetCourseQueryVariables>;
export const AdminGetCourseUserDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminGetCourseUserDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"joiningEndDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"joiningStartDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastLoginEndDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastLoginStartDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"noOfRecords"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminGetCourseUserDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"joiningEndDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"joiningEndDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"joiningStartDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"joiningStartDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastLoginEndDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastLoginEndDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastLoginStartDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastLoginStartDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"userStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageNo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNo"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchTerm"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}},{"kind":"Argument","name":{"kind":"Name","value":"noOfRecords"},"value":{"kind":"Variable","name":{"kind":"Name","value":"noOfRecords"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"wid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"comingSoon"}},{"kind":"Field","name":{"kind":"Name","value":"lessonCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"courseProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"courseWId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"tokenVersion"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastLoginAt"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageNo"}},{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}}]}}]}}]} as unknown as DocumentNode<AdminGetCourseUserDetailsQuery, AdminGetCourseUserDetailsQueryVariables>;
export const AdminUserActivityCourseDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminUserActivityCourseDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseCompleteEndDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseCompleteStartDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseStartEndDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseStartStartDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminUserActivityCourseDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseCompleteEndDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseCompleteEndDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseCompleteStartDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseCompleteStartDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseStartEndDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseStartEndDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseStartStartDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseStartStartDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startedCourses"}},{"kind":"Field","name":{"kind":"Name","value":"completedCourses"}}]}}]}}]} as unknown as DocumentNode<AdminUserActivityCourseDetailsQuery, AdminUserActivityCourseDetailsQueryVariables>;
export const AdminManualSyncTriggerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminManualSyncTrigger"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminManualSyncTrigger"}}]}}]} as unknown as DocumentNode<AdminManualSyncTriggerMutation, AdminManualSyncTriggerMutationVariables>;
export const GetActiveUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getActiveUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getActiveUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graphData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalActiveUsers"}}]}}]}}]} as unknown as DocumentNode<GetActiveUsersQuery, GetActiveUsersQueryVariables>;
export const GetNewSignupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getNewSignups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getNewSignups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<GetNewSignupsQuery, GetNewSignupsQueryVariables>;
export const GetCoursesReportDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCoursesReportData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCoursesReportData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coursesNotStarted"}},{"kind":"Field","name":{"kind":"Name","value":"coursesNotCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"coursesCompleted"}}]}}]}}]} as unknown as DocumentNode<GetCoursesReportDataQuery, GetCoursesReportDataQueryVariables>;
export const GetCourseCompletionReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCourseCompletionReport"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCourseCompletionReport"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courseTitle"}},{"kind":"Field","name":{"kind":"Name","value":"completions"}}]}}]}}]} as unknown as DocumentNode<GetCourseCompletionReportQuery, GetCourseCompletionReportQueryVariables>;
export const GetAuthUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAuthURL"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getGoogleAuthURL"}}]}}]} as unknown as DocumentNode<GetAuthUrlQuery, GetAuthUrlQueryVariables>;
export const GetGaConnectionStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getGAConnectionStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getGAConnectionStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetGaConnectionStatusQuery, GetGaConnectionStatusQueryVariables>;
export const UnlinkGaConnectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"unlinkGAConnection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unlinkGAConnection"}}]}}]} as unknown as DocumentNode<UnlinkGaConnectionMutation, UnlinkGaConnectionMutationVariables>;
export const GetGaReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getGAReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dateRanges"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getGAReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"dateRanges"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateRanges"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dimensionValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metricValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"rows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dimensionValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metricValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"metricHeaders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dimensionHeaders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"getGAByCountryReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"dateRanges"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateRanges"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dimensionValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metricValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"rows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dimensionValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metricValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"metricHeaders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dimensionHeaders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"R1"},"name":{"kind":"Name","value":"getGARunTimeReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"minuteRanges"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"0-5","block":false},{"kind":"StringValue","value":"6-10","block":false}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"rows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dimensionValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metricValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"metricHeaders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dimensionHeaders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"R2"},"name":{"kind":"Name","value":"getGARunTimeReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"minuteRanges"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"11-15","block":false},{"kind":"StringValue","value":"16-20","block":false}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"rows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dimensionValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metricValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"metricHeaders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dimensionHeaders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"R3"},"name":{"kind":"Name","value":"getGARunTimeReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"minuteRanges"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"21-25","block":false},{"kind":"StringValue","value":"26-29","block":false}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"rows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dimensionValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metricValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"metricHeaders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dimensionHeaders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"getGAPageViewsReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"dateRanges"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateRanges"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"rows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dimensionValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metricValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"metricHeaders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dimensionHeaders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"getGAEventsReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"dateRanges"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateRanges"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rowCount"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"rows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dimensionValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metricValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"metricHeaders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dimensionHeaders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<GetGaReportQuery, GetGaReportQueryVariables>;
export const AdminGetAllUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminGetAllUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"joiningEndDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"joiningStartDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastLoginEndDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastLoginStartDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"noOfRecords"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminGetAllUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"joiningEndDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"joiningEndDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"joiningStartDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"joiningStartDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastLoginEndDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastLoginEndDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastLoginStartDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastLoginStartDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchTerm"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}},{"kind":"Argument","name":{"kind":"Name","value":"noOfRecords"},"value":{"kind":"Variable","name":{"kind":"Name","value":"noOfRecords"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageNo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNo"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"tokenVersion"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastLoginAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalRecords"}}]}}]}}]} as unknown as DocumentNode<AdminGetAllUsersQuery, AdminGetAllUsersQueryVariables>;
export const AdminGetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminGetUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminGetUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"tokenVersion"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastLoginAt"}},{"kind":"Field","name":{"kind":"Name","value":"courseProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AdminGetUserQuery, AdminGetUserQueryVariables>;
export const AdminUpdateUserStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminUpdateUserStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminUpdateUserStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"tokenVersion"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastLoginAt"}}]}}]}}]} as unknown as DocumentNode<AdminUpdateUserStatusMutation, AdminUpdateUserStatusMutationVariables>;
export const AdminGetUserProgressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminGetUserProgress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminGetUserProgress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"tokenVersion"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastLoginAt"}},{"kind":"Field","name":{"kind":"Name","value":"_count"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lessonProgress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"courseProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"courseWId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"_count"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lessonProgress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"wid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"comingSoon"}},{"kind":"Field","name":{"kind":"Name","value":"lessonCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"_count"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lessons"}},{"kind":"Field","name":{"kind":"Name","value":"courseProgress"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lessonProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lessonWId"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"courseProgressId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lesson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"wid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}},{"kind":"Field","name":{"kind":"Name","value":"lessonContent"}},{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"_count"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lessonProgress"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AdminGetUserProgressQuery, AdminGetUserProgressQueryVariables>;
export const AdminExportUsersCsvDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminExportUsersCSV"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"joiningEndDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"joiningStartDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastLoginEndDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastLoginStartDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminExportUsersCSV"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"joiningEndDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"joiningEndDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"joiningStartDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"joiningStartDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastLoginEndDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastLoginEndDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastLoginStartDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastLoginStartDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchTerm"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}]}}]} as unknown as DocumentNode<AdminExportUsersCsvQuery, AdminExportUsersCsvQueryVariables>;
export const PublicLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"publicLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<PublicLoginMutation, PublicLoginMutationVariables>;
export const PublicSsoLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"publicSSOLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicSSOLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<PublicSsoLoginMutation, PublicSsoLoginMutationVariables>;
export const PublicForgotPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"publicForgotPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicForgotPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<PublicForgotPasswordMutation, PublicForgotPasswordMutationVariables>;
export const PublicResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"publicResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicResetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode<PublicResetPasswordMutation, PublicResetPasswordMutationVariables>;
export const PublicSignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"publicSignup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"company"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"jobTitle"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"country"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newsletterOptIn"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicSignup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"company"},"value":{"kind":"Variable","name":{"kind":"Name","value":"company"}}},{"kind":"Argument","name":{"kind":"Name","value":"jobTitle"},"value":{"kind":"Variable","name":{"kind":"Name","value":"jobTitle"}}},{"kind":"Argument","name":{"kind":"Name","value":"country"},"value":{"kind":"Variable","name":{"kind":"Name","value":"country"}}},{"kind":"Argument","name":{"kind":"Name","value":"newsletterOptIn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newsletterOptIn"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<PublicSignupMutation, PublicSignupMutationVariables>;
export const PublicResendOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"publicResendOTP"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"OTPType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicResendOTP"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"OTPType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"OTPType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<PublicResendOtpMutation, PublicResendOtpMutationVariables>;
export const VerifySignupOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"verifySignupOTP"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rememberMe"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifySignupOTP"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"otp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otp"}}},{"kind":"Argument","name":{"kind":"Name","value":"rememberMe"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rememberMe"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<VerifySignupOtpMutation, VerifySignupOtpMutationVariables>;
export const VerifyLoginOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"verifyLoginOTP"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rememberMe"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyLoginOTP"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"otp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otp"}}},{"kind":"Argument","name":{"kind":"Name","value":"rememberMe"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rememberMe"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<VerifyLoginOtpMutation, VerifyLoginOtpMutationVariables>;
export const VerifyResetPasswordOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"verifyResetPasswordOTP"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicVerifyResetPasswordOTP"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"otp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otp"}}}]}]}}]} as unknown as DocumentNode<VerifyResetPasswordOtpMutation, VerifyResetPasswordOtpMutationVariables>;
export const UserMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"isGoogleLogin"}},{"kind":"Field","name":{"kind":"Name","value":"expertBadgeUnlocked"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"jobTitle"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"newsletterOptIn"}}]}}]}}]} as unknown as DocumentNode<UserMeQuery, UserMeQueryVariables>;
export const PublicUploadAvatarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"publicUploadAvatar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imageFile"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicUploadAvatar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"file"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imageFile"}}}]}]}}]} as unknown as DocumentNode<PublicUploadAvatarMutation, PublicUploadAvatarMutationVariables>;
export const SetExpertBadgeUnlockedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setExpertBadgeUnlocked"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setExpertBadgeUnlocked"}}]}}]} as unknown as DocumentNode<SetExpertBadgeUnlockedMutation, SetExpertBadgeUnlockedMutationVariables>;
export const GetAllCoursesProgressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllCoursesProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllCoursesProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lessonProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"courseProgressId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wid"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"readTime"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllCoursesProgressQuery, GetAllCoursesProgressQueryVariables>;
export const GetAllLessonsProgressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllLessonsProgress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllLessonsProgress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"courseProgressId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"courseProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lesson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"readTime"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllLessonsProgressQuery, GetAllLessonsProgressQueryVariables>;
export const GetCourseProgressByCourseIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCourseProgressByCourseId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCourseProgressByCourseId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lessonProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"courseProgressId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lesson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"readTime"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"readTime"}}]}}]}}]}}]} as unknown as DocumentNode<GetCourseProgressByCourseIdQuery, GetCourseProgressByCourseIdQueryVariables>;
export const GetLessonProgressByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getLessonProgressById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getLessonProgressById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"courseProgressId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"courseProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lesson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]} as unknown as DocumentNode<GetLessonProgressByIdQuery, GetLessonProgressByIdQueryVariables>;
export const StartLessonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"startLesson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startLesson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}]}]}}]} as unknown as DocumentNode<StartLessonMutation, StartLessonMutationVariables>;
export const UpdateLessonStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateLessonStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isLastLesson"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLessonStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"isLastLesson"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isLastLesson"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}]}]}}]} as unknown as DocumentNode<UpdateLessonStatusMutation, UpdateLessonStatusMutationVariables>;
export const UpdateReadTimeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateReadTime"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"readTime"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateReadTime"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}},{"kind":"Argument","name":{"kind":"Name","value":"readTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"readTime"}}}]}]}}]} as unknown as DocumentNode<UpdateReadTimeMutation, UpdateReadTimeMutationVariables>;
export const CheckAllCoursesCompletedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"checkAllCoursesCompleted"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkAllCoursesCompleted"}}]}}]} as unknown as DocumentNode<CheckAllCoursesCompletedQuery, CheckAllCoursesCompletedQueryVariables>;
export const PublicChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"publicChangePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicChangePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"oldPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<PublicChangePasswordMutation, PublicChangePasswordMutationVariables>;