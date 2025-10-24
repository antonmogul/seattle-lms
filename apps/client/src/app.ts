import { loadAdminAuthFromStorage } from "./auth/admin";
import { loadPublicAuthFromStorage } from "./auth/public";
import adminRoutes from "./routes/admin";
import publicRoutes from "./routes/public";

const app = () => {
  //auth
  loadAdminAuthFromStorage();
  loadPublicAuthFromStorage();

  //routes
  adminRoutes();
  publicRoutes();
};

export default app;
