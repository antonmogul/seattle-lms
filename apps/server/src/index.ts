require("dotenv").config();
import "reflect-metadata";
import apiServer from "./modules/services/api-server";
import { coursesSyncCronjob } from "./modules/services/schedule-job";

apiServer(async () => {
    // await coursesSyncCronjob();
});