import pino from 'pino';

const SENSITIVE_FIELDS = ['password', 'jwt', 'token', 'tokens', 'payment_info', 'paymentInfo', 'secret', 'authorization'];

export function createLogger(serviceName) {
  const transport = process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' } }
    : undefined;

  const logger = pino({
    name: serviceName,
    transport,
    redact: {
      paths: SENSITIVE_FIELDS,
      censor: '[REDACTED]',
    },
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        headers: req.headers,
      }),
      err: pino.stdSerializers.err,
    },
  });

  return logger;
}
