import { Params } from 'nestjs-pino';

export const loggerConfig: Params = {
  pinoHttp: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport:
      process.env.NODE_ENV !== 'production'
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
    customProps: (req: any) => ({
      userId: req.user?.id,
      userEmail: req.user?.email,
    }),
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
        headers: {
          host: req.headers.host,
          'user-agent': req.headers['user-agent'],
          referer: req.headers.referer,
        },
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
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
