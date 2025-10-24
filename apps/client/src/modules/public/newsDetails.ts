import { WFComponent } from "@xatom/core"
import { logoutPublicAuth, publicAuth } from "../../auth/public";
import { curtainLoader } from "client-utils/curtain-loader";

export const newsDetails = async () => {
    const loginButton = new WFComponent(`[xa-type="login-link"]`);
    const logoutButton = new WFComponent(`[xa-type="logout-link"]`);
    const getStartedButton = new WFComponent(`[xa-type="get-started-link"]`);
    const myDashboardButton = new WFComponent(`[xa-type="my-dashboard-btn"]`);
    if (publicAuth.isLoggedIn()) {
        getStartedButton.addCssClass("hide");
        loginButton.addCssClass("hide");
        logoutButton.removeCssClass("hide");
        myDashboardButton.removeCssClass("hide");
        curtainLoader().hide();
    } else {
        getStartedButton.removeCssClass("hide");
        loginButton.removeCssClass("hide");
        logoutButton.addCssClass("hide");
        myDashboardButton.addCssClass("hide");
        curtainLoader().hide();
    }
    logoutButton.on("click", () => {
        logoutPublicAuth();
    });
}