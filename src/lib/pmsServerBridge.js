import 'server-only';

export function pmsServerUrl() {
  const configured = process.env.PMS_BASE_URL || process.env.NEXT_PUBLIC_PMS_URL;
  if (!configured) throw new Error('PMS_BASE_URL is not configured');
  const url = new URL(configured);
  if (url.protocol !== 'https:' && !(['localhost', '127.0.0.1'].includes(url.hostname) && url.protocol === 'http:')) {
    throw new Error('PMS_BASE_URL must use HTTPS');
  }
  return url.origin;
}

export function pmsTenantId() {
  const tenantId = process.env.PMS_TENANT_ID || process.env.NEXT_PUBLIC_PMS_TENANT_ID;
  if (!tenantId && process.env.NODE_ENV === 'production') throw new Error('PMS_TENANT_ID is not configured');
  return tenantId || 't-aanandham-hq';
}

export async function requestPms(path, { method = 'GET', body, idempotencyKey, apiKey, timeoutMs = 10000 } = {}) {
  const tenant = pmsTenantId();
  const headers = { 
    Accept: 'application/json',
    'X-PMS-Tenant-Id': tenant,
  };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
  if (apiKey) headers['X-API-Key'] = apiKey;
  const response = await fetch(`${pmsServerUrl()}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
    signal: AbortSignal.timeout(timeoutMs),
  });
  const payload = await response.json().catch(() => null);
  if (!payload || typeof payload !== 'object') {
    return { status: 502, payload: { success: false, message: 'PMS returned an invalid response' } };
  }
  return { status: response.status, payload };
}
