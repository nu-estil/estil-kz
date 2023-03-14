import _ from 'lodash';
import pino, { Logger, LoggerOptions } from 'pino';
import PinoHttp, { HttpLogger, Options } from 'pino-http';

type CreateLoggerArgs = {
    logger?: LoggerOptions;
    httpLogger?: Options;
};

const prettyPrintOptions: LoggerOptions['prettyPrint'] = {
    colorize: true,
    levelFirst: true,
    suppressFlushSyncWarning: true,
    translateTime: true,
};

export const getLogger = (config?: CreateLoggerArgs): AppLogger => {
    const pinoOptions = {
        ...config?.logger,
    };
    if (config?.logger?.prettyPrint) {
        _.merge(pinoOptions, { prettyPrint: prettyPrintOptions });
    }
    const logger = pino(pinoOptions);

    logger.fatal = logger.fatal.bind(logger);
    logger.error = logger.error.bind(logger);
    logger.warn = logger.warn.bind(logger);
    logger.info = logger.info.bind(logger);
    logger.debug = logger.debug.bind(logger);
    const appLogger = new AppLogger(logger);

    return appLogger;
};

export class AppLogger {
    public constructor(public pino: Logger) {}

    public fatal = this.pino.fatal;
    public error = this.pino.error;
    public warn = this.pino.warn;
    public info = this.pino.info;
    public debug = this.pino.debug;
}

export const getPinoMiddleware = (appLogger: AppLogger, config: CreateLoggerArgs): HttpLogger => {
    const { pino: logger } = appLogger;

    return PinoHttp({
        logger,
        genReqId: (req) => req.id,
        ...config.httpLogger,
    });
};
