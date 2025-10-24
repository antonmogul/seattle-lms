import axios from "axios";
import { OTP_EMAIL_TEMPLATE_ID, POSTMARK_EMAIL_API_ENDPOINT, POSTMARK_FROM_EMAIL, RESET_PASS_EMAIL_TEMPLATE_ID, WELCOME_EMAIL_TEMPLATE_ID } from "../../../config/global";
export enum emailTemplates {
    RESET_PASSWORD = "Reset Password",
    VERIFICATION_OTP = "Verification OTP",
    WELCOME_EMAIL = "Welcome Email"
}

const sendEmail = (TemplateId: string, To: string, templateModel: object, Cc: string = "", Bcc: string = "") => {
    return new Promise((resolve, reject) => {
        axios.post(
            `${POSTMARK_EMAIL_API_ENDPOINT}/email/withTemplate/`,
            {
                TemplateId: TemplateId,
                TemplateModel: templateModel,
                From: POSTMARK_FROM_EMAIL,
                To
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-Postmark-Server-Token": process.env.POSTMARK_SERVER_TOKEN
                }
            }
        ).then((res) => {
            // Only return the data payload to avoid circular references
            resolve({ success: true, data: res.data });
        }).catch((err) => {
            reject({ success: false, error: err.message });
        });
    });
}


export const sendEmailWithTemplate = async (
    To: string,
    emailTemplate: emailTemplates,
    templateParams: Object,
    Cc: string = "",
    Bcc: string = ""
) => {
    let templateId = "";

    switch (emailTemplate) {
        case "Reset Password":
            templateId = RESET_PASS_EMAIL_TEMPLATE_ID;
            break;
        case "Verification OTP":
            templateId = OTP_EMAIL_TEMPLATE_ID;
            break;
        case "Welcome Email":
            templateId = WELCOME_EMAIL_TEMPLATE_ID;
            break;
    }

    const result = await sendEmail(templateId, To, templateParams, Cc, Bcc);

    return result;
}


