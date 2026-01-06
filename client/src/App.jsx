import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PreferencesProvider } from './contexts/PreferencesContext';
import Layout from './components/Layout';
// import LoadingSpinner from './components/LoadingSpinner'; // Removed as it doesn't exist

// Lazy Load Pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ListingDetailsPage = React.lazy(() => import('./pages/ListingDetailsPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const SignupPage = React.lazy(() => import('./pages/SignupPage'));
const TripsPage = React.lazy(() => import('./pages/TripsPage'));
const WishlistsPage = React.lazy(() => import('./pages/WishlistsPage'));
const AccountPage = React.lazy(() => import('./pages/AccountPage'));
const ExperiencesPage = React.lazy(() => import('./pages/ExperiencesPage'));
const ExperienceDetailsPage = React.lazy(() => import('./pages/ExperienceDetailsPage'));
const TravelPackagesPage = React.lazy(() => import('./pages/TravelPackagesPage'));
const PackageDetailsPage = React.lazy(() => import('./pages/PackageDetailsPage'));
const DestinationsPage = React.lazy(() => import('./pages/DestinationsPage'));
const DestinationDetailsPage = React.lazy(() => import('./pages/DestinationDetailsPage'));
const GuidesPage = React.lazy(() => import('./pages/GuidesPage'));
const GuideDetailsPage = React.lazy(() => import('./pages/GuideDetailsPage'));
const PlacesPage = React.lazy(() => import('./pages/PlacesPage'));
const HotelsPage = React.lazy(() => import('./pages/HotelsPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const LegalPage = React.lazy(() => import('./pages/LegalPage'));
const FullGalleryPage = React.lazy(() => import('./pages/FullGalleryPage')); // Added by instruction
const StrangersCampPage = React.lazy(() => import('./pages/StrangersCampPage'));
const MunnarGuide = React.lazy(() => import('./pages/blogs/MunnarGuide'));
const WayanadGlamping = React.lazy(() => import('./pages/blogs/WayanadGlamping'));
const KolukkumalaiSafety = React.lazy(() => import('./pages/blogs/KolukkumalaiSafety'));
const SuryanelliSpots = React.lazy(() => import('./pages/blogs/SuryanelliSpots'));
const MunnarFAQ = React.lazy(() => import('./pages/blogs/MunnarFAQ'));

// Admin Pages
const AdminLayout = React.lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers'));
const AdminListings = React.lazy(() => import('./pages/admin/AdminListings'));
const AdminBookings = React.lazy(() => import('./pages/admin/AdminBookings'));
const AdminExperiences = React.lazy(() => import('./pages/admin/AdminExperiences'));
const AdminReviews = React.lazy(() => import('./pages/admin/AdminReviews'));
const AdminGallery = React.lazy(() => import('./pages/admin/AdminGallery'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Business Pages
const BusinessDashboard = React.lazy(() => import('./pages/business/BusinessDashboard'));

// Simple Loading Fallback
const PageLoader = () => (
  <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-white)' }}>
    <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--border-light)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
  </div>
);

import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <PreferencesProvider>
          <Router>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Main Layout - All pages with Navbar and Footer */}
                <Route path="/" element={<Layout />}>
                  {/* Home and Main Pages */}
                  <Route index element={<HomePage />} />
                  <Route path="/hotels" element={<HotelsPage />} />
                  <Route path="/stories/strangers-camp" element={<StrangersCampPage />} />
                  <Route path="/stories/munnar-camping-guide" element={<MunnarGuide />} />
                  <Route path="/stories/wayanad-glamping" element={<WayanadGlamping />} />
                  <Route path="/stories/kolukkumalai-safety" element={<KolukkumalaiSafety />} />
                  <Route path="/stories/suryanelli-spots" element={<SuryanelliSpots />} />
                  <Route path="/stories/munnar-faq" element={<MunnarFAQ />} />
                  <Route path="/gallery" element={<FullGalleryPage />} />
                  <Route path="experiences" element={<ExperiencesPage />} />
                  <Route path="experiences/:id" element={<ExperienceDetailsPage />} />
                  <Route path="listings/:id" element={<ListingDetailsPage />} />
                  <Route path="trips" element={<TripsPage />} />
                  <Route path="bookings" element={<TripsPage />} />
                  <Route path="wishlists" element={<WishlistsPage />} />
                  <Route path="account" element={<AccountPage />} />

                  {/* Places Section */}
                  <Route path="places" element={<PlacesPage />}>
                    <Route path="destinations" element={<DestinationsPage />} />
                    <Route path="packages" element={<TravelPackagesPage />} />
                    <Route path="guides" element={<GuidesPage />} />
                  </Route>

                  {/* Detail Pages */}
                  <Route path="packages/:id" element={<PackageDetailsPage />} />
                  <Route path="destinations/:id" element={<DestinationDetailsPage />} />
                  <Route path="guides/:id" element={<GuideDetailsPage />} />

                  {/* Auth Pages */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />

                  {/* Static Pages */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/terms" element={<LegalPage type="terms" />} />
                  <Route path="/privacy" element={<LegalPage type="privacy" />} />
                  <Route path="/safety" element={<LegalPage type="safety" />} />
                  <Route path="/support" element={<LegalPage type="support" />} />
                  <Route path="/careers" element={<LegalPage type="careers" />} />
                  <Route path="/press" element={<LegalPage type="press" />} />
                </Route>

                {/* Business Routes - Separate Layout */}
                <Route path="/business" element={<BusinessDashboard />} />

                {/* Admin Routes - Separate Layout */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="listings" element={<AdminListings />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="experiences" element={<AdminExperiences />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="gallery" element={<AdminGallery />} />
                </Route>

                {/* Catch-all Route for 404 - MUST be last */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Router>
        </PreferencesProvider>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App
