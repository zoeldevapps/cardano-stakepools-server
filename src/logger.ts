import pino from "pino";
import { options } from "./options";

export const logger: pino.Logger = pino({
  name: `assets-server`,
  transport: options.isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: "true",
        },
      }
    : undefined,
  level: options.logLevel,
});
