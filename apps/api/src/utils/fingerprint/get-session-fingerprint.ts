import {UAParser, type UAParserHeaders} from "ua-parser-js";

export const getSessionFingerprint = async (headers: UAParserHeaders) => {
  try {
    const parsed = await UAParser(headers).withClientHints();

    return {
      userAgent: parsed.ua || "Unknown User Agent",
      browser: parsed.browser.toString() || "Unknown Browser",
      os: parsed.os.toString() || "Unknown OS",
      model: parsed.device.toString() || "Unknown Model",
      engine: parsed.engine.toString() || "Unknown Engine",
      device: parsed.device.toString() || "Unknown Device",
    };
  } catch (error) {
    console.error("Error parsing user agent headers:", error);
    return {
      userAgent: "Unknown User Agent",
      browser: "Unknown Browser",
      os: "Unknown OS",
      model: "Unknown Model",
      engine: "Unknown Engine",
      device: "Unknown Device",
    };
  }
};
