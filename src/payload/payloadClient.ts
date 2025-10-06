import { Payload } from 'payload';

let cached: { client: Payload | null; promise: Promise<Payload> | null } = {
  client: null,
  promise: null,
};

export default async function getPayloadClient(): Promise<Payload> {
  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    // Dynamic import to avoid issues during build
    cached.promise = (async () => {
      const { getPayload } = await import('payload');
      const payload = await getPayload({
        config: await import('@/payload.config').then(mod => mod.default),
      });
      return payload;
    })();
  }

  try {
    cached.client = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.client;
}
