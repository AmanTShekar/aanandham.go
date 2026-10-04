// Contact forms and booking inquiries share the PMS-owned lead intake path.
// A local-only contact record must not be reported as delivered to the CRM.
export { POST } from '@/app/api/inquiries/route';
