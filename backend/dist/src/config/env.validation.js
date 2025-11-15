"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = void 0;
const zod_1 = require("zod");
const schema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(['development', 'test', 'production'])
        .default('development'),
    PORT: zod_1.z.coerce.number().positive().default(4000),
    DATABASE_URL: zod_1.z.string().optional(),
    SUPABASE_URL: zod_1.z.string().optional(),
    SUPABASE_ANON_KEY: zod_1.z.string().optional(),
    SUPABASE_SERVICE_ROLE_KEY: zod_1.z.string().optional(),
    OPTIMIZE_API_KEY: zod_1.z.string().optional(),
    REDIS_URL: zod_1.z.string().optional(),
    JWT_SECRET: zod_1.z.string().optional(),
    JWT_EXPIRATION: zod_1.z.string().default('3600m'),
});
const validateEnv = (config) => {
    const parsed = schema.safeParse(config);
    if (!parsed.success) {
        const issues = parsed.error.issues;
        const messages = issues
            .map(({ path, message }) => `${path.join('.') || 'root'}: ${message}`)
            .join('\n');
        throw new Error(`Invalid environment configuration:\n${messages}`);
    }
    const data = parsed.data;
    const isTest = data.NODE_ENV === 'test';
    const missing = [];
    if (!data.DATABASE_URL && !isTest) {
        missing.push('DATABASE_URL');
    }
    if (!data.JWT_SECRET && !isTest) {
        missing.push('JWT_SECRET');
    }
    if (missing.length) {
        throw new Error(`Missing required environment variables in ${data.NODE_ENV} mode: ${missing.join(', ')}`);
    }
    return {
        ...data,
        DATABASE_URL: data.DATABASE_URL ??
            'postgresql://postgres:postgres@localhost:5432/postgres',
        SUPABASE_URL: data.SUPABASE_URL ?? 'http://localhost',
        SUPABASE_ANON_KEY: data.SUPABASE_ANON_KEY ?? 'local-anon-key',
        JWT_SECRET: data.JWT_SECRET ?? 'dev-secret-key',
    };
};
exports.validateEnv = validateEnv;
//# sourceMappingURL=env.validation.js.map