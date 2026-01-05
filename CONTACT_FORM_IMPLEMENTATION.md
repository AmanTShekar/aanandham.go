# Contact Form System Implementation

## Overview
A comprehensive contact form and inquiry system has been added to the Aanandham application, allowing users to send inquiries about listings, experiences, and general contact requests.

## Features Implemented

### 1. Backend Infrastructure

#### Database Schema (models.js)
- **Inquiry Model**: New schema for storing contact form submissions
  - Fields: name, email, phone, subject, message
  - Inquiry types: general, listing, experience, event
  - References to listings and experiences
  - Booking details: checkIn, checkOut, guests
  - Status tracking: new, read, replied, closed
  - Timestamps for tracking

#### API Routes (routes/inquiries.js)
- `POST /api/inquiries` - Submit new inquiry
- `GET /api/inquiries` - Get all inquiries (Admin only, with filters)
- `GET /api/inquiries/:id` - Get specific inquiry (Admin only)
- `PATCH /api/inquiries/:id/status` - Update inquiry status (Admin only)
- `DELETE /api/inquiries/:id` - Delete inquiry (Admin only)
- `GET /api/inquiries/stats/overview` - Get inquiry statistics (Admin only)

### 2. Frontend Components

#### ContactForm Component
- **Location**: `client/src/components/ContactForm.jsx`
- **Features**:
  - Supports multiple inquiry types (general, listing, experience, event)
  - Dynamic form fields based on inquiry type
  - Date selection for check-in/check-out
  - Guest count input
  - Real-time validation
  - Success/error state handling
  - Premium dark theme design
  - Responsive layout

#### InquiryModal Component
- **Location**: `client/src/components/InquiryModal.jsx`
- **Features**:
  - Modal wrapper for ContactForm
  - Displays listing/experience preview
  - Auto-close on success
  - Backdrop blur effect
  - Smooth animations

#### ContactPage
- **Location**: `client/src/pages/ContactPage.jsx`
- **Features**:
  - Dedicated contact page at `/contact`
  - Contact information display
  - Email: bookings@aanandhamgo.in
  - Phone: +91 9400 987 654
  - Address: Suryanelli Estate, Munnar
  - Social media links
  - Embedded Google Maps
  - Integrated ContactForm
  - SEO optimized

### 3. Integration Points

#### Listing Details Page
- **Send Inquiry** button added to booking card
- Opens InquiryModal with listing context
- Pre-fills listing information
- Allows users to specify dates and guest count

#### Experience Details Page
- **Send Inquiry** button added to booking sidebar
- Opens InquiryModal with experience context
- Pre-fills experience information
- Allows users to ask questions about the experience

### 4. API Integration

#### Frontend API Service (api.js)
```javascript
inquiryAPI.submitInquiry(inquiryData)
inquiryAPI.getAllInquiries(filters)
inquiryAPI.getInquiryById(id)
inquiryAPI.updateInquiryStatus(id, status)
inquiryAPI.deleteInquiry(id)
inquiryAPI.getInquiryStats()
```

## User Flow

### For Visitors

1. **General Contact**:
   - Navigate to `/contact` page
   - Fill out contact form
   - Submit inquiry
   - Receive confirmation

2. **Listing Inquiry**:
   - Browse listings
   - Click on a listing
   - Click "Send Inquiry" button
   - Fill out inquiry form with dates/guests
   - Submit inquiry

3. **Experience Inquiry**:
   - Browse experiences
   - Click on an experience
   - Click "Send Inquiry" button
   - Fill out inquiry form
   - Submit inquiry

### For Admins

1. **View Inquiries**:
   - Access admin panel
   - View all inquiries
   - Filter by status/type
   - View inquiry details

2. **Manage Inquiries**:
   - Mark as read/replied/closed
   - Delete spam inquiries
   - View statistics

## Email Configuration

The backend is fully configured to send email notifications. You just need to add your credentials to the `.env` file in the `server` directory.

### 1. Add credentials to `.env`:

```env
EMAIL_USER=bookings@aanandhamgo.in
EMAIL_PASS=your-app-password
EMAIL_HOST=smtp.zoho.in
EMAIL_PORT=465
```

### 2. Provider Settings

**For Zoho Mail (India):**
- Host: `smtp.zoho.in`
- Port: `465` (SSL)
- Password: You **must** generate an [App Password](https://accounts.zoho.in/home#security/app_password) if you use 2FA or external login.

**For Zoho Mail (Global):**
- Host: `smtp.zoho.com`
- Port: `465`

**For Gmail:**
- Host: `smtp.gmail.com`
- Port: `587`
- Password: Use an [App Password](https://myaccount.google.com/apppasswords).

## Design Features

- **Premium Dark Theme**: Modern black and gold color scheme
- **Smooth Animations**: Framer Motion integration
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Proper labels and ARIA attributes
- **Form Validation**: Client-side and server-side validation
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Clear confirmation messages

## Database Collections

### Inquiries Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String (optional),
  subject: String,
  message: String,
  inquiryType: 'general' | 'listing' | 'experience' | 'event',
  listing: ObjectId (optional),
  experience: ObjectId (optional),
  checkIn: Date (optional),
  checkOut: Date (optional),
  guests: Number (optional),
  status: 'new' | 'read' | 'replied' | 'closed',
  createdAt: Date,
  updatedAt: Date
}
```

## Next Steps

1. **Email Notifications**: Set up automated email notifications
2. **Admin Dashboard**: Create inquiry management interface
3. **Auto-responder**: Send automatic confirmation emails
4. **Analytics**: Track inquiry conversion rates
5. **CRM Integration**: Connect with customer relationship management system

## Files Modified/Created

### Backend
- ✅ `server/models.js` - Added Inquiry schema
- ✅ `server/routes/inquiries.js` - Created inquiry routes
- ✅ `server/index.js` - Mounted inquiry routes

### Frontend
- ✅ `client/src/components/ContactForm.jsx` - Created
- ✅ `client/src/components/InquiryModal.jsx` - Created
- ✅ `client/src/pages/ContactPage.jsx` - Enhanced
- ✅ `client/src/services/api.js` - Added inquiry API methods
- ✅ `client/src/components/listing/ListingBookingCard.jsx` - Added inquiry button
- ✅ `client/src/pages/ListingDetailsPage.jsx` - Integrated InquiryModal
- ✅ `client/src/pages/ExperienceDetailsPage.jsx` - Integrated InquiryModal

## Testing Checklist

- [ ] Submit general contact form
- [ ] Submit listing inquiry with dates
- [ ] Submit experience inquiry
- [ ] Verify form validation
- [ ] Test responsive design on mobile
- [ ] Test modal open/close
- [ ] Verify success messages
- [ ] Check database entries
- [ ] Test admin inquiry management (when implemented)

## Contact Information

All inquiries are sent to: **bookings@aanandhamgo.in**

Phone support: **+91 9400 987 654**

Location: **Suryanelli Estate, Munnar, Kerala 685618, India**
