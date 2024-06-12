export default class Logger {
  static info(message: string): void {
    Logger.log(message, LogLevel.INFO);
  }

  static error(message: string): void {
    Logger.log(message, LogLevel.ERROR);
  }

  static warn(message: string): void {
    Logger.log(message, LogLevel.WARN);
  }

  static debug(message: string): void {
    Logger.log(message, LogLevel.DEBUG);
  }

  private static log(message: string, level: LogLevel): void {
    console.log(`${level}: ${message}`);
  }
}

enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}
