export const DEFAULT_WA_PHONE = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '9188685831';

/**
 * Format a phone number into an international numeric string without special chars
 */
export const cleanPhone = (phone = '') => {
  const digits = String(phone).replace(/\D/g, '');
  if (!digits) return DEFAULT_WA_PHONE;
  if (digits.length === 10) return '91' + digits;
  return digits;
};

/**
 * Validate phone number has at least 10 valid numeric digits
 */
export const isValidPhoneNumber = (phone = '') => {
  if (!phone) return false;
  const digits = String(phone).replace(/\D/g, '');
  return digits.length >= 10;
};

/**
 * Build a standard wa.me URL
 * @param {string} text - Message text
 * @param {string} [phone=DEFAULT_WA_PHONE] - Optional phone override
 * @returns {string} WhatsApp URL
 */
export const waLink = (text = '', phone = DEFAULT_WA_PHONE) => {
  const clean = cleanPhone(phone);
  const encoded = encodeURIComponent(text.trim());
  return `https://wa.me/${clean}?text=${encoded}`;
};

/**
 * Build standardized Booking Confirmation / Reservation Message
 */
export const buildBookingWaText = ({
  guestName,
  phone,
  email,
  packageTitle,
  dates,
  guests = 1,
  stayType,
  totalAmount,
  notes
}) => {
  const lines = [
    '🌲 *AANANDHAM GLAMPING & EXPEDITIONS RESERVATION* 🌲',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    guestName ? `👤 *Guest:* ${guestName}` : '',
    phone ? `📞 *Phone:* ${phone}` : '',
    email ? `✉️ *Email:* ${email}` : '',
    packageTitle ? `⛺ *Package:* ${packageTitle}` : '',
    dates ? `📅 *Dates:* ${dates}` : '',
    guests ? `👥 *Group Size:* ${guests} Camper${Number(guests) > 1 ? 's' : ''}` : '',
    stayType ? `🏡 *Stay Option:* ${stayType}` : '',
    totalAmount ? `💰 *Estimated Total:* ₹${Number(totalAmount).toLocaleString('en-IN')}` : '',
    notes ? `📝 *Special Requests:* ${notes}` : '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '✨ *Status:* Inquiring for Instant Mountain Ridge Confirmation',
    'Please confirm availability and share advance payment details.'
  ].filter(Boolean);

  return lines.join('\n');
};

/**
 * Build standardized Custom Package Expedition Message
 */
export const buildCustomPackageWaText = ({
  name,
  phone,
  stayType,
  duration,
  groupSize,
  selectedActivities = [],
  dietaryPref,
  dates,
  budget,
  estimatedPrice
}) => {
  const lines = [
    '🏔️ *CUSTOM AANANDHAM EXPEDITION INQUIRY* 🏔️',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    name ? `👤 *Lead Organizer:* ${name}` : '',
    phone ? `📞 *Phone:* ${phone}` : '',
    stayType ? `🏕️ *Preferred Stay:* ${stayType}` : '',
    duration ? `⏳ *Duration:* ${duration}` : '',
    groupSize ? `👥 *Squad Size:* ${groupSize} People` : '',
    dates ? `📅 *Preferred Dates:* ${dates}` : '',
    selectedActivities.length > 0 ? `🎯 *Curated Activities:*\n  • ${selectedActivities.join('\n  • ')}` : '',
    dietaryPref ? `🍲 *Meal Plan:* ${dietaryPref}` : '',
    budget ? `💵 *Target Budget:* ₹${Number(budget).toLocaleString('en-IN')}` : '',
    estimatedPrice ? `✨ *Calculated Estimate:* ₹${Number(estimatedPrice).toLocaleString('en-IN')}` : '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'Please share custom itinerary and slot availability!'
  ].filter(Boolean);

  return lines.join('\n');
};

/**
 * Build standardized General Contact / Inquiry Message
 */
export const buildInquiryWaText = ({
  name,
  email,
  phone,
  subject,
  message
}) => {
  const lines = [
    '👋 *HELLO AANANDHAM ADVENTURE DESK*',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    name ? `👤 *Name:* ${name}` : '',
    phone ? `📞 *Phone:* ${phone}` : '',
    email ? `✉️ *Email:* ${email}` : '',
    subject ? `📌 *Subject:* ${subject}` : '',
    message ? `💬 *Message:* ${message}` : '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'Looking forward to your guidance for our Munnar trip!'
  ].filter(Boolean);

  return lines.join('\n');
};
