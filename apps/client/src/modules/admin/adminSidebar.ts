import { WFComponent, WFFormComponent } from "@xatom/core";
import { S3_BASE_URL } from "../../config";
import { adminQL } from "../../graphql";
import { AdminManualSyncTriggerDocument, AdminMeDocument, AdminUploadAvatarDocument } from "../../graphql/graphql";
import { logoutAdminAuth } from "../../auth/admin";

const defaultUsrAvatar = "https://assets-global.website-files.com/plugins/Basic/assets/placeholder.60f9b1840c.svg";
let loaderProgress = 0;

export const adminSidebar = () => {
    try {
        const adminDataReq = adminQL.query(AdminMeDocument);
        const avatarChangeReq = adminQL.mutation(AdminUploadAvatarDocument);
        const logoutBtn = new WFComponent(`[xa-type="sidebar-signout-btn"]`);
        logoutBtn.on("click", () => {
            logoutAdminAuth();
        })
        const adminAvatarForm = new WFFormComponent<{
            img: File;
        }>(`[xa-type="avatar-upload-form"]`);
        const userAvatarInput = new WFComponent<HTMLInputElement>(`#sidebar-dp-upload`);
        const adminImage = new WFComponent(`[xa-type="admin-avatar"]`);
        const adminImagePlaceholderWrap = new WFComponent(`[xa-type="sidebar-admin-placeholder-wrap"]`);
        const adminImagePlaceHolder = adminImagePlaceholderWrap.getChildAsComponent(`[xa-type="sidebar-admin-placeholder"]`);
        const adminName = new WFComponent(`[xa-type="user-name"]`);
        // const adminEmail = new WFComponent(`[xa-type="user-email"]`);
        const avatarLoaderWrap = new WFComponent(`[xa-type="avatar-loader-wrap"]`);
        const avatarLoader = avatarLoaderWrap.getChildAsComponent(`[xa-type="avatar-loader"]`);


        const adminManualSyncReq = adminQL.mutation(AdminManualSyncTriggerDocument);
        const courseSyncButton = new WFComponent(`[xa-type="syncAllButton"]`);
        const courseIconGray = new WFComponent(`[xa-type="sync-icon-gray"]`);
        const courseIconDefault = new WFComponent(`[xa-type="sync-icon-default"]`);
        const courseIconSuccess = new WFComponent(`[xa-type="sync-icon-success"]`);
        const courseIconError = new WFComponent(`[xa-type="sync-icon-error"]`);
        const syncTrigger = new WFComponent(`[xa-type="sync-trigger"]`)
        adminManualSyncReq.onError((error) => {
            console.log("Sync Error: ", error.adminManualCourseSyncTrigger);
                courseIconGray.addCssClass("hide");
                courseIconError.removeCssClass("hide");
                courseSyncButton.removeCssClass("is-loading");
                courseSyncButton.addCssClass("is-sync-error");
                courseSyncButton.getChildAsComponent("div").setText("Sync Error!");
                setTimeout(() => {
                    courseIconError.addCssClass("hide");
                    courseIconDefault.removeCssClass("hide");
                    courseSyncButton.removeCssClass("is-sync-error");
                    courseSyncButton.getChildAsComponent("div").setText("Sync Courses");
                }, 3000);
        });
        adminManualSyncReq.onData((data) => {
            if(data.adminManualSyncTrigger) {
                console.log("Sync Completed", data.adminManualSyncTrigger);
                courseIconGray.addCssClass("hide");
                courseIconSuccess.removeCssClass("hide");
                courseSyncButton.removeCssClass("is-loading");
                courseSyncButton.addCssClass("is-synced");
                courseSyncButton.getChildAsComponent("div").setText("Sync Complete");
                setTimeout(() => {
                    courseIconSuccess.addCssClass("hide");
                    courseIconDefault.removeCssClass("hide");
                    courseSyncButton.removeCssClass("is-synced");
                    courseSyncButton.getChildAsComponent("div").setText("Sync Courses");
                }, 3000);
            } else {
                console.log("Sync Error: ", data.adminManualSyncTrigger);
                courseIconGray.addCssClass("hide");
                courseIconError.removeCssClass("hide");
                courseSyncButton.removeCssClass("is-loading");
                courseSyncButton.addCssClass("is-sync-error");
                courseSyncButton.getChildAsComponent("div").setText("Sync Error!");
                setTimeout(() => {
                    courseIconError.addCssClass("hide");
                    courseIconDefault.removeCssClass("hide");
                    courseSyncButton.removeCssClass("is-sync-error");
                    courseSyncButton.getChildAsComponent("div").setText("Sync Courses");
                }, 3000);
            }
        })
        courseSyncButton.on("click", () => {
            console.log("Syncing...");
            syncTrigger.getElement().click();
            courseSyncButton.addCssClass("is-loading");
            courseSyncButton.getChildAsComponent("div").setText("Syncing now");
            courseIconGray.removeCssClass("hide");
            courseIconDefault.addCssClass("hide");
            adminManualSyncReq.fetch();
        });
        window.onload = function () {
            const loaderIntervalId = setInterval(() => {
                loaderAnimation(avatarLoader);
            }, 10);
        }

        adminDataReq.onLoadingChange((status) => {
            if (status) {
                avatarLoaderWrap.removeCssClass("hide");
            }
        });

        adminDataReq.onData((data) => {
            adminName.getElement().innerHTML = `${data.adminMe.firstName} ${data.adminMe.lastName}`;
            // adminEmail.setText(data.adminMe.email);
            adminName.removeCssClass("disabled");
            // adminEmail.removeCssClass("disabled");
            if (data.adminMe.avatar) {
                adminImage.setAttribute("src", `${S3_BASE_URL}${data.adminMe.avatar}`);
                adminImage.setAttribute("srcset", `${S3_BASE_URL}${data.adminMe.avatar}`);
                adminImage.removeCssClass("hide");
            } else {
                const fullName = `${data.adminMe.firstName} ${data.adminMe.lastName}`;
                const initials = getInitials(fullName);
                const imageColors = ['#F7E5C2', '#F2E5D1', '#EFEFEE', '#F6F6F7', '#D5E2E8', '#FBE1D5'];
                adminImagePlaceHolder.setText(`${initials}`);
                adminImagePlaceholderWrap.getElement().style.backgroundColor = getRandomValueFromArray(imageColors);
                adminImagePlaceholderWrap.removeCssClass("hide");
                adminImage.addCssClass("hide");
            }
            avatarLoaderWrap.addCssClass("hide");
        });
        adminDataReq.fetch();

        //Update user Avatar
        userAvatarInput.on("change", () => {
            if (adminAvatarForm.getFormData() && adminAvatarForm.getFormData().img) {
                const image = adminAvatarForm.getFormData().img;
                adminImage.addCssClass("hide");
                avatarLoaderWrap.removeCssClass("hide");
                avatarChangeReq.fetch({
                    imageFile: image
                });

                // avatarChangeReq.onLoadingChange((status) => {
                //     if (status) {

                //     }
                // });
            }
        });
        adminAvatarForm.onFormSubmit((data) => {
            //do nothing

        });

        avatarChangeReq.onError((err) => {
        })

        avatarChangeReq.onData((data) => {
            adminAvatarForm.resetForm();
            adminImage.setAttribute("src", `${data.adminUploadAvatar}`);
            adminImage.setAttribute("srcset", `${data.adminUploadAvatar}`);
            adminImage.removeCssClass("hide");
            avatarLoaderWrap.addCssClass("hide");
        })
    } catch (err) {
        console.log("We think this page doesn't have a sidebar. Check this error - ", err.message);
    }


    function getInitials(name) {
        const words = name.split(' ');
        const initials = words.map(word => word.charAt(0).toUpperCase()).join('');
        return initials;
    }


    function getRandomValueFromArray(array) {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    function loaderAnimation(loader) {
        loader.getElement().style.background = `conic-gradient(#00B8B4 ${loaderProgress * 3.6}deg, #ededed 0deg)`;
        loaderProgress = (loaderProgress + 1) % 100;
    }
}