import {envVars} from "~/config";

export const isProduction = () => {
  return envVars.BUN_ENVIRONMENT === "production";
};

export const isDevelopment = () => {
  return envVars.BUN_ENVIRONMENT === "development";
};
