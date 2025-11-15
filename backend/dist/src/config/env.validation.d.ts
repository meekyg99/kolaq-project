import { z } from 'zod';
declare const schema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "test", "production"]>>;
    PORT: z.ZodDefault<z.ZodNumber>;
    DATABASE_URL: z.ZodOptional<z.ZodString>;
    SUPABASE_URL: z.ZodOptional<z.ZodString>;
    SUPABASE_ANON_KEY: z.ZodOptional<z.ZodString>;
    SUPABASE_SERVICE_ROLE_KEY: z.ZodOptional<z.ZodString>;
    OPTIMIZE_API_KEY: z.ZodOptional<z.ZodString>;
    REDIS_URL: z.ZodOptional<z.ZodString>;
    JWT_SECRET: z.ZodOptional<z.ZodString>;
    JWT_EXPIRATION: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    NODE_ENV?: "development" | "test" | "production";
    PORT?: number;
    DATABASE_URL?: string;
    SUPABASE_URL?: string;
    SUPABASE_ANON_KEY?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
    OPTIMIZE_API_KEY?: string;
    REDIS_URL?: string;
    JWT_SECRET?: string;
    JWT_EXPIRATION?: string;
}, {
    NODE_ENV?: "development" | "test" | "production";
    PORT?: number;
    DATABASE_URL?: string;
    SUPABASE_URL?: string;
    SUPABASE_ANON_KEY?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
    OPTIMIZE_API_KEY?: string;
    REDIS_URL?: string;
    JWT_SECRET?: string;
    JWT_EXPIRATION?: string;
}>;
export type EnvVars = z.infer<typeof schema>;
export declare const validateEnv: (config: Record<string, unknown>) => EnvVars;
export {};
