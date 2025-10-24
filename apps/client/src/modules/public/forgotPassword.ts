import { WFComponent, WFFormComponent, navigate } from "@xatom/core";
import { publicQL } from "../../graphql";
import { PublicForgotPasswordDocument } from "../../graphql/graphql";
import { PUBLIC_PATHS } from "../../config";

export const userForgotPassword = () => {
    const forgotPasswordReq = publicQL.mutation(PublicForgotPasswordDocument);
    const forgotPasswordForm = new WFFormComponent<{
        "reset-password-email": string;
    }>(`[xa-type="reset-password-form"]`);
    const errorBlock = new WFComponent(`[xa-type="form-error-alert"]`);
    const successBlock = new WFComponent(`[xa-type="form-success-alert"]`);
    const errorHeading = errorBlock.getChildAsComponent(`[xa-type="heading"]`);
    const errorDesc = errorBlock.getChildAsComponent(`[xa-type="description"]`);
    const successHeading = successBlock.getChildAsComponent(`[xa-type="heading"]`);
    const successDesc = successBlock.getChildAsComponent(`[xa-type="description"]`);
    const submitButton = forgotPasswordForm.getChildAsComponent(`[xa-type="reset-pass-btn"]`);
    const errorTrigger = new WFComponent(`[xa-type="error-trigger"]`);
    const successTrigger = new WFComponent(`[xa-type="success-trigger"]`);
    let email = "";

    submitButton.setAttribute("value", "Continue");
    submitButton.removeAttribute("disabled");
    submitButton.removeCssClass("is-disabled");
    forgotPasswordForm.removeCssClass("pointer-events-off");

    forgotPasswordForm.onFormSubmit((data) => {
        errorBlock.addCssClass("hide");
        email = data["reset-password-email"];
        forgotPasswordReq.fetch({
            email: data["reset-password-email"]
        });
    });
    forgotPasswordReq.onLoadingChange((status) => {
        if (status) forgotPasswordForm.disableForm();
        else forgotPasswordForm.enableForm();

        forgotPasswordForm.updateSubmitButtonText(
            status ? "Please wait.." : "Reset Password"
        );
    });
    forgotPasswordReq.onError((err) => {
        const errMessage = err && err.message ? err.message : "Something went wrong!";
        errorHeading.setText("Forgot Password Error!");
        errorDesc.setText(errMessage);
        errorTrigger.getElement().click();
        // errorBlock.removeCssClass("hide");
        // setTimeout(() => {
        //     errorBlock.addCssClass("hide");
        // }, 5000);
    });
    forgotPasswordReq.onData((data) => {
        setTimeout(() => {
            forgotPasswordForm.disableForm();
            forgotPasswordForm.updateSubmitButtonText("Redirecting...");
            successHeading.setText("OTP Request")
            successDesc.setText("OTP to reset the password has been sent to your email.");
            // successBlock.removeCssClass("hide");
            // setTimeout(() => {
            //     successBlock.addCssClass("hide");
            // }, 5000);
            successTrigger.getElement().click();
        }, 100);
        setTimeout(() => {
            sessionStorage.setItem("verificationEmail", email);
            navigate(`${PUBLIC_PATHS.userVerification}?type=resetPassword`);
        }, 5000);
    });
}