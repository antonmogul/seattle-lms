import { WFComponent, WFFormComponent, navigate } from "@xatom/core";
import { publicQL } from "../../graphql";
import { PublicSignupDocument } from "../../graphql/graphql";
import { PUBLIC_PATHS } from "../../config";

export const userSignup = () => {
    const signUpReq = publicQL.mutation(PublicSignupDocument);
    const signUpForm = new WFFormComponent<{
        "signup-first-name": string;
        "signup-last-name": string;
        "signup-email": string;
        "signup-password": string;
        "signup-repeat-password": string;
        "company": string;
        "job-title": string;
        "Select-Country": string;
        "checkbox": boolean;
    }>(`[xa-type="signup-form"]`);
    const errorBlock = new WFComponent(`[xa-type="form-error-alert"]`);
    const successBlock = new WFComponent(`[xa-type="form-success-alert"]`);
    const errorHeading = errorBlock.getChildAsComponent(`[xa-type="heading"]`);
    const errorDesc = errorBlock.getChildAsComponent(`[xa-type="description"]`);
    const submitButton = signUpForm.getChildAsComponent(`[xa-type="signup-btn"]`);
    const errorTrigger = new WFComponent(`[xa-type="error-trigger"]`);
    let email = "";

    submitButton.setAttribute("value", "Continue");
    submitButton.removeAttribute("disabled");
    submitButton.removeCssClass("is-disabled");
    signUpForm.removeCssClass("pointer-events-off");

    signUpForm.onFormSubmit((data) => {
        email = data["signup-email"];
        const passwordSpecialCharactersCheck = /[!/\-;]+/;

        if (passwordSpecialCharactersCheck && !/\d/.test(data["signup-password"])) {
            const errMessage = "Passwords should not contain special characters like / - ;";
            errorHeading.setText("Signup Error!");
            errorDesc.setText(errMessage);
            errorTrigger.getElement().click();
        } else {
            signUpReq.fetch({
                firstName: data["signup-first-name"],
                lastName: data["signup-last-name"],
                email: data["signup-email"],
                password: data["signup-password"],
                company: data["company"],
                jobTitle: data["job-title"],
                country: data["Select-Country"],
                newsletterOptIn: Boolean(data["checkbox"]),
            });
        }
    });
    signUpReq.onLoadingChange((status) => {
        if (status) signUpForm.disableForm();
        else signUpForm.enableForm();

        signUpForm.updateSubmitButtonText(
            status ? "Please wait.." : "Create Account"
        );
    });
    signUpReq.onError((err) => {
        const errMessage = err && err.message ? err.message : "Something went wrong!";
        errorHeading.setText("Signup Error!");
        errorDesc.setText(errMessage);
        errorTrigger.getElement().click();
    });
    signUpReq.onData((data) => {
        setTimeout(() => {
            signUpForm.disableForm();
            signUpForm.updateSubmitButtonText("Redirecting...");
        }, 100);
        sessionStorage.setItem("verificationEmail", email);
        setTimeout(() => {
            navigate(`${PUBLIC_PATHS.userVerification}?type=signup`);
        }, 2000);
    });

};