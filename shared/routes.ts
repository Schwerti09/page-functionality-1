import { z } from 'zod';
import { insertPurchaseSchema, insertDeploySchema, purchases, deploys, PRICING_PLANS } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const userStatsSchema = z.object({
  totalDeploys: z.number(),
  remainingDeploys: z.number(),
  hasUnlimited: z.boolean(),
  purchases: z.array(z.custom<typeof purchases.$inferSelect>()),
});

export const api = {
  userStats: {
    get: {
      method: 'GET' as const,
      path: '/api/user/stats',
      responses: {
        200: userStatsSchema,
        401: errorSchemas.unauthorized,
      },
    },
  },
  deploys: {
    list: {
      method: 'GET' as const,
      path: '/api/deploys',
      responses: {
        200: z.array(z.custom<typeof deploys.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/deploys',
      input: z.object({ projectName: z.string() }),
      responses: {
        201: z.custom<typeof deploys.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        402: errorSchemas.validation,
      },
    },
  },
  checkout: {
    create: {
      method: 'POST' as const,
      path: '/api/checkout',
      input: z.object({ planId: z.string() }),
      responses: {
        200: z.object({ url: z.string() }),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        503: errorSchemas.internal,
      },
    },
  },
  plans: {
    get: {
      method: 'GET' as const,
      path: '/api/plans',
      responses: {
        200: z.custom<typeof PRICING_PLANS>(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
