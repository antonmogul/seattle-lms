import { WFComponent } from "@xatom/core";

export const topbar = new WFComponent(`.topbar_component.is-admin`);
export const userSearchInput = topbar.getChildAsComponent(`[xa-type="list-search-input"]`).getElement() as HTMLInputElement;
export const courseStatusFilter = topbar.getChildAsComponent(`[xa-type="course-status-filter"]`);
export const courseProgressFilter = courseStatusFilter.getChildAsComponent(`[xa-type="progress-filter"]`);
export const courseCompletedFilter = courseStatusFilter.getChildAsComponent(`[xa-type="completed-filter"]`);
export const userStatusFilter = topbar.getChildAsComponent(`[xa-type="user-status-filter"]`);
export const userEnabledFilter = userStatusFilter.getChildAsComponent(`[xa-type="filter-by-enabled"]`);
export const userDisabledFilter = userStatusFilter.getChildAsComponent(`[xa-type="filter-by-disabled"]`);
export const clearFilters = topbar.getChildAsComponent(`[xa-type="clear-all-filters"]`);