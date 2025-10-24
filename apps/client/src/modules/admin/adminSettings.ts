import { WFFormComponent, navigate } from "@xatom/core";
import { adminAuth, logoutAdminAuth } from "../../auth/admin";
import { adminQL } from "../../graphql";
import { AdminChangePasswordDocument } from "../../graphql/graphql";
import { ADMIN_PATHS } from "../../config";

export const adminSettings = () => {
    const userSettingsForm = new WFFormComponent(`[xa-type="user-settings-form"]`);
    const userName = userSettingsForm.getChildAsComponent(`[xa-type="settings-user-name"]`);
    const userEmail = userSettingsForm.getChildAsComponent(`[xa-type="settings-user-email"]`);
    const editPassBtn = userSettingsForm.getChildAsComponent(`[xa-type="edit-password-btn"]`);

    editPassBtn.setText("Edit Password");
    editPassBtn.removeAttribute("disabled");
    editPassBtn.removeCssClass("is-disabled");

    userName.getElement().innerHTML = adminAuth.getUser().name;
    userEmail.getElement().innerHTML = adminAuth.getUser().email;

    editPassBtn.on("click", () => {
        const oldPassLabel = userSettingsForm.getChildAsComponent(`[xa-type="old-password-label"]`);
        const passField = userSettingsForm.getChildAsComponent(`#old-password`);
        const newPassWrap = userSettingsForm.getChildAsComponent(`[xa-type="new-password-wrap"]`);
        const newPassField = userSettingsForm.getChildAsComponent(`#new-password`);
        const repeatPassWrap = userSettingsForm.getChildAsComponent(`[xa-type="repeat-password-wrap"]`);
        const repeatPassField = repeatPassWrap.getChildAsComponent(`#repeat-new-password`);
        const buttonWrapper = userSettingsForm.getChildAsComponent(`[xa-type="button-wrapper"]`);
        const updatePassReq = adminQL.mutation(AdminChangePasswordDocument);

        oldPassLabel.setText("Old Password");
        passField.removeCssClass("disabled");
        passField.removeAttribute('disabled');
        newPassWrap.removeCssClass("hide");
        newPassField.removeAttribute('disabled');
        repeatPassWrap.removeCssClass("hide");
        repeatPassField.removeAttribute('disabled');
        buttonWrapper.removeCssClass("hide");

        userSettingsForm.onFormSubmit((data) => {
            const formSuccessAlert = userSettingsForm.getChildAsComponent(`[xa-type="form-success-alert"]`);
            const successHeading = formSuccessAlert.getChildAsComponent(`[xa-type="heading"]`);
            const successDesc = formSuccessAlert.getChildAsComponent(`[xa-type="description"]`);
            const formErrorAlert = userSettingsForm.getChildAsComponent(`[xa-type="form-error-alert"]`);
            const errorHeading = formErrorAlert.getChildAsComponent(`[xa-type="heading"]`);
            const errorDesc = formErrorAlert.getChildAsComponent(`[xa-type="description"]`);
            
            if (data && data['old-password'] != '' && data['new-password'] != '' && data['repeat-new-password'] != '') {
                
                if (data['new-password'] === data['repeat-new-password']) {
                    updatePassReq.fetch({
                        newPassword: data['repeat-new-password'].toString(),
                        oldPassword: data['old-password'].toString()
                    });
                } else {
                    formSuccessAlert.addCssClass("hide");
                    errorHeading.setText('Invalid details');
                    errorDesc.setText("The new passwords don't match. Try again.");
                    formErrorAlert.removeCssClass("hide");
                    setTimeout(() => {
                        formErrorAlert.addCssClass("hide");
                    }, 5000);
                }

                updatePassReq.onData((data) => {
                    formErrorAlert.addCssClass("hide");
                    successHeading.setText('Success!');
                    successDesc.setText('Your password has been updated. Signing you out.');
                    formSuccessAlert.removeCssClass("hide");

                    setTimeout(() => {
                        logoutAdminAuth();
                        navigate(ADMIN_PATHS.signIn);
                    }, 2000);
                });

                updatePassReq.onError((err) => {
                    formSuccessAlert.addCssClass("hide");
                    if (err.message === 'Invalid password') {
                        errorHeading.setText('Invalid details');
                        errorDesc.setText("You entered the wrong old password. Try again.");
                    } else {
                        errorHeading.setText('Oops! There was an error.');
                        errorDesc.setText("We couldn't update your password. Try again later.");
                    }
                    formErrorAlert.removeCssClass("hide");
                    setTimeout(() => {
                        formErrorAlert.addCssClass("hide");
                    }, 5000);
                });

                updatePassReq.onLoadingChange((status) => {
                    userSettingsForm.updateSubmitButtonText(
                        status ? "Please wait.." : "Save Settings"
                    )
                });
            }
        });
    });
}