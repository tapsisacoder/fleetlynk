// Dummy data for the LynkFleet demo prototype

export const company = {
  name: "Masvingo Haulage",
  owner: "John Masvingo",
  fleetSize: 8
};

export const vehicles = [
  {
    id: "ZWE-8472",
    model: "Scania DC13",
    tankCapacity: 800,
    status: "deployed",
    consumption: { empty: 30, loaded: 38 },
    performance: { trips: 24, avgEfficiency: 37.2, variance: -2.1 },
    lastTrip: "2 days ago",
    odometer: 245670
  },
  {
    id: "RSA-2341",
    model: "Cummins X15",
    tankCapacity: 1000,
    status: "deployed",
    consumption: { empty: 32, loaded: 40 },
    performance: { trips: 31, avgEfficiency: 41.2, variance: 3.0 },
    lastTrip: "Yesterday",
    odometer: 312450
  },
  {
    id: "ZWE-9123",
    model: "Volvo D13",
    tankCapacity: 800,
    status: "available",
    consumption: { empty: 31, loaded: 39 },
    performance: { trips: 18, avgEfficiency: 38.5, variance: -1.3 },
    lastTrip: "5 days ago",
    odometer: 198230
  },
  {
    id: "ZWE-7651",
    model: "Mercedes OM 471",
    tankCapacity: 850,
    status: "available",
    consumption: { empty: 29, loaded: 37 },
    performance: { trips: 22, avgEfficiency: 36.8, variance: -1.8 },
    lastTrip: "3 days ago",
    odometer: 267890
  },
  {
    id: "RSA-8821",
    model: "Detroit DD15",
    tankCapacity: 1000,
    status: "available",
    consumption: { empty: 33, loaded: 41 },
    performance: { trips: 19, avgEfficiency: 40.5, variance: 1.2 },
    lastTrip: "4 days ago",
    odometer: 189450
  },
  {
    id: "ZWE-5543",
    model: "Renault DTI 13",
    tankCapacity: 750,
    status: "available",
    consumption: { empty: 28, loaded: 36 },
    performance: { trips: 16, avgEfficiency: 35.9, variance: -2.3 },
    lastTrip: "6 days ago",
    odometer: 156780
  },
  {
    id: "RSA-9012",
    model: "Scania DC16",
    tankCapacity: 900,
    status: "available",
    consumption: { empty: 34, loaded: 42 },
    performance: { trips: 27, avgEfficiency: 41.8, variance: 0.8 },
    lastTrip: "1 day ago",
    odometer: 298560
  },
  {
    id: "ZWE-3345",
    model: "Cummins X12",
    tankCapacity: 750,
    status: "available",
    consumption: { empty: 27, loaded: 35 },
    performance: { trips: 21, avgEfficiency: 34.9, variance: -3.1 },
    lastTrip: "2 days ago",
    odometer: 223450
  }
];

export const activeTrips = [
  {
    reference: "TRIP-2025-042",
    status: "in-transit",
    vehicle: "ZWE-8472",
    vehicleModel: "Scania DC13",
    route: { from: "Harare", to: "Beira" },
    distance: 604,
    progress: 65,
    fuel: { expected: 240, used: 155, variance: -5 },
    started: "2 days ago",
    eta: "Tomorrow 14:00"
  },
  {
    reference: "TRIP-2025-041",
    status: "in-transit",
    vehicle: "RSA-2341",
    vehicleModel: "Cummins X15",
    route: { from: "Johannesburg", to: "Harare" },
    distance: 1015,
    progress: 30,
    fuel: { expected: 420, used: 130, variance: 2 },
    started: "Yesterday",
    eta: "3 Dec 18:00"
  }
];

export const tripHistory = [
  { reference: "TRIP-040", vehicle: "ZWE-9123", route: "Harare → Lusaka", distance: 512, fuel: 195, variance: -8, date: "28 Nov", status: "completed" },
  { reference: "TRIP-039", vehicle: "ZWE-8472", route: "Beira → Harare (Empty)", distance: 598, fuel: 183, variance: -12, date: "26 Nov", status: "completed" },
  { reference: "TRIP-038", vehicle: "RSA-2341", route: "Harare → Beira", distance: 612, fuel: 245, variance: 18, date: "25 Nov", status: "warning" },
  { reference: "TRIP-037", vehicle: "ZWE-7651", route: "Mutare → Harare", distance: 265, fuel: 102, variance: 2, date: "24 Nov", status: "completed" },
  { reference: "TRIP-036", vehicle: "ZWE-9123", route: "Harare → Bulawayo", distance: 439, fuel: 172, variance: -3, date: "23 Nov", status: "completed" },
  { reference: "TRIP-035", vehicle: "RSA-2341", route: "Johannesburg → Bulawayo", distance: 683, fuel: 278, variance: 5, date: "22 Nov", status: "completed" },
  { reference: "TRIP-034", vehicle: "ZWE-8472", route: "Beira → Harare", distance: 598, fuel: 225, variance: -2, date: "21 Nov", status: "completed" },
  { reference: "TRIP-033", vehicle: "ZWE-5543", route: "Harare → Lusaka", distance: 512, fuel: 189, variance: -6, date: "20 Nov", status: "completed" },
  { reference: "TRIP-032", vehicle: "RSA-9012", route: "Johannesburg → Harare", distance: 1015, fuel: 425, variance: 8, date: "19 Nov", status: "warning" },
  { reference: "TRIP-031", vehicle: "ZWE-7651", route: "Harare → Beira", distance: 604, fuel: 231, variance: 1, date: "18 Nov", status: "completed" }
];

export const monthlyReport = {
  totalFuel: 12480,
  expectedFuel: 13200,
  savings: -720,
  savingsPercent: -5.5,
  savingsAmount: 15840,
  vehiclePerformance: [
    { vehicle: "ZWE-9123", trips: 6, expected: 1140, actual: 1065, variance: -75, status: "excellent" },
    { vehicle: "ZWE-8472", trips: 8, expected: 1920, actual: 1882, variance: -38, status: "good" },
    { vehicle: "RSA-2341", trips: 7, expected: 2940, actual: 3015, variance: 75, status: "check" },
    { vehicle: "ZWE-7651", trips: 5, expected: 1050, actual: 1038, variance: -12, status: "good" }
  ]
};

export const documentAlerts = [
  {
    id: 1,
    type: "urgent",
    title: "Vehicle License Disc",
    vehicle: "ZWE-8472",
    expires: "15 Dec 2025",
    daysLeft: 12
  },
  {
    id: 2,
    type: "warning",
    title: "Insurance Policy",
    vehicle: "RSA-2341",
    expires: "25 Dec 2025",
    daysLeft: 22
  },
  {
    id: 3,
    type: "warning",
    title: "Roadworthy Certificate",
    vehicle: "ZWE-9123",
    expires: "31 Dec 2025",
    daysLeft: 28
  }
];

export const recentActivity = [
  { icon: "🚛", text: "TRIP-2025-042 Fuel stop logged", time: "2 hours ago" },
  { icon: "📄", text: "RSA-2341 Insurance Renewed", time: "Yesterday" },
  { icon: "🚀", text: "TRIP-2025-041 Deployed", time: "Yesterday" },
  { icon: "⛽", text: "155L fuel logged TRIP-2025-042", time: "5 hours ago" }
];
