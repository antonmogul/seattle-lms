import { WFComponent } from "@xatom/core"
import { logoutPublicAuth, publicAuth } from "../../auth/public";


export const landing = () => {
    const loginButton = new WFComponent(`[xa-type="login-link"]`);
    const logoutButton = new WFComponent(`[xa-type="logout-link"]`);
    const getStartedButton = new WFComponent(`[xa-type="get-started-link"]`);
    const myDashboardButton = new WFComponent(`[xa-type="my-dashboard-btn"]`);
    if (publicAuth.isLoggedIn()) {
        getStartedButton.addCssClass("hide");
        loginButton.addCssClass("hide");
        logoutButton.removeCssClass("hide");
        myDashboardButton.removeCssClass("hide");
    } else {
        getStartedButton.removeCssClass("hide");
        loginButton.removeCssClass("hide");
        logoutButton.addCssClass("hide");
        myDashboardButton.addCssClass("hide");
    }
    logoutButton.on("click", () => {
        logoutPublicAuth();
    });
}