import { WFComponent, WFFormComponent, navigate } from "@xatom/core";
import { adminQL } from "../../graphql";
import { AdminResetPasswordDocument } from "../../graphql/graphql";
import { ADMIN_PATHS } from "../../config";

export const adminResetPassword = () => {
    const resetPasswordReq = adminQL.mutation(AdminResetPasswordDocument);
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
            errorBlock.removeCssClass("hide");
            setTimeout(() => {
                errorBlock.addCssClass("hide");
            }, 5000);
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
        errorBlock.removeCssClass("hide");
        setTimeout(() => {
            errorBlock.addCssClass("hide");
        }, 5000);
    });
    resetPasswordReq.onData((data) => {
        setTimeout(() => {
            resetPasswordForm.disableForm();
            resetPasswordForm.updateSubmitButtonText("Redirecting...");
            successHeading.setText("Password Reset Success");
            successDesc.setText("Password has been resetted succesfully.");
            successBlock.removeCssClass("hide");
            setTimeout(() => {
                successBlock.addCssClass("hide");
            }, 3000);
        }, 100);
        setTimeout(() => {
            navigate(ADMIN_PATHS.signIn);
        }, 3000);
    });
}