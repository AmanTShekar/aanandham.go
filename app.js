/* ==========================================================================
   AANANDHAM.GO — INTERACTIVE JAVASCRIPT ENGINE
   ========================================================================== */

// ── 1. TESTIMONIALS DATA ──
const TESTIMONIALS_DATA = [
    {
        quote: `"Best decision I made this year. I was burnt out from work and needed a reset — this camp delivered exactly that. The coaches really know their stuff, the vibe is super chill, and I made friends from all over the world. Went from barely standing on a trail to actually riding the Kolukkumalai sunrise. Already booked my spot for next season."`,
        author: "Daniel Kim",
        badge: "camp '25",
        batch: "Aanandham GO, August 2025",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    {
        quote: `"I was nervous about traveling alone, but this crew made me feel at home immediately. We trekked every morning, explored hidden waterfalls, and had the kind of deep acoustic campfire conversations you usually only have with childhood friends."`,
        author: "Emma Rodriguez",
        badge: "camp '25",
        batch: "Aanandham GO, March 2025",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    {
        quote: `"Unmatched wilderness comfort. We organized a 24-member corporate team offsite at the Suryanelli ridge. Clean private western washrooms, delicious hot barbecue at 12°C, and the 4x4 jeep safari was pure adrenaline."`,
        author: "Karthik & Tribe",
        badge: "trek '25",
        batch: "Aanandham GO, November 2025",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
    },
    {
        quote: `"The heart-shaped lake at Chembra Peak took my breath away. Our trek leader paced the entire group patiently, carried medical kits, and pointed out endemic bird species. The food at basecamp felt just like home-cooked Kerala Sadhya."`,
        author: "Ananya Iyer",
        badge: "trek '26",
        batch: "Aanandham GO, January 2026",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
    }
];

let currentTestimonialIndex = 0;

function rotateTestimonial(direction) {
    currentTestimonialIndex = (currentTestimonialIndex + direction + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length;
    const nextIndex = (currentTestimonialIndex + 1) % TESTIMONIALS_DATA.length;

    const t1 = TESTIMONIALS_DATA[currentTestimonialIndex];
    const t2 = TESTIMONIALS_DATA[nextIndex];

    // Update Card 1
    document.getElementById('testQuote1').textContent = t1.quote;
    document.getElementById('testAuthor1').textContent = t1.author;
    document.getElementById('testBatch1').textContent = t1.batch;
    document.getElementById('testBadge1').textContent = t1.badge;
    document.querySelector('#testCard1 .test-avatar').src = t1.avatar;

    // Update Card 2
    document.getElementById('testQuote2').textContent = t2.quote;
    document.getElementById('testAuthor2').textContent = t2.author;
    document.getElementById('testBatch2').textContent = t2.batch;
    document.getElementById('testBadge2').textContent = t2.badge;
    document.querySelector('#testCard2 .test-avatar').src = t2.avatar;
}

// ── 2. HIGHLIGHT CARD ROTATION (Overview Section) ──
const HIGHLIGHTS_DATA = [
    {
        img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
        title: "Live in a High-Altitude Ridge Tent",
        sub: "Stay options for solo travelers, couples, and groups"
    },
    {
        img: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=800&q=80",
        title: "Sunrise Peaks & Cloud Bed Treks",
        sub: "Guided ridge walks through misty tea valleys"
    },
    {
        img: "https://images.unsplash.com/photo-1510312305653-8ed496efbe75?auto=format&fit=crop&w=800&q=80",
        title: "Acoustic Campfires & Live BBQ",
        sub: "Starlit night sessions under pristine mountain skies"
    }
];

let highlightIndex = 0;

function rotateHighlight(dir) {
    highlightIndex = (highlightIndex + dir + HIGHLIGHTS_DATA.length) % HIGHLIGHTS_DATA.length;
    const h = HIGHLIGHTS_DATA[highlightIndex];
    document.querySelector('.highlight-img').src = h.img;
    document.getElementById('highlight-title').textContent = h.title;
    document.getElementById('highlight-subtitle').textContent = h.sub;
}

// ── 3. FAQ ACCORDION TOGGLE ──
function toggleFaq(element) {
    const isOpen = element.classList.contains('open');
    document.querySelectorAll('.faq-acc-item').forEach(item => item.classList.remove('open'));
    if (!isOpen) {
        element.classList.add('open');
    }
}

// ── 4. STAY ACCOMMODATION ACCORDION TOGGLE ──
function toggleStayAcc(element) {
    const isOpen = element.classList.contains('open');
    document.querySelectorAll('.stay-acc-item').forEach(item => item.classList.remove('open'));
    if (!isOpen) {
        element.classList.add('open');
    }
}

// ── 5. PACKAGE CATEGORY FILTERING ──
function filterPackages(category, btnElement) {
    // Update active pill
    document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');

    // Filter cards
    const cards = document.querySelectorAll('.pkg-card');
    cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// ── 6. MODALS MANAGEMENT ──
function openBookingModal(pkgName, price) {
    document.getElementById('modalPkgName').textContent = pkgName;
    document.getElementById('modalPkgPrice').textContent = '₹' + price.toLocaleString();
    document.getElementById('bookingFormView').style.display = 'block';
    document.getElementById('bookingSuccessView').style.display = 'none';
    document.getElementById('bookingModal').classList.add('open');
}

function openEventModal() {
    document.getElementById('eventFormView').style.display = 'block';
    document.getElementById('eventSuccessView').style.display = 'none';
    document.getElementById('eventModal').classList.add('open');
}

function openVideoModal() {
    document.getElementById('videoModal').classList.add('open');
}

function closeModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
}

// Close on backdrop click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
        closeModals();
    }
});

// Close on Escape key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModals();
    }
});

// ── 7. BOOKING FORM SUBMISSION & WHATSAPP REDIRECT ──
function handleBookingSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('bName').value;
    const phone = document.getElementById('bPhone').value;
    const date = document.getElementById('bDate').value;
    const guests = document.getElementById('bGuests').value;
    const notes = document.getElementById('bNotes').value;
    const pkg = document.getElementById('modalPkgName').textContent;

    document.getElementById('bookingFormView').style.display = 'none';
    document.getElementById('bookingSuccessView').style.display = 'block';

    const msg = `Hi Aanandham GO! I would like to reserve a spot for *${pkg}*.\nName: ${name}\nPhone: ${phone}\nDate: ${date}\nGuests: ${guests}\nNotes: ${notes}`;
    const encoded = encodeURIComponent(msg);

    setTimeout(() => {
        window.open(`https://wa.me/919400987654?text=${encoded}`, '_blank');
    }, 700);
}

// ── 8. CUSTOM EVENT FORM SUBMISSION & WHATSAPP REDIRECT ──
function handleEventSubmit(e) {
    e.preventDefault();
    const type = document.getElementById('eType').value;
    const name = document.getElementById('eName').value;
    const phone = document.getElementById('ePhone').value;
    const size = document.getElementById('eSize').value;
    const dest = document.getElementById('eDest').value;
    const notes = document.getElementById('eNotes').value;

    document.getElementById('eventFormView').style.display = 'none';
    document.getElementById('eventSuccessView').style.display = 'block';

    const msg = `Hi Aanandham GO! I'm planning a *${type}*.\nOrganizer: ${name}\nPhone: ${phone}\nGroup Size: ${size}\nDestination: ${dest}\nDetails: ${notes}`;
    const encoded = encodeURIComponent(msg);

    setTimeout(() => {
        window.open(`https://wa.me/919400987654?text=${encoded}`, '_blank');
    }, 700);
}

// ── 9. STICKY HEADER SCROLL EFFECT ──
window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (window.scrollY > 30) {
        header.style.background = 'rgba(2, 4, 3, 0.96)';
        header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.7)';
    } else {
        header.style.background = 'rgba(2, 4, 3, 0.88)';
        header.style.boxShadow = 'none';
    }
});
