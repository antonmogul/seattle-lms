import app from "./app";

// (window as any).WFDebug = true;
(window as any).Webflow ||= [];

(window as any).Webflow.push(() => {
  console.log("Webflow is ready!");
  app();
});
