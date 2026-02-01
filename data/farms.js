const farmsData = [
  {
    id: 1,
    farmerName: "rajaram mane",
    crop: "Soybean",
    location: "Kolhapur",
    polygon: [
      [16.705, 74.2433],
      [16.7055, 74.2445],
      [16.7045, 74.245],
      [16.704, 74.2438],
    ],
    // Phase 1: New fields for satellite monitoring & insurance
    area: 2.5, // hectares
    cropType: "Soybean (JS 335 variety)",
    sowingDate: new Date("2025-07-15"),
    expectedHarvestDate: new Date("2025-11-10"),
    baselineNDVI: 0.75, // healthy crop NDVI baseline
    insuranceValue: 250000, // ₹2,50,000
    contactInfo: {
      phone: "+91-9876543210",
      aadhar: "1234-5678-9012",
    },
    // Phase 2: Administrative Hierarchy
    administrativeData: {
      state: "Maharashtra",
      district: "Kolhapur",
      tehsil: "Shahuwadi",
      village: "Nesari",
      pincode: "416213",
    },
  },
  {
    id: 2,
    farmerName: "sarjerao mane",
    crop: "Soybean",
    location: "Kolhapur",
    polygon: [
      [16.706, 74.2455],
      [16.7065, 74.2467],
      [16.7055, 74.2472],
      [16.705, 74.246],
    ],
    area: 3.2,
    cropType: "Soybean (JS 335 variety)",
    sowingDate: new Date("2025-07-18"),
    expectedHarvestDate: new Date("2025-11-12"),
    baselineNDVI: 0.72,
    insuranceValue: 320000,
    contactInfo: {
      phone: "+91-9876543211",
      aadhar: "1234-5678-9013",
    },
    administrativeData: {
      state: "Maharashtra",
      district: "Kolhapur",
      tehsil: "Shahuwadi",
      village: "Nesari",
      pincode: "416213",
    },
  },
  {
    id: 3,
    farmerName: "vishal rane",
    crop: "Soybean",
    location: "Kolhapur",
    polygon: [
      [16.7035, 74.242],
      [16.704, 74.2432],
      [16.703, 74.2437],
      [16.7025, 74.2425],
    ],
    area: 1.8,
    cropType: "Soybean (MAUS 71 variety)",
    sowingDate: new Date("2025-07-12"),
    expectedHarvestDate: new Date("2025-11-05"),
    baselineNDVI: 0.78,
    insuranceValue: 180000,
    contactInfo: {
      phone: "+91-9876543212",
      aadhar: "1234-5678-9014",
    },
    administrativeData: {
      state: "Maharashtra",
      district: "Kolhapur",
      tehsil: "Radhanagari",
      village: "Kasba Walva",
      pincode: "416211",
    },
  },
  {
    id: 4,
    farmerName: "Ramesh Patil",
    crop: "Soybean",
    location: "Kolhapur",
    polygon: [
      [16.707, 74.244],
      [16.7075, 74.2452],
      [16.7065, 74.2457],
      [16.706, 74.2445],
    ],
    area: 4.0,
    cropType: "Soybean (JS 335 variety)",
    sowingDate: new Date("2025-07-20"),
    expectedHarvestDate: new Date("2025-11-15"),
    baselineNDVI: 0.74,
    insuranceValue: 400000,
    contactInfo: {
      phone: "+91-9876543213",
      aadhar: "1234-5678-9015",
    },
    administrativeData: {
      state: "Maharashtra",
      district: "Kolhapur",
      tehsil: "Karveer",
      village: "Nigave",
      pincode: "416207",
    },
  },
];

export const getFarms = () => farmsData;

export default farmsData;
