import { WFComponent, WFFormComponent, navigate } from "@xatom/core";
import { adminQL } from "../../graphql"
import { AdminForgotPasswordDocument, AdminLoginDocument } from "../../graphql/graphql";
import { setAdminAuthDetails } from "../../auth/admin";
import { ADMIN_PATHS } from "../../config";

export const adminSignIn = () => {
    let passwordAttempts = localStorage.getItem("sc-admin-pac") ? parseInt(localStorage.getItem("sc-admin-pac")) : 0;
    const signInReq = adminQL.mutation(AdminLoginDocument);
    const forgotPasswordReq = adminQL.mutation(AdminForgotPasswordDocument);
    const signInForm = new WFFormComponent<{
        "signin-email": string;
        "signin-password": string;
    }>(`[xa-type="signin-form"]`);
    const submitButton = signInForm.getChildAsComponent(`[xa-type="signin-btn"]`);

    // Handle optional error alert elements
    let formErrorAlert: WFComponent | null = null;
    let errorMessageHeading: WFComponent | null = null;
    let errorMessageDesc: WFComponent | null = null;
    let errorTrigger: WFComponent | null = null;

    try {
        formErrorAlert = new WFComponent(`[xa-type="form-error-alert"]`);
        errorMessageHeading = formErrorAlert.getChildAsComponent(`[xa-type="heading"]`);
        errorMessageDesc = formErrorAlert.getChildAsComponent(`[xa-type="description"]`);
        errorTrigger = new WFComponent(`[xa-type="error-trigger"]`);
    } catch (e) {
        console.warn("Error alert elements not found, using fallbacks");
    }

    let email = "";
    submitButton.setAttribute("value", "Continue");
    submitButton.removeAttribute("disabled");
    submitButton.removeCssClass("is-disabled");
    signInForm.removeCssClass("pointer-events-off");

    signInForm.onFormSubmit((data) => {
        email = data["signin-email"];
        if (passwordAttempts < 5) {
            passwordAttempts = localStorage.getItem("sc-admin-pac") ? parseInt(localStorage.getItem("sc-admin-pac")) + 1 : 1;
            localStorage.setItem("sc-admin-pac", JSON.stringify(passwordAttempts));
            signInReq.fetch({
                email: data["signin-email"],
                password: data["signin-password"],
            });
        }
    });

    signInReq.onLoadingChange((status) => {
        if (status) {
            signInForm.disableForm();
        } else {
            signInForm.enableForm();
        }

        signInForm.updateSubmitButtonText(
            status ? "Please wait.." : "Sign In"
        );
    });

    signInReq.onError((err) => {
        if (passwordAttempts >= 5 && err && err.message === "Invalid email or password") {
            if (errorMessageHeading && errorMessageDesc) {
                errorMessageHeading.setText("Login Error!");
                errorMessageDesc.setText(`You have exceeded password attempts limit! Please reset password!`);
            }
            if (errorTrigger) {
                errorTrigger.getElement().click();
            }
            forgotPasswordReq.fetch({
                email: email
            });
            signInForm.disableForm();
            signInForm.updateSubmitButtonText("Redirecting...");
        } else {
            const errMessage = err && err.message ? err.message : "Something went wrong!";
            if (errorMessageHeading && errorMessageDesc) {
                errorMessageHeading.setText("Oops! We've had an error.");
                errorMessageDesc.setText(errMessage);
            }
            if (errorTrigger) {
                errorTrigger.getElement().click();
            } else {
                // Fallback: show alert if no error elements
                alert(`Login Error: ${errMessage}`);
            }
        }
    });

    signInReq.onData((data) => {
        setTimeout(() => {
            signInForm.disableForm();
            signInForm.updateSubmitButtonText("Redirecting...");
        }, 100);

        if (data.adminLogin.id) {
            setAdminAuthDetails(
                `${data.adminLogin.firstName} ${data.adminLogin.lastName}`,
                email,
                data.adminLogin.token
            );
            navigate(ADMIN_PATHS.dashboard);
        } else {
            sessionStorage.setItem("verificationEmail", email);
            setTimeout(() => {
                navigate(`${ADMIN_PATHS.adminVerification}?type=login`);
            }, 2000);
        }
    });

    forgotPasswordReq.onError((err) => {
        const errMessage = err && err.message ? err.message : "Something went wrong!";
        if (errorMessageHeading && errorMessageDesc) {
            errorMessageHeading.setText("Reset Password Error!");
            errorMessageDesc.setText(errMessage);
        }
        if (errorTrigger) {
            errorTrigger.getElement().click();
        } else {
            alert(`Reset Password Error: ${errMessage}`);
        }
    });
    forgotPasswordReq.onData((data) => {
        setTimeout(() => {
            sessionStorage.setItem("verificationEmail", email);
            localStorage.removeItem("sc-admin-pac");
            navigate(`${ADMIN_PATHS.adminVerification}?type=resetPassword`);
        }, 5000);
    });
};