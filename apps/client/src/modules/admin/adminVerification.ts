import { WFComponent, WFFormComponent, navigate } from "@xatom/core";
import { adminQL } from "../../graphql"
import { AdminForgotPasswordDocument, AdminResendLoginOtpDocument, AdminVerifyLoginOtpDocument, AdminVerifyResetPasswordOtpDocument } from "../../graphql/graphql";
import { setAdminAuthDetails } from "../../auth/admin";
import { ADMIN_PATHS } from "../../config";
import { setOTPInput } from "client-utils/utility-functions";

export const adminVerification = (pageQuery: { type: string }) => {
  const resendOTPReq = adminQL.mutation(AdminResendLoginOtpDocument);
  const adminLoginVerificationReq = adminQL.mutation(AdminVerifyLoginOtpDocument);
  const adminResetPasswordOTPVerificationReq = adminQL.mutation(AdminVerifyResetPasswordOtpDocument)
  const resendButton = new WFComponent(`[xa-type="resend-link"]`);
  const forgotPasswordReq = adminQL.mutation(AdminForgotPasswordDocument);
  const verificationForm = new WFFormComponent<{
    "otp-digit-1": string;
    "otp-digit-2": string;
    "otp-digit-3": string;
    "otp-digit-4": string;
    "remember-me-2": string;
  }>(`[xa-type="verification-code-form"]`);
  const submitButton = verificationForm.getChildAsComponent(`[xa-type="verification-button"]`);

  const formErrorAlert = new WFComponent(`[xa-type="form-error-alert"]`);
  const errorMessageHeading = formErrorAlert.getChildAsComponent(`[xa-type="heading"]`);
  const errorMessageDesc = formErrorAlert.getChildAsComponent(`[xa-type="description"]`);
  const formSuccessAlert = new WFComponent(`[xa-type="form-success-alert"]`);
  const successMessageHeading = formSuccessAlert.getChildAsComponent(`[xa-type="heading"]`);
  const successMessageDesc = formSuccessAlert.getChildAsComponent(`[xa-type="description"]`);
  const rememberMeBlock = new WFComponent(`.form_toggle-wrapper`);
  const errorTrigger = new WFComponent(`[xa-type="error-trigger"]`);
  const successTrigger = new WFComponent(`[xa-type="success-trigger"]`);
  const email = sessionStorage.getItem("verificationEmail");

  submitButton.setAttribute("value", "Continue");
  submitButton.removeAttribute("disabled");
  submitButton.removeCssClass("is-disabled");
  verificationForm.removeCssClass("pointer-events-off");

  let OTPAttempts = localStorage.getItem("sc-admin-voac") ? parseInt(localStorage.getItem("sc-admin-voac")) : 0;

  if (email && pageQuery && pageQuery.type) {
    if (pageQuery.type === "resetPassword") {
      rememberMeBlock.addCssClass("hide");
    }
    resendButton.on("click", () => {
      resendOTPReq.fetch({ email, OTPType: pageQuery.type === "login" ? "ADMIN_LOGIN" : "ADMIN_RESET_PASSWORD" });
      successMessageHeading.setText("Success!");
      successMessageDesc.setText("New OTP has been sent to your email.");
      successTrigger.getElement().click();
    });

    verificationForm.onFormSubmit((data) => {
      if (OTPAttempts < 5) {
        const verificationCode = `${data["otp-digit-1"]}${data["otp-digit-2"]}${data["otp-digit-3"]}${data["otp-digit-4"]}`;
        OTPAttempts = localStorage.getItem("sc-admin-voac") ? parseInt(localStorage.getItem("sc-admin-voac")) + 1 : 1;
        localStorage.setItem("sc-admin-voac", JSON.stringify(OTPAttempts));
        if (pageQuery.type === "login") {
          adminLoginVerificationReq.fetch({
            email,
            otp: verificationCode,
            rememberMe: !!data["remember-me-2"]
          });
        } else {
          adminResetPasswordOTPVerificationReq.fetch({
            email,
            otp: verificationCode
          });
        }
      }
    });
    
    forgotPasswordReq.onError((err) => {
      const errMessage = err && err.message ? err.message : "Something went wrong!";
      errorMessageHeading.setText("Reset Password Error!");
      errorMessageDesc.setText(errMessage);
      errorTrigger.getElement().click();
    });

    forgotPasswordReq.onData((data) => {
      setTimeout(() => {
        sessionStorage.setItem("verificationEmail", email);
        localStorage.removeItem("sc-admin-voac");
        OTPAttempts = 0;
        navigate(`${ADMIN_PATHS.adminVerification}?type=resetPassword`);
      }, 5000);
    });

    adminLoginVerificationReq.onError((err) => {
      if (OTPAttempts >= 5 && err && err.message === "Invalid OTP! Please try again.") {
        errorMessageHeading.setText("Verification Error!");
        errorMessageDesc.setText(`You have exceeded OTP attempts limit! Please reset password!`);
        errorTrigger.getElement().click();
        forgotPasswordReq.fetch({
          email: email
        });
        verificationForm.disableForm();
        verificationForm.updateSubmitButtonText("Redirecting...");
      } else {
        const errMessage = err && err.message ? err.message : "Something went wrong!";
        errorMessageHeading.setText("Oops! We've had an error");
        errorMessageDesc.setText(errMessage);
        errorTrigger.getElement().click();
      }
    });

    adminLoginVerificationReq.onData((data) => {
      setTimeout(() => {
        verificationForm.disableForm();
        verificationForm.updateSubmitButtonText("Redirecting...");
      }, 100);

      setAdminAuthDetails(
        `${data.adminVerifyLoginOTP.firstName} ${data.adminVerifyLoginOTP.lastName}`,
        email,
        data.adminVerifyLoginOTP.token
      );
      sessionStorage.removeItem("verificationEmail");
      setTimeout(() => {
        navigate(ADMIN_PATHS.dashboard);
      }, 500);
    });

    adminResetPasswordOTPVerificationReq.onData((data) => {
      setTimeout(() => {
        verificationForm.disableForm();
        verificationForm.updateSubmitButtonText("Redirecting...");
      }, 100);
      sessionStorage.removeItem("verificationEmail");
      setTimeout(() => {
        navigate(`${ADMIN_PATHS.resetPassword}?token=${data.adminVerifyResetPasswordOTP}`);
      }, 500);
    });

    adminResetPasswordOTPVerificationReq.onError((err) => {
      if (OTPAttempts >= 5 && err && err.message === "Invalid OTP! Please try again.") {
        errorMessageHeading.setText("Verification Error!");
        errorMessageDesc.setText(`You have exceeded OTP attempts limit! Please reset password!`);
        errorTrigger.getElement().click();
        forgotPasswordReq.fetch({
          email: email
        });
        verificationForm.disableForm();
        verificationForm.updateSubmitButtonText("Redirecting...");
      } else {
        const errMessage = err && err.message ? err.message : "Something went wrong!";
        errorMessageHeading.setText("Verification Error!");
        errorMessageDesc.setText(errMessage);
        errorTrigger.getElement().click();
      }
    });
  } else {
    if (pageQuery && pageQuery.type) {
      setTimeout(() => {
        navigate(ADMIN_PATHS.signIn);
      }, 500);
    }
  }

  setOTPInput();

}