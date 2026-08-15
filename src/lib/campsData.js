// ── CENTRALIZED KERALA WILDERNESS CAMPS & PROPERTIES DATA ──

export const INITIAL_ALL_CAMPS = [
    {
        id: 'pkg-kolukkumalai',
        title: 'Kolukkumalai Sunrise 4x4 & High-Altitude Ridge Glamp',
        shortTitle: 'Kolukkumalai Sunrise Ridge',
        region: 'Munnar',
        category: 'Summit Trek & Glamp',
        tag: 'Bestseller ⭐',
        location: 'Suryanelli / Kolukkumalai, Munnar, Kerala',
        altitude: '7,900 FT',
        price: 2499,
        originalPrice: 3200,
        rating: 4.98,
        reviewsCount: 342,
        duration: '2 Days / 1 Night',
        difficulty: 'Moderate Offroad',
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'Perched high above the legendary rolling cloud beds of Suryanelli, Kolukkumalai is home to the world’s highest organic tea plantations. This signature glamping expedition combines high-altitude Quechua dome pods, a private 4x4 rugged Jeep climb at dawn to Tiger Rock, roaring campfire barbecues, and starlit midnight acoustic jams.',
        highlights: [
            'Private 4x4 Rugged Jeep Convoy to World’s Highest Tea Estate',
            'Tiger Rock Sunrise Ridge Hike above endless cloud carpets',
            'Live Campfire BBQ Dinner with Kerala Spiced Marinades',
            'Weatherproof Geodesic Dome Pods & Alpine Tents',
            'Certified Wilderness Marshals & Forest Entry Permits Included'
        ],
        inclusions: [
            '1 Night Accommodation (Dome Pod / Alpine Tent)',
            '4x4 Off-Road Jeep Safari to Kolukkumalai Sunrise Point',
            'Evening Campfire with Live Barbecue (Chicken / Paneer)',
            'Buffet Dinner (Authentic Kerala Cuisine) & Hot Mountain Breakfast',
            'Forest Department Permits & Certified Trek Guides',
            'Clean Western Washrooms with Hot Water Facilities'
        ],
        exclusions: [
            'Transportation to reporting basecamp (Suryanelli town)',
            'Personal trekking gear and personal snacking',
            'Tips and gratuities for safari drivers & camp crew'
        ],
        itinerary: [
            {
                day: 'Day 1',
                title: 'Check-in, Sunset Ridge Walk & Campfire BBQ',
                items: [
                    '02:00 PM – Arrival at Suryanelli Basecamp & welcome organic spiced tea.',
                    '03:00 PM – Tent / Pod allocation and briefing by expedition marshals.',
                    '04:30 PM – Guided sunset nature hike along Phantom Hill Ridge.',
                    '07:00 PM – Roaring campfire lighting with live acoustic jam session.',
                    '08:30 PM – Live BBQ skewers followed by authentic Kerala buffet dinner.',
                    '10:30 PM – Stargazing under zero light pollution skies & overnight rest.'
                ]
            },
            {
                day: 'Day 2',
                title: 'Kolukkumalai Sunrise 4x4 Safari & Tea Tasting',
                items: [
                    '04:30 AM – Wake up & hot black tea briefing.',
                    '05:00 AM – 4x4 Rugged Jeep climb to Kolukkumalai Tiger Rock (7,900 FT).',
                    '06:15 AM – Witness the legendary golden cloud bed sunrise over Tamil Nadu plains.',
                    '08:00 AM – Visit the historic 1935 orthodox tea factory for tasting.',
                    '09:30 AM – Return to basecamp for traditional Kerala breakfast.',
                    '11:00 AM – Check-out with unforgettable wilderness memories.'
                ]
            }
        ],
        rooms: [
            {
                id: 'r1',
                name: 'Geodesic Luxury Dome Pod',
                capacity: '2 Adults',
                price: 2499,
                totalUnits: 8,
                bookedUnits: 4,
                isAvailable: true,
                image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
                features: ['Valley Facing Deck', 'King Size Bed', 'En-suite Restroom', 'Thermal Blankets', 'Charging Station']
            },
            {
                id: 'r2',
                name: 'Weatherproof Alpine 4-Person Tent',
                capacity: '4 Campers',
                price: 1799,
                totalUnits: 14,
                bookedUnits: 6,
                isAvailable: true,
                image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80',
                features: ['Waterproof Flysheet', 'Foam Mattress & Sleeping Bag', 'Camping Lantern', 'Shared Modern Washrooms']
            },
            {
                id: 'r3',
                name: 'Private Cliffside Wooden Cottage',
                capacity: '3 Campers',
                price: 3499,
                totalUnits: 3,
                bookedUnits: 1,
                isAvailable: true,
                image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
                features: ['Panoramic Glass Window', 'Hot Shower Geyser', 'Private Fire Pit', 'Attendant on Call']
            }
        ],
        amenities: [
            { id: 'am-1', name: 'Campfire Circle & Acoustic Jams', icon: '🔥', enabled: true },
            { id: 'am-2', name: '4x4 Offroad Trail Access', icon: '🚙', enabled: true },
            { id: 'am-3', name: 'Western Washrooms & Running Hot Water', icon: '🚿', enabled: true },
            { id: 'am-4', name: 'Power Backup & Charging Stations', icon: '⚡', enabled: true },
            { id: 'am-5', name: 'Wilderness First Aid & Oxygen Kits', icon: '🩺', enabled: true }
        ],
        addons: [
            { id: 'ad-1', name: 'Live Campfire BBQ Platter (Chicken / Paneer)', price: 450, enabled: true },
            { id: 'ad-2', name: 'Private 4x4 Jeep Safari Upgrade', price: 1200, enabled: true },
            { id: 'ad-3', name: '4K Cinematic Drone Video Reel', price: 1500, enabled: true }
        ],
        locationCoordinates: {
            lat: '10.0892',
            lng: '77.2189',
            mapsUrl: 'https://maps.google.com/?q=Kolukkumalai+Tea+Estate',
            nearestTown: 'Suryanelli (8 km) / Munnar (28 km)'
        },
        reviews: [
            { id: 'rv-1', name: 'Ananya Sharma', location: 'Bengaluru', rating: 5, date: 'Last weekend', comment: 'The sunrise at Tiger Rock was pure magic! Sleeping in the Geodesic dome while watching stars was breathtaking. The barbecue was mouthwatering.' },
            { id: 'rv-2', name: 'Gokul Krishnan', location: 'Kochi', rating: 5, date: '2 weeks ago', comment: 'Aanandham’s team made everything seamless. The 4x4 ride is bumpy and thrilling, and the guides are extremely professional. 10/10 recommendation!' },
            { id: 'rv-3', name: 'Dr. Siddharth & Squad', location: 'Chennai', rating: 5, date: '3 weeks ago', comment: 'Best camping experience in South India. Clean washrooms, great crowd, and very safe for family and couples.' }
        ]
    },
    {
        id: 'pkg-meesapulimala',
        title: 'Meesapulimala 8,661 FT Summit Cloud Bed Trek',
        shortTitle: 'Meesapulimala Summit Trek',
        region: 'Munnar',
        category: 'Summit Trek',
        tag: 'High Peak Challenge',
        location: 'Silent Valley, Munnar, Kerala',
        altitude: '8,661 FT',
        price: 3199,
        originalPrice: 4200,
        rating: 4.99,
        reviewsCount: 264,
        duration: '2 Days / 1 Night',
        difficulty: 'Strenuous High Peak',
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'South India’s 2nd highest peak expedition. Trek across 8 rolling high-altitude hills, traverse blooming rhododendron valleys, and sleep above dense oceans of white clouds in Silent Valley basecamps.',
        highlights: [
            '8-Peak High-Altitude Ridge Crossing with Certified Marshals',
            'Wilderness Basecamp Tent Glamping in Silent Valley',
            'Official Kerala Forest Department Trek Permits Included',
            'Campfire Acoustic Session under Milky Way Stars',
            'Endless Rhododendron & Shola Grassland Valleys'
        ],
        inclusions: [
            'Basecamp Alpine Tent Glamping',
            'Forest Entry & Trekking Permits',
            'Wilderness Guide Marshals',
            'Dinner, Breakfast & Energy Trail Snacks',
            'Campfire Evening with Hot Tea'
        ],
        exclusions: [
            'Transportation to Silent Valley pickup point',
            'Personal trekking backpack and shoes'
        ],
        itinerary: [
            {
                day: 'Day 1',
                title: 'Basecamp Trek, Shola Trails & Night Camp',
                items: [
                    '01:00 PM – Meet at Munnar Silent Valley checkpost.',
                    '02:30 PM – Hike to basecamp with views of cascading streams.',
                    '07:00 PM – Campfire briefing & hot stew dinner.'
                ]
            },
            {
                day: 'Day 2',
                title: 'Summit Push to 8,661 FT & Return',
                items: [
                    '05:00 AM – Early morning summit trek across the 8 rolling ridges.',
                    '08:30 AM – Stand atop Meesapulimala Summit above the sea of clouds.',
                    '12:30 PM – Descent back to basecamp for farewell lunch.'
                ]
            }
        ],
        rooms: [
            {
                id: 'r4',
                name: 'Summit Expedition Weatherproof Tent',
                capacity: '2 Campers',
                price: 3199,
                totalUnits: 12,
                bookedUnits: 5,
                isAvailable: true,
                image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
                features: ['Double Layer Windproof Fly', 'Thermal Sleeping Bags', 'Ridge Edge Pitch', 'Foam Mattress']
            }
        ],
        amenities: [
            { id: 'am-10', name: 'Forest Permit & Entry Passes', icon: '🎫', enabled: true },
            { id: 'am-11', name: 'Wilderness Guide Marshals', icon: '🧭', enabled: true },
            { id: 'am-12', name: 'Western Washrooms at Basecamp', icon: '🚿', enabled: true }
        ],
        addons: [
            { id: 'ad-5', name: 'Trekking Pole & Thermal Kit Rental', price: 350, enabled: true }
        ],
        locationCoordinates: {
            lat: '10.0970',
            lng: '77.2023',
            mapsUrl: 'https://maps.google.com/?q=Meesapulimala+Peak',
            nearestTown: 'Munnar (24 km)'
        },
        reviews: [
            { id: 'rv-4', name: 'Karthik Rao', location: 'Hyderabad', rating: 5, date: '1 month ago', comment: 'Standing on peak 8 feeling the mountain breeze was an unforgettable feeling. Marshals were supportive every step of the way.' }
        ]
    },
    {
        id: 'pkg-suryanelli',
        title: 'Suryanelli Valley Ridge Geodesic Glamping',
        shortTitle: 'Suryanelli Valley Glamp',
        region: 'Suryanelli',
        category: 'Trek & Glamp',
        tag: 'Couples & Squads',
        location: 'Suryanelli, Idukki, Kerala',
        altitude: '6,500 FT',
        price: 1999,
        originalPrice: 2600,
        rating: 4.95,
        reviewsCount: 286,
        duration: '2 Days / 1 Night',
        difficulty: 'Easy Ridge Walk',
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'Private geodesic dome pods facing cascading green tea slopes and misty sunset valleys. Live acoustic sessions, star observation scopes, and authentic farm-to-table Kerala dining.',
        highlights: [
            'Geodesic Dome Glamping with Private Valley Decks',
            'Stargazing Telescope Observation Sessions',
            'Campfire Acoustic Music & Live Barbecue Grill',
            'Easy Sunset Ridge Nature Walks',
            'Farm-to-table Traditional Kerala Cuisine'
        ],
        inclusions: [
            'Dome Pod Accommodation',
            'Campfire & Live BBQ Skewers',
            'Dinner & Hot Breakfast',
            'Guided Evening Ridge Walk'
        ],
        exclusions: ['Personal transport to camp'],
        itinerary: [
            {
                day: 'Day 1',
                title: 'Check-in & Sunset Deck',
                items: [
                    '03:00 PM – Check-in at Suryanelli Ridge.',
                    '05:00 PM – Sunset walk through tea slopes.',
                    '07:30 PM – Campfire BBQ & acoustic sessions.'
                ]
            },
            {
                day: 'Day 2',
                title: 'Morning Mist Walk & Breakfast',
                items: [
                    '07:00 AM – Morning tea walk in the misty plantations.',
                    '08:30 AM – Kerala buffet breakfast & check-out.'
                ]
            }
        ],
        rooms: [
            {
                id: 'r6',
                name: 'Valley View Geodesic Dome',
                capacity: '2 Adults',
                price: 2199,
                totalUnits: 10,
                bookedUnits: 4,
                isAvailable: true,
                image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
                features: ['Private Valley Deck', 'Plush Bedding', 'Glass Sky Window', 'Attached Washroom']
            }
        ],
        amenities: [
            { id: 'am-20', name: 'Private Valley Deck', icon: '🌄', enabled: true },
            { id: 'am-21', name: 'Stargazing Scope', icon: '🔭', enabled: true }
        ],
        addons: [
            { id: 'ad-7', name: 'Acoustic Guitarist for Evening', price: 2000, enabled: true }
        ],
        locationCoordinates: {
            lat: '10.0381',
            lng: '77.1429',
            mapsUrl: 'https://maps.google.com/?q=Suryanelli+Munnar',
            nearestTown: 'Suryanelli (2 km)'
        },
        reviews: [
            { id: 'rv-5', name: 'Meera & Vineeth', location: 'Kochi', rating: 5, date: '3 weeks ago', comment: 'The view from the private deck in the morning with hot tea was pure therapy. Highly recommend for couples!' }
        ]
    },
    {
        id: 'pkg-phantom',
        title: 'Phantom Head Peak & Golden Hour Sunset Trek',
        shortTitle: 'Phantom Head Peak',
        region: 'Munnar',
        category: 'Summit Trek',
        tag: 'Sunset Vista',
        location: 'Munnar Ridge, Kerala',
        altitude: '6,800 FT',
        price: 1799,
        originalPrice: 2400,
        rating: 4.91,
        reviewsCount: 195,
        duration: '2 Days / 1 Night',
        difficulty: 'Moderate Trek',
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80'
        ],
        description: '360-degree panoramic golden hour peak overlooking the Western Ghats mountain layers. Guided evening cliff walk, campfire dinner, and high-altitude tent stay.',
        highlights: ['360° Mountain Panorama', 'Golden Hour Sunset Peak', 'High-Altitude Tent Stay', 'Guided Marshals', 'Campfire Dinner'],
        inclusions: ['Alpine Tent Stay', 'Dinner & Breakfast', 'Guided Peak Hike', 'Campfire'],
        exclusions: ['Personal transport'],
        itinerary: [
            {
                day: 'Day 1',
                title: 'Sunset Cliff Walk',
                items: ['03:00 PM – Basecamp arrival', '05:00 PM – Golden hour hike to Phantom Head Peak', '08:00 PM – Campfire & dinner']
            },
            {
                day: 'Day 2',
                title: 'Valley Walk',
                items: ['07:30 AM – Morning tea walk', '09:00 AM – Breakfast and departure']
            }
        ],
        rooms: [
            { id: 'r7', name: 'Alpine Ridge Tent', capacity: '2 Campers', price: 1799, totalUnits: 12, bookedUnits: 3, isAvailable: true, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', features: ['Sleeping Bag', 'Foam Mat', 'Mountain View'] }
        ],
        amenities: [{ id: 'am-30', name: 'Campfire Circle', icon: '🔥', enabled: true }],
        addons: [],
        locationCoordinates: { lat: '10.0512', lng: '77.1650', mapsUrl: 'https://maps.google.com/?q=Phantom+Head+Munnar', nearestTown: 'Munnar (18 km)' },
        reviews: [{ id: 'rv-6', name: 'Arjun N.', location: 'Trivandrum', rating: 5, date: '1 month ago', comment: 'The golden hour sunset is unbelievable. Great budget adventure!' }]
    },
    {
        id: 'pkg-chembra',
        title: 'Wayanad Chembra Peak & Heart Lake Expedition',
        shortTitle: 'Chembra Heart Lake Trek',
        region: 'Wayanad',
        category: 'Summit Trek',
        tag: 'Summit Challenge',
        location: 'Meppadi, Wayanad, Kerala',
        altitude: '6,900 FT',
        price: 3799,
        originalPrice: 4800,
        rating: 4.95,
        reviewsCount: 218,
        duration: '3 Days / 2 Nights',
        difficulty: 'High Endurance Peak',
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=1200&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'Trek through dense Western Ghats rainforest canopies, discover the legendary perennial heart-shaped mountain lake, and sleep under millions of stars in secluded estate pods.',
        highlights: ['Chembra Peak & Heart Lake Trek', 'Banasura Sagar Dam Kayaking', 'Rainforest Canopy Night Safari', 'Zero-Trace Wilderness Campout', 'Natural Rock Pool Swimming'],
        inclusions: ['2 Nights Glamping Accommodation', 'All Meals & BBQ', 'Forest Department Permits', 'Kayaking Pass', 'Certified Trek Marshals'],
        exclusions: ['Travel to Meppadi, Wayanad'],
        itinerary: [
            { day: 'Day 1', title: 'Arrival & Plantation Walk', items: ['02:00 PM – Check-in', '04:00 PM – Bamboo forest stream hike', '07:30 PM – Campfire & tribal meal'] },
            { day: 'Day 2', title: 'Chembra Summit & Heart Lake', items: ['06:00 AM – Trek start to Heart Lake (5,000 FT)', '01:00 PM – Return & rock pool swim', '07:00 PM – BBQ Night'] },
            { day: 'Day 3', title: 'Kayaking & Check-out', items: ['08:00 AM – Breakfast', '09:30 AM – Banasura Dam kayaking', '12:00 PM – Departure'] }
        ],
        rooms: [
            { id: 'r8', name: 'Estate Canopy Cottage', capacity: '2 Adults', price: 3799, totalUnits: 6, bookedUnits: 2, isAvailable: true, image: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=600&q=80', features: ['Balcony View', 'King Bed', 'Hot Geyser'] }
        ],
        amenities: [{ id: 'am-35', name: 'Permits & Passes', icon: '🎫', enabled: true }],
        addons: [],
        locationCoordinates: { lat: '11.5134', lng: '76.0917', mapsUrl: 'https://maps.google.com/?q=Chembra+Peak+Wayanad', nearestTown: 'Meppadi (7 km) / Kalpetta (18 km)' },
        reviews: [{ id: 'rv-7', name: 'Deepa V.', location: 'Bangalore', rating: 5, date: '2 weeks ago', comment: 'Heart Lake is breathtaking in real life. The entire 3-day itinerary was perfectly organized!' }]
    },
    {
        id: 'pkg-wayanad',
        title: 'Wayanad 900 Kandi Rainforest Glass Bridge Glamp',
        shortTitle: '900 Kandi Glass Bridge',
        region: 'Wayanad',
        category: 'Water & Wild',
        tag: 'Canopy Glamp',
        location: 'Meppadi, Wayanad, Kerala',
        altitude: '3,200 FT',
        price: 2699,
        originalPrice: 3500,
        rating: 4.96,
        reviewsCount: 220,
        duration: '2 Days / 1 Night',
        difficulty: 'Jungle Trail',
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'Glass bridge canopy walks, off-road 4x4 jeep safaris into deep evergreen jungle, natural rock-pool swimming, and treehouse canopy stays.',
        highlights: ['Glass Bridge Access', '4x4 Deep Forest Safari', 'Natural Stream Swims', 'Treehouse Glamp Villa', 'Tribal Dinner Feast'],
        inclusions: ['Treehouse / Alpine Tent', 'Glass Bridge Entry', '4x4 Jeep Ride', 'Dinner & Breakfast'],
        exclusions: ['Personal expenses'],
        itinerary: [
            { day: 'Day 1', title: '4x4 Jungle Ride & Glass Bridge', items: ['01:00 PM – Offroad Jeep to 900 Kandi', '03:30 PM – Glass bridge walk', '07:30 PM – Campfire & dinner'] },
            { day: 'Day 2', title: 'Rock Pool Swim', items: ['07:30 AM – Natural rock pool swim', '09:00 AM – Breakfast and departure'] }
        ],
        rooms: [
            { id: 'r9', name: 'Rainforest Treehouse Villa', capacity: '2 Adults', price: 2699, totalUnits: 6, bookedUnits: 2, isAvailable: true, image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80', features: ['Canopy Deck', 'Forest View', 'En-suite Restroom'] }
        ],
        amenities: [{ id: 'am-40', name: '4x4 Jeep Access', icon: '🚙', enabled: true }],
        addons: [],
        locationCoordinates: { lat: '11.4988', lng: '76.1345', mapsUrl: 'https://maps.google.com/?q=900+Kandi+Wayanad', nearestTown: 'Meppadi (12 km)' },
        reviews: [{ id: 'rv-8', name: 'Rohan Joshi', location: 'Mumbai', rating: 5, date: '1 month ago', comment: 'Treehouse in the deep jungle with morning bird sounds was otherworldly.' }]
    },
    {
        id: 'pkg-vagamon',
        title: 'Vagamon Pine Valley & Starlit Acoustic Camp',
        shortTitle: 'Vagamon Pine Valley Camp',
        region: 'Vagamon',
        category: 'Camp & Relax',
        tag: 'Relax & Chill',
        location: 'Pine Forest, Vagamon, Kerala',
        altitude: '4,800 FT',
        price: 2199,
        originalPrice: 2900,
        rating: 4.92,
        reviewsCount: 184,
        duration: '2 Days / 1 Night',
        difficulty: 'Easy / Family & Friends',
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'Unwind in the misty pine groves of Vagamon. Perfect for acoustic campfire jams, off-road trails, starlit barbecues, and refreshing morning walks through tea valleys.',
        highlights: ['Pine Forest Glamping Site', 'Off-Road Jeep Trail to Kurisumala', 'Sunset at Vagamon Rolling Meadows', 'Open-Mic Acoustic Campfire', 'Live Barbecue Station'],
        inclusions: ['Pine Grove Tent Stay', 'Campfire with Live BBQ', 'Dinner & Hot Breakfast', 'Guided Meadows Hike'],
        exclusions: ['Travel to Vagamon'],
        itinerary: [
            { day: 'Day 1', title: 'Pine Grove Walk & Acoustic Night', items: ['02:00 PM – Check-in', '04:30 PM – Pine forest sunset hike', '07:30 PM – Open-mic acoustic jam & BBQ'] },
            { day: 'Day 2', title: 'Rolling Meadows Walk', items: ['07:30 AM – Morning tea & green meadows walk', '09:30 AM – Breakfast and check-out'] }
        ],
        rooms: [
            { id: 'r10', name: 'Pine Forest Alpine Tent', capacity: '2 Campers', price: 2199, totalUnits: 10, bookedUnits: 3, isAvailable: true, image: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=600&q=80', features: ['Pine Grove View', 'Mattress & Blanket', 'Campfire Access'] }
        ],
        amenities: [{ id: 'am-50', name: 'Acoustic Guitar & Fire Pit', icon: '🎸', enabled: true }],
        addons: [],
        locationCoordinates: { lat: '9.6842', lng: '76.9056', mapsUrl: 'https://maps.google.com/?q=Vagamon+Pine+Forest', nearestTown: 'Vagamon Town (3 km)' },
        reviews: [{ id: 'rv-9', name: 'Nikhil & Friends', location: 'Coimbatore', rating: 5, date: '1 month ago', comment: 'Chill vibes, acoustic music by the fire, and cold pine breeze. Loved every minute!' }]
    },
    {
        id: 'pkg-athirappilly',
        title: 'Athirappilly Jungle Rapids & Riverbank Glamping',
        shortTitle: 'Athirappilly River Camp',
        region: 'Athirappilly',
        category: 'Water & Wild',
        tag: 'Rainforest River',
        location: 'Chalakudy River, Athirappilly, Kerala',
        altitude: '1,200 FT',
        price: 2499,
        originalPrice: 3400,
        rating: 4.89,
        reviewsCount: 156,
        duration: '2 Days / 1 Night',
        difficulty: 'Easy River Trails',
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=1200&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'Experience Kerala’s grandest rainforest river cascades. Natural rock-pool swims, river kayaking, birding walks in hornbill sanctuaries, and riverside luxury canvas tents.',
        highlights: ['Private River Stream Access', 'Canoeing & Kayak Equipment', 'Night Forest Insect & Hornbill Walk', 'Bamboo Raft Stream Ride', 'Forest-to-Table Kerala Feast'],
        inclusions: ['Riverside Canvas Tent', 'Kayaking & Stream Bathing', 'Campfire & Dinner', 'Breakfast'],
        exclusions: ['Travel to Athirappilly'],
        itinerary: [
            { day: 'Day 1', title: 'River Kayaking & Sunset', items: ['02:00 PM – Riverbank check-in', '04:00 PM – Kayaking in calm stream', '07:30 PM – Riverside campfire dinner'] },
            { day: 'Day 2', title: 'Hornbill Walk & Check-out', items: ['07:00 AM – Early morning birding walk', '09:00 AM – Breakfast and departure'] }
        ],
        rooms: [
            { id: 'r11', name: 'Riverside Safari Tent', capacity: '2 Adults', price: 2499, totalUnits: 8, bookedUnits: 2, isAvailable: true, image: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=600&q=80', features: ['River View Deck', 'Comfort Bed', 'Clean Washroom'] }
        ],
        amenities: [{ id: 'am-60', name: 'River Stream Access', icon: '🌊', enabled: true }],
        addons: [],
        locationCoordinates: { lat: '10.2851', lng: '76.5698', mapsUrl: 'https://maps.google.com/?q=Athirappilly+Waterfalls', nearestTown: 'Chalakudy (28 km)' },
        reviews: [{ id: 'rv-10', name: 'Pooja Nair', location: 'Thrissur', rating: 5, date: '3 weeks ago', comment: 'Waking up to the sound of flowing water and birds was pure bliss.' }]
    }
];

// Helper to get all camps, merging localStorage overrides if present
export function getAllCamps() {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('aanandham_admin_properties_v2');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            } catch (e) {
                console.error('Error parsing admin properties from localStorage:', e);
            }
        }
    }
    return INITIAL_ALL_CAMPS;
}

// Helper to find a specific camp by ID (handles prefixes like pkg- or raw slug)
export function getCampById(id) {
    const all = getAllCamps();
    if (!id) return all[0];
    const cleanTarget = String(id).toLowerCase().replace('pkg-', '').trim();
    return all.find(c => {
        const cleanId = String(c.id).toLowerCase().replace('pkg-', '').trim();
        return cleanId === cleanTarget || c.id === id;
    }) || all[0];
}
