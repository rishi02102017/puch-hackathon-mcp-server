export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  data?: Record<string, any>;
}

class Logger {
  private log(level: LogEntry['level'], message: string, data?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    // In production, you might want to send this to a logging service
    console.log(JSON.stringify(entry));
  }

  info(message: string, data?: Record<string, any>) {
    this.log('info', message, data);
  }

  warn(message: string, data?: Record<string, any>) {
    this.log('warn', message, data);
  }

  error(message: string, data?: Record<string, any>) {
    this.log('error', message, data);
  }

  // Timing utility
  time<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    return fn().finally(() => {
      const duration = Date.now() - start;
      this.info(`Timing: ${name}`, { duration: `${duration}ms` });
    });
  }
}

export const logger = new Logger(); 