/// Logger module
import moment from 'moment';
import chalk from 'chalk';
import util from 'util';

// Log level enumerate
export const LogLevel = Object.freeze({
  OFF: 0,
  FATAL: 1,
  ERROR: 2,
  WARN: 3,
  INFO: 4,
  DEBUG: 5,
  TRACE: 6,
  ALL: 7
});

// Global log level
export let globalLogLevel = LogLevel.INFO;

// Logger class
export class Logger {
  // Constructor
  constructor(name) {
    this.name = name;
  }

  // Print log
  #printLog(lv, msg, args) {
    // Get time string
    const time = `${chalk.bold(moment().format('\\[YYYY-MM-DD HH:mm:ss\\]'))}`;

    // Get basic string
    let str = `${time} ${lv} (${this.name}): ${chalk.blueBright(msg)}\n`;

    // Append arguments
    for (const i of args) {
      if (i instanceof Error) {
        str += chalk.red(i.stack);
      } else if (typeof i === 'string') {
        str += chalk.gray(i);
      } else {
        str += util.inspect(i, {
          colors: true,
          compact: false,
          depth: null,
          showHidden: true
        });
      }
      str += '\n';
    }

    // Write to stdout
    process.stdout.write(str);
  }

  // Trace
  trace(msg, ...args) {
    // Check level
    if (globalLogLevel < LogLevel.TRACE) {
      return;
    }

    // Print log
    this.#printLog(chalk.gray('TRACE'), msg, args);
  }

  // Debug
  debug(msg, ...args) {
    // Check level
    if (globalLogLevel < LogLevel.DEBUG) {
      return;
    }

    // Print log
    this.#printLog(chalk.blue('DEBUG'), msg, args);
  }

  // Info
  info(msg, ...args) {
    // Check level
    if (globalLogLevel < LogLevel.INFO) {
      return;
    }

    // Print log
    this.#printLog(chalk.green('INFO'), msg, args);
  }

  // Warn
  warn(msg, ...args) {
    // Check level
    if (globalLogLevel < LogLevel.WARN) {
      return;
    }

    // Print log
    this.#printLog(chalk.yellow('WARN'), msg, args);
  }

  // Error
  error(msg, ...args) {
    // Check level
    if (globalLogLevel < LogLevel.ERROR) {
      return;
    }

    // Print log
    this.#printLog(chalk.red('ERROR'), msg, args);
  }

  // Fatal
  fatal(msg, ...args) {
    // Check level
    if (globalLogLevel < LogLevel.FATAL) {
      return;
    }

    // Print log
    this.#printLog(chalk.magenta('FATAL'), msg, args);
  }
}
