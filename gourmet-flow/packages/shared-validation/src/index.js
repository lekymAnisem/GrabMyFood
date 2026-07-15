import { z } from 'zod';

export function validate(schema, sources = ['body']) {
  return (req, res, next) => {
    const data = {};
    for (const source of sources) {
      if (source === 'body') data.body = req.body;
      if (source === 'params') data.params = req.params;
      if (source === 'query') data.query = req.query;
    }

    const result = schema.safeParse(data);
    if (!result.success) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    for (const source of sources) {
      if (source === 'body') req.body = result.data.body;
      if (source === 'params') req.params = result.data.params;
      if (source === 'query') req.query = result.data.query;
    }

    next();
  };
}

export const idParam = z.object({
  params: z.object({
    id: z.string().uuid('Invalid UUID'),
  }),
});

export const paginationQuery = z.object({
  query: z.object({
    page: z.string().optional().default('1').transform(Number).pipe(z.number().int().positive()),
    limit: z.string().optional().default('20').transform(Number).pipe(z.number().int().min(1).max(100)),
  }),
});

export const emailSchema = z.string().email('Invalid email address');

export const phoneSchema = z.string().regex(
  /^\+?[1-9]\d{1,14}$/,
  'Invalid phone number (E.164 format required)',
);
