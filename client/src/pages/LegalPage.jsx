import { motion } from 'framer-motion';
import { FaShieldAlt, FaBriefcase, FaNewspaper, FaQuestionCircle, FaGavel, FaUserLock } from 'react-icons/fa';
import SEO from '../components/SEO';

const pages = {
    terms: {
        title: "Terms of Service",
        icon: <FaGavel size={40} color="var(--primary)" />,
        date: "Last Updated: January 03, 2026",
        content: (
            <>
                <h3>1. Introduction</h3>
                <p>Welcome to <strong>Aanandham.go</strong>. By booking our <strong>luxury camping packages in Munnar</strong>, you agree to these terms. We facilitate bookings for verified tent stays in Suryanelli, Kolukkumalai trekking, and other premium Kerala tourism activities.</p>

                <h3>2. Booking & Refund Policy</h3>
                <p>All reservations for <strong>Munnar tent stays</strong> are subject to availability. A 100% refund is issued for cancellations made 7 days prior to check-in. Cancellations within 48 hours of your scheduled <strong>Suryanelli camping</strong> trip are non-refundable. For assistance, contact <strong>bookings@aanandhamgo.in</strong>.</p>

                <h3>3. Guest Conduct</h3>
                <p>We enforce a strict "Nature First" policy. Use of SINGLE-USE PLASTICS and loud music in protected <strong>Western Ghats</strong> forestry zones is prohibited. Violations may result in eviction from the campsite without refund.</p>

                <h3>4. Liability Disclaimer</h3>
                <p><strong>Aanandham.go</strong> acts as a premium booking partner. While we verify all <strong>Munnar glamping</strong> locations for safety, we are not liable for weather-related cancellations (e.g., fog blocking <strong>Kolukkumalai sunrise</strong>) or personal injuries during independent treks.</p>
            </>
        )
    },
    privacy: {
        title: "Privacy Policy",
        icon: <FaUserLock size={40} color="var(--primary)" />,
        date: "Last Updated: January 03, 2026",
        content: (
            <>
                <h3>1. Data Collection</h3>
                <p>To provide compliant <strong>tourism services in Kerala</strong>, we collect essential guest data (Government ID, Name) required for forest department permits for <strong>Kolukkumalai treks</strong> and campsite registration.</p>

                <h3>2. Data Usage</h3>
                <p>Your contact information is used strictly for sending booking vouchers for your <strong>luxury tent stay</strong> and emergency weather updates. We manage all communications via <strong>bookings@aanandhamgo.in</strong>.</p>

                <h3>3. Payment Security</h3>
                <p>We prioritize your safety. All transactions for our <strong>Munnar resorts</strong> and camping packages are processed through industry-standard encrypted gateways.</p>
            </>
        )
    },
    safety: {
        title: "Safety Standards",
        icon: <FaShieldAlt size={40} color="var(--primary)" />,
        date: "Your Safety, Our Priority",
        content: (
            <>
                <h3>1. Verified Campsites</h3>
                <p>Every <strong>Munnar tent stay</strong> listed on Aanandham.go is physically audited by our team. We ensure fenced perimeters, 24/7 security, and safe access roads for families and <strong>solo female travelers</strong>.</p>

                <h3>2. Jeep Safari Protocols</h3>
                <p>For <strong>Kolukkumalai jeep safaris</strong>, we use only mandated 4x4 vehicles with licensed local drivers who are experts on the <strong>Suryanelli</strong> off-road terrain.</p>

                <h3>3. Emergency Support</h3>
                <p>All partner properties have on-site first aid. For any urgent assistance during your trip, our support team at <strong>bookings@aanandhamgo.in</strong> or <strong>+91 9400 987 654</strong> is available.</p>
            </>
        )
    },
    careers: {
        title: "Careers",
        icon: <FaBriefcase size={40} color="var(--primary)" />,
        date: "Join the Adventure",
        content: (
            <>
                <h3>Work with Aanandham.go</h3>
                <p>Passionate about sustainable tourism in Kerala? We are looking for storytellers and explorers to promote <strong>Munnar's hidden gems</strong>.</p>

                <h3>Opportunities</h3>
                <ul>
                    <li><strong>Camp Manager:</strong> Oversee operations at our <strong>luxury campsites in Suryanelli</strong>.</li>
                    <li><strong>Content Creator:</strong> Capture the magic of the <strong>Western Ghats</strong>.</li>
                </ul>
                <p>Send your portfolio to <strong>bookings@aanandhamgo.in</strong>.</p>
            </>
        )
    },
    support: {
        title: "Help Center",
        icon: <FaQuestionCircle size={40} color="var(--primary)" />,
        date: "We're Here to Help",
        content: (
            <>
                <h3>Frequently Asked Questions</h3>
                <p><strong>Q: How do I book a sunrise trek?</strong><br />A: Select the 'Kolukkumalai Sunrise' add-on when booking your <strong>Suryanelli tent stay</strong>.</p>

                <p><strong>Q: Is food included?</strong><br />A: Yes, most of our <strong>Munnar glamping packages</strong> include dinner and breakfast.</p>

                <h3>Contact Us</h3>
                <p>For all inquiries regarding bookings, cancellations, or partnerships:</p>
                <ul>
                    <li>Email: <strong>bookings@aanandhamgo.in</strong></li>
                    <li>Phone: <strong>+91 9400 987 654</strong></li>
                </ul>
            </>
        )
    },
    press: {
        title: "Press & Media",
        icon: <FaNewspaper size={40} color="var(--primary)" />,
        date: "Featured Stories",
        content: (
            <>
                <h3>Media Inquiries</h3>
                <p>For official statements regarding <strong>Aanandham.go</strong> and eco-tourism in Munnar, please reach out to <strong>bookings@aanandhamgo.in</strong>.</p>

                <h3>In the News</h3>
                <p><em>"Redefining Luxury Camping in Kerala"</em> - <strong>Travel Weekly</strong></p>
                <p><em>"The Safest Tent Stays in Suryanelli"</em> - <strong>Kerala Tourism Blog</strong></p>
            </>
        )
    }
};

const LegalPage = ({ type }) => {
    const data = pages[type];
    if (!data) return (
        <div style={{ paddingTop: '100px', textAlign: 'center', color: 'white' }}>Page Not Found</div>
    );

    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg-white)', color: 'var(--text-main)' }}>
            <SEO
                title={data.title}
                description={`Read the ${data.title} for Aanandham.go - Luxury glamping and camping provider in Munnar, Kerala.`}
            />
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                        {data.icon}
                        <div>
                            <h1 style={{ fontSize: '36px', fontWeight: '800', margin: 0 }}>{data.title}</h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '5px' }}>{data.date}</p>
                        </div>
                    </div>

                    <div style={{ height: '1px', background: 'var(--border-light)', width: '100%', marginBottom: '40px' }}></div>

                    <div className="legal-content" style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                        {data.content}
                    </div>
                </motion.div>
            </div>
            {/* Inline styles for basic formatting of h3/ul inside content */}
            <style>{`
                .legal-content h3 {
                    font-size: 22px;
                    font-weight: 700;
                    color: var(--text-main);
                    margin-top: 30px;
                    margin-bottom: 15px;
                }
                .legal-content ul {
                    margin-bottom: 20px;
                    padding-left: 20px;
                }
                .legal-content li {
                    margin-bottom: 10px;
                }
                .legal-content strong {
                    color: var(--primary);
                }
            `}</style>
        </div>
    );
};

export default LegalPage;
