import {envVars} from "~/config/env";

export const isProduction = () => {
  return envVars.BUN_ENVIRONMENT === "production";
};

export const isDevelopment = () => {
  return envVars.BUN_ENVIRONMENT === "development";
};
