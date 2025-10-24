import { WFComponent, WFFormComponent, navigate } from "@xatom/core";
import { publicQL } from "../../graphql";
import { PublicResetPasswordDocument } from "../../graphql/graphql";
import { PUBLIC_PATHS } from "../../config";

export const userResetPassword = (pageQuery: { fr: string }) => {
    const resetPasswordReq = publicQL.mutation(PublicResetPasswordDocument);
    const resetPasswordForm = new WFFormComponent<{
        "new-password": string;
        "repeat-new-password": string
    }>(`[xa-type="update-password-form"]`);
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const errorBlock = new WFComponent(`[xa-type="form-error-alert"]`);
    const successBlock = new WFComponent(`[xa-type="form-success-alert"]`);
    const errorHeading = errorBlock.getChildAsComponent(`[xa-type="heading"]`);
    const errorDesc = errorBlock.getChildAsComponent(`[xa-type="description"]`);
    const successHeading = successBlock.getChildAsComponent(`[xa-type="heading"]`);
    const successDesc = successBlock.getChildAsComponent(`[xa-type="description"]`);
    const submitButton = resetPasswordForm.getChildAsComponent(`[xa-type="update-password-btn"]`);
    const errorTrigger = new WFComponent(`[xa-type="error-trigger"]`);
    const successTrigger = new WFComponent(`[xa-type="success-trigger"]`);

    submitButton.setAttribute("value", "Update");
    submitButton.removeAttribute("disabled");
    submitButton.removeCssClass("is-disabled");
    resetPasswordForm.removeCssClass("pointer-events-off");

    resetPasswordForm.onFormSubmit((data) => {
        if (data["new-password"] === data["repeat-new-password"]) {
            resetPasswordReq.fetch({
                newPassword: data["new-password"],
                token
            });
        } else {
            const errMessage = "Passwords are not matching!";
            errorHeading.setText("Reset Password Error!")
            errorDesc.setText(errMessage);
            // errorBlock.removeCssClass("hide");
            errorTrigger.getElement().click();
        }
    });
    resetPasswordReq.onLoadingChange((status) => {
        if (status) resetPasswordForm.disableForm();
        else resetPasswordForm.enableForm();

        resetPasswordForm.updateSubmitButtonText(
            status ? "Please wait.." : "Reset Password"
        );
    });
    resetPasswordReq.onError((err) => {
        const errMessage = err && err.message ? err.message : "Something went wrong!";
        errorHeading.setText("Reset Password Error!")
        errorDesc.setText(errMessage);
        // errorBlock.removeCssClass("hide");
        errorTrigger.getElement().click();
    });
    resetPasswordReq.onData((data) => {
        localStorage.removeItem("sc-pac");
        localStorage.removeItem("sc-voac");
        setTimeout(() => {
            resetPasswordForm.disableForm();
            resetPasswordForm.updateSubmitButtonText("Redirecting...");
            successHeading.setText("Password Reset Success");
            successDesc.setText("Password has been resetted succesfully.");
            // successBlock.removeCssClass("hide");
            // setTimeout(() => {
            //     successBlock.addCssClass("hide");
            // }, 3000);
            successTrigger.getElement().click();
        }, 100);
        setTimeout(() => {
            navigate(PUBLIC_PATHS.signIn);
        }, 3000);
    });
}