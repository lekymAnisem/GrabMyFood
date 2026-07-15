import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1).max(1000),
  userName: z.string().min(1).max(100).optional(),
});

export function validateCreateReview(req, res, next) {
  const result = createReviewSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: {
        code: 'VALIDATION_ERROR',
        details: result.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    });
  }
  req.validatedBody = result.data;
  next();
}
