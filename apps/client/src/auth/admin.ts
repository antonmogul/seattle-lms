import {
  navigate,
  WFAuth,
  WFAuthMiddleware,
} from "@xatom/core";
const KEY = "@bw-auth-admin";
export const adminAuth = new WFAuth<
  {
    email: string;
    name: string;
  },
  "NONE" | "ADMIN",
  { token: string }
>();
adminAuth.setRole("NONE");

export const adminMiddleware = new WFAuthMiddleware(
  adminAuth
);

export const loadAdminAuthFromStorage = () => {
  const _data = JSON.parse(
    localStorage.getItem(KEY) || "{}"
  );
  if (
    "email" in _data &&
    "fullName" in _data &&
    "token" in _data
  ) {
    adminAuth.setUser({
      email: _data.email,
      name: _data.fullName,
    });
    adminAuth.setRole("ADMIN");
    adminAuth.setConfig({ token: _data.token });
  }
};

export const setAdminAuthDetails = (
  fullName: string,
  email: string,
  token: string
) => {
  adminAuth.setUser({
    email,
    name: fullName,
  });
  adminAuth.setRole("ADMIN");
  adminAuth.setConfig({ token });
  localStorage.setItem(
    KEY,
    JSON.stringify({ fullName, email, token })
  );
};

export const logoutAdminAuth = () => {
  adminAuth.logout();
  localStorage.removeItem(KEY);
  navigate("/admin/sign-in");
};
