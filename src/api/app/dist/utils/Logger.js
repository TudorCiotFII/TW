"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    static info(message) {
        Logger.log(message, LogLevel.INFO);
    }
    static error(message) {
        Logger.log(message, LogLevel.ERROR);
    }
    static warn(message) {
        Logger.log(message, LogLevel.WARN);
    }
    static debug(message) {
        Logger.log(message, LogLevel.DEBUG);
    }
    static log(message, level) {
        console.log(`${level}: ${message}`);
    }
}
exports.default = Logger;
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "DEBUG";
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
})(LogLevel || (LogLevel = {}));
