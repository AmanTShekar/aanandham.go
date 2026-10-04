/**
 * Universal Property & Stay Category Dictionary for Enterprise Hotel & Resort PMS
 * Mirror of PMS canonical taxonomy (checked 2026-10-04)
 */

export const PROPERTY_STAY_CATEGORIES = [
  {
    id: "hotel",
    key: "Hotel",
    slug: "hotels",
    label: "Hotels",
    shortLabel: "Hotels",
    badge: "Hotel",
    aliases: ["Hotel", "Hotel & Luxury Suites", "Luxury Hotel"],
    icon: "Building2",
    unitTerm: "Room / Suite",
    unitsPlural: "Rooms & Suites",
    pricingSuffix: "/ room / night",
    description: "City hotels, boutique stays, executive suites, and business hotels",
    defaultAmenities: [
      "High-Speed Wi-Fi",
      "Air Conditioning",
      "Room Service 24/7",
      "Swimming Pool",
      "Fitness Center",
      "Smart TV",
      "Ensuite Luxury Bathroom",
      "Daily Housekeeping",
    ],
  },
  {
    id: "resort",
    key: "Resort",
    slug: "resorts",
    label: "Resorts",
    shortLabel: "Resorts",
    badge: "Resort",
    aliases: ["Resort", "Resort & Wellness Retreat", "Wellness Retreat", "Luxury Dome Glamp"],
    icon: "Compass",
    unitTerm: "Cottage / Suite",
    unitsPlural: "Cottages & Suites",
    pricingSuffix: "/ room / night",
    description: "Expansive luxury resorts nestled in beaches, hills, or scenic forests",
    defaultAmenities: [
      "Infinity Pool",
      "Spa & Ayurveda Wellness",
      "Fine Dining Restaurant",
      "Scenic Balcony / Deck",
      "Concierge & Valet",
      "Guided Nature Walks",
      "Kids Play Area",
      "Campfire / Lounge",
    ],
  },
  {
    id: "hostel",
    key: "Hostel",
    slug: "hostels",
    label: "Hostels",
    shortLabel: "Hostels",
    badge: "Hostel",
    aliases: ["Hostel", "Hostel & Backpacker Hub", "Backpacker Hostel"],
    icon: "Bed",
    unitTerm: "Dorm Bed / Room",
    unitsPlural: "Dorm Beds & Private Rooms",
    pricingSuffix: "/ bed / night",
    description: "Shared dormitories, pod capsules, co-living spaces, and backpacker hostels",
    defaultAmenities: [
      "High-Speed Wi-Fi",
      "Shared Community Lounge",
      "Personal Locker / Storage",
      "Community Kitchen / Cafe",
      "Bunk Bed Reading Light & USB",
      "Daily Social Activities",
      "Filtered Drinking Water",
      "CCTV & Gated Access",
    ],
  },
  {
    id: "villa",
    key: "Villa",
    slug: "villas",
    label: "Villas",
    shortLabel: "Villas",
    badge: "Private Villa",
    aliases: ["Villa", "Luxury Villa & Private Estate", "Private Estate"],
    icon: "Building2",
    unitTerm: "Private Villa",
    unitsPlural: "Private Villas",
    pricingSuffix: "/ villa / night",
    description: "Standalone luxury pool villas, heritage bungalows, and private estates",
    defaultAmenities: [
      "Private Plunge Pool",
      "Personal Chef on Demand",
      "Dedicated Butler",
      "Lush Private Lawn",
      "Fully Equipped Kitchenette",
      "Outdoor BBQ Pit",
      "High-End Audio System",
      "Gated Security",
    ],
  },
  {
    id: "apartment",
    key: "Apartment",
    slug: "apartments",
    label: "Apartments",
    shortLabel: "Apartments",
    badge: "Apartment",
    aliases: ["Apartment", "Serviced Apartment", "Aparthotel", "Flat"],
    icon: "Building2",
    unitTerm: "Apartment / Studio",
    unitsPlural: "Apartments & Studios",
    pricingSuffix: "/ night",
    description: "Multi-room serviced apartments, urban studios, and long-stay flats",
    defaultAmenities: [
      "Modular Kitchenette & Refrigerator",
      "Washing Machine & Iron",
      "Workstation Desk & Wi-Fi",
      "Living Room Seating",
      "Air Conditioning",
      "Elevator Access",
      "Daily / Weekly Housekeeping",
      "Reserved Parking",
    ],
  },
  {
    id: "homestay",
    key: "Homestay",
    slug: "homestays",
    label: "Homestays",
    shortLabel: "Homestays",
    badge: "Homestay",
    aliases: ["Homestay", "Homestay & Heritage Home", "Heritage Home"],
    icon: "Home",
    unitTerm: "Heritage Room",
    unitsPlural: "Heritage Rooms",
    pricingSuffix: "/ room / night",
    description: "Warm local host stays, plantation heritage homes, and farm stays",
    defaultAmenities: [
      "Authentic Home-Cooked Meals",
      "Local Host Guidance",
      "Garden / Estate Walk",
      "Hot Water Geyser",
      "Verandah Seating",
      "Wi-Fi",
      "Peaceful Countryside Vibe",
      "Tea / Coffee Making",
    ],
  },
  {
    id: "campsite",
    key: "Campsite",
    slug: "camps",
    label: "Camps",
    shortLabel: "Camps",
    badge: "Glamp & Camp",
    aliases: [
      "Camp",
      "Campsite",
      "Campsite & Glamping Retreat",
      "Tent Stay & Camping",
      "Sky Deck & Mountain Dome",
    ],
    icon: "Tent",
    unitTerm: "Glamp Dome / Tent",
    unitsPlural: "Domes & Alpine Tents",
    pricingSuffix: "/ camper",
    description: "High-altitude glamping, luxury geodesic domes, and wilderness retreats",
    defaultAmenities: [
      "Panoramic Mountain View",
      "Stargazing Skylight",
      "Campfire & Live BBQ",
      "Attached Washroom",
      "4x4 Shuttle Access",
      "Sunrise Trek Guide",
      "Bed Warmers / Quilts",
      "Fresh Mountain Tea",
    ],
  },
  {
    id: "lodge",
    key: "Lodge",
    slug: "mountain-stays",
    label: "Mountain Stays",
    shortLabel: "Mountain Stays",
    badge: "Mountain Stay",
    aliases: [
      "Lodge",
      "Mountain Stay",
      "Eco-Lodge & Wilderness Cabin",
      "Summit Trek",
      "Summit Trek & Glamp",
    ],
    icon: "Trees",
    unitTerm: "Cabin / Treehouse",
    unitsPlural: "Cabins & Treehouses",
    pricingSuffix: "/ night",
    description: "Sustainable timber lodges, treehouses, and wildlife forest chalets",
    defaultAmenities: [
      "Eco-Friendly Solar Power",
      "Birdwatching Balcony",
      "Organic Farm-to-Table Meals",
      "Natural Spring Water",
      "Forest Trail Access",
      "Hammocks",
      "Campfire Pit",
      "Library / Tea Lounge",
    ],
  },
  {
    id: "cottage",
    key: "Cottage",
    slug: "cottages-and-cabins",
    label: "Cottages & Cabins",
    shortLabel: "Cottages & Cabins",
    badge: "Cottage & Cabin",
    aliases: [
      "Cottage",
      "Cabin",
      "Cottages",
      "Cabins",
      "Treehouse",
      "Mountain Cottage & Chalet",
      "Cabin & Tent Camp",
    ],
    icon: "Mountain",
    unitTerm: "Cottage",
    unitsPlural: "Cottages & Cabins",
    pricingSuffix: "/ cottage / night",
    description: "Cozy hillside cottages, stone chalets, and heritage hillside homes",
    defaultAmenities: [
      "Wood-Fired Fireplace",
      "Tea Estate View",
      "Verandah / Patio",
      "Hot Water Geyser",
      "Home-Cooked Meals",
      "Outdoor Seating",
      "Board Games",
      "Wi-Fi",
    ],
  },
  {
    id: "houseboat",
    key: "Houseboat",
    slug: "houseboats",
    label: "Houseboats",
    shortLabel: "Houseboats",
    badge: "Houseboat Cruise",
    aliases: ["Houseboat", "Houseboat & Floating Villa", "Floating Villa"],
    icon: "Compass",
    unitTerm: "Cruise Cabin",
    unitsPlural: "Cruise Cabins",
    pricingSuffix: "/ cabin / night",
    description: "Backwater houseboats, lake cruisers, and floating luxury suites",
    defaultAmenities: [
      "Private Captain & Crew",
      "Upper Deck Lounge",
      "Traditional Kerala Cuisine",
      "Air-Conditioned Cabins",
      "Sunset Cruise Experience",
      "Fishing Rods",
      "Dining Area",
      "Ensuite Bathroom",
    ],
  },
  {
    id: "heritage-hotel",
    key: "Heritage Hotel",
    slug: "heritage-hotels",
    label: "Heritage Hotels",
    shortLabel: "Heritage Hotels",
    badge: "Heritage Palace",
    aliases: ["Heritage Hotel", "Palace Hotel", "Heritage Property"],
    icon: "Landmark",
    unitTerm: "Heritage Room / Suite",
    unitsPlural: "Heritage Rooms & Suites",
    pricingSuffix: "/ room / night",
    description: "Historic hotels and restored palaces operated as hotels",
    defaultAmenities: [
      "Restored Heritage Architecture",
      "On-site Dining",
      "Guest Services",
      "Housekeeping",
    ],
  },
  {
    id: "guesthouse-bnb",
    key: "Guesthouse & B&B",
    slug: "guesthouses-and-bbs",
    label: "Guesthouses & B&Bs",
    shortLabel: "Guesthouses & B&Bs",
    badge: "Guesthouse / B&B",
    aliases: ["Guesthouse", "Guest House", "Bed and Breakfast", "Bed & Breakfast", "B&B"],
    icon: "Home",
    unitTerm: "Guest Room",
    unitsPlural: "Guest Rooms",
    pricingSuffix: "/ room / night",
    description: "Independent guesthouses and bed-and-breakfast properties",
    defaultAmenities: [
      "Breakfast Service",
      "Guest Lounge",
      "Local Host Support",
      "Housekeeping",
    ],
  },
  {
    id: "farmstay",
    key: "Farmstay",
    slug: "farmstays",
    label: "Farmstays",
    shortLabel: "Farmstays",
    badge: "Farmstay",
    aliases: ["Farm Stay", "Farm & Wilderness Camping", "Plantation Stay"],
    icon: "Trees",
    unitTerm: "Farm Room / Cottage",
    unitsPlural: "Farm Rooms & Cottages",
    pricingSuffix: "/ night",
    description: "Working farms, plantations, and rural guest stays",
    defaultAmenities: [
      "Farm or Plantation Access",
      "Local Produce",
      "Nature Walks",
      "Host Support",
    ],
  },
  {
    id: "eco-stay",
    key: "Eco Stay",
    slug: "eco-stays",
    label: "Eco Stays",
    shortLabel: "Eco Stays",
    badge: "Eco Retreat",
    aliases: ["Eco Stay", "Eco Lodge", "Eco-Lodge", "Sustainable Stay"],
    icon: "Trees",
    unitTerm: "Eco Room / Cabin",
    unitsPlural: "Eco Rooms & Cabins",
    pricingSuffix: "/ night",
    description: "Nature stays with an explicit low-impact operating model",
    defaultAmenities: [
      "Low-Impact Operations",
      "Waste Reduction",
      "Nature Access",
      "Locally Sourced Options",
    ],
  },
];

export const ROOM_INVENTORY_TYPES = [
  {
    id: "PRIVATE_UNIT",
    label: "Private Room / Suite / Cottage",
    badge: "Private Unit",
    description: "1 reservation books the entire private room, suite, or cottage regardless of guest count.",
    icon: "Building2",
    defaultPricing: "PER_ROOM",
    defaultBathroom: "Ensuite Private Bathroom",
    defaultBed: "1 King Bed",
    defaultCapacity: 2,
    defaultSizeSqFt: 350,
  },
  {
    id: "DORM_BED",
    label: "Shared Dormitory Bed (Hostel / Backpacker)",
    badge: "Shared Dorm",
    description: "Multi-bed dorm where individual travelers book single beds. All unbooked beds stay live.",
    icon: "Bed",
    defaultPricing: "PER_BED",
    defaultBathroom: "Shared / Common Restroom",
    defaultBed: "1 Single Bed",
    defaultCapacity: 1,
    defaultSizeSqFt: 450,
  },
  {
    id: "GLAMP_DOME",
    legacyId: "SAFARI_PITCH",
    label: "Glamping Dome / Safari Tent (Pre-Pitched)",
    badge: "Glamping Dome",
    description: "Luxury pre-pitched geodesic dome, alpine glamping tent, or bell tent with luxury bedding.",
    icon: "Tent",
    defaultPricing: "PER_ROOM",
    defaultBathroom: "Ensuite Private Bathroom",
    defaultBed: "1 King Bed",
    defaultCapacity: 2,
    defaultSizeSqFt: 280,
  },
  {
    id: "CAMPING_PITCH",
    legacyId: "OUTDOOR_PITCH",
    label: "Outdoor Camping Pitch / BYOT / Caravan Bay",
    badge: "Camping Pitch",
    description: "Bring your own tent, open camper ground, or RV / motorhome bay.",
    icon: "Tent",
    defaultPricing: "PER_ROOM",
    defaultBathroom: "Shared / Common Restroom",
    defaultBed: "Open Camping Pitch",
    defaultCapacity: 2,
    defaultSizeSqFt: 200,
  },
  {
    id: "VILLA_ESTATE",
    label: "Entire Standalone Villa / Heritage Estate",
    badge: "Private Villa",
    description: "Multi-bedroom private estate, pool bungalow, or plantation home booked as an entire property.",
    icon: "Home",
    defaultPricing: "PER_ROOM",
    defaultBathroom: "Ensuite Private Bathroom",
    defaultBed: "3 King Beds",
    defaultCapacity: 6,
    defaultSizeSqFt: 1200,
  },
  {
    id: "TREEHOUSE_CABIN",
    label: "Treehouse / Elevated Eco-Cabin",
    badge: "Treehouse",
    description: "Canopy treehouse or elevated eco-lodge timber cabin nestled in wilderness forest.",
    icon: "Trees",
    defaultPricing: "PER_ROOM",
    defaultBathroom: "Ensuite Private Bathroom",
    defaultBed: "1 King Bed",
    defaultCapacity: 2,
    defaultSizeSqFt: 320,
  },
  {
    id: "HOUSEBOAT_CABIN",
    label: "Houseboat Cruise Cabin / Floating Suite",
    badge: "Houseboat",
    description: "Floating bedroom or AC cruise cabin on backwater houseboats and lake cruisers.",
    icon: "Compass",
    defaultPricing: "PER_ROOM",
    defaultBathroom: "Ensuite Private Bathroom",
    defaultBed: "1 Queen Bed",
    defaultCapacity: 2,
    defaultSizeSqFt: 250,
  },
];

export function getInventoryTypeMeta(typeId, roomName = "") {
  const nameLower = String(roomName || "").toLowerCase();
  const normalized = String(typeId || "").toUpperCase().trim();

  // If room name or typeId explicitly indicates a dorm / bunk bed
  if (
    normalized === "DORM_BED" ||
    normalized === "DORM" ||
    nameLower.includes("dorm") ||
    nameLower.includes("bunk") ||
    nameLower.includes("mixed dorm") ||
    nameLower.includes("female dorm") ||
    nameLower.includes("male dorm")
  ) {
    return ROOM_INVENTORY_TYPES[1]; // DORM_BED
  }

  if (normalized === "SAFARI_PITCH" || normalized === "GLAMP_DOME") return ROOM_INVENTORY_TYPES[2];
  if (normalized === "OUTDOOR_PITCH" || normalized === "CAMPING_PITCH") return ROOM_INVENTORY_TYPES[3];
  if (normalized === "VILLA_ESTATE" || normalized === "VILLA") return ROOM_INVENTORY_TYPES[4];
  if (normalized === "TREEHOUSE_CABIN" || normalized === "TREEHOUSE") return ROOM_INVENTORY_TYPES[5];
  if (normalized === "HOUSEBOAT_CABIN" || normalized === "HOUSEBOAT") return ROOM_INVENTORY_TYPES[6];

  if (normalized) {
    const found = ROOM_INVENTORY_TYPES.find(
      (t) =>
        t.id === normalized ||
        t.legacyId === normalized ||
        t.id.toLowerCase() === normalized.toLowerCase()
    );
    if (found) return found;
  }

  return ROOM_INVENTORY_TYPES[0];
}

const normalizeTypeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const slugifyPropertyType = (value) =>
  normalizeTypeText(value).replace(/\s+/g, "-") || "resorts";

function findCanonicalPropertyType(value) {
  const normalized = normalizeTypeText(value);
  if (!normalized) return null;
  return (
    PROPERTY_STAY_CATEGORIES.find((category) =>
      [
        category.slug,
        category.id,
        category.key,
        category.label,
        category.shortLabel,
        category.badge,
        ...(category.aliases || []),
      ].some((candidate) => normalizeTypeText(candidate) === normalized)
    ) || null
  );
}

function inferPropertyType(value) {
  const text = normalizeTypeText(value);
  const has = (...terms) => terms.some((term) => text.includes(term));
  const find = (id) => PROPERTY_STAY_CATEGORIES.find((item) => item.id === id);

  if (has("heritage hotel", "palace hotel")) return find("heritage-hotel");
  if (has("guesthouse", "guest house", "bed and breakfast", "bnb", "b and b")) return find("guesthouse-bnb");
  if (has("farmstay", "farm stay", "plantation stay", "farm and wilderness")) return find("farmstay");
  if (has("eco stay", "eco lodge", "sustainable stay")) return find("eco-stay");
  if (has("houseboat", "floating villa")) return find("houseboat");
  if (has("hostel", "dorm", "backpacker")) return find("hostel");
  if (has("homestay", "heritage home")) return find("homestay");
  if (has("apartment", "studio", "flat", "aparthotel")) return find("apartment");
  if (has("villa", "private estate")) return find("villa");
  if (has("mountain stay", "mountain lodge", "summit", "high altitude", "chalet")) return find("lodge");
  if (has("hotel", "suite")) return find("hotel");
  if (has("cottage", "cabin", "treehouse", "wood house")) return find("cottage");
  if (has("camp", "glamp", "tent", "dome")) return find("campsite");
  return null;
}

export function resolvePropertyType(categoryValue = "", fallbackTitle = "") {
  const explicit = findCanonicalPropertyType(categoryValue);
  if (explicit) return explicit;

  const inferredCategory = inferPropertyType(categoryValue);
  if (inferredCategory) return inferredCategory;

  const customLabel = String(categoryValue || "").trim();
  if (customLabel) {
    return {
      id: "custom",
      key: customLabel,
      slug: slugifyPropertyType(customLabel),
      label: customLabel,
      shortLabel: customLabel,
      badge: customLabel,
      icon: "Building2",
      unitTerm: "Room / Unit",
      unitsPlural: "Rooms & Units",
      pricingSuffix: "/ night",
      description: `Stay category: ${customLabel}`,
      defaultAmenities: ["High-Speed Wi-Fi", "Attached Restroom", "Housekeeping"],
      isCustom: true,
    };
  }

  return inferPropertyType(fallbackTitle) || findCanonicalPropertyType("resorts");
}

export function getPricingUnitLabel(property = {}, room = null) {
  let targetRoom = room;
  if (!targetRoom && Array.isArray(property?.rooms) && property.rooms.length > 0) {
    const propPrice = Number(property.price || property.basePrice || 0);
    targetRoom = property.rooms.find(
      (r) => Number(r.price || r.pricePerPerson || r.basePrice || 0) === propPrice
    ) || property.rooms[0];
  }

  const roomName = String(targetRoom?.name || targetRoom?.title || '').toLowerCase();
  const isDorm =
    targetRoom?.inventoryType === 'DORM_BED' ||
    targetRoom?.pricingModel === 'PER_BED' ||
    roomName.includes('dorm') ||
    roomName.includes('bunk') ||
    roomName.includes('bed in');

  if (isDorm) return "/ bed / night";

  const model = targetRoom?.pricingModel || property?.pricingModel;
  if (model === "PER_BED" || model === "per_bed_night") return "/ bed / night";
  if (model === "PER_ROOM" || model === "per_room_night") return "/ room / night";

  const typeMeta = resolvePropertyType(property?.propertyTypeSlug || property?.category || "", property?.title || "");
  if (typeMeta?.pricingSuffix) return typeMeta.pricingSuffix;
  return "/ night";
}
