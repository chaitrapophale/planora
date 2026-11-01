export const INITIAL_EVENTS = [
  {
    id: "ev-1",
    name: "TechSpark 2025",
    fullName: "TechSpark 2025: Annual College Cultural Fest - Mumbai",
    category: "College / Cultural Festival",
    date: "2025-10-24",
    endDate: "2025-10-24",
    startTime: "09:00",
    endTime: "21:30",
    venue: "St. Xavier's Grand Quad, Mumbai",
    venueAddress: "5, Mahapalika Marg, Dhobi Talao, Chhatrapati Shivaji Terminus Area, Mumbai, Maharashtra 400001",
    attendance: 500,
    budget: 200000,
    currency: "INR",
    status: "In Production",
    daysLeft: 3,
    readiness: 78,
    description: "Flagship annual cultural festival spanning technical exhibits, live battle of the bands, competitive choreography, and keynote talks.",
    director: "Avantika Sharma",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdOHJ_xMmJ8vJpLh8PurH-otLuaMcgPAw-gdJP2lSV3aezkNf8xOHsRk3SaGEDHb20dTaeBKqRsUKaUYukMSPRiK3aXf-CtWum9lJG8SDl0k3fN66APxnIag-6eBaj_LZwHODJpPSOHiIGnUnfNkrg49ZDFXmGBUbGNmYrF8yRNxVePztNljFk4B5DZaqNXeBXTyElqs1egiAi8GQUOiYhUntCK9Ok7ucdDSFF2wvabcab5H-GI9c"
  },
  {
    id: "ev-2",
    name: "Aarav & Meera Wedding",
    fullName: "Aarav & Meera Luxury Wedding Reception",
    category: "Wedding / Reception",
    date: "2025-11-14",
    endDate: "2025-11-14",
    startTime: "18:30",
    endTime: "23:30",
    venue: "The Taj Lands End, Bandra, Mumbai",
    venueAddress: "BJ Road, Bandstand Promenade, Bandra West, Mumbai, Maharashtra 400050",
    attendance: 400,
    budget: 850000,
    currency: "INR",
    status: "Planning",
    daysLeft: 24,
    readiness: 85,
    description: "Exclusive sea-facing wedding reception with customized floral canopies, five-course international dining, and live acoustic quartet.",
    director: "Avantika Sharma",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfCT9J26gOZLicccYMz7LAIee4pGRCNqLuE-Gs5aGWuOjNCL-aiNkNRi9m8wjacyKvlSS4NmxLGUT97mtV9CvmroiCejArZH2yAazKGhA8xljx561Q1L-d8Oq87S6DNSxMv34RXgdEgDbgEW2aXKyd0iht-9ioicglCXPwu6yyhCawI1XkUaJhwno-sjxOaZS-we1-4hAXInHUo8stRppAWEiw929PfET8RKVmIyXcxFyHblMsy-8"
  },
  {
    id: "ev-3",
    name: "Oakridge International Annual Day",
    fullName: "Oakridge International Annual Day & Centenary Showcase",
    category: "School / Centenary",
    date: "2025-12-05",
    endDate: "2025-12-05",
    startTime: "10:00",
    endTime: "17:00",
    venue: "Main Auditorium, Hyderabad",
    venueAddress: "Oakridge Boulevard, Khajaguda, Nanakramguda Road, Cyberabad, Hyderabad 500008",
    attendance: 1200,
    budget: 420000,
    currency: "INR",
    status: "Draft",
    daysLeft: 45,
    readiness: 40,
    description: "Grand centenary student production with theatrical stage lighting, synchronized student choirs, and visiting international dignitaries.",
    director: "Avantika Sharma",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMwLES2FzMuH78yZZj_qecgr64b8yyvsJbn93jiF2H6fiN1-26p9dYjNcolvvvoxilObyxw-SnE7OkVA44hYkTQi3tIwezamKm9q_8OeGkBAXgmhM-cctj-Scww35OHVkSJ-Woge-8Z6snZODeHwOb7BN4eaK32-PBA9TvtCV2kmqFOTgO4zJw9ToaZF4cgN1WYoLgfuKcskZzOT5ZkPqFPs8Ynr8bUP1tjBa6btNEi5nJErMzsl4"
  },
  {
    id: "ev-4",
    name: "FinTech Innovations Summit 2025",
    fullName: "FinTech Innovations Summit & Global Venture Expo",
    category: "Corporate / Summit",
    date: "2025-10-18",
    endDate: "2025-10-18",
    startTime: "08:30",
    endTime: "19:00",
    venue: "Jio World Convention Centre, Mumbai",
    venueAddress: "G Block, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051",
    attendance: 512,
    budget: 200000,
    currency: "INR",
    status: "Concluded",
    daysLeft: 0,
    readiness: 100,
    description: "High-level BFSI leadership summit featuring investor pitch rooms, keynote tracks, and catered networking banquets.",
    director: "Avantika Sharma",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUGzHZxwuFsFbOI8IvlwC6CEytvc2ZiKbysEzGcSjl0gsnh1Ja8TGul8Aowm0vuJSVgtyAQpqwAwZya4GGaFpX1y7lJiGz8IqirOktqfo3M0EYiARObyuzL_vHr2_p9HW7J7UfWJVkzhywZHuNHUUM2Rotdad8LjfmrRJVOToK-9BiQ4kO5iqM3eeJM7Q3sdb40gR41LcnC7acFtUfreifbGibwdAIJ2AxDUKP17I5TWqO2MehuoI"
  }
];

export const INITIAL_TASKS = [
  {
    id: "tsk-1",
    eventId: "ev-1",
    title: "Sound System Check & Mic Rental",
    description: "Test line array acoustic balance, RF frequencies for cordless mics, and stage monitor delays.",
    priority: "critical",
    status: "todo",
    category: "Audio / Tech",
    assignedTo: "Rohit K. (Audio Lead)",
    assignedId: "tm-3",
    dueDate: "2025-10-24",
    dueTime: "16:00",
    delayStatus: "Critical Delay",
    overdue: true
  },
  {
    id: "tsk-2",
    eventId: "ev-1",
    title: "Police & Fire Safety NOC verification",
    description: "Obtain stamped physical clearance for Quad assembly and verify fire extinguisher pressure checks.",
    priority: "high",
    status: "in-progress",
    category: "Licensing / Govt",
    assignedTo: "Meera S. (Govt Liaison)",
    assignedId: "tm-2",
    dueDate: "2025-10-23",
    dueTime: "11:00",
    delayStatus: "In-Progress",
    overdue: false
  },
  {
    id: "tsk-3",
    eventId: "ev-1",
    title: "Food caterer menu sign-off (500 pax snacks box)",
    description: "Approve vegetarian/Jain segregation, sample bakery items, and confirm dispatch window for 14:00.",
    priority: "high",
    status: "todo",
    category: "Catering",
    assignedTo: "Royal Flavors Catering (Vendor)",
    assignedId: "tm-4",
    dueDate: "2025-10-22",
    dueTime: "18:00",
    delayStatus: "Pending Sign-Off",
    overdue: true
  },
  {
    id: "tsk-4",
    eventId: "ev-1",
    title: "Stage Rigging & Truss Safety Inspection",
    description: "Structural engineer sign-off on 40-foot aluminum truss overhead rigging and motorized hoists.",
    priority: "critical",
    status: "completed",
    category: "Staging",
    assignedTo: "Devendra P. (Stage Master)",
    assignedId: "tm-5",
    dueDate: "2025-10-21",
    dueTime: "17:00",
    delayStatus: "Verified",
    overdue: false
  },
  {
    id: "tsk-5",
    eventId: "ev-1",
    title: "VIP Lounge Furniture & Air-Cooler Placement",
    description: "Set up 18 plush armchairs, low brass tables, and four quiet duct evaporative coolers.",
    priority: "medium",
    status: "in-progress",
    category: "Hospitality",
    assignedTo: "Pooja V. (Hospitality Lead)",
    assignedId: "tm-6",
    dueDate: "2025-10-23",
    dueTime: "15:00",
    delayStatus: "In-Progress",
    overdue: false
  },
  {
    id: "tsk-6",
    eventId: "ev-1",
    title: "Emergency Exit Lighting & Pathway Clearances",
    description: "Confirm step-free ramp access at Gate 3 and zero obstruction along medical evacuation route.",
    priority: "high",
    status: "completed",
    category: "Safety",
    assignedTo: "Capt. R. Deshmukh (Security)",
    assignedId: "tm-7",
    dueDate: "2025-10-20",
    dueTime: "12:00",
    delayStatus: "Clear",
    overdue: false
  },
  {
    id: "tsk-7",
    eventId: "ev-1",
    title: "Artist Dressing Room Key Handover & Hospitality Kit",
    description: "Stock green room with mirror lights, bottled water, dry fruit hampers, and assigned runner.",
    priority: "medium",
    status: "todo",
    category: "Artist Relations",
    assignedTo: "Simran T. (Talent Coordinator)",
    assignedId: "tm-8",
    dueDate: "2025-10-24",
    dueTime: "08:30",
    delayStatus: "Upcoming",
    overdue: false
  }
];

export const INITIAL_EXPENSES = [
  {
    id: "exp-1",
    eventId: "ev-1",
    title: "Stage Truss & German Hanger Tent Rental",
    category: "Staging & Rigging",
    vendor: "Octanorm Staging Solutions",
    amount: 52000,
    status: "Paid",
    dueDate: "2025-10-15",
    invoiceNo: "INV-2025-881",
    paymentMode: "NEFT Bank Transfer"
  },
  {
    id: "exp-2",
    eventId: "ev-1",
    title: "Main PA System, Digital Mixers & Line Array",
    category: "Audio Visual",
    vendor: "SonicPro Acoustics Mumbai",
    amount: 45000,
    status: "Due on Delivery",
    dueDate: "2025-10-24",
    invoiceNo: "INV-SONIC-409",
    paymentMode: "Cheque on Site"
  },
  {
    id: "exp-3",
    eventId: "ev-1",
    title: "500 Pax Gourmet Snack Boxes & Bottled Beverages",
    category: "Catering & Hospitality",
    vendor: "Royal Flavors Catering Pvt Ltd",
    amount: 32000,
    status: "Paid",
    dueDate: "2025-10-18",
    invoiceNo: "RFC-9932-B",
    paymentMode: "UPI Business"
  },
  {
    id: "exp-4",
    eventId: "ev-1",
    title: "Police Bandobast & Fire Brigade Standby NOC Fee",
    category: "Licensing & Safety",
    vendor: "Municipal Corporation of Greater Mumbai",
    amount: 8500,
    status: "Paid",
    dueDate: "2025-10-12",
    invoiceNo: "MCGM-REC-4820",
    paymentMode: "Treasury Challan"
  },
  {
    id: "exp-5",
    eventId: "ev-1",
    title: "Event Signage, Backdrop Banners & Directional Standees",
    category: "Decor & Signage",
    vendor: "PrintCraft High-Res Studios",
    amount: 4500,
    status: "Pending Approval",
    dueDate: "2025-10-23",
    invoiceNo: "PC-8122",
    paymentMode: "NEFT"
  }
];

export const INITIAL_FOOD_ITEMS = [
  {
    id: "food-1",
    eventId: "ev-1",
    mealType: "Mid-Day Snacks Box",
    scheduleTime: "14:00 - 15:30",
    paxCount: 500,
    menuItems: [
      "Paneer Tikka Roll / Veg Puff (Jain segregated)",
      "Kaju Katli sweet piece",
      "Roasted Makhana Snack pouch",
      "Tetra Pack Fresh Fruit Juice (200ml)",
      "Mineral Water bottle (250ml)"
    ],
    dietaryNotes: "45 Jain Pax clearly barcoded with green dot label. 3 VIP nut-free boxes marked red.",
    costPerPax: 64,
    totalCost: 32000,
    vendor: "Royal Flavors Catering Pvt Ltd",
    status: "Confirmed"
  },
  {
    id: "food-2",
    eventId: "ev-1",
    mealType: "Green Room & VIP Hospitality Platter",
    scheduleTime: "11:00 - 21:00 (Continuous)",
    paxCount: 30,
    menuItems: [
      "Assorted Artisan Sandwiches (Eggless)",
      "Imported Cheese & Crackers",
      "Seasonal Cut Fruits & Berries",
      "Nespresso Coffee & Herbal Tea Station"
    ],
    dietaryNotes: "Sugar-free tea sweeteners and lactose-free almond milk requested by headline speaker.",
    costPerPax: 250,
    totalCost: 7500,
    vendor: "Royal Flavors VIP Division",
    status: "In Preparation"
  }
];

export const INITIAL_SUPPLIES = [
  {
    id: "sup-1",
    eventId: "ev-1",
    name: "Shure QLX-D Digital Cordless Handheld Mics",
    category: "Audio Equipment",
    requiredQty: 6,
    availableQty: 4,
    unit: "sets",
    status: "Missing 2",
    responsible: "Rohit K. (Audio Lead)",
    estimatedCost: 8000
  },
  {
    id: "sup-2",
    eventId: "ev-1",
    name: "125kVA Cummins Silent Diesel Generator",
    category: "Electrical Power",
    requiredQty: 1,
    availableQty: 1,
    unit: "unit",
    status: "Ready on Site",
    responsible: "Dinesh M. (Electrician)",
    estimatedCost: 18000
  },
  {
    id: "sup-3",
    eventId: "ev-1",
    name: "Heavy Steel Barricade Panels (2.5m)",
    category: "Crowd Control",
    requiredQty: 30,
    availableQty: 30,
    unit: "panels",
    status: "Erected",
    responsible: "Capt. Deshmukh",
    estimatedCost: 9000
  },
  {
    id: "sup-4",
    eventId: "ev-1",
    name: "Automatic External Defibrillator & Medical Kit",
    category: "Emergency First Aid",
    requiredQty: 2,
    availableQty: 2,
    unit: "kits",
    status: "Verified",
    responsible: "Dr. Ananya (Medic Lead)",
    estimatedCost: 5000
  },
  {
    id: "sup-5",
    eventId: "ev-1",
    name: "High-Capacity 5GHz Wi-Fi Mesh Nodes",
    category: "IT & Telephony",
    requiredQty: 4,
    availableQty: 3,
    unit: "nodes",
    status: "In Transit",
    responsible: "Kunal S. (Network Lead)",
    estimatedCost: 6500
  }
];

export const INITIAL_VENUE_ZONES = [
  {
    id: "zn-1",
    name: "Main Stage & Green Rooms",
    capacity: 60,
    occupied: 45,
    status: "Setup Complete",
    color: "#1D4533",
    type: "Performance Zone",
    features: ["40x30ft wooden stage", "Line array hung", "Dual green rooms with locks"]
  },
  {
    id: "zn-2",
    name: "VIP Guest & Faculty Enclosure",
    capacity: 80,
    occupied: 60,
    status: "Arranging Chairs",
    color: "#5E3122",
    type: "Reserved Seating",
    features: ["Cushioned banquet armchairs", "Direct stage sightlines", "Covered pagoda canopy"]
  },
  {
    id: "zn-3",
    name: "General Student & Audience Quad",
    capacity: 350,
    occupied: 280,
    status: "Clear",
    color: "#855140",
    type: "General Audience",
    features: ["Tiered plastic seating", "Center camera riser", "Dual 8-foot aisles"]
  },
  {
    id: "zn-4",
    name: "Food Court & Water Stations",
    capacity: 120,
    occupied: 0,
    status: "Stands Erected",
    color: "#392313",
    type: "Hospitality Zone",
    features: ["4 segregated distribution lines", "Waste segregation bins", "Hand-wash basins"]
  },
  {
    id: "zn-5",
    name: "Medical Aid & Emergency Exit Corridor",
    capacity: 20,
    occupied: 2,
    status: "Sterile Clearance",
    color: "#ba1a1a",
    type: "Safety Zone",
    features: ["Direct ambulance egress to Gate 3", "First-aid nurse tent", "Fire extinguisher rack"]
  }
];

export const INITIAL_TEAM_MEMBERS = [
  {
    id: "tm-1",
    name: "Avantika Sharma",
    role: "Executive Event Director",
    department: "Executive Command",
    shift: "Shift 01 (07:00 - 16:00)",
    status: "On Duty",
    phone: "+91 98201 54321",
    email: "avantika@planora.events",
    tasksCount: 6,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6QACscJaMN82cnjf3bXLZkPCG877azkpDLwCUThmgtealxXh2NCou9A3Kwg8mm8rNtZifHOhOdsKjbu5Gko2BtqsQBWEJLSZY1YiZ4_xSzKJX4UaIKUxWmvca2iBvDm8p-nADmaBmDaOGNbH3yGdMx2Ym_0nS36IQoOMdT4sJoNqBe3xMmPgECHAmvgpgH0b2GFolGKHk7WQjftqkliZtnqNNLjAHcfgFn_Iu8kkE2M5duvscz9Y"
  },
  {
    id: "tm-2",
    name: "Meera Sen",
    role: "Govt & Municipal Liaison",
    department: "Compliance & Safety",
    shift: "Shift 01 (08:00 - 17:00)",
    status: "On Duty",
    phone: "+91 98202 67890",
    email: "meera.sen@planora.events",
    tasksCount: 4,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfCT9J26gOZLicccYMz7LAIee4pGRCNqLuE-Gs5aGWuOjNCL-aiNkNRi9m8wjacyKvlSS4NmxLGUT97mtV9CvmroiCejArZH2yAazKGhA8xljx561Q1L-d8Oq87S6DNSxMv34RXgdEgDbgEW2aXKyd0iht-9ioicglCXPwu6yyhCawI1XkUaJhwno-sjxOaZS-we1-4hAXInHUo8stRppAWEiw929PfET8RKVmIyXcxFyHblMsy-8"
  },
  {
    id: "tm-3",
    name: "Rohit Kulkarni",
    role: "Lead Audio & Acoustic Engineer",
    department: "Technical Production",
    shift: "Shift 02 (13:00 - 22:30)",
    status: "On Ground",
    phone: "+91 98203 12345",
    email: "rohit.audio@planora.events",
    tasksCount: 5,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCznLF8tJKRsv7siXkm2vWOzVF8qDkct6fmL-xQa5u2Ez31ZZRtRahesnNM8Xhu4Uid1cTBD3c1mh45fLMIenc0G-UJv2OFF0Lb2Ol39pqsqEtQPWTZ4vSqv-yKBq5sUP8Efg3D_fVIsgWlxPJo8WrNbdt6aKPFcxVz2lcaMOORqJPAsfGLiftwUNQy3gD2w2OysF_4b8XMlV1-jL84sj8twxYOhF8irHFXzZoVgfHNTVeYTrNC0ME"
  },
  {
    id: "tm-4",
    name: "Chef Sanjeev Rathore",
    role: "Catering Supervisor",
    department: "Hospitality & Food",
    shift: "Shift 02 (12:00 - 20:00)",
    status: "Standby",
    phone: "+91 98204 98765",
    email: "catering.lead@royalflavors.in",
    tasksCount: 3,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMwLES2FzMuH78yZZj_qecgr64b8yyvsJbn93jiF2H6fiN1-26p9dYjNcolvvvoxilObyxw-SnE7OkVA44hYkTQi3tIwezamKm9q_8OeGkBAXgmhM-cctj-Scww35OHVkSJ-Woge-8Z6snZODeHwOb7BN4eaK32-PBA9TvtCV2kmqFOTgO4zJw9ToaZF4cgN1WYoLgfuKcskZzOT5ZkPqFPs8Ynr8bUP1tjBa6btNEi5nJErMzsl4"
  },
  {
    id: "tm-5",
    name: "Devendra Patel",
    role: "Master Stage & Rigging Lead",
    department: "Technical Production",
    shift: "Shift 01 (07:00 - 16:00)",
    status: "On Duty",
    phone: "+91 98205 55432",
    email: "devendra.rig@planora.events",
    tasksCount: 4,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUGzHZxwuFsFbOI8IvlwC6CEytvc2ZiKbysEzGcSjl0gsnh1Ja8TGul8Aowm0vuJSVgtyAQpqwAwZya4GGaFpX1y7lJiGz8IqirOktqfo3M0EYiARObyuzL_vHr2_p9HW7J7UfWJVkzhywZHuNHUUM2Rotdad8LjfmrRJVOToK-9BiQ4kO5iqM3eeJM7Q3sdb40gR41LcnC7acFtUfreifbGibwdAIJ2AxDUKP17I5TWqO2MehuoI"
  },
  {
    id: "tm-6",
    name: "Capt. Ravindra Deshmukh",
    role: "Chief Security & Crowd Controller",
    department: "Security & Evacuation",
    shift: "Shift 01 (07:00 - 22:00)",
    status: "On Duty",
    phone: "+91 98206 11223",
    email: "security.lead@planora.events",
    tasksCount: 5,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdOHJ_xMmJ8vJpLh8PurH-otLuaMcgPAw-gdJP2lSV3aezkNf8xOHsRk3SaGEDHb20dTaeBKqRsUKaUYukMSPRiK3aXf-CtWum9lJG8SDl0k3fN66APxnIag-6eBaj_LZwHODJpPSOHiIGnUnfNkrg49ZDFXmGBUbGNmYrF8yRNxVePztNljFk4B5DZaqNXeBXTyElqs1egiAi8GQUOiYhUntCK9Ok7ucdDSFF2wvabcab5H-GI9c"
  }
];

export const INITIAL_LIVE_SCHEDULE = [
  {
    id: "ls-1",
    activity: "Production Load-in & Power Grid Check",
    scheduledTime: "08:00 AM",
    actualTime: "08:05 AM",
    status: "completed",
    lead: "Devendra Patel",
    zone: "Loading Bay",
    delayMin: 5
  },
  {
    id: "ls-2",
    activity: "Line Array Sound Calibration & Band Tuning",
    scheduledTime: "09:30 AM",
    actualTime: "09:40 AM",
    status: "completed",
    lead: "Rohit Kulkarni",
    zone: "Main Stage",
    delayMin: 10
  },
  {
    id: "ls-3",
    activity: "Registration & Fast-Track Badge Entry",
    scheduledTime: "10:30 AM",
    actualTime: "10:30 AM",
    status: "completed",
    lead: "Avantika Sharma",
    zone: "Gate 1 & Quad Desk",
    delayMin: 0
  },
  {
    id: "ls-4",
    activity: "Keynote Address & Tech Innovation Showcase",
    scheduledTime: "11:30 AM",
    actualTime: "11:42 AM",
    status: "current",
    lead: "Meera Sen",
    zone: "Auditorium Stage",
    delayMin: 12
  },
  {
    id: "ls-5",
    activity: "Mid-Day Snacks Box Box-Office Distribution",
    scheduledTime: "01:30 PM",
    actualTime: "Pending",
    status: "upcoming",
    lead: "Chef Sanjeev",
    zone: "Food Court Quad",
    delayMin: 0
  },
  {
    id: "ls-6",
    activity: "Inter-College Band Wars & Dance Championship",
    scheduledTime: "03:30 PM",
    actualTime: "Pending",
    status: "upcoming",
    lead: "Rohit Kulkarni",
    zone: "Main Stage",
    delayMin: 0
  },
  {
    id: "ls-7",
    activity: "Grand Valedictory & Celebrity Guest Appearance",
    scheduledTime: "06:30 PM",
    actualTime: "Pending",
    status: "upcoming",
    lead: "Avantika Sharma",
    zone: "Main Stage",
    delayMin: 0
  }
];

export const INITIAL_INCIDENTS = [
  {
    id: "inc-1",
    eventId: "ev-1",
    timestamp: "10:15 AM",
    severity: "Medium",
    category: "Technical",
    title: "RF Interference on Channel 3 Wireless Mic",
    description: "Frequency clash with campus local security walkie-talkie. Shifted Channel 3 to 614.250 MHz.",
    reportedBy: "Rohit K.",
    status: "Resolved"
  },
  {
    id: "inc-2",
    eventId: "ev-1",
    timestamp: "11:05 AM",
    severity: "Low",
    category: "Crowd Flow",
    title: "Queue Overflow at Gate 1 QR Scanner Desk",
    description: "Added 2 auxiliary tablet scanners to clear bottleneck in under 4 minutes.",
    reportedBy: "Capt. Deshmukh",
    status: "Resolved"
  }
];

export const INITIAL_SETTINGS = {
  organizerName: "Avantika Sharma",
  agencyName: "Planora Executive Studios",
  email: "avantika@planora.events",
  phone: "+91 98201 54321",
  currency: "INR",
  currencySymbol: "₹",
  dateFormat: "DD/MM/YYYY",
  timeZone: "Asia/Kolkata (IST)",
  emailNotifications: true,
  liveSmsAlerts: true,
  soundAlerts: false,
  highContrast: false,
  autoSaveDrafts: true
};
