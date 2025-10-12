import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

type MockResponse = { data: null; error: Error };

const buildMockResponse = (): MockResponse => ({
  data: null,
  error: new Error(
    'Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable live data.'
  )
});

const createThenable = <T extends Record<string, unknown>>(builder: T) => {
  Object.defineProperty(builder, 'then', {
    enumerable: false,
    configurable: true,
    value: (onFulfilled?: (value: MockResponse) => unknown, onRejected?: (reason: unknown) => unknown) =>
      Promise.resolve(buildMockResponse()).then(onFulfilled, onRejected)
  });
  return builder;
};

const createQueryBuilder = () => {
  const builder: Record<string, unknown> = {};
  const chain = builder as {
    select: (...args: unknown[]) => typeof chain;
    eq: (...args: unknown[]) => typeof chain;
    order: (...args: unknown[]) => typeof chain;
    limit: (...args: unknown[]) => typeof chain;
    maybeSingle: () => Promise<{ data: null; error: Error }>;
    single: () => Promise<{ data: null; error: Error }>;
  };

  chain.select = () => chain;
  chain.eq = () => chain;
  chain.order = () => chain;
  chain.limit = () => chain;
  chain.maybeSingle = () => Promise.resolve(buildMockResponse());
  chain.single = () => Promise.resolve(buildMockResponse());

  return createThenable(chain);
};

const createInsertBuilder = () => {
  const builder: Record<string, unknown> = {};
  const chain = builder as {
    select: (...args: unknown[]) => typeof chain;
    single: () => Promise<{ data: null; error: Error }>;
    maybeSingle: () => Promise<{ data: null; error: Error }>;
  };

  chain.select = () => chain;
  chain.single = () => Promise.resolve(buildMockResponse());
  chain.maybeSingle = () => Promise.resolve(buildMockResponse());

  return createThenable(chain);
};

const createMutationBuilder = () => {
  const builder: Record<string, unknown> = {};
  const chain = builder as {
    eq: (...args: unknown[]) => Promise<{ data: null; error: Error }>;
    select: (...args: unknown[]) => typeof chain;
    single: () => Promise<{ data: null; error: Error }>;
    maybeSingle: () => Promise<{ data: null; error: Error }>;
  };

  chain.eq = () => Promise.resolve(buildMockResponse());
  chain.select = () => chain;
  chain.single = () => Promise.resolve(buildMockResponse());
  chain.maybeSingle = () => Promise.resolve(buildMockResponse());

  return createThenable(chain);
};

type AnySupabaseClient = SupabaseClient<Record<string, unknown>>;

const createMockSupabaseClient = (): AnySupabaseClient => {
  const proxyTarget = {} as Record<string, unknown>;

  return new Proxy(proxyTarget, {
    get: (_target, prop) => {
      if (prop === 'from') {
        return () => {
          const builder = createQueryBuilder() as Record<string, unknown>;
          (builder as Record<string, unknown>).insert = () => createInsertBuilder();
          (builder as Record<string, unknown>).update = () => createMutationBuilder();
          (builder as Record<string, unknown>).delete = () => createMutationBuilder();
          return builder;
        };
      }

      if (prop === 'auth' || prop === 'storage' || prop === 'functions') {
        return createThenable({});
      }

      return () => Promise.resolve(buildMockResponse());
    }
  }) as unknown as AnySupabaseClient;
};

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn('Supabase environment variables are missing. Running in read-only demo mode.');
}

export const supabase: any = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : createMockSupabaseClient();
