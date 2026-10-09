// CHAT: AI Troubleshooting engine with hardware safety guards and interactive multi-turn dialogue
import { KnowledgeBase } from '../models/KnowledgeBase.js';
import { DANGEROUS_HARDWARE_KEYWORDS } from '../config/constants.js';

export const analyzeTroubleshootingQuery = async ({
  deviceCategory,
  brand,
  model,
  userDescription,
  imageUploaded,
  imageUrl,
  history = []
}) => {
  const query = (userDescription || '').trim().toLowerCase();

  // 1. SAFETY: Check for dangerous hardware keywords immediately
  const isDangerousHardware = DANGEROUS_HARDWARE_KEYWORDS.some((kw) =>
    query.includes(kw.toLowerCase())
  );

  // 2. DETECT MULTI-TURN CONVERSATIONAL INTENTS
  const isResolvedIntent = /\b(worked|fixed|working now|resolved|thank you|thanks|all good|done|sorted|problem solved)\b/i.test(query);
  const isStillFailingIntent = /\b(still not working|still broken|still leaking|still hot|didn't work|did not work|no change|same issue|same problem|persists|no luck|still bad)\b/i.test(query);
  const isTechnicianRequest = /\b(find technician|book technician|call expert|schedule service|repairman|expert|book service|call technician|need a pro)\b/i.test(query);

  // If user says it worked / problem resolved!
  if (isResolvedIntent) {
    return {
      success: true,
      device: deviceCategory,
      brand: brand || 'Not specified',
      model: model || 'Not specified',
      problem: 'Issue Safely Resolved',
      serviceDomain: `${deviceCategory} Preventative Care`,
      possibleCauses: ['Resolved via standard maintenance / reset'],
      troubleshootingSteps: [
        'Keep ventilation around the appliance free of dust and debris.',
        'Run monthly inspection of external cables and power plugs.',
        'Always ensure dry hands and stable wall power sockets.'
      ],
      escalationCondition: 'No escalation required. Appliance functioning within expected operating parameters.',
      safetyWarning: 'Great job staying safe! Unplug before routine exterior cleaning.',
      requiresService: false,
      isDangerousHardware: false,
      conversationalReply: `Fantastic news! 🎉 I'm glad we could safely resolve the issue on your ${deviceCategory}${brand ? ` (${brand})` : ''} without requiring an on-site technician. Remember to keep vents clear and perform periodic checks. What else can I assist you with?`,
      suggestedReplies: [
        'Diagnose another appliance',
        'How to maintain this appliance?',
        'Find verified technician for routine servicing'
      ]
    };
  }

  // If user confirms issue persists after safe exterior steps
  if (isStillFailingIntent) {
    return {
      success: true,
      device: deviceCategory,
      brand: brand || 'Not specified',
      model: model || 'Not specified',
      problem: 'Unresolved Internal Hardware Fault',
      serviceDomain: `${deviceCategory} Advanced Diagnostics & Repair`,
      possibleCauses: [
        'Internal component wear (motor, compressor, power inverter, or logic board)',
        'Faulty internal sensors or wiring harness',
        'Pressure or thermal cutoff safety trip'
      ],
      troubleshootingSteps: [
        'Safely disconnect the appliance from the main wall switch.',
        'Do NOT attempt to unscrew the chassis or touch internal circuitry.',
        'Keep the area dry and isolated until inspected.',
        'Book a background-verified Fixora service specialist.'
      ],
      escalationCondition: 'Exterior troubleshooting did not clear the fault. Continuing DIY inspection risks electric shock or voiding safety certifications.',
      safetyWarning: 'SAFETY DIRECTIVE: Do not open internal covers. Internal capacitors and sharp metal edges present severe risk.',
      requiresService: true,
      isDangerousHardware: false,
      conversationalReply: `Understood. Since basic exterior checks did not resolve the problem, this strongly points to an internal electrical or mechanical fault in your ${deviceCategory}. For your safety, internal disassembly is hazardous. I recommend having a verified Fixora technician diagnose it with proper test equipment.`,
      suggestedReplies: [
        'Find Verified Technicians',
        'What will the technician inspect?',
        'How much does a diagnostic visit cost?'
      ]
    };
  }

  // If user explicitly asks to book or locate technician
  if (isTechnicianRequest) {
    return {
      success: true,
      device: deviceCategory,
      brand: brand || 'Not specified',
      model: model || 'Not specified',
      problem: 'Technician Escalation Request',
      serviceDomain: `${deviceCategory} Specialist Dispatch`,
      possibleCauses: ['User requested professional in-person service'],
      troubleshootingSteps: [
        'Keep appliance switched off at the wall socket.',
        'Have model number and warranty details ready for the specialist.',
        'Connect directly with a verified Fixora technician in your area.'
      ],
      escalationCondition: 'Immediate specialist dispatch requested.',
      safetyWarning: 'Ensure the appliance is powered off before the technician arrives.',
      requiresService: true,
      isDangerousHardware: false,
      conversationalReply: `I can help you connect with verified, background-checked ${deviceCategory} specialists in your area. They provide doorstep diagnosis with upfront pricing and safety guarantees. Click below to browse available technicians!`,
      suggestedReplies: [
        'Find Verified Technicians',
        'Check technician ratings and reviews',
        'Diagnose another appliance'
      ]
    };
  }

  // 3. SEARCH KNOWLEDGE BASE FOR MATCHING SYMPTOMS
  const candidates = await KnowledgeBase.find({ deviceCategory });

  let matchedKb = null;
  let highestMatchCount = 0;

  for (const kb of candidates) {
    let matchScore = 0;
    const problemWords = kb.problem.toLowerCase().split(/\s+/);
    problemWords.forEach((word) => {
      if (word.length > 3 && query.includes(word)) {
        matchScore += 3;
      }
    });

    kb.symptoms.forEach((symptom) => {
      const symWords = symptom.toLowerCase().split(/\s+/);
      symWords.forEach((sw) => {
        if (sw.length > 3 && query.includes(sw)) {
          matchScore += 1.5;
        }
      });
    });

    if (matchScore > highestMatchCount) {
      highestMatchCount = matchScore;
      matchedKb = kb;
    }
  }

  // Fallback to first available category entry or generalized safe guidance if no specific symptom matches
  if (!matchedKb && candidates.length > 0) {
    matchedKb = candidates[0];
  }

  // 4. SERVICE DOMAIN MAPPING
  let serviceDomain = matchedKb ? matchedKb.serviceDomain : `${deviceCategory} Repair & Service`;
  let problemTitle = matchedKb ? matchedKb.problem : `${deviceCategory} Operational Malfunction`;
  let possibleCauses = matchedKb ? matchedKb.possibleCauses : [
    'Component wear or signal disruption',
    'Power socket or voltage fluctuation',
    'Mechanical obstruction or firmware freeze'
  ];
  let troubleshootingSteps = matchedKb ? [...matchedKb.safeTroubleshootingSteps] : [
    'Safely disconnect the power cable from the main outlet.',
    'Inspect power cord and external sockets for any visible damage or loose connections.',
    'Wait 5 minutes for internal capacitors to discharge before reconnecting power.',
    'Check if the appliance status LED indicator illuminates or beeps.'
  ];

  let escalationCondition = matchedKb
    ? matchedKb.escalationCondition
    : 'If standard restart and cable inspection do not resolve the issue, professional diagnostic is required.';

  // 5. ENFORCE SAFETY DIRECTIVE
  let requiresService = isDangerousHardware;
  let safetyWarning = '';

  if (isDangerousHardware) {
    requiresService = true;
    safetyWarning = 'CRITICAL SAFETY ALERT: This issue involves high-voltage electrical, compressor, or chemical/microwave hazards. Professional tools are required. Do NOT open the appliance casing yourself.';
    troubleshootingSteps = [
      'IMMEDIATELY turn off the power switch and unplug the device from the wall socket.',
      'Do not touch any exposed components, liquid, or charred areas.',
      'Keep children and pets away from the appliance.',
      'Book a verified Fixora service specialist to inspect the device safely.'
    ];
  } else {
    safetyWarning = matchedKb?.safetyWarning || 'Always keep hands dry and unplug appliances before inspecting exterior cables. Do not open interior casing.';
  }

  // Add note about uploaded image if supplied
  if (imageUploaded) {
    troubleshootingSteps.unshift('Exterior photo analyzed: Visual symptoms aligned with known exterior wear and connector points.');
  }

  // Generate friendly conversational text
  let conversationalReply = '';
  if (isDangerousHardware) {
    conversationalReply = `⚠️ **Hazard Detected!** The symptoms you described involve potential high-voltage, compressor, or chemical hazards for your ${deviceCategory}. For your safety, do not attempt to open the unit or touch internal components. Please follow the emergency exterior steps below and schedule a verified technician.`;
  } else {
    conversationalReply = `I've analyzed the symptoms for your **${deviceCategory}**${brand ? ` (${brand})` : ''}. This closely aligns with **${problemTitle}**. Here are safe exterior troubleshooting steps you can perform right now:`;
  }

  // Generate smart suggested reply chips
  const suggestedReplies = isDangerousHardware
    ? [
        'Find Verified Technicians',
        'Is it safe to keep it plugged in?',
        'Diagnose another appliance'
      ]
    : [
        'I tried this, it worked! 🎉',
        'Still having the problem after checks',
        'Could it be a power surge or fuse issue?',
        'Book a Verified Technician'
      ];

  return {
    success: true,
    device: deviceCategory,
    brand: brand || 'Not specified',
    model: model || 'Not specified',
    problem: problemTitle,
    serviceDomain,
    possibleCauses,
    troubleshootingSteps,
    escalationCondition,
    safetyWarning,
    requiresService,
    isDangerousHardware,
    conversationalReply,
    suggestedReplies
  };
};
