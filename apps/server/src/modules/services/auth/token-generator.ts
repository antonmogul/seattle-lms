import { Response } from "express";
import {
  COOKIE_PREFIX,
  isProduction,
} from "../../../config/global";
import { generateToken } from "../JWT";
import dayjs from "dayjs";
const tokenGenerator = (
  tokenFor: "admin" | "user",
  tokenData: { id: string; version: number; rememberMe?: boolean },
  res?: Response
) => {
  let token = generateToken(
    {
      id: tokenData.id,
      version: tokenData.version,
      type: tokenFor,
      refreshToken: false,
      rememberMe: tokenData.rememberMe ? tokenData.rememberMe : false
    },
    "30d"
  );
  let refreshToken = generateToken(
    {
      id: tokenData.id,
      version: tokenData.version,
      refreshToken: true,
      type: tokenFor,
      rememberMe: tokenData.rememberMe ? tokenData.rememberMe : false
    },
    "30d"
  );

  if (res) {
    res.cookie(
      `${COOKIE_PREFIX}-${tokenFor}`,
      refreshToken,
      {
        httpOnly: true,
        expires: dayjs().add(30, "days").toDate(),
        secure: true,
        sameSite: "none",
      }
    );
  }

  return { token, refreshToken };
};

export default tokenGenerator;
