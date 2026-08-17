/**
 * Time-Slot Activity Scheduling, Guide Dispatch & Adventure Indemnity
 */

export const ADVENTURE_ACTIVITIES = [
    {
        id: 'act-kolukkumalai-sunrise',
        title: 'Kolukkumalai Sunrise & Cloudbed 4x4 Safari',
        campsiteId: 'pkg-kolukkumalai',
        timeSlot: '04:30 AM - 07:30 AM IST',
        maxParticipantsPerBatch: 12,
        guideRequired: true,
        difficultyLevel: 'MODERATE',
        riskLevel: 'MEDIUM',
        includesWaiver: true,
        description: 'Guided 4x4 offroad safari through rugged mountain trails to the world’s highest organic tea estate sunrise ridge.'
    },
    {
        id: 'act-meesapulimala-summit',
        title: 'Meesapulimala 8,661 FT Alpine Summit Trek',
        campsiteId: 'pkg-meesapulimala',
        timeSlot: '06:00 AM - 01:00 PM IST',
        maxParticipantsPerBatch: 15,
        guideRequired: true,
        difficultyLevel: 'CHALLENGING',
        riskLevel: 'HIGH',
        includesWaiver: true,
        description: 'Certified forest ranger-guided 14km ridge trek through shola grasslands and mist valleys.'
    },
    {
        id: 'act-stargazing-telescope',
        title: 'Zero-Light-Pollution Astronomy & Stargazing',
        campsiteId: 'pkg-suryanelli',
        timeSlot: '08:30 PM - 10:00 PM IST',
        maxParticipantsPerBatch: 20,
        guideRequired: true,
        difficultyLevel: 'EASY',
        riskLevel: 'LOW',
        includesWaiver: false,
        description: 'High-altitude deep-sky telescope viewing of the Milky Way, constellations, and lunar craters.'
    }
];

/**
 * Match a certified mountain guide to an expedition batch
 * @param {string} activityId 
 * @param {string} languagePreference - 'malayalam' | 'tamil' | 'english' | 'hindi'
 * @returns {object} Assigned guide info
 */
export function assignMountainGuide(activityId, languagePreference = 'english') {
    const guides = [
        { id: 'GD-01', name: 'Suresh Kumar', language: ['malayalam', 'tamil', 'english'], certifications: 'Kerala Forest Dept Certified / Wilderness First Aid', phone: '+91 90748 58014' },
        { id: 'GD-02', name: 'Anand Mani', language: ['tamil', 'english', 'hindi'], certifications: 'Nehru Institute of Mountaineering (NIM) Certified', phone: '+91 94479 79088' }
    ];

    const matched = guides.find(g => g.language.includes(languagePreference.toLowerCase())) || guides[0];
    return matched;
}
