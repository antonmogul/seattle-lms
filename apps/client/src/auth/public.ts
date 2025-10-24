import {
  navigate,
  WFAuth,
  WFAuthMiddleware,
} from "@xatom/core";
const KEY = "@bw-auth-public";
export const publicAuth = new WFAuth<
  {
    email: string;
    name: string;
  },
  "NONE" | "USER",
  { token: string }
>();
publicAuth.setRole("NONE");

export const publicMiddleware = new WFAuthMiddleware(
  publicAuth
);

export const loadPublicAuthFromStorage = () => {
  const _data = JSON.parse(
    localStorage.getItem(KEY) || "{}"
  );
  if (
    "email" in _data &&
    "fullName" in _data &&
    "token" in _data
  ) {
    publicAuth.setUser({
      email: _data.email,
      name: _data.fullName,
    });
    publicAuth.setRole("USER");
    publicAuth.setConfig({ token: _data.token });
  }
};

export const setPublicAuthDetails = (
  fullName: string,
  email: string,
  token: string
) => {
  publicAuth.setUser({
    email,
    name: fullName,
  });
  publicAuth.setRole("USER");
  publicAuth.setConfig({ token });
  localStorage.setItem(
    KEY,
    JSON.stringify({ fullName, email, token })
  );
};

export const logoutPublicAuth = () => {
  publicAuth.logout();
  localStorage.removeItem(KEY);
  navigate("/user/sign-in");
};
