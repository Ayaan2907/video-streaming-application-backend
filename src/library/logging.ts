import chalk from "chalk";
import config from "../config/config.js";
// const storeLog = (event: any) => {};

const logType = (arg: string) => {
    switch (arg) {
        case "info":
            return chalk.blueBright;
        case "event":
            return chalk.greenBright;
        case "warning":
            return chalk.yellowBright;
        case "error":
            return chalk.redBright;
        default:
            return chalk.gray;
    }
};
!config.logging && console.log(chalk.whiteBright("Logs are disabled"));

const printLog = (args: any, type: string) => {
    config.logging &&
        console.log(
            logType(type)(
                `[${new Date().toLocaleString()}] [${type.toUpperCase()}]`
            ),
            typeof args === "string" ? logType(type)(args) : args
        );
};

const Logging = {
    log: (args: any) => printLog(args, "log"),
    info: (args: any) => printLog(args, "info"),
    event: (args: any) => printLog(args, "event"),
    warning: (args: any) => printLog(args, "warning"),
    error: (args: any) => printLog(args, "error"),
};

export default Logging;
