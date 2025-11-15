import { type ZodIssue, z } from 'zod';

const schema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().positive().default(4000),
  DATABASE_URL: z.string().optional(),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  OPTIMIZE_API_KEY: z.string().optional(),
  REDIS_URL: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  JWT_EXPIRATION: z.string().default('3600m'),
});

export type EnvVars = z.infer<typeof schema>;

export const validateEnv = (config: Record<string, unknown>): EnvVars => {
  const parsed = schema.safeParse(config);

  if (!parsed.success) {
    const issues: ZodIssue[] = parsed.error.issues;
    const messages = issues
      .map(({ path, message }) => `${path.join('.') || 'root'}: ${message}`)
      .join('\n');

    throw new Error(`Invalid environment configuration:\n${messages}`);
  }

  const data = parsed.data;
  const isTest = data.NODE_ENV === 'test';
  const missing: string[] = [];

  if (!data.DATABASE_URL && !isTest) {
    missing.push('DATABASE_URL');
  }

  if (!data.JWT_SECRET && !isTest) {
    missing.push('JWT_SECRET');
  }

  if (missing.length) {
    throw new Error(
      `Missing required environment variables in ${data.NODE_ENV} mode: ${missing.join(', ')}`,
    );
  }

  return {
    ...data,
    DATABASE_URL:
      data.DATABASE_URL ??
      'postgresql://postgres:postgres@localhost:5432/postgres',
    SUPABASE_URL: data.SUPABASE_URL ?? 'http://localhost',
    SUPABASE_ANON_KEY: data.SUPABASE_ANON_KEY ?? 'local-anon-key',
    JWT_SECRET: data.JWT_SECRET ?? 'dev-secret-key',
  };
};
