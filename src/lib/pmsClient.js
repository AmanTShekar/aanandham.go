/**
 * Aanandham PMS Client SDK (@aanandham/pms-client)
 *
 * Enterprise headless client SDK for connecting the marketing website
 * to the central Aanandham OpenPMS backend.
 *
 * Static content may fall back locally; transactional actions fail closed.
 */
import { INITIAL_ALL_CAMPS } from './campsData';
import { DEFAULT_DESTINATION_CONTENT, DEFAULT_SITE_PAGES_CONTENT } from './cmsContent';

export function getPmsBaseUrl() {
  if (process.env.NEXT_PUBLIC_PMS_URL && process.env.NEXT_PUBLIC_PMS_URL !== "http://localhost:3001") {
    return process.env.NEXT_PUBLIC_PMS_URL.replace(/\/$/, "");
  }
  if (process.env.PMS_BASE_URL) {
    return process.env.PMS_BASE_URL.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV === "production") {
    return "https://pms.aanandham.in";
  }
  return "http://localhost:3001";
}

export class AanandhamPmsClient {
  constructor(config = {}) {
    this.tenantId = config.tenantId || process.env.NEXT_PUBLIC_PMS_TENANT_ID || "t-aanandham-hq";
    this.publishableKey = config.publishableKey || config.apiKey || null;
    this.endpoint = (config.endpoint || getPmsBaseUrl()).replace(/\/$/, "");

    // 1. Namespaced Campsites Resource
    this.campsites = {
      list: this.listCampsites.bind(this),
      get: this.getCampsite.bind(this),
    };

    // 2. Availability Resource
    this.availability = {
      check: this.checkAvailability.bind(this),
    };

    // 3. Inbound Inquiries Resource
    this.inquiries = {
      create: this.createInquiry.bind(this),
    };

    // 4. Bookings Resource
    this.bookings = {
      create: (data) => this.createBooking(data),
      get: (id) => this.getBooking(id),
    };

    // 5. Headless CMS Content Resource
    this.cms = {
      getContent: async (section = null) => {
        try {
          return await this._request(`/api/cms${section ? `?section=${section}` : ""}`);
        } catch {
          return { destinations: DEFAULT_DESTINATION_CONTENT, sitePages: DEFAULT_SITE_PAGES_CONTENT };
        }
      },
      getDestination: async (region) => {
        try {
          const res = await this._request(`/api/cms/destinations?region=${region}`);
          return res.destination || res.data || res;
        } catch {
          return DEFAULT_DESTINATION_CONTENT[region] || null;
        }
      },
      getBrandStory: async () => {
        try {
          const res = await this._request("/api/cms/brandStory");
          return res.brandStory || res.data || res;
        } catch {
          return DEFAULT_SITE_PAGES_CONTENT.about;
        }
      },
      getServices: async () => {
        try {
          const res = await this._request("/api/cms/services");
          return res.services || res.data || res;
        } catch {
          return DEFAULT_SITE_PAGES_CONTENT.services;
        }
      },
      getHotlines: async () => {
        try {
          const res = await this._request("/api/cms/hotlines");
          return res.hotlines || res.data || res;
        } catch {
          return DEFAULT_SITE_PAGES_CONTENT.contact;
        }
      },
    };

    // 6. Currency Engine
    this.currency = {
      getRates: async () => {
        try {
          return await this._request("/api/currency/rates");
        } catch {
          return { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095, AED: 0.044 };
        }
      },
      convert: async (amount, from = "INR", to = "USD") => {
        try {
          const rates = await this.currency.getRates();
          const inInr = from === "INR" ? amount : amount / (rates[from] || 1);
          const converted = to === "INR" ? inInr : inInr * (rates[to] || 0.012);
          return { amount, from, to, result: Math.round(converted * 100) / 100 };
        } catch {
          return { amount, from, to, result: Math.round(amount * 0.012 * 100) / 100 };
        }
      },
    };

    // 7. 1-Click Razorpay Direct Checkout
    this.checkout = {
      openPayment: (options) => this.openPaymentCheckout(options),
    };
  }

  // Internal centralized request wrapper with timeout & error handling
  async _request(path, options = {}) {
    const url = `${this.endpoint}${path}`;
    const headers = {
      "Content-Type": "application/json",
      "X-PMS-Tenant-Id": this.tenantId,
      ...(this.publishableKey ? { Authorization: `Bearer ${this.publishableKey}` } : {}),
      ...(options.headers || {}),
    };

    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeout = setTimeout(() => controller?.abort(), 3500);

    try {
      const res = await fetch(url, {
        ...options,
        headers,
        signal: controller?.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const error = new Error(errData.message || `PMS Error (${res.status})`);
        error.status = res.status;
        throw error;
      }

      return await res.json();
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  }

  async listCampsites(params = {}) {
    try {
      const query = new URLSearchParams({
        tenantId: this.tenantId,
        ...(params.region ? { region: params.region } : {}),
        ...(params.category ? { category: params.category } : {}),
      }).toString();

      const res = await this._request(`/api/properties?${query}`);
      return res.properties || res.camps || res;
    } catch {
      // Graceful fallback to verified local catalog
      if (params.region && params.region !== 'All') {
        return INITIAL_ALL_CAMPS.filter(c => c.region.toLowerCase() === params.region.toLowerCase());
      }
      return INITIAL_ALL_CAMPS;
    }
  }

  async getCampsite(campsiteId) {
    if (!campsiteId) return null;
    try {
      const list = await this.listCampsites();
      return list.find((c) => c.id === campsiteId) || null;
    } catch {
      return INITIAL_ALL_CAMPS.find((c) => c.id === campsiteId) || null;
    }
  }

  async checkAvailability({ campsiteId, date, guests = 2 }) {
    throw new Error('Live availability API is not implemented; do not display unverified vacancy.');
  }

  async createInquiry(data) {
      return await this._request("/api/inquiries", {
        method: "POST",
        body: JSON.stringify({
          tenantId: this.tenantId,
          ...data,
        }),
      });
  }

  async createBooking(bookingData) {
    return await this._request("/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        tenantId: this.tenantId,
        ...bookingData,
      }),
    });
  }

  async getBooking(bookingId) {
    throw new Error('Public booking-status lookup is not implemented; use the authenticated PMS admin API.');
  }

  async openPaymentCheckout() {
    throw new Error('This legacy checkout has no PMS-backed payment order. Use BookingEngineModal or the PMS SDK checkout.');
  }
}

// ── Singleton export for universal drop-in import ──
export const pms = new AanandhamPmsClient({
  endpoint: process.env.NEXT_PUBLIC_PMS_URL || "http://localhost:3001",
  tenantId: process.env.NEXT_PUBLIC_PMS_TENANT_ID || "t-aanandham-hq",
});

export default pms;
