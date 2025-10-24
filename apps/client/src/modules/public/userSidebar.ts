import { WFComponent, WFFormComponent } from "@xatom/core";
import { publicQL } from "../../graphql";
import { PublicUploadAvatarDocument, UserMeDocument } from "../../graphql/graphql";
import { S3_BASE_URL } from "../../config";
import { logoutPublicAuth } from "../../auth/public";
const defaultUsrAvatar = "https://assets-global.website-files.com/plugins/Basic/assets/placeholder.60f9b1840c.svg";
let loaderProgress = 0;

export const userSidebar = () => {
    console.log("Function executed");
    try {
        const userDataReq = publicQL.query(UserMeDocument);
        const avatarChangeReq = publicQL.mutation(PublicUploadAvatarDocument);
        const logoutBtn = new WFComponent(`[xa-type="sidebar-signout-btn"]`);
        logoutBtn.on("click", () => {
            logoutPublicAuth();
        })
        // const userAvatarForm = new WFFormComponent<{
        //     img: File;
        // }>(`[xa-type="avatar-upload-form"]`);
        // const userAvatarInput = new WFComponent<HTMLInputElement>(`#sidebar-dp-upload`);
        const userImage = new WFComponent(`[xa-type="user-avatar"]`);
        const userImagePlaceholderWrap = new WFComponent(`[xa-type="sidebar-user-placeholder-wrap"]`);
        const userImagePlaceHolder = userImagePlaceholderWrap.getChildAsComponent(`[xa-type="sidebar-user-placeholder"]`);
        const userName = new WFComponent(`[xa-type="user-name"]`);
        const userEmail = new WFComponent(`[xa-type="user-email"]`);
        const avatarLoaderWrap = new WFComponent(`[xa-type="avatar-loader-wrap"]`);
        const avatarLoader = avatarLoaderWrap.getChildAsComponent(`[xa-type="avatar-loader"]`);

        console.log(userName);

        window.onload = function () {
            const loaderIntervalId = setInterval(() => {
                loaderAnimation(avatarLoader);
            }, 10);
        }

        userDataReq.onLoadingChange((status) => {
            if (status) {
                avatarLoaderWrap.removeCssClass("hide");
            }
        });

        userDataReq.onData((data) => {
            if (!data.userMe.enabled) {
                logoutPublicAuth();
            } else {
                userName.getElement().innerHTML = `${data.userMe.firstName} ${data.userMe.lastName}`;
                userName.removeCssClass("disabled");
                userEmail.getElement().innerHTML = `${data.userMe.email}`;
                if (data.userMe.avatar) {
                    userImage.setAttribute("src", `${S3_BASE_URL}${data.userMe.avatar}`);
                    userImage.setAttribute("srcset", `${S3_BASE_URL}${data.userMe.avatar}`);
                    userImage.removeCssClass("hide");
                } else {
                    const fullName = `${data.userMe.firstName} ${data.userMe.lastName}`;
                    const initials = getInitials(fullName);
                    const imageColors = ['#F7E5C2', '#F2E5D1', '#EFEFEE', '#F6F6F7', '#D5E2E8', '#FBE1D5'];
                    userImagePlaceHolder.setText(`${initials}`);
                    userImagePlaceholderWrap.getElement().style.backgroundColor = getRandomValueFromArray(imageColors);
                    userImagePlaceholderWrap.removeCssClass("hide");
                    userImage.addCssClass("hide");
                }
                avatarLoaderWrap.addCssClass("hide");
            }
        });
        
        userDataReq.fetch();

        // //Update user Avatar
        // userAvatarInput.on("change", () => {
        //     if (userAvatarForm.getFormData() && userAvatarForm.getFormData().img) {
        //         const image = userAvatarForm.getFormData().img;
        //         userImage.addCssClass("hide");
        //         avatarLoaderWrap.removeCssClass("hide");
        //         avatarChangeReq.fetch({
        //             imageFile: image
        //         });
        //     }
        // });
        // userAvatarForm.onFormSubmit((data) => {
        //     //do nothing
        // });

        // avatarChangeReq.onError((err) => {
        // })

        // avatarChangeReq.onData((data) => {
        //     userAvatarForm.resetForm();
        //     userImage.setAttribute("src", `${data.publicUploadAvatar}`);
        //     userImage.setAttribute("srcset", `${data.publicUploadAvatar}`);
        //     userImage.removeCssClass("hide");
        //     avatarLoaderWrap.addCssClass("hide");
        // })
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
