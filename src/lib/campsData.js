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
        faqs: [{ q: 'What time does the Kolukkumalai sunrise trek start?', a: 'You leave basecamp at 4:30–4:45 AM in a 4x4 jeep to reach the ridge before sunrise (5:45–6:15 AM depending on season).' }, { q: 'Is the Kolukkumalai trek difficult?', a: 'The jeep-and-summit version is easy to moderate — a 20–30 minute rocky climb to the top after the jeep drop. Full-hike versions are longer and best for experienced trekkers.' }, { q: 'Do I need a permit for Kolukkumalai?', a: 'No official permit is needed, but estate access is controlled; booked expeditions handle entry through the organised jeep route.' }, { q: 'What is included in the Kolukkumalai package?', a: 'The package includes 4x4 jeep transfers, summit sunrise trek, dome/alpine tent stay, dinner BBQ, breakfast, marshals, and forest permits.' }, { q: 'Can solo travelers join the Kolukkumalai sunrise trek?', a: 'Yes — the expedition runs in shared jeep batches with marshals and is popular with solo travelers; we host 350+ solo female campers annually.' }],
        description: 'Perched high above the legendary rolling cloud beds of Suryanelli, Kolukkumalai is home to the world’s highest organic tea plantations. This signature glamping expedition combines high-altitude Quechua dome pods, a private 4x4 rugged Jeep climb at dawn to Tiger Rock, roaring campfire barbecues, and starlit midnight acoustic jams.',
        highlights: [
            'Private 4x4 Rugged Jeep Convoy to World’s Highest Tea Estate',
            'Tiger Rock Sunrise Ridge Hike above endless cloud carpets',
            'Live Campfire BBQ Dinner with Kerala Spiced Marinades',
            'Weatherproof Geodesic Dome Pods & Alpine Tents',
            'Certified Wilderness Guides & Forest Entry Permits Included'
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
        faqs: [{ q: 'How difficult is the Meesapulimala trek?', a: 'Moderate — the Rhodo Valley route is an 8–13 km ridge trek with sustained ascents. Achievable for regular walkers with a guide, tougher than Kolukkumalai but easier than Anamudi.' }, { q: 'Do I need a permit for Meesapulimala?', a: 'Yes — an ecodevelopment committee permit is required; organised treks arrange it as part of the package.' }, { q: 'How long is the Meesapulimala trek?', a: 'Typically 4–7 hours depending on route and pace; sunrise expeditions start around 3:30–4:00 AM.' }, { q: 'Is Meesapulimala good for beginners?', a: 'With an organised guide and reasonable fitness (regular 5–8 km walks), yes — but it is not a casual stroll; do Kolukkumalai first if unsure.' }, { q: 'What altitude is Meesapulimala?', a: '8,660 ft — South India\'s second-highest peak after Anamudi.' }],
        description: 'South India’s 2nd highest peak expedition. Trek across 8 rolling high-altitude hills, traverse blooming rhododendron valleys, and sleep above dense oceans of white clouds in Silent Valley basecamps.',
        highlights: [
            '8-Peak High-Altitude Ridge Crossing with Certified Guides',
            'Wilderness Basecamp Tent Glamping in Silent Valley',
            'Official Kerala Forest Department Trek Permits Included',
            'Campfire Acoustic Session under Milky Way Stars',
            'Endless Rhododendron & Shola Grassland Valleys'
        ],
        inclusions: [
            'Basecamp Alpine Tent Glamping',
            'Forest Entry & Trekking Permits',
'Wilderness Guide & Host',
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
            { id: 'am-11', name: 'Wilderness Guide & Host', icon: '🧭', enabled: true },
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
            { id: 'rv-4', name: 'Karthik Rao', location: 'Hyderabad', rating: 5, date: '1 month ago', comment: 'Standing on peak 8 feeling the mountain breeze was an unforgettable feeling. Guides were supportive every step of the way.' }
        ]
    },
    {
        id: 'pkg-suryanelli',
        title: 'Suryanelli Valley Tea Plantation Camping & Tent Stay',
        shortTitle: 'Suryanelli Valley Camping',
        region: 'Suryanelli',
        category: 'Tent Stay & Camping',
        tag: 'Clean Tents & Pods ⛺',
        location: 'Suryanelli, Munnar, Idukki, Kerala',
        altitude: '6,070 FT',
        price: 1499,
        originalPrice: 2200,
        rating: 4.95,
        reviewsCount: 286,
        duration: '2 Days / 1 Night',
        difficulty: 'Easy Camp Stay',
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80'
        ],
        faqs: [
            { q: 'Where is Suryanelli?', a: 'Suryanelli is a hill village on the Munnar–Bodimettu road, about 45 minutes from Munnar town, at ~6,000 ft altitude.' },
            { q: 'Is a Suryanelli tent stay better than staying in Munnar town?', a: 'For camping and sunrise treks, yes — Suryanelli sits closer to Kolukkumalai and Meesapulimala, with quieter campsites, clean washrooms, and clear night skies.' },
            { q: 'What types of stays are available at Suryanelli camp?', a: 'We offer clean weatherproof alpine camping tents, quad group tents, and cozy valley pods with comfortable bedding, foam mattresses, charging points, and clean modern washrooms.' },
            { q: 'Does the Suryanelli camping package include food?', a: 'Yes — the package includes evening campfire with live barbecue, authentic Kerala dinner buffet, and hot mountain breakfast.' },
            { q: 'Are washrooms clean and equipped with hot water?', a: 'Yes, our campsite maintains hygienic western washrooms with 24/7 running water and hot water facilities.' }
        ],
        description: 'Immerse yourself in authentic mountain camping surrounded by cascading green tea slopes and misty sunset valleys. Enjoy clean weatherproof alpine tent stays, cozy mountain pods, campfire barbecue, guided tea trail walks, clean modern washrooms, and farm-to-table Kerala dining.',
        highlights: [
            'Clean Weatherproof Alpine Tents & Mountain Pods',
            'Tea Plantation Sunset Ridge Nature Walk',
            'Evening Campfire with Live Barbecue Grill',
            'Hygienic Modern Washrooms with Hot Water',
            'Farm-to-table Traditional Kerala Dinner & Breakfast'
        ],
        inclusions: [
            '1 Night Tent Stay / Mountain Pod Accommodation',
            'Evening Campfire with Live Barbecue (Chicken / Veg)',
            'Buffet Dinner (Authentic Kerala Cuisine) & Hot Breakfast',
            'Guided Tea Plantation Sunset Ridge Walk',
            'Clean Western Washrooms with Hot Water'
        ],
        exclusions: [
            'Personal transportation to Suryanelli basecamp',
            'Snacks and extra personal expenses'
        ],
        itinerary: [
            {
                day: 'Day 1',
                title: 'Check-in, Tea Slopes Walk & Campfire BBQ',
                items: [
                    '03:00 PM – Arrival at Suryanelli Basecamp & welcome organic tea.',
                    '04:00 PM – Clean tent / pod allocation and briefing.',
                    '05:00 PM – Guided sunset nature walk through tea slopes.',
                    '07:30 PM – Campfire lighting with live BBQ skewers.',
                    '08:30 PM – Traditional Kerala buffet dinner.',
                    '10:00 PM – Stargazing and peaceful overnight rest.'
                ]
            },
            {
                day: 'Day 2',
                title: 'Morning Mist Walk & Breakfast',
                items: [
                    '06:30 AM – Morning tea amidst misty tea hills.',
                    '08:30 AM – Kerala breakfast buffet (Appam / Puttu / Poori).',
                    '10:00 AM – Check-out with unforgettable memories.'
                ]
            }
        ],
        rooms: [
            {
                id: 'r6_tent',
                name: 'Clean Alpine Camping Tent',
                capacity: '2-3 Campers',
                price: 1499,
                totalUnits: 16,
                bookedUnits: 5,
                isAvailable: true,
                image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80',
                features: ['Weatherproof Flysheet', 'Clean Foam Mattresses & Blankets', 'Camping Lantern', 'Clean Modern Washrooms with Hot Water']
            },
            {
                id: 'r6_pod',
                name: 'Cozy Valley Mountain Pod',
                capacity: '2 Adults',
                price: 1999,
                totalUnits: 8,
                bookedUnits: 3,
                isAvailable: true,
                image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
                features: ['Valley View Deck', 'Comfortable Plush Bed', 'Charging Points', 'Attached Modern Clean Washroom']
            },
            {
                id: 'r6_quad',
                name: 'Group Alpine Quad Tent',
                capacity: '4 Campers',
                price: 1299,
                totalUnits: 10,
                bookedUnits: 4,
                isAvailable: true,
                image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
                features: ['Spacious 4-Person Tent', '4 Foam Mattresses & Pillows', 'Thermal Blankets', 'Modern Shared Restrooms']
            }
        ],
        amenities: [
            { id: 'am-20', name: 'Clean Modern Washrooms', icon: '🚿', enabled: true },
            { id: 'am-21', name: 'Campfire Circle', icon: '🔥', enabled: true },
            { id: 'am-22', name: 'Tea Plantation Trail', icon: '🌿', enabled: true },
            { id: 'am-23', name: 'Charging Stations', icon: '⚡', enabled: true }
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
            { id: 'rv-5', name: 'Meera & Vineeth', location: 'Kochi', rating: 5, date: '3 weeks ago', comment: 'The tents were exceptionally clean and comfortable. Loved the campfire and the morning tea walk through the tea gardens!' }
        ]
    },
    {
        id: 'pkg-mini-mexico',
        title: 'Mini Mexico — Vattavada Cabins, Wood House & Tent Camp',
        shortTitle: 'Mini Mexico Vattavada',
        region: 'Munnar',
        category: 'Cabin & Tent Camp',
        tag: 'Pet Friendly 🐾',
        location: 'Vattavada, Munnar, Idukki, Kerala',
        altitude: '6,200 FT',
        price: 1500,
        originalPrice: 2000,
        rating: 4.96,
        reviewsCount: 184,
        duration: '2 Days / 1 Night',
        difficulty: 'Easy Scenic',
        isAvailable: true,
        image: 'https://scontent.fccj2-3.fna.fbcdn.net/v/t39.30808-6/468139504_18059353645850452_887727965337578026_n.jpg?stp=dst-jpg_tt6&cstp=mx1440x1800&ctp=s1440x1800&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_ohc=oC1xOL3QguUQ7kNvwExUaFi&_nc_oc=AdqHC_X7Trvkq4FymDxEGuL5oZYQ_A9Avvq4JYcMwUwlR0kVHjyBuxc1EWuN0nhJg0oZxJ8Gvn08-Q9V01vDu_rM&_nc_zt=23&_nc_ht=scontent.fccj2-3.fna&_nc_gid=YY__ZAhsYUPANNehc3z0Jg&_nc_ss=7b289&oh=00_AQE7X_fxETD23AMaMbFYVLsTixO75yepXPjVGAkk-ub32g&oe=6A8E7765',
        gallery: [
            'https://scontent.fccj2-3.fna.fbcdn.net/v/t39.30808-6/468139504_18059353645850452_887727965337578026_n.jpg?stp=dst-jpg_tt6&cstp=mx1440x1800&ctp=s1440x1800&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_ohc=oC1xOL3QguUQ7kNvwExUaFi&_nc_oc=AdqHC_X7Trvkq4FymDxEGuL5oZYQ_A9Avvq4JYcMwUwlR0kVHjyBuxc1EWuN0nhJg0oZxJ8Gvn08-Q9V01vDu_rM&_nc_zt=23&_nc_ht=scontent.fccj2-3.fna&_nc_gid=YY__ZAhsYUPANNehc3z0Jg&_nc_ss=7b289&oh=00_AQE7X_fxETD23AMaMbFYVLsTixO75yepXPjVGAkk-ub32g&oe=6A8E7765',
            'https://scontent.fccj2-3.fna.fbcdn.net/v/t51.75761-15/465987105_18057887323850452_2330242188932491135_n.jpg?stp=dst-jpg_tt6&cstp=mx1440x1800&ctp=s1440x1800&_nc_cat=105&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_ohc=ohyVrM7OLFcQ7kNvwFHrvdh&_nc_oc=AdqE2_YJJm71pcF68VtZNof72DxSOxPb1ddFus7AoVOfL1PhLTpOcxHNLzraKMqSfXg6AW_MziIHCTuKIip_RG0X&_nc_zt=23&_nc_ht=scontent.fccj2-3.fna&_nc_gid=6cYlCpdBMoawWnqR1LVDXQ&_nc_ss=7b289&oh=00_AQHA0mAdDHrIxAqeuWqQTuehH-qovuz7XM-HZmDTznZVCw&oe=6A8E85B6',
            'https://scontent.fccj2-3.fna.fbcdn.net/v/t51.75761-15/491462294_18073377121850452_2329010786375635633_n.jpg?stp=dst-jpg_tt6&cstp=mx1440x1800&ctp=s1440x1800&_nc_cat=103&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_ohc=PYDazogwLPsQ7kNvwG2GfOb&_nc_oc=Adrk7mQmJIOqPi_phzK7VgvF2QggQM0h4JH5KfyDqakHdAuw2vKm1XIuXMtMpuoLgM0lUloq7OBH9UE4Ywmej17W&_nc_zt=23&_nc_ht=scontent.fccj2-3.fna&_nc_gid=yvhIkbSNYZa4o8MCP_1gbA&_nc_ss=7b289&oh=00_AQHPLgNieqBlFFzXWznmnYP0MzIXpR8bWFBzU9CyUT9e_A&oe=6A8E7AD9',
            'https://scontent.fccj2-1.fna.fbcdn.net/v/t51.75761-15/491520082_18073531504850452_6388308843358970211_n.jpg?stp=dst-jpg_tt6&cstp=mx1440x1800&ctp=s1440x1800&_nc_cat=107&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_ohc=mIN-M0re9xMQ7kNvwFwcqWV&_nc_oc=AdryCtFd2CLUWmNYFcthuFPHZwdTWdy2MxbfDB7EqqHMSRuZmu5iL8KSdNQuC9lXeste7gmU4sTjgZxWQJmaiCOb&_nc_zt=23&_nc_ht=scontent.fccj2-1.fna&_nc_gid=LQvn5mT5n5vpg8DcfFxLYA&_nc_ss=7b289&oh=00_AQGOONw9pZw62I-9s4D9DrLHxgNWh4oMVdYFJL2wVQ0MUw&oe=6A8E6417',
            'https://scontent.fccj2-3.fna.fbcdn.net/v/t51.82787-15/657856773_18107793616850452_1148871301258396135_n.jpg?stp=dst-jpegr_tt6&cstp=mx1440x1920&ctp=s1440x1920&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_ohc=M1-75c17zYMQ7kNvwEdj-BK&_nc_oc=Adrz0g9mTdgIcZzTvpgS7-DLS7LTTgisDBmBfn4MfuHNBULyCVR1kmR4yW_pn_aTYOJMFttgMX3avoMoAMiYVvCy&_nc_zt=23&se=-1&_nc_ht=scontent.fccj2-3.fna&_nc_gid=chHb1zi7zctWGYAeBHL97w&_nc_ss=7b289&oh=00_AQEMYr8_kwT4Eqt6qGWz0YWfQ6DsuL7CJHfnGNwDK4SZrg&oe=6A8E8F50',
            'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnH8vlHaw3ERWDpX-_6ZvP-Cdhnz3Vk9bUy7gvLE8hQWkRqtDoGkC4MWdiC5Yq2Vlird1LvCjcf8bjcR3mHfFJLgypQD457k0IzHqoZhFVzspXjuS3ZrC3euEvTUVNlIb9jiTsS=s1360-w1360-h1020-rw',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyte7Yo7rCOBCWHNFbuUFVSLrHxIGNWo5hEXNa27_Nw2F0L6lJmidpoXo&s=10'
        ],
        faqs: [
            { q: 'Where is Mini Mexico located?', a: 'Mini Mexico is nestled in the serene vegetable terraced valleys of Vattavada, approximately 42 km from Munnar town in Kerala.' },
            { q: 'Is Mini Mexico pet-friendly?', a: 'Yes! Mini Mexico is a dedicated pet-friendly haven. We warmly welcome your four-legged companions.' },
            { q: 'What meals are included in the stay?', a: 'All base packages include welcome hot beverages, dinner (Chapati / Ghee Rice with Chicken Curry), and morning breakfast (Kerala Tiffin or English Breakfast).' },
            { q: 'What is the booking and special request policy?', a: 'Any additional requests, special meals, or transport bookings must be confirmed prior to arrival or during the booking process. No on-the-spot requests will be accepted upon arrival.' },
            { q: 'What activities are available at Mini Mexico?', a: 'Included with your stay is a hilltop view point trek, vegetable farm visit, and 1 hour complimentary evening campfire. Optional activities include the Shola National Park Forest Walk, 4x4 off-road rides, and waterfall excursions.' }
        ],
        description: 'Escape to the serene hills of Vattavada and experience nature at its purest. Whether you are looking for cozy cabin stays, pet-friendly tent camping, or off-road mountain adventure, Mini Mexico offers an unforgettable retreat amidst vegetable-terraced valleys, strawberry farms, and misty eucalyptus ridges. All base packages include dinner and breakfast, with access to panoramic view points and complimentary campfire.',
        highlights: [
            '100% Pet-Friendly Wilderness Sanctuary & Mountain Retreat',
            'Cozy Rustic Wood House & Alpine Cabin Stays with Valley Views',
            'Complimentary Hilltop View Point & Organic Farm Visit',
            'Included Dinner (Ghee Rice / Chapati with Chicken Curry) & Hot Breakfast',
            'Complimentary 1-Hour Campfire with Extra Duration Options',
            'Shola National Park Forest Walks & 4x4 Off-Road Trail Rides on Request'
        ],
        inclusions: [
            '1 Night Stay (Wood House / Cabin / Alpine Tent)',
            'Welcome Hot Beverages upon Arrival',
            'Dinner (Chapati / Ghee Rice with Kerala Chicken Curry or Veg Alternative)',
            'Morning Breakfast (Traditional Kerala Tiffin or English Breakfast)',
            'Hilltop View Point Guided Walk & Organic Farm Tour',
            '1 Hour Complimentary Evening Campfire',
            'Clean Western Washrooms with Hot Water Facilities',
            'Complimentary Safe Parking for 2WD & 4WD Vehicles'
        ],
        exclusions: [
            'Lunch (Optional: Veg ₹120 | Non-Veg ₹170 per head)',
            'Live BBQ (On Request: ₹200 per piece / portion)',
            'Shola National Park Forest Walk (₹300 per head)',
            'Trekking & 4x4 Off-Road Jeep Rides (Extra charge on request)',
            'Extra Campfire Time beyond 1st hour (₹500 for additional duration)',
            'Waterfall Visit (3 km from property, available on request for groups)',
            'Personal transport to Vattavada property'
        ],
        itinerary: [
            {
                day: 'Day 1',
                title: 'Check-In, Farm Visit, Hilltop Sunset & Campfire',
                items: [
                    '02:00 PM – Arrival at Mini Mexico Vattavada & welcome hot mountain beverages.',
                    '02:30 PM – Room / Tent allocation and property orientation by camp host.',
                    '04:00 PM – Guided Hilltop View Point walk & organic vegetable farm tour.',
                    '06:30 PM – Sunset golden hour tea over misty terraced hills.',
                    '07:30 PM – 1-Hour complimentary campfire gathering with starlit mountain sky.',
                    '08:30 PM – Warm dinner served (Chapati / Ghee Rice with Chicken Curry or Veg).',
                    '10:30 PM – Quiet starlit sleep in cozy cabins, wood house, or tents.'
                ]
            },
            {
                day: 'Day 2',
                title: 'Morning Forest Walk, Breakfast & Check-Out',
                items: [
                    '06:30 AM – Morning tea & birdwatching in eucalyptus breezes.',
                    '07:30 AM – Optional Shola National Park Forest Walk (₹300/head) or waterfall excursion.',
                    '09:00 AM – Traditional Kerala Tiffin or English Breakfast.',
                    '11:00 AM – Check-out with refreshed mountain memories and pet smiles.'
                ]
            }
        ],
        rooms: [
            {
                id: 'r-vattavada-woodhouse',
                name: 'Rustic Wood House (Couple Deal: ₹5,000 | Group: ₹2,000/head)',
                capacity: '2 - 6 Guests',
                price: 2000,
                couplePrice: 5000,
                totalUnits: 4,
                bookedUnits: 1,
                isAvailable: true,
                image: 'https://scontent.fccj2-3.fna.fbcdn.net/v/t39.30808-6/468139504_18059353645850452_887727965337578026_n.jpg?stp=dst-jpg_tt6&cstp=mx1440x1800&ctp=s1440x1800&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_ohc=oC1xOL3QguUQ7kNvwExUaFi&_nc_oc=AdqHC_X7Trvkq4FymDxEGuL5oZYQ_A9Avvq4JYcMwUwlR0kVHjyBuxc1EWuN0nhJg0oZxJ8Gvn08-Q9V01vDu_rM&_nc_zt=23&_nc_ht=scontent.fccj2-3.fna&_nc_gid=YY__ZAhsYUPANNehc3z0Jg&_nc_ss=7b289&oh=00_AQE7X_fxETD23AMaMbFYVLsTixO75yepXPjVGAkk-ub32g&oe=6A8E7765',
                features: ['Private Wood House', 'Valley Deck', 'En-suite Restroom', 'Dinner & Breakfast Included', 'Pet Friendly', 'Couple Deal ₹5,000 / Group ₹2,000 pp']
            },
            {
                id: 'r-vattavada-cabin',
                name: 'Cozy Mountain Cabin (Couple Deal: ₹5,000 | Group: ₹2,000/head)',
                capacity: '2 - 4 Guests',
                price: 2000,
                couplePrice: 5000,
                totalUnits: 4,
                bookedUnits: 1,
                isAvailable: true,
                image: 'https://scontent.fccj2-3.fna.fbcdn.net/v/t51.75761-15/465987105_18057887323850452_2330242188932491135_n.jpg?stp=dst-jpg_tt6&cstp=mx1440x1800&ctp=s1440x1800&_nc_cat=105&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_ohc=ohyVrM7OLFcQ7kNvwFHrvdh&_nc_oc=AdqE2_YJJm71pcF68VtZNof72DxSOxPb1ddFus7AoVOfL1PhLTpOcxHNLzraKMqSfXg6AW_MziIHCTuKIip_RG0X&_nc_zt=23&_nc_ht=scontent.fccj2-3.fna&_nc_gid=6cYlCpdBMoawWnqR1LVDXQ&_nc_ss=7b289&oh=00_AQHA0mAdDHrIxAqeuWqQTuehH-qovuz7XM-HZmDTznZVCw&oe=6A8E85B6',
                features: ['Cozy Wooden Cabin', 'Balcony Mountain View', 'En-suite Restroom', 'Dinner & Breakfast Included', 'Pet Friendly']
            },
            {
                id: 'r-vattavada-tent',
                name: 'Alpine Tent Camping (₹1,500 per head)',
                capacity: '2 - 4 Campers',
                price: 1500,
                totalUnits: 10,
                bookedUnits: 2,
                isAvailable: true,
                image: 'https://scontent.fccj2-3.fna.fbcdn.net/v/t51.75761-15/491462294_18073377121850452_2329010786375635633_n.jpg?stp=dst-jpg_tt6&cstp=mx1440x1800&ctp=s1440x1800&_nc_cat=103&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_ohc=PYDazogwLPsQ7kNvwG2GfOb&_nc_oc=Adrk7mQmJIOqPi_phzK7VgvF2QggQM0h4JH5KfyDqakHdAuw2vKm1XIuXMtMpuoLgM0lUloq7OBH9UE4Ywmej17W&_nc_zt=23&_nc_ht=scontent.fccj2-3.fna&_nc_gid=yvhIkbSNYZa4o8MCP_1gbA&_nc_ss=7b289&oh=00_AQHPLgNieqBlFFzXWznmnYP0MzIXpR8bWFBzU9CyUT9e_A&oe=6A8E7AD9',
                features: ['Weatherproof Alpine Tent', 'Foam Mattress & Warm Blankets', 'Dinner & Breakfast Included', 'Shared Clean Restrooms', 'Campfire Circle Access']
            }
        ],
        amenities: [
            { id: 'am-v1', name: '100% Pet Friendly Property 🐾', icon: '🐾', enabled: true },
            { id: 'am-v2', name: 'Hilltop View Point & Farm Visit', icon: '🌿', enabled: true },
            { id: 'am-v3', name: 'Complimentary Campfire (1 Hour)', icon: '🔥', enabled: true },
            { id: 'am-v4', name: 'Western Washrooms with Hot Water', icon: '🚿', enabled: true },
            { id: 'am-v5', name: 'On-Site 2WD & 4WD Parking', icon: '🚗', enabled: true },
            { id: 'am-v6', name: 'Shola National Park Access Nearby', icon: '🌲', enabled: true }
        ],
        addons: [
            { id: 'ad-lunch-veg', name: 'Optional Lunch (Vegetarian Meal)', price: 120, perPerson: true, enabled: true },
            { id: 'ad-lunch-nonveg', name: 'Optional Lunch (Non-Vegetarian Meal)', price: 170, perPerson: true, enabled: true },
            { id: 'ad-live-bbq', name: 'Live BBQ (Per Piece / Portion)', price: 200, enabled: true },
            { id: 'ad-forest-walk', name: 'Shola National Park Forest Walk (Per Person)', price: 300, perPerson: true, enabled: true },
            { id: 'ad-campfire-extra', name: 'Extra Campfire Hour Duration', price: 500, enabled: true }
        ],
        policyNote: 'Important Booking Policy: Any additional requests, special meals, or transport bookings must be confirmed prior to arrival or during the booking process. No on-the-spot requests will be accepted upon arrival.',
        locationCoordinates: {
            lat: '10.1834',
            lng: '77.2625',
            mapsUrl: 'https://maps.google.com/?q=Vattavada+Munnar+Kerala',
            nearestTown: 'Vattavada (1.5 km) / Munnar (42 km)'
        },
        reviews: [
            { id: 'rv-v1', name: 'Rahul & Priya', location: 'Bengaluru', rating: 5, date: '1 week ago', comment: 'Our Golden Retriever had the best time running around freely! The wood house was super cozy and dinner with ghee rice and chicken curry was fantastic.' },
            { id: 'rv-v2', name: 'Akshay Menon', location: 'Ernakulam', rating: 5, date: '2 weeks ago', comment: 'Vattavada is untouched beauty. The farm walk and hilltop sunset view were peaceful. Excellent host hospitality.' }
        ]
    },
    {
        id: 'pkg-wildlink',
        title: 'Camp Wildlink — 7-Acre Sustainable Farm Camping & Shola Wilderness',
        shortTitle: 'Camp Wildlink Vattavada',
        region: 'Munnar',
        category: 'Farm & Wilderness Camping',
        tag: '7-Acre Shola Farm 🌿',
        location: 'Pazhathottam, Vattavada, Munnar, Idukki, Kerala',
        altitude: '7,000 FT',
        price: 1499,
        originalPrice: 1999,
        rating: 4.98,
        reviewsCount: 142,
        duration: '2 Days / 1 Night',
        difficulty: 'Easy Farm Living',
        isAvailable: true,
        image: '/images/wildlinks/wildlink_16.jpg',
        gallery: [
            '/images/wildlinks/wildlink_16.jpg',
            '/images/wildlinks/wildlink_1.jpg',
            '/images/wildlinks/wildlink_3.jpg',
            '/images/wildlinks/wildlink_7.jpg',
            '/images/wildlinks/wildlink_8.jpg',
            '/images/wildlinks/wildlink_10.jpg',
            '/images/wildlinks/wildlink_12.jpg',
            '/images/wildlinks/wildlink_13.jpg'
        ],
        routeGuide: {
            from: 'Munnar Town (42 km)',
            steps: [
                'Munnar to Top Station: Start from Munnar town and head toward Vattavada along the main tar road (approx. 42 km).',
                'Vattavada Forest Checkpost: Cross Top Station to reach the Vattavada checkpost. Register your name, contact, and vehicle details with the authorities before proceeding.',
                'Turn Towards Pazhathottam: Continue toward Koviloor. Just before reaching Koviloor town, take the concrete hairpin / U-turn road on the left side that heads downhill.',
                'Pazhathottam Viewpoint (8 km): Ask locals for Pazhathottam S Valavu or Pazhathottam Viewpoint.',
                'Final Mud Road Approach: Locate Orion Farmers (Tea Fed) Resort (marked by its wooden fencing). Take the mud road directly opposite Orion to arrive at the campsite.'
            ],
            navigationWarning: 'Crucial Navigation Warning: Do not follow Google Maps deviations before Top Station that lead to rugged off-road tracks. Stick strictly to the main tarred road until you pass Top Station.',
            roadCondition: 'Road Condition: The final 8 km stretch from Vattavada town to the site is a semi-off-road route, but it is manageable for all standard vehicle types (bikes, sedans, hatchbacks, and SUVs).'
        },
        faqs: [
            { q: 'Where is Camp Wildlink located?', a: 'Camp Wildlink is perched at 7,000 ft above MSL in Pazhathottam, Vattavada (approx. 42 km from Munnar), bordering the lush Pampadum Shola National Park across a pristine 7-acre eco farm.' },
            { q: 'How do I reach Camp Wildlink from Munnar?', a: 'Drive along the main tar road from Munnar through Top Station (42 km) to the Vattavada Forest checkpost. Continue toward Koviloor, take the left downhill hairpin toward Pazhathottam Viewpoint (S Valavu), and take the mud road directly opposite Orion Farmers (Tea Fed) Resort.' },
            { q: 'What meals are included in the base tariff?', a: 'Included in your stay: Welcome Black Tea / Coffee, Veg Dinner (Chapathi with Dal Curry / Potato Curry / Veg Kurma), and Authentic South Indian Breakfast (Puttu + Kadala / Dosa-Idli + Sambar / Upma + Egg Curry).' },
            { q: 'Can we order non-veg meals or live BBQ?', a: 'Yes! Freshly prepared Chicken Curry (₹360/kg), Live BBQ Chicken (₹360/kg), and Lunch (Veg ₹120 | Non-Veg ₹150) can be added. Must be confirmed in advance.' },
            { q: 'Is Camp Wildlink pet-friendly?', a: 'Yes! Camp Wildlink offers 7 acres of free-roaming, pet-friendly open spaces for four-legged friends.' }
        ],
        description: 'Experience sustainable farm camping perched at 7,000 ft above MSL in Pazhathottam, Vattavada, bordered by the lush greens of Pampadum Shola National Park. A 7-acre eco-friendly community haven crafted for authentic mountain living, tranquility, and nature immersion.',
        highlights: [
            'Sustainable 7-Acre Farm Camping Sanctuary at 7,000 FT MSL',
            'Bordering Pristine Pampadum Shola National Park Forest',
            'Hilltop Viewpoint & Sunset Walk across Organic Farmlands',
            'Included Veg Dinner (Chapathi + Curries) & South Indian Breakfast',
            'Farm-to-Table Experience (Strawberries, Garlic, Cabbage Orchards)',
            '100% Pet-Friendly Community Grounds with Campfire Circle'
        ],
        inclusions: [
            '1 Night Accommodation (Standard Camping Tent / Wood Cabin)',
            'Welcome Hot Black Tea / Mountain Coffee on Arrival',
            'Dinner (Veg: Chapathi with Dal Curry / Potato Curry / Veg Kurma)',
            'South Indian Breakfast (Puttu+Kadala / Dosa-Idli / Upma+Egg Curry)',
            'Hilltop Sunset Walk & Organic Farm Tour',
            'Evening Community Campfire setup under the stars',
            'Sunrise Mountain Peak Trek & Shola Border Exploration',
            'Safe On-site Parking (2WD & 4WD Manageable)'
        ],
        exclusions: [
            'Lunch: Veg at ₹120 | Non-Veg at ₹150 per head',
            'Freshly prepared Chicken Curry: ₹360 per kg',
            'Live BBQ Chicken: ₹360 per kg',
            'Pampadum Shola Guided Safari / Trekking Permits',
            'Personal transport to Pazhathottam Vattavada property'
        ],
        itinerary: [
            {
                day: 'Day 1',
                title: 'Check-In (02:00 PM – 03:00 PM), Sunset Walk & Campfire',
                items: [
                    '02:00 PM – 03:00 PM – Welcome black tea/coffee & check-in across the 7-acre farm.',
                    '04:30 PM – Hilltop Viewpoint & Sunset Walk through strawberry and garlic orchards.',
                    '06:30 PM – Golden hour mist rolling in from Pampadum Shola borders.',
                    '07:30 PM – Evening community campfire setup under the stars.',
                    '08:30 PM – Warm dinner served (Chapathi with Dal / Potato / Veg Kurma or optional fresh chicken curry).',
                    '10:30 PM – Quiet starlit sleep in mountain tents or wood cabins.'
                ]
            },
            {
                day: 'Day 2',
                title: 'Sunrise Trek, South Indian Breakfast & Check-Out (10:00 AM – 12:00 PM)',
                items: [
                    '06:00 AM – Early morning tea & Sunrise Mountain Peak Trek overlooking Vattavada valley.',
                    '07:30 AM – Pampadum Shola border exploration & birdwatching.',
                    '08:30 AM – South Indian Breakfast (Puttu + Kadala / Dosa-Idli + Sambar / Upma + Egg Curry).',
                    '10:00 AM – 12:00 PM – Leisure farm stroll & check-out.'
                ]
            }
        ],
        rooms: [
            {
                id: 'r-wildlink-tent',
                name: 'Standard Farm Tent Camping (₹1,499 per head)',
                capacity: '2 - 4 Campers',
                price: 1499,
                totalUnits: 12,
                bookedUnits: 2,
                isAvailable: true,
                image: '/images/wildlinks/wildlink_7.jpg',
                features: ['High-Altitude Camping Tent', 'Foam Mattress & Warm Blankets', 'Dinner & Breakfast Included', 'Campfire Circle Access', 'Pet Friendly']
            },
            {
                id: 'r-wildlink-cabin',
                name: 'Shola View Wood Cabin (Couple Deal: ₹5,000 | Group: ₹2,000/head)',
                capacity: '2 - 4 Guests',
                price: 2000,
                couplePrice: 5000,
                totalUnits: 4,
                bookedUnits: 1,
                isAvailable: true,
                image: '/images/wildlinks/wildlink_1.jpg',
                features: ['Rustic Wood Cabin', 'Shola Forest Views', 'En-suite Restroom', 'Dinner & Breakfast Included', 'Pet Friendly']
            },
            {
                id: 'r-wildlink-cottage',
                name: 'Panoramic Farm Cottage (₹2,500 per head)',
                capacity: '2 - 6 Guests',
                price: 2500,
                totalUnits: 2,
                bookedUnits: 0,
                isAvailable: true,
                image: '/images/wildlinks/wildlink_16.jpg',
                features: ['Panoramic Deck Overlook', 'Spacious Living Area', 'En-suite Hot Shower', 'Dinner & Breakfast Included', 'Couple & Family Friendly']
            }
        ],
        amenities: [
            { id: 'am-wl1', name: '7-Acre Eco Farm Sanctuary', icon: '🌿', enabled: true },
            { id: 'am-wl2', name: '100% Pet Friendly Grounds 🐾', icon: '🐾', enabled: true },
            { id: 'am-wl3', name: 'Evening Community Campfire', icon: '🔥', enabled: true },
            { id: 'am-wl4', name: 'Sunrise Mountain Peak Trek', icon: '⛰️', enabled: true },
            { id: 'am-wl5', name: 'Pampadum Shola Exploration', icon: '🌲', enabled: true },
            { id: 'am-wl6', name: 'Safe 2WD / 4WD Parking On-Site', icon: '🚗', enabled: true }
        ],
        addons: [
            { id: 'ad-wl-lunch-veg', name: 'Lunch (Vegetarian Meal)', price: 120, perPerson: true, enabled: true },
            { id: 'ad-wl-lunch-nonveg', name: 'Lunch (Non-Vegetarian Meal)', price: 150, perPerson: true, enabled: true },
            { id: 'ad-wl-chicken-curry', name: 'Fresh Chicken Curry (Per Kg)', price: 360, enabled: true },
            { id: 'ad-wl-live-bbq', name: 'Live BBQ Chicken (Per Kg)', price: 360, enabled: true }
        ],
        policyNote: 'Important Guidelines & Policies: Strictly follow leave-no-trace zero-waste principles. Carry warm thermal layers, rain gear, and trekking shoes. All non-veg meals and live BBQ must be reserved in advance.',
        locationCoordinates: {
            lat: '10.1865',
            lng: '77.2650',
            mapsUrl: 'https://maps.google.com/?q=Pazhathottam+Vattavada+Kerala',
            nearestTown: 'Pazhathottam / Vattavada (1.5 km) / Munnar (42 km)'
        },
        reviews: [
            { id: 'rv-wl1', name: 'Siddharth & Ananya', location: 'Bengaluru', rating: 5, date: '1 week ago', comment: 'The 7-acre farm at 7,000 ft is pure magic. Sunset walk and South Indian breakfast with hot puttu and kadala was unmatchable!' },
            { id: 'rv-wl2', name: 'Gokul Krishna', location: 'Kochi', rating: 5, date: '2 weeks ago', comment: 'Peaceful tranquility bordering the Shola national park. Our dog had the best weekend of his life.' }
        ]
    }
];

const DEPRECATED_CAMP_IDS = new Set([
    'pkg-chembra-peak',
    'pkg-900-kandi',
    'pkg-vagamon-pine',
    'pkg-athirappilly',
    'pkg-athirappilly-rapids',
    'pkg-chembra',
    'pkg-vagamon',
    'pkg-phantom',
    'pkg-wayanad'
]);

// Helper to get all camps, dynamically calculating live room bookedUnits from active bookings
export function getAllCamps(bookings = null) {
    let baseCamps = INITIAL_ALL_CAMPS;
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('aanandham_admin_properties_v2');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    const cleaned = parsed.filter(c => c && c.id && !DEPRECATED_CAMP_IDS.has(c.id));
                    if (cleaned.length > 0) {
                        baseCamps = cleaned;
                    }
                }
            } catch (e) {
                console.error('Error parsing admin properties from localStorage:', e);
            }
        }
    }

    if (!Array.isArray(bookings) || bookings.length === 0) {
        return baseCamps;
    }

    // Dynamically calculate bookedUnits for each room from active bookings
    return baseCamps.map(camp => {
        if (!Array.isArray(camp.rooms)) return camp;
        const campBookings = bookings.filter(b => {
            if (['Cancelled', 'Refunded', 'Expired'].includes(b.status)) return false;
            const bCamp = (b.campsiteId || b.packageId || b.package || '').toLowerCase();
            return bCamp.includes(camp.id.toLowerCase().replace('pkg-', '')) || bCamp.includes((camp.title || camp.name || '').toLowerCase());
        });

        const updatedRooms = camp.rooms.map(room => {
            const roomBookings = campBookings.filter(b => {
                const bRoom = (b.roomType || '').toLowerCase();
                return bRoom.includes((room.name || '').toLowerCase()) || bRoom.includes((room.id || '').toLowerCase());
            });
            const liveBookedCount = roomBookings.length;
            return {
                ...room,
                bookedUnits: Math.min(room.totalUnits || 8, Math.max(room.bookedUnits || 0, liveBookedCount))
            };
        });

        return {
            ...camp,
            rooms: updatedRooms
        };
    });
}

// Helper to save all camps to localStorage
export function saveAllCamps(camps) {
    if (typeof window !== 'undefined') {
        try {
            const valid = Array.isArray(camps) ? camps.filter(c => c && c.id && !DEPRECATED_CAMP_IDS.has(c.id)) : [];
            localStorage.setItem('aanandham_admin_properties_v2', JSON.stringify(valid));
            // Trigger storage event for other components in same window
            window.dispatchEvent(new Event('storage'));
        } catch (e) {
            console.error('Error saving camps to localStorage:', e);
        }
    }
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

export const INITIAL_EVENTS = [
    {
        id: 'evt-1',
        title: 'Kolukkumalai Sunrise 4x4 & High-Altitude Ridge Glamp',
        campsite: 'Kolukkumalai Sunrise Glamping',
        dates: '24 Oct - 25 Oct 2026',
        price: 2499,
        capacity: 30,
        booked: 24,
        status: 'Fast Filling',
        guide: 'Vignesh Marshal',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'evt-2',
        title: 'Meesapulimala 8,661 FT Summit Cloud Bed Trek',
        campsite: 'Meesapulimala Basecamp',
        dates: '31 Oct - 01 Nov 2026',
        price: 2899,
        capacity: 25,
        booked: 19,
        status: 'Available',
        guide: 'Anoop Marshal',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'evt-3',
        title: 'Camp Wildlink — Vattavada Cabins, Wood House & Tent Camp',
        campsite: 'Camp Wildlink Vattavada Sanctuary',
        dates: '07 Nov - 08 Nov 2026',
        price: 1999,
        capacity: 20,
        booked: 14,
        status: 'Available',
        guide: 'Manoj Guide',
        image: 'https://scontent.fccj2-3.fna.fbcdn.net/v/t39.30808-6/468139504_18059353645850452_887727965337578026_n.jpg?stp=dst-jpg_tt6&cstp=mx1440x1800&ctp=s1440x1800&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_ohc=oC1xOL3QguUQ7kNvwExUaFi&_nc_oc=AdqHC_X7Trvkq4FymDxEGuL5oZYQ_A9Avvq4JYcMwUwlR0kVHjyBuxc1EWuN0nhJg0oZxJ8Gvn08-Q9V01vDu_rM&_nc_zt=23&_nc_ht=scontent.fccj2-3.fna&_nc_gid=YY__ZAhsYUPANNehc3z0Jg&_nc_ss=7b289&oh=00_AQE7X_fxETD23AMaMbFYVLsTixO75yepXPjVGAkk-ub32g&oe=6A8E7765'
    }
];

export const INITIAL_MARSHALS = [
    {
        id: 'msh-1',
        name: 'Vignesh Kumar',
        phone: '+91 98470 11223',
        pin: '2026',
        role: 'Senior Camp Marshal',
        campsite: 'Kolukkumalai Sunrise Glamping',
        stationId: 'kolukkumalai_gate',
        status: 'On Station',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'
    },
    {
        id: 'msh-2',
        name: 'Anoop Chandran',
        phone: '+91 94471 99881',
        pin: '9000',
        role: 'Summit Guide & Marshal',
        campsite: 'Meesapulimala Basecamp',
        stationId: 'meesapulimala_gate',
        status: 'On Station',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80'
    },
    {
        id: 'msh-3',
        name: 'Manoj Varghese',
        phone: '+91 97455 33445',
        pin: '1234',
        role: 'Basecamp Coordinator',
        campsite: 'Mini Mexico Vattavada Sanctuary',
        stationId: 'vattavada_gate',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80'
    }
];


