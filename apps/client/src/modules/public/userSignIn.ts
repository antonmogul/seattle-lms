import {
    WFComponent,
    WFFormComponent,
    navigate,
} from "@xatom/core";
import { publicQL } from "../../graphql";
import {
    PublicForgotPasswordDocument,
    PublicLoginDocument,
    PublicSsoLoginDocument,
} from "../../graphql/graphql";
import { PUBLIC_PATHS } from "../../config";
import { setPublicAuthDetails } from "../../auth/public";

export const userSignIn = (pageQuery: { glogin:string, e: string }) => {
    let passwordAttempts = localStorage.getItem("sc-pac") ? parseInt(localStorage.getItem("sc-pac")) : 0;
    const signInReq = publicQL.mutation(PublicLoginDocument);
    const ssoSignInReq = publicQL.mutation(PublicSsoLoginDocument);
    const forgotPasswordReq = publicQL.mutation(PublicForgotPasswordDocument);
    const signInForm = new WFFormComponent<{
        "signin-email": string;
        "signin-password": string;
    }>(`[xa-type="signin-form"]`);
    const errorBlock = new WFComponent(`[xa-type="form-error-alert"]`);
    const successBlock = new WFComponent(`[xa-type="form-success-alert"]`);
    const errorHeading = errorBlock.getChildAsComponent(`[xa-type="heading"]`);
    const errorDesc = errorBlock.getChildAsComponent(`[xa-type="description"]`);
    const submitButton = signInForm.getChildAsComponent(`[xa-type="signin-btn"]`);
    const errorTrigger = new WFComponent(`[xa-type="error-trigger"]`);
    let email = "", gLoginEmail = pageQuery.e, gLoginResult = pageQuery.glogin;
    try {
        if (gLoginEmail) {
            gLoginEmail = Buffer.from(gLoginEmail, "base64").toString()
        }
        if (gLoginResult === "1" && gLoginEmail && gLoginEmail.length) {
            ssoSignInReq.fetch({
                email: gLoginEmail
            });
        } else if (gLoginResult && gLoginResult === "0"){
            const errMessage = "Something went wrong with Google Login!";
            errorHeading.setText("Login Error!");
            errorDesc.setText(errMessage);
            errorTrigger.getElement().click();
            // errorBlock.removeCssClass("hide");
            // setTimeout(() => {
            //     errorBlock.addCssClass("hide");
            // }, 5000);
        }

        submitButton.setAttribute("value", "Continue");
        submitButton.removeAttribute("disabled");
        submitButton.removeCssClass("is-disabled");
        signInForm.removeCssClass("pointer-events-off");

        signInForm.onFormSubmit((data) => {
            email = data["signin-email"];
            if (passwordAttempts < 5) {
                passwordAttempts = localStorage.getItem("sc-pac") ? parseInt(localStorage.getItem("sc-pac")) + 1 : 1;
                localStorage.setItem("sc-pac", JSON.stringify(passwordAttempts));
                signInReq.fetch({
                    email: data["signin-email"],
                    password: data["signin-password"],
                });
            }
        });
        signInReq.onLoadingChange((status) => {
            if (status) {
                signInForm.disableForm();
            }
            else signInForm.enableForm();

            signInForm.updateSubmitButtonText(
                status ? "Please wait.." : "Sign In"
            );
        });
        signInReq.onError((err) => {
            if (passwordAttempts >= 5 && err && err.message === "Invalid email or password") {
                errorHeading.setText("Login Error!");
                errorDesc.setText(`You have exceeded password attempts limit! Please reset password!`);
                errorTrigger.getElement().click();
                setTimeout(() => {
                    forgotPasswordReq.fetch({
                        email: email
                    });
                    signInForm.disableForm();
                    signInForm.updateSubmitButtonText("Redirecting...");
                }, 3000);
            } else {
                const errMessage = err && err.message ? err.message : "Something went wrong!";
                errorHeading.setText("Login Error!");
                errorDesc.setText(errMessage);
                errorTrigger.getElement().click();
            }
        });

        signInReq.onData((data) => {
            setTimeout(() => {
                signInForm.disableForm();
                signInForm.updateSubmitButtonText("Redirecting...");
            }, 100);
            if (data.publicLogin.id) {
                setPublicAuthDetails(
                    `${data.publicLogin.firstName} ${data.publicLogin.lastName}`,
                    email,
                    data.publicLogin.token
                );
                navigate(PUBLIC_PATHS.dashboard);
            } else {
                sessionStorage.setItem("verificationEmail", email);
                setTimeout(() => {
                    navigate(`${PUBLIC_PATHS.userVerification}?type=login`);
                }, 2000);
            }
        });
        forgotPasswordReq.onError((err) => {
            const errMessage = err && err.message ? err.message : "Something went wrong!";
            errorHeading.setText("Reset Password Error!");
            errorDesc.setText(errMessage);
            errorTrigger.getElement().click();
            // errorBlock.removeCssClass("hide");
            // setTimeout(() => {
            //     errorBlock.addCssClass("hide");
            // }, 5000);
        });
        forgotPasswordReq.onData((data) => {
            setTimeout(() => {
                sessionStorage.setItem("verificationEmail", email);
                navigate(`${PUBLIC_PATHS.userVerification}?type=resetPassword`);
            }, 5000);
        });

        ssoSignInReq.onLoadingChange((status) => {
            if (status) {
                signInForm.disableForm();
            }
            else signInForm.enableForm();

            signInForm.updateSubmitButtonText(
                status ? "Please wait.." : "Sign In"
            );
        });
        ssoSignInReq.onError((err) => {
            const errMessage = err && err.message ? err.message : "Something went wrong!";
            errorHeading.setText("Login Error!");
            errorDesc.setText(errMessage);
            errorTrigger.getElement().click();
            // errorBlock.removeCssClass("hide");
            // setTimeout(() => {
            //     errorBlock.addCssClass("hide");
            // }, 5000);
        });

        ssoSignInReq.onData((data) => {
            setTimeout(() => {
                signInForm.disableForm();
                signInForm.updateSubmitButtonText("Redirecting...");
            }, 100);
            setPublicAuthDetails(
                `${data.publicSSOLogin.firstName} ${data.publicSSOLogin.lastName}`,
                gLoginEmail,
                data.publicSSOLogin.token
            );
            navigate(PUBLIC_PATHS.dashboard);
        });
    } catch(err) {
        const errMessage = err && err.message ? err.message : "Something went wrong!";
        errorHeading.setText("Login Error!");
        errorDesc.setText(errMessage);
        errorTrigger.getElement().click();
    }
};

