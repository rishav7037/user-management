import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { ConfigsService } from '../configs/configs.service';
enum LogLevel {
  error,
  warn,
  log,
  debug,
  trace,
}

@Injectable({ scope: Scope.TRANSIENT })
export class SweetLogger extends ConsoleLogger {
  private readonly checkLevel;

  constructor(private readonly configsService: ConfigsService) {
    super();
    this.checkLevel = (level: string) =>
      LogLevel[level] <= LogLevel[this.configsService.get('logger.logLevel')];
  }

  error(msg: string, trace?: string, ctx?: string) {
    if (this.checkLevel(this.error.name)) {
      trace
        ? super.error(msg, trace, this.context)
        : super.error(msg, this.context);
    }
  }

  warn(msg: string, ctx?: string) {
    if (this.checkLevel(this.warn.name)) {
      super.warn.apply(this, arguments);
    }
  }

  log(msg: string, ctx?: string) {
    if (this.checkLevel(this.log.name)) {
      super.log.apply(this, arguments);
    }
  }

  debug(msg: string, ctx?: string) {
    if (this.checkLevel(this.debug.name)) {
      super.debug.apply(this, arguments);
    }
  }

  trace(msg: string, obj?: any, ctx?: string) {
    if (this.checkLevel(this.trace.name)) {
      let logMessage = msg;
      if (obj !== undefined) {
        try {
          const str = JSON.stringify(obj);
          const maxLogSize = 1000;
          if (str.length > maxLogSize) {
            logMessage += ` ${str.substring(0, maxLogSize)}... [truncated]`;
          } else {
            logMessage += ` ${str}`;
          }
        } catch (error) {
          logMessage += ` Error while logging object: ${error.message}`;
        }
      }
      super.debug.apply(this, [logMessage, ctx]);
    }
  }
}
