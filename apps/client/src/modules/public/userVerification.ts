import { WFComponent, WFFormComponent, navigate } from "@xatom/core";
import { publicQL } from "../../graphql";
import { PublicForgotPasswordDocument, PublicResendOtpDocument, VerifyLoginOtpDocument, VerifyResetPasswordOtpDocument, VerifySignupOtpDocument } from "../../graphql/graphql";
import { PUBLIC_PATHS } from "../../config";
import { setPublicAuthDetails } from "../../auth/public";
import { setOTPInput } from "client-utils/utility-functions";

export const userVerification = (pageQuery: { type: string }) => {
  const resendOTPReq = publicQL.mutation(PublicResendOtpDocument);
  const userLoginVerificationReq = publicQL.mutation(VerifyLoginOtpDocument);
  const userSignupVerificationReq = publicQL.mutation(VerifySignupOtpDocument);
  const UserResetPasswordOTPVerificationReq = publicQL.mutation(VerifyResetPasswordOtpDocument)
  const forgotPasswordReq = publicQL.mutation(PublicForgotPasswordDocument);
  const resendButton = new WFComponent(`[xa-type="resend-link"]`);
  const verificationForm = new WFFormComponent<{
    "otp-digit-1": string;
    "otp-digit-2": string;
    "otp-digit-3": string;
    "otp-digit-4": string;
    "remember-me-2": string;
  }>(`[xa-type="verification-code-form"]`);
  const rememberMeBlock = new WFComponent(`.form_toggle-wrapper`);
  const errorBlock = new WFComponent(`[xa-type="form-error-alert"]`);
  const successBlock = new WFComponent(`[xa-type="form-success-alert"]`);
  const errorHeading = errorBlock.getChildAsComponent(`[xa-type="heading"]`);
  const errorDesc = errorBlock.getChildAsComponent(`[xa-type="description"]`);
  const successHeading = successBlock.getChildAsComponent(`[xa-type="heading"]`);
  const successDesc = successBlock.getChildAsComponent(`[xa-type="description"]`);
  const submitButton = verificationForm.getChildAsComponent(`[xa-type="verification-button"]`);
  const errorTrigger = new WFComponent(`[xa-type="error-trigger"]`);
  const successTrigger = new WFComponent(`[xa-type="success-trigger"]`);

  const email = sessionStorage.getItem("verificationEmail");

  submitButton.setAttribute("value", "Continue");
  submitButton.removeAttribute("disabled");
  submitButton.removeCssClass("is-disabled");
  verificationForm.removeCssClass("pointer-events-off");

  let OTPAttempts = localStorage.getItem("sc-voac") ? parseInt(localStorage.getItem("sc-voac")) : 0;

  if (email && pageQuery && pageQuery.type) {
    if (pageQuery.type === "resetPassword") {
      rememberMeBlock.addCssClass("hide");
    }
    resendButton.on("click", () => {
      resendOTPReq.fetch({ email, OTPType: pageQuery.type === "login" ? "LOGIN" : pageQuery.type === "signup" ? "SIGNUP" : "RESET_PASSWORD" });
      successHeading.setText("OTP Request");
      successDesc.setText("New OTP has been sent to your email.");
      successTrigger.getElement().click();
    });

    verificationForm.onFormSubmit((data) => {
      if (OTPAttempts < 5) {
        const verificationCode = `${data["otp-digit-1"]}${data["otp-digit-2"]}${data["otp-digit-3"]}${data["otp-digit-4"]}`
        OTPAttempts = localStorage.getItem("sc-voac") ? parseInt(localStorage.getItem("sc-voac")) + 1 : 1;
        localStorage.setItem("sc-voac", JSON.stringify(OTPAttempts));
        if (pageQuery.type === "login") {
          userLoginVerificationReq.fetch({
            email,
            otp: verificationCode,
            rememberMe: !!data["remember-me-2"]
          });
        } else if (pageQuery.type === "signup") {
          userSignupVerificationReq.fetch({
            email,
            otp: verificationCode,
            rememberMe: !!data["remember-me-2"]
          });
        } else {
          UserResetPasswordOTPVerificationReq.fetch({
            email,
            otp: verificationCode,
          })
        }
      }
    });

    forgotPasswordReq.onError((err) => {
      const errMessage = err && err.message ? err.message : "Something went wrong!";
      errorHeading.setText("Reset Password Error!");
      errorDesc.setText(errMessage);
      errorTrigger.getElement().click();
    });

    forgotPasswordReq.onData((data) => {
      setTimeout(() => {
        sessionStorage.setItem("verificationEmail", email);
        localStorage.removeItem("sc-voac");
        OTPAttempts = 0;
        navigate(`${PUBLIC_PATHS.userVerification}?type=resetPassword`);
      }, 5000);
    });

    userLoginVerificationReq.onError((err) => {
      if (OTPAttempts >= 5 && err && err.message === "Invalid OTP! Please try again.") {
        errorHeading.setText("Verification Error!");
        errorDesc.setText(`You have exceeded OTP attempts limit! Please reset password!`);
        errorTrigger.getElement().click();
        verificationForm.disableForm();
        verificationForm.updateSubmitButtonText("Redirecting...");
      } else {
        const errMessage = err && err.message ? err.message : "Something went wrong!";
        errorHeading.setText("Verification Error!");
        errorDesc.setText(errMessage);
        errorTrigger.getElement().click();
      }
    });

    userLoginVerificationReq.onData((data) => {
      setTimeout(() => {
        verificationForm.disableForm();
        verificationForm.updateSubmitButtonText("Redirecting...");
      }, 100);

      setPublicAuthDetails(
        `${data.verifyLoginOTP.firstName} ${data.verifyLoginOTP.lastName}`,
        email,
        data.verifyLoginOTP.token
      );
      sessionStorage.removeItem("verificationEmail");
      setTimeout(() => {
        navigate(PUBLIC_PATHS.userVerification);
      }, 500);
    });

    userSignupVerificationReq.onError((err) => {
      if (OTPAttempts >= 5 && err && err.message === "Invalid OTP! Please try again.") {
        errorHeading.setText("Verification Error!");
        errorDesc.setText(`You have exceeded OTP attempts limit! Please reset password!`);
        errorTrigger.getElement().click();
        setTimeout(() => {
          forgotPasswordReq.fetch({
            email: email
          });
          verificationForm.disableForm();
          verificationForm.updateSubmitButtonText("Redirecting...");
        }, 3000);
      } else {
        const errMessage = err && err.message ? err.message : "Something went wrong!";
        errorHeading.setText("Verification Error!");
        errorDesc.setText(errMessage);
        errorTrigger.getElement().click();
      }
    });

    userSignupVerificationReq.onData((data) => {
      setTimeout(() => {
        verificationForm.disableForm();
        verificationForm.updateSubmitButtonText("Redirecting...");
      }, 100);

      setPublicAuthDetails(
        `${data.verifySignupOTP.firstName} ${data.verifySignupOTP.lastName}`,
        email,
        data.verifySignupOTP.token
      );
      sessionStorage.removeItem("verificationEmail");
      setTimeout(() => {
        navigate(PUBLIC_PATHS.userVerification);
      }, 500);
    });

    UserResetPasswordOTPVerificationReq.onData((data) => {
      setTimeout(() => {
        verificationForm.disableForm();
        verificationForm.updateSubmitButtonText("Redirecting...");
      }, 100);
      sessionStorage.removeItem("verificationEmail");
      setTimeout(() => {
        navigate(`${PUBLIC_PATHS.resetPassword}?token=${data.publicVerifyResetPasswordOTP}`);
      }, 500);
    });

    UserResetPasswordOTPVerificationReq.onError((err) => {
      if (OTPAttempts >= 5 && err && err.message === "Invalid OTP! Please try again.") {
        errorHeading.setText("Verification Error!");
        errorDesc.setText(`You have exceeded OTP attempts limit! Please reset password!`);
        errorTrigger.getElement().click();
        verificationForm.disableForm();
        verificationForm.updateSubmitButtonText("Redirecting...");
      } else {
        const errMessage = err && err.message ? err.message : "Something went wrong!";
        errorHeading.setText("Verification Error!");
        errorDesc.setText(errMessage);
        errorTrigger.getElement().click();
      }
    });
  } else {
    if (pageQuery && pageQuery.type) {
      if (pageQuery.type === "login") {
        setTimeout(() => {
          navigate(PUBLIC_PATHS.signIn);
        }, 500);
      } else if (pageQuery.type === "signup") {
        setTimeout(() => {
          navigate(PUBLIC_PATHS.signUp);
        }, 500);
      } else {
        setTimeout(() => {
          navigate(PUBLIC_PATHS.forgotPassword);
        }, 500);
      }
    } else {
      setTimeout(() => {
        navigate(PUBLIC_PATHS.signIn);
      }, 500);
    }
  }
  setOTPInput();
};

