import { WFComponent } from "@xatom/core";

export const curtainLoader = () => {
    return {
        hide: () => {
            try {
                const hideLoaderTrigger = new WFComponent(`[xa-type="loader-hide-trigger"]`);
                hideLoaderTrigger.getElement().click();
            } catch (err) {
                console.log("Curtain not found.", err.message);
            }

        }
    }
}