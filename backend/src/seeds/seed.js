// DB: Database seed script for Fixora defaults and knowledge base
import mongoose from 'mongoose';
import { connectDB, closeDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Customer } from '../models/Customer.js';
import { ServiceProvider } from '../models/ServiceProvider.js';
import { DeviceCategory } from '../models/DeviceCategory.js';
import { KnowledgeBase } from '../models/KnowledgeBase.js';
import { ServiceRequest } from '../models/ServiceRequest.js';
import { ROLES, VERIFICATION_STATUS, ACCOUNT_STATUS, DEVICE_CATEGORIES, SERVICE_REQUEST_STATUS } from '../config/constants.js';

const categoryData = [
  {
    name: 'TV',
    icon: 'Tv',
    description: 'Smart TVs, OLED/QLED, LED panels, audio output, and remote sensor issues.',
    commonProblems: [
      { problemName: 'No Power / Black Screen', serviceDomain: 'TV Power & Display Repair', isHighRisk: true },
      { problemName: 'Lines on Display Panel', serviceDomain: 'TV Panel Repair', isHighRisk: false },
      { problemName: 'Sound Working but No Picture', serviceDomain: 'TV Backlight Repair', isHighRisk: false },
      { problemName: 'Wi-Fi / Apps Not Connecting', serviceDomain: 'Smart TV Software Configuration', isHighRisk: false }
    ]
  },
  {
    name: 'Wi-Fi / Router',
    icon: 'Wifi',
    description: 'Broadband routers, mesh systems, packet drops, frequency setup, and ONT modems.',
    commonProblems: [
      { problemName: 'Frequent Disconnection', serviceDomain: 'Network & Router Diagnostics', isHighRisk: false },
      { problemName: 'Slow Speed / High Latency', serviceDomain: 'Bandwidth & Channel Optimization', isHighRisk: false },
      { problemName: 'Red LOS / Fiber Link Light Blinking', serviceDomain: 'Optical Fiber Line Repair', isHighRisk: false }
    ]
  },
  {
    name: 'Laptop',
    icon: 'Laptop',
    description: 'Ultrabooks, gaming laptops, battery health, charging circuits, screens, and OS tuning.',
    commonProblems: [
      { problemName: 'Not Turning On / Charging Failure', serviceDomain: 'Laptop Motherboard & Power Repair', isHighRisk: true },
      { problemName: 'Screen Flickering or Vertical Lines', serviceDomain: 'Laptop Screen Replacement', isHighRisk: false },
      { problemName: 'Overheating and Fan Noise', serviceDomain: 'Thermal Paste & Cooling Service', isHighRisk: false },
      { problemName: 'Keyboard or Trackpad Unresponsive', serviceDomain: 'Laptop Hardware Input Repair', isHighRisk: false }
    ]
  },
  {
    name: 'Phone',
    icon: 'Smartphone',
    description: 'Smartphones, touchscreen failure, charging ports, battery degradation, and camera modules.',
    commonProblems: [
      { problemName: 'Touch Screen Unresponsive', serviceDomain: 'Phone Display Replacement', isHighRisk: false },
      { problemName: 'Battery Draining Rapidly', serviceDomain: 'Phone Battery Service', isHighRisk: false },
      { problemName: 'Microphone / Speaker Muffled', serviceDomain: 'Audio Component Service', isHighRisk: false }
    ]
  },
  {
    name: 'Projector / Home Theatre / Speaker',
    icon: 'Speaker',
    description: 'Home audio amplifiers, soundbars, subwoofers, Bluetooth receivers, and laser projectors.',
    commonProblems: [
      { problemName: 'Audio Distortion / Crackling Sound', serviceDomain: 'Audio Amplifier & Driver Repair', isHighRisk: false },
      { problemName: 'Lamp Not Turning On', serviceDomain: 'Projector Optical & Lamp Replacement', isHighRisk: true },
      { problemName: 'No HDMI Signal Output', serviceDomain: 'HDMI Port & Circuit Board Repair', isHighRisk: false }
    ]
  },
  {
    name: 'Washing Machine',
    icon: 'Disc',
    description: 'Front load, top load, agitators, drainage pumps, motor drive, and spin cycle vibration.',
    commonProblems: [
      { problemName: 'Drum Not Spinning', serviceDomain: 'Washing Machine Motor & Belt Repair', isHighRisk: false },
      { problemName: 'Water Not Draining', serviceDomain: 'Drain Pump & Filter Service', isHighRisk: false },
      { problemName: 'Excessive Vibration and Noise', serviceDomain: 'Suspension & Damper Replacement', isHighRisk: false },
      { problemName: 'Water Leaking from Bottom', serviceDomain: 'Door Gasket & Hose Repair', isHighRisk: false }
    ]
  },
  {
    name: 'Refrigerator',
    icon: 'Refrigerator',
    description: 'Frost-free, inverter compressors, cooling coils, thermostats, and door seal gaskets.',
    commonProblems: [
      { problemName: 'Fridge Not Cooling But Light is On', serviceDomain: 'Refrigerator Compressor & Relay Repair', isHighRisk: true },
      { problemName: 'Excessive Frost Buildup in Freezer', serviceDomain: 'Defrost Heater & Thermostat Service', isHighRisk: false },
      { problemName: 'Water Pooling at the Base', serviceDomain: 'Drain Tube Cleansing & Pan Service', isHighRisk: false }
    ]
  },
  {
    name: 'AC',
    icon: 'Wind',
    description: 'Split and window air conditioners, condenser coils, refrigerant pressure, and fan motors.',
    commonProblems: [
      { problemName: 'Water Leaking from Indoor Unit', serviceDomain: 'AC Drain Pipe & Deep Cleaning Service', isHighRisk: false },
      { problemName: 'Blowing Warm Air / No Cooling', serviceDomain: 'AC Refrigerant Gas & Capacitor Repair', isHighRisk: true },
      { problemName: 'Strange Foul Odor During Operation', serviceDomain: 'Evaporator Coil Sanitization & Cleaning', isHighRisk: false },
      { problemName: 'Ice Forming on Copper Coils', serviceDomain: 'Airflow & Blower Fan Optimization', isHighRisk: false }
    ]
  },
  {
    name: 'Computer',
    icon: 'Cpu',
    description: 'Desktop PCs, custom rigs, SMPS power units, RAM diagnostics, and GPU artifacts.',
    commonProblems: [
      { problemName: 'PC Powers On But No Display', serviceDomain: 'RAM & Motherboard POST Diagnostics', isHighRisk: false },
      { problemName: 'Sudden Blue Screen (BSOD) Crashing', serviceDomain: 'Hardware Memory & Drive Diagnostics', isHighRisk: false },
      { problemName: 'Continuous Beeping Sound on Startup', serviceDomain: 'BIOS Hardware Troubleshooting', isHighRisk: false }
    ]
  },
  {
    name: 'Microwave Oven',
    icon: 'Flame',
    description: 'Solo and convection ovens, magnetrons, turntable motors, high-voltage diodes, and latches.',
    commonProblems: [
      { problemName: 'Turntable Spins but Food Does Not Heat', serviceDomain: 'Microwave Magnetron & Diode Repair', isHighRisk: true },
      { problemName: 'Sparking / Arcing Inside Chamber', serviceDomain: 'Waveguide Cover Replacement', isHighRisk: true },
      { problemName: 'Buttons on Keypad Not Responding', serviceDomain: 'Microwave Membrane & Control Board Repair', isHighRisk: false }
    ]
  },
  {
    name: 'Printer',
    icon: 'Printer',
    description: 'Laser, inkjet, and tank printers, paper feed rollers, cartridge heads, and wireless print queues.',
    commonProblems: [
      { problemName: 'Paper Jamming Repeatedly', serviceDomain: 'Printer Roller Cleansing & Replacement', isHighRisk: false },
      { problemName: 'Faded or Streaked Printouts', serviceDomain: 'Printhead & Toner Cartridge Cleaning', isHighRisk: false },
      { problemName: 'Printer Showing Offline / Driver Error', serviceDomain: 'Wireless Printing & Driver Setup', isHighRisk: false }
    ]
  }
];

const knowledgeBaseData = [
  // AC
  {
    deviceCategory: 'AC',
    problem: 'Water Leaking from Indoor Unit',
    symptoms: ['Water droplets dripping down wall', 'Gurgling drain noise', 'Ice melting near indoor filter'],
    possibleCauses: ['Clogged condensate drain hose', 'Dirty air filters blocking airflow', 'Improper indoor unit slope'],
    safeTroubleshootingSteps: [
      'Switch off the AC unit using the remote control and turn off the dedicated wall isolator switch.',
      'Gently lift the indoor front panel and remove the two mesh air filters.',
      'Rinse the filters thoroughly under lukewarm tap water and let them air dry completely before re-inserting.',
      'Inspect the exterior drain outlet pipe outside your home to ensure dirt, leaves, or insects are not blocking water outflow.',
      'Do not attempt to unscrew the indoor housing or manipulate internal evaporator coils.'
    ],
    escalationCondition: 'If water continues to pool or overflow after clean filters are re-inserted, the drain pan or internal pump requires professional servicing.',
    isHighRiskHardware: false,
    safetyWarning: 'Turn off the AC wall switch before opening the filter latch. Do not touch electrical terminals behind the louvers.',
    serviceDomain: 'AC Drain Pipe & Deep Cleaning Service'
  },
  {
    deviceCategory: 'AC',
    problem: 'Blowing Warm Air / No Cooling',
    symptoms: ['AC running but room temperature does not drop', 'Outdoor condenser fan not spinning', 'Hissing sound near copper pipes'],
    possibleCauses: ['Failed compressor capacitor', 'Refrigerant gas leakage', 'Heavily choked outdoor unit condenser fins'],
    safeTroubleshootingSteps: [
      'Check remote control mode and verify it is set to "COOL" mode with temperature set at 24°C.',
      'Verify that all room doors and windows are closed properly.',
      'Check if the outdoor unit is receiving unobstructed ventilation.',
      'Inspect the circuit breaker to ensure the compressor line has not tripped.'
    ],
    escalationCondition: 'If outdoor compressor fails to engage or if refrigerant gas has leaked, dangerous high voltage and pressurized coolant require professional technician tools.',
    isHighRiskHardware: true,
    safetyWarning: 'SAFETY WARNING: Air conditioning compressors utilize 400V+ capacitors and pressurized chemical refrigerants. Do not attempt to open the outdoor enclosure or recharge gas yourself.',
    serviceDomain: 'AC Refrigerant Gas & Capacitor Repair'
  },
  // TV
  {
    deviceCategory: 'TV',
    problem: 'Sound Working but No Picture',
    symptoms: ['Audio is clearly audible', 'Screen remains black or very dim', 'Power LED is solid blue/green'],
    possibleCauses: ['Faulty LED backlight strip', 'Inverter circuit degradation', 'Loose LVDS display ribbon cable'],
    safeTroubleshootingSteps: [
      'Perform a safe soft-reset: Unplug TV from wall socket for 10 minutes, press power button for 15 seconds to drain static, then plug back in.',
      'Shine a bright flashlight very close to the screen in a dark room: If faint images/menus are visible, the backlight circuit has failed.',
      'Test multiple input channels (HDMI 1, HDMI 2, or streaming app) to rule out cable fault.',
      'Ensure ambient room temperature is moderate and rear ventilation vents are dust-free.'
    ],
    escalationCondition: 'Backlight diode or internal T-Con board failure requires panel disassembly and professional soldering.',
    isHighRiskHardware: false,
    safetyWarning: 'Television back panels contain switch-mode power supplies with high residual voltages. Never unmount the plastic rear case.',
    serviceDomain: 'TV Backlight Repair'
  },
  // Laptop
  {
    deviceCategory: 'Laptop',
    problem: 'Screen Flickering or Vertical Lines',
    symptoms: ['Lines on screen when tilting lid', 'Intermittent screen flicker', 'Colors distorting'],
    possibleCauses: ['Pinched EDP display cable in hinge', 'GPU driver corruption', 'Physical LCD panel crack'],
    safeTroubleshootingSteps: [
      'Connect the laptop to an external TV or monitor via HDMI: If the external display is stable, the laptop display cable or panel is at fault.',
      'Slowly tilt the laptop lid back and forth: If lines shift with movement, the internal display ribbon in the hinge is degraded.',
      'Update graphics drivers via your operating system settings.',
      'Power off laptop and boot into BIOS setup: If lines remain in BIOS, it is definitely a hardware defect.'
    ],
    escalationCondition: 'Hinge cable replacement or LCD matrix replacement requires specialized micro-screwdrivers and static-safe workbench.',
    serviceDomain: 'Laptop Screen Replacement'
  },
  // Washing Machine
  {
    deviceCategory: 'Washing Machine',
    problem: 'Drum Not Spinning',
    symptoms: ['Machine fills with water but drum remains stationary', 'Humming motor sound', 'Error code E3 / UE on display'],
    possibleCauses: ['Snapped drive belt', 'Worn motor carbon brushes', 'Door lock safety switch failure'],
    safeTroubleshootingSteps: [
      'Turn off machine and check if the wash load is distributed evenly without heavy blanket bunching.',
      'Ensure the front/top door is clicking fully shut.',
      'Check that the drain filter is clean and water is emptying freely.',
      'Try running an empty "Spin Only" cycle to test motor response.'
    ],
    escalationCondition: 'Drive belt replacement or inverter motor control board repairs must be handled by an authorized technician.',
    serviceDomain: 'Washing Machine Motor & Belt Repair'
  },
  // Refrigerator
  {
    deviceCategory: 'Refrigerator',
    problem: 'Fridge Not Cooling But Light is On',
    symptoms: ['Interior compartment is warm', 'Compressor clicking every few minutes', 'Fan runs but no cold air'],
    possibleCauses: ['Defective compressor start relay', 'Dust-clogged condenser coils', 'Defrost sensor timer stuck'],
    safeTroubleshootingSteps: [
      'Unplug refrigerator and pull it slightly away from the wall to verify at least 3 inches of airflow clearance.',
      'Inspect the rear bottom vents and gently brush away surface dust with a dry cloth.',
      'Verify the internal temperature dial is set to medium (e.g. 3 or 4) rather than minimum.',
      'Ensure the rubber magnetic door gaskets are sealing tightly around the door frame.'
    ],
    escalationCondition: 'Clicking sounds indicate the compressor start relay or run capacitor is failing and requires specialist replacement.',
    isHighRiskHardware: true,
    safetyWarning: 'SAFETY WARNING: Never puncture cooling coils or tamper with refrigerant gas lines. Contact a verified refrigerator specialist.',
    serviceDomain: 'Refrigerator Compressor & Relay Repair'
  },
  // Microwave Oven
  {
    deviceCategory: 'Microwave Oven',
    problem: 'Turntable Spins but Food Does Not Heat',
    symptoms: ['Light turns on and timer counts down', 'Food remains completely cold', 'Loud buzzing sound'],
    possibleCauses: ['Blown high-voltage fuse', 'Defective magnetron', 'Short-circuited high voltage capacitor'],
    safeTroubleshootingSteps: [
      'Verify food is placed inside a microwave-safe ceramic or glass container.',
      'Ensure the cooking power level is set to HIGH (100%) and not Defrost mode.',
      'Test with a single cup of tap water for 1 minute.',
      'Clean any grease splatters from the small mica waveguide plate on the interior right wall.'
    ],
    escalationCondition: 'If the unit does not heat water, internal high-voltage components have failed.',
    isHighRiskHardware: true,
    safetyWarning: 'SAFETY CRITICAL WARNING: Microwave ovens contain high-voltage capacitors storing lethal 2,000V+ electrical charges even when unplugged for weeks. DO NOT OPEN THE CASING UNDER ANY CIRCUMSTANCES.',
    serviceDomain: 'Microwave Magnetron & Diode Repair'
  },
  // Printer
  {
    deviceCategory: 'Printer',
    problem: 'Paper Jamming Repeatedly',
    symptoms: ['Paper stuck halfway in feed path', 'Grinding roller noise', 'Printer error light blinking'],
    possibleCauses: ['Dusty pickup rollers', 'Creased or damp paper', 'Foreign object (staple/paperclip) in tray'],
    safeTroubleshootingSteps: [
      'Turn off printer and open the access door to gently pull trapped paper in the natural direction of paper feed.',
      'Inspect paper stack: Fan the stack before loading and ensure paper guides fit snugly against edges.',
      'Ensure paper is dry and standard 75-80 GSM weight.',
      'Clean external feed tray with a dry lint-free cloth.'
    ],
    escalationCondition: 'Worn rubber pick-up rollers or defective optical paper sensor require technician service.',
    serviceDomain: 'Printer Roller Cleansing & Replacement'
  },
  // Phone
  {
    deviceCategory: 'Phone',
    problem: 'Battery Draining Rapidly or Overheating',
    symptoms: ['Battery drops quickly within hours', 'Back panel hot during normal use', 'Unexpected shutdowns at 20%'],
    possibleCauses: ['Background app processing loop', 'Degraded Li-ion battery health', 'Defective charging port or cable'],
    safeTroubleshootingSteps: [
      'Restart the smartphone to clear stuck background service processes.',
      'Inspect the charging port gently with a dry wooden toothpick or soft brush to remove pocket lint.',
      'Test charging with a certified original cable and adapter on a known good wall outlet.',
      'Check Battery Health in settings and enable Battery Saver mode.'
    ],
    escalationCondition: 'If battery is visibly swelling, warping the display, or hot when idle, cease use immediately. Professional battery replacement is required.',
    isHighRiskHardware: false,
    safetyWarning: 'Never puncture a swollen smartphone battery. If swollen, do not charge and store in a fire-safe container.',
    serviceDomain: 'Phone Battery & Thermal Diagnostics'
  },
  // Computer
  {
    deviceCategory: 'Computer',
    problem: 'PC Powers On But No Display Output',
    symptoms: ['Fans spin and LEDs light up', 'Monitor displays "No Signal"', 'Continuous beeping on motherboard startup'],
    possibleCauses: ['Unseated RAM memory module', 'Loose HDMI/DisplayPort cable', 'GPU power connector fault'],
    safeTroubleshootingSteps: [
      'Verify the monitor is powered on and set to the correct input source (HDMI 1, DP 1).',
      'Unplug the monitor cable from both ends and firmly reseat it.',
      'If using a dedicated graphics card, verify the video cable is plugged into the GPU port, not the motherboard.',
      'Perform a cold power cycle: Turn off PSU switch, unplug power cable, hold front power button 20 seconds, reconnect.'
    ],
    escalationCondition: 'Motherboard POST diagnostic failure, RAM failure, or dead power supply unit requires hardware bench diagnostics.',
    isHighRiskHardware: false,
    safetyWarning: 'Always unplug the PC from the wall socket before touching exterior cables. Never open the metal casing of the Power Supply Unit (PSU).',
    serviceDomain: 'RAM & Motherboard POST Diagnostics'
  },
  // Wi-Fi / Router
  {
    deviceCategory: 'Wi-Fi / Router',
    problem: 'Frequent Connection Drops / Red Internet LED',
    symptoms: ['Wi-Fi disconnects intermittently', 'Slow internet across all devices', 'Router blinking red/amber WAN light'],
    possibleCauses: ['ISP line signal degradation', 'Overheating router firmware', 'Loose RJ-45 ethernet cable'],
    safeTroubleshootingSteps: [
      'Perform a 30-30-30 power cycle: Unplug power adapter, wait 30 seconds, plug back in and allow 2 minutes to boot.',
      'Inspect the yellow/blue WAN cable coming from your modem/fiber ONT to ensure it clicks firmly into the WAN port.',
      'Ensure the router is elevated off the floor in an open space, away from large metal objects and microwaves.',
      'Check if your ISP is reporting an area outage.'
    ],
    escalationCondition: 'Persistent WAN loss or damaged fiber optic patch cable requires physical line technician repair.',
    isHighRiskHardware: false,
    safetyWarning: 'Do not look directly into the tip of fiber optic cables; invisible laser light can cause eye damage.',
    serviceDomain: 'Router Firmware & Network Line Diagnostics'
  },
  // Projector / Home Theatre / Speaker
  {
    deviceCategory: 'Projector / Home Theatre / Speaker',
    problem: 'Audio Distortion / Crackling Speaker Sound',
    symptoms: ['Crackling or static sound at higher volume', 'One audio channel cutting out', 'Bluetooth audio latency'],
    possibleCauses: ['Loose aux/optical cable connection', 'Torn speaker cone surround', 'Bluetooth wireless 2.4GHz interference'],
    safeTroubleshootingSteps: [
      'Test audio playback across multiple sources (Bluetooth, Aux, HDMI ARC) to isolate if the issue is source-specific.',
      'Inspect physical speaker wire connections at the back terminals for fraying or loose copper strands.',
      'Keep speaker units at least 3 feet away from Wi-Fi routers or cordless phones to prevent wireless interference.',
      'Lower volume to 70% to check if sound clearing indicates amplifier clipping.'
    ],
    escalationCondition: 'Blown speaker voice coil or failed amplifier capacitors require authorized audio service.',
    isHighRiskHardware: false,
    safetyWarning: 'Power off the amplifier before connecting or disconnecting speaker wires to prevent shorting the amplifier outputs.',
    serviceDomain: 'Speaker Audio Coil & Crossover Repair'
  }
];

export const seedDatabase = async () => {
  try {
    console.log('[SEED] Starting Fixora database initialization...');
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    // 1. Seed Categories
    console.log('[SEED] Seeding device categories...');
    for (const cat of categoryData) {
      await DeviceCategory.findOneAndUpdate(
        { name: cat.name },
        { $set: cat },
        { upsert: true, new: true }
      );
    }

    // 2. Seed KnowledgeBase
    console.log('[SEED] Seeding troubleshooting knowledge base...');
    for (const kb of knowledgeBaseData) {
      await KnowledgeBase.findOneAndUpdate(
        { deviceCategory: kb.deviceCategory, problem: kb.problem },
        { $set: kb },
        { upsert: true, new: true }
      );
    }

    // 3. Seed Administrator
    console.log('[SEED] Ensuring default admin account...');
    let admin = await User.findOne({ email: 'admin@fixora.com' });
    if (!admin) {
      admin = await User.create({
        name: 'System Administrator',
        email: 'admin@fixora.com',
        mobileNumber: '9876543210',
        password: 'AdminPassword@123',
        role: ROLES.ADMIN,
        accountStatus: ACCOUNT_STATUS.ACTIVE
      });
      console.log('[SEED] Created Admin: admin@fixora.com / AdminPassword@123');
    }

    // 4. Seed Sample Verified Customer
    let customerUser = await User.findOne({ email: 'customer@fixora.com' });
    if (!customerUser) {
      customerUser = await User.create({
        name: 'Rahul Sharma',
        email: 'customer@fixora.com',
        mobileNumber: '9123456780',
        password: 'CustomerPassword@123',
        role: ROLES.CUSTOMER,
        accountStatus: ACCOUNT_STATUS.ACTIVE
      });

      await Customer.create({
        user: customerUser._id,
        aadhaarNumber: '123456789012',
        aadhaarDocument: {
          fileUrl: '/uploads/sample_aadhaar.pdf',
          originalName: 'aadhaar_card_rahul.pdf',
          fileType: 'application/pdf',
          fileSize: 184500,
          uploadedAt: new Date(Date.now() - 5 * 86400000)
        },
        preliminaryChecks: {
          passed: true,
          fileValid: true,
          qualityOk: true,
          duplicateChecked: true,
          formatMatches: true,
          notes: ['Aadhaar format verified (12-digits).', 'Valid PDF document.', 'No duplicates.'],
          checkedAt: new Date(Date.now() - 5 * 86400000)
        },
        adminApprovalStatus: VERIFICATION_STATUS.APPROVED,
        approvedAt: new Date(Date.now() - 4 * 86400000),
        adminRemarks: 'Verified by Fixora Administrator.',
        address: {
          street: '42 MG Road, Indiranagar',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560038'
        }
      });
      console.log('[SEED] Created Sample Verified Customer: customer@fixora.com / CustomerPassword@123');
    }

    // 5. Seed Sample Verified Service Providers
    const sampleProviders = [
      {
        name: 'Suresh Kumar - AC & Cooling Pro',
        email: 'suresh.ac@fixora.com',
        mobileNumber: '9988776655',
        categories: ['AC', 'Refrigerator'],
        expertise: ['AC Drain Pipe & Deep Cleaning Service', 'AC Refrigerant Gas & Capacitor Repair', 'Cooling & Compressor'],
        experienceYears: 7,
        city: 'Bangalore',
        serviceArea: ['Bangalore', 'Indiranagar', 'Koramangala', 'Whitefield'],
        rating: 4.9,
        reviewCount: 28,
        completedServicesCount: 34,
        bio: 'Certified HVAC & Domestic Cooling Technician with 7+ years of experience across all major AC & Fridge brands.'
      },
      {
        name: 'Vikram Electronics - TV & Audio Specialist',
        email: 'vikram.tv@fixora.com',
        mobileNumber: '9877665544',
        categories: ['TV', 'Projector / Home Theatre / Speaker'],
        expertise: ['TV Backlight Repair', 'TV Panel Repair', 'TV Power & Display Repair', 'Audio Amplifier & Driver Repair'],
        experienceYears: 5,
        city: 'Bangalore',
        serviceArea: ['Bangalore', 'HSR Layout', 'Electronic City', 'Indiranagar'],
        rating: 4.8,
        reviewCount: 19,
        completedServicesCount: 22,
        bio: 'Expert TV backlight and PCB motherboard diagnostic specialist for Sony, Samsung, LG & Mi smart TVs.'
      },
      {
        name: 'TechRevive - Laptop & PC Clinic (NEW)',
        email: 'techrevive@fixora.com',
        mobileNumber: '9766554433',
        categories: ['Laptop', 'Computer', 'Printer'],
        expertise: ['Laptop Screen Replacement', 'Laptop Motherboard & Power Repair', 'Thermal Paste & Cooling Service'],
        experienceYears: 4,
        city: 'Bangalore',
        serviceArea: ['Bangalore', 'Indiranagar', 'Jayanagar'],
        rating: 0, // NEW provider with no reviews yet!
        reviewCount: 0,
        completedServicesCount: 1,
        bio: 'Precision electronics lab technician specialized in SMD soldering, laptop screen replacement, and thermal tuning.'
      }
    ];

    for (const p of sampleProviders) {
      let pUser = await User.findOne({ email: p.email });
      if (!pUser) {
        pUser = await User.create({
          name: p.name,
          email: p.email,
          mobileNumber: p.mobileNumber,
          password: 'ProviderPassword@123',
          role: ROLES.PROVIDER,
          accountStatus: ACCOUNT_STATUS.ACTIVE
        });

        await ServiceProvider.create({
          user: pUser._id,
          location: { city: p.city, state: 'Karnataka', pincode: '560001', address: 'Service Hub' },
          serviceArea: p.serviceArea,
          categories: p.categories,
          expertise: p.expertise,
          experienceYears: p.experienceYears,
          faceRegistration: {
            registered: true,
            faceImageUrl: '/uploads/sample_face.jpg',
            capturedAt: new Date(Date.now() - 10 * 86400000),
            livenessScore: 0.98,
            status: 'COMPLETED'
          },
          faceRegistered: true,
          documents: [
            {
              documentType: 'technical_certificate',
              fileUrl: '/uploads/sample_cert.pdf',
              originalName: 'trade_technician_certificate.pdf',
              uploadedAt: new Date(Date.now() - 10 * 86400000),
              preliminaryValid: true
            }
          ],
          documentsVerified: true,
          adminApproved: true,
          adminApprovalStatus: VERIFICATION_STATUS.APPROVED,
          approvedAt: new Date(Date.now() - 8 * 86400000), // Within 30 days
          rating: p.rating,
          reviewCount: p.reviewCount,
          completedServicesCount: p.completedServicesCount,
          isAvailable: true,
          bio: p.bio
        });
        console.log(`[SEED] Created Verified Provider: ${p.email} / ProviderPassword@123`);
      }
    }

    // 6. Seed Sample Customer Service Request
    const existingReq = await ServiceRequest.findOne({ requestNumber: 'REQ-20261010-001' });
    const targetCustomer = await User.findOne({ email: 'customer@fixora.com' });
    if (!existingReq && targetCustomer) {
      const providerUser = await User.findOne({ email: 'suresh.ac@fixora.com' });
      if (providerUser) {
        await ServiceRequest.create({
          requestNumber: 'REQ-20261010-001',
          customer: customerUser._id,
          provider: providerUser._id,
          deviceCategory: 'AC',
          brand: 'Voltas',
          modelNumber: '1.5 Ton Split Inverter',
          problemDescription: 'Indoor unit leaking water rapidly from front panel. Filter cleaning did not resolve the drip.',
          serviceDomain: 'AC Drain Pipe & Deep Cleaning Service',
          status: SERVICE_REQUEST_STATUS.PENDING,
          scheduledDate: new Date(Date.now() + 86400000),
          serviceAddress: {
            street: '42 MG Road, Indiranagar',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560038',
            contactNumber: '9123456780'
          },
          estimatedCost: 850
        });
        console.log('[SEED] Created Sample Service Request: REQ-20261010-001');
      }
    }

    console.log('[SEED] Fixora database seeded successfully.');
  } catch (error) {
    console.error(`[SEED: ERROR] ${error.message}`);
  }
};

// Execute if run directly via command line
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().then(() => {
    closeDB().then(() => process.exit(0));
  });
}
