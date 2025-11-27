"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerConfig = void 0;
exports.loggerConfig = {
    pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport: process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname',
                    singleLine: false,
                    messageFormat: '{req.method} {req.url} - {msg}',
                },
            }
            : undefined,
        customProps: (req) => ({
            userId: req.user?.id,
            userEmail: req.user?.email,
        }),
        serializers: {
            req: (req) => {
                if (!req)
                    return {};
                return {
                    id: req.id,
                    method: req.method,
                    url: req.url,
                    query: req.query,
                    params: req.params,
                    headers: req.headers
                        ? {
                            host: req.headers.host,
                            'user-agent': req.headers['user-agent'],
                            referer: req.headers.referer,
                        }
                        : undefined,
                };
            },
            res: (res) => {
                if (!res)
                    return {};
                return {
                    statusCode: res.statusCode,
                };
            },
        },
        redact: {
            paths: [
                'req.headers.authorization',
                'req.headers.cookie',
                'req.body.password',
                'req.body.passcode',
                'req.body.token',
            ],
            remove: true,
        },
        autoLogging: {
            ignore: (req) => req.url === '/health' || req.url === '/metrics',
        },
    },
};
//# sourceMappingURL=logger.config.js.map