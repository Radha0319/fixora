// CHAT: Modern Interactive AI Troubleshooting Assistant (Chat-to-Chat Multi-Turn UI)
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Upload,
  ArrowRight,
  ShieldAlert,
  Wrench,
  Send,
  RefreshCw,
  X,
  Bot,
  User as UserIcon,
  HelpCircle,
  Tv,
  Wifi,
  Laptop,
  Smartphone,
  Speaker,
  Disc,
  Refrigerator,
  Wind,
  Cpu,
  Flame,
  Printer,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon
} from 'lucide-react';

const CATEGORY_ICONS = {
  'TV': Tv,
  'Wi-Fi / Router': Wifi,
  'Laptop': Laptop,
  'Phone': Smartphone,
  'Projector / Home Theatre / Speaker': Speaker,
  'Washing Machine': Disc,
  'Refrigerator': Refrigerator,
  'AC': Wind,
  'Computer': Cpu,
  'Microwave Oven': Flame,
  'Printer': Printer
};

const CATEGORIES = [
  'AC',
  'Refrigerator',
  'Washing Machine',
  'TV',
  'Microwave Oven',
  'Laptop',
  'Phone',
  'Computer',
  'Printer',
  'Wi-Fi / Router',
  'Projector / Home Theatre / Speaker'
];

const CATEGORY_PROMPTS = {
  'AC': [
    'Blowing warm air / no cooling',
    'Water leaking from indoor unit',
    'Strange buzzing or rattling noise',
    'AC outdoor unit fan not turning on'
  ],
  'Refrigerator': [
    'Fridge not cooling, freezer is cold',
    'Excessive ice / frost buildup',
    'Water pooling under vegetable tray',
    'Loud humming noise from compressor'
  ],
  'Washing Machine': [
    'Drum not spinning during cycle',
    'Water not draining / error code',
    'Excessive vibration and banging noise',
    'Water leaking from bottom or door seal'
  ],
  'TV': [
    'No picture / black screen with sound',
    'Flickering horizontal or vertical lines',
    'TV won\'t power on / no standby light',
    'HDMI ports showing "No Signal"'
  ],
  'Microwave Oven': [
    'Turntable spins but food does not heat',
    'Sparking / arcing inside chamber',
    'Keypad buttons not responding',
    'Unusual humming / buzzing noise'
  ],
  'Laptop': [
    'Battery not charging when plugged in',
    'Overheating and loud fan noise',
    'Screen flickering or black display',
    'Laptop freezing or slow bootup'
  ],
  'Phone': [
    'Battery draining unusually fast',
    'Phone overheating while charging',
    'Touchscreen unresponsive in areas',
    'Microphone or speaker muffled'
  ],
  'Computer': [
    'PC powers on but no display signal',
    'Sudden Blue Screen (BSOD) crashes',
    'Continuous beeping sound on startup',
    'CPU overheating and thermal throttling'
  ],
  'Printer': [
    'Paper jamming repeatedly',
    'Faded or streaked printouts',
    'Printer showing offline / driver error',
    'Ink cartridge not recognized'
  ],
  'Wi-Fi / Router': [
    'Frequent Wi-Fi disconnects',
    'Slow speeds across all connected devices',
    'Internet LED blinking orange or red',
    'Cannot connect to 5GHz frequency band'
  ],
  'Projector / Home Theatre / Speaker': [
    'Projector lamp won\'t light up',
    'Audio distortion or crackling sound',
    'Bluetooth pairing dropping constantly',
    'Projector image blurry or discolored'
  ]
};

export const TroubleshootingAssistant = ({ onNavigate, preselectedCategory }) => {
  const { user, profile } = useAuth();
  const [deviceCategory, setDeviceCategory] = useState(preselectedCategory || 'AC');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [showDeviceSpecs, setShowDeviceSpecs] = useState(false);

  const [inputMessage, setInputMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const isCustomerApproved = profile?.adminApprovalStatus === 'APPROVED';

  // Chat message stream
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Hello${user?.name ? ' ' + user.name.split(' ')[0] : ''}! I am Fixora's Safe Diagnostic AI Assistant 🛠️.
Select your appliance category above and describe the symptoms you're experiencing. I will provide safe, exterior step-by-step diagnostic checks and guide you if professional technician repair is needed.`,
      category: preselectedCategory || 'AC',
      suggestedReplies: CATEGORY_PROMPTS[preselectedCategory || 'AC'] || []
    }
  ]);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle category switch
  const handleSelectCategory = (cat) => {
    if (cat === deviceCategory) return;
    setDeviceCategory(cat);
    
    // Add system assistant message announcing the switch
    const switchMsg = {
      id: `switch-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Switched active appliance to **${cat}**. What issues are you observing with this device? You can type your symptom or choose one of the common issues below:`,
      category: cat,
      suggestedReplies: CATEGORY_PROMPTS[cat] || []
    };
    setMessages((prev) => [...prev, switchMsg]);
  };

  // Handle image upload selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Reset conversation
  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Consultation reset. I'm ready to diagnose your **${deviceCategory}**. What symptoms or errors are you experiencing?`,
        category: deviceCategory,
        suggestedReplies: CATEGORY_PROMPTS[deviceCategory] || []
      }
    ]);
    removeSelectedImage();
    setInputMessage('');
  };

  // Send message
  const handleSendMessage = async (textToSend, customImage = null) => {
    const text = (textToSend || inputMessage).trim();
    const imageToUse = customImage || selectedImage;

    if (!text && !imageToUse) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text || 'Diagnose uploaded exterior image',
      imagePreview: imagePreview || null
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    removeSelectedImage();
    setLoading(true);

    try {
      // Build conversation history summary for context
      const historyContext = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text || m.conversationalReply || ''
      }));

      let payload;
      if (imageToUse) {
        payload = new FormData();
        payload.append('deviceCategory', deviceCategory);
        if (brand) payload.append('brand', brand);
        if (model) payload.append('model', model);
        payload.append('userDescription', text || 'Inspect uploaded photo');
        payload.append('history', JSON.stringify(historyContext));
        payload.append('problemImage', imageToUse);
      } else {
        payload = {
          deviceCategory,
          brand: brand || undefined,
          model: model || undefined,
          userDescription: text,
          history: historyContext
        };
      }

      const res = await api.diagnoseChat(payload);

      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: res.conversationalReply || `Diagnosis complete for ${res.device}.`,
        diagnosis: res,
        category: res.device || deviceCategory,
        suggestedReplies: res.suggestedReplies || [
          'I tried this, it worked! 🎉',
          'Still having the problem after checks',
          'Find Verified Technicians'
        ]
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg = {
        id: `error-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `⚠️ ${err.message || 'Troubleshooting diagnostic failed. Please check your network connection and try again.'}`,
        suggestedReplies: ['Try again', 'Find Verified Technicians']
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const ActiveIcon = CATEGORY_ICONS[deviceCategory] || Wrench;

  return (
    <div className="page-container" style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '30px' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)'
            }}
          >
            <Sparkles size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.5px', margin: 0 }}>
              AI Troubleshooting Assistant
            </h1>
            <p style={{ color: '#64748B', fontSize: '13px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
              Interactive Safe Diagnostic Engine • 11 Appliance Categories
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Toggle Brand / Model context */}
          <button
            type="button"
            onClick={() => setShowDeviceSpecs(!showDeviceSpecs)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
          >
            <ActiveIcon size={14} color="#4F46E5" />
            <span>
              {brand ? `${brand} ${model || ''}` : 'Specify Brand / Model'}
            </span>
            {showDeviceSpecs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {/* New consultation button */}
          <button
            type="button"
            onClick={handleResetChat}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
            title="Reset consultation"
          >
            <RefreshCw size={14} /> New Chat
          </button>
        </div>
      </div>

      {/* Optional Brand & Model Quick Input Card */}
      {showDeviceSpecs && (
        <div
          className="card"
          style={{
            padding: '16px 20px',
            marginBottom: '16px',
            borderRadius: '16px',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#334155', minWidth: '120px' }}>
            Device Specs:
          </div>
          <div style={{ flex: '1', minWidth: '180px' }}>
            <input
              type="text"
              className="form-input"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Brand / Manufacturer (e.g. Samsung, Voltas, LG)"
              style={{ padding: '8px 12px', fontSize: '13px' }}
            />
          </div>
          <div style={{ flex: '1', minWidth: '180px' }}>
            <input
              type="text"
              className="form-input"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Model Number (e.g. 1.5 Ton Inverter, 55-inch OLED)"
              style={{ padding: '8px 12px', fontSize: '13px' }}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowDeviceSpecs(false)}
            className="btn btn-primary btn-sm"
            style={{ padding: '8px 14px', fontSize: '12px' }}
          >
            Apply Context
          </button>
        </div>
      )}

      {/* 11 Appliance Categories Ribbon */}
      <div style={{ marginBottom: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            scrollbarWidth: 'thin'
          }}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = deviceCategory === cat;
            const Icon = CATEGORY_ICONS[cat] || Wrench;
            return (
              <button
                type="button"
                key={cat}
                onClick={() => handleSelectCategory(cat)}
                className={`category-tab-pill ${isSelected ? 'active' : ''}`}
              >
                <Icon size={14} color={isSelected ? '#FFFFFF' : '#64748B'} />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Chat Window */}
      <div className="chat-container">
        {/* Active Context Header Sub-bar */}
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#EEF2FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4F46E5'
              }}
            >
              <ActiveIcon size={18} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                {deviceCategory} Diagnostic Session
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                {brand ? `${brand} ${model || ''}` : 'Generic Category Model'} • Exterior Non-Invasive Safety Protocol Active
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-verified" style={{ fontSize: '11px', padding: '4px 8px' }}>
              <CheckCircle2 size={12} /> Safe AI Engine
            </span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="chat-messages">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const diag = msg.diagnosis;

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-end' : 'flex-start',
                  width: '100%'
                }}
              >
                {/* Sender Tag & Timestamp */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '5px',
                    fontSize: '11px',
                    color: '#94A3B8',
                    padding: '0 4px'
                  }}
                >
                  {isUser ? (
                    <>
                      <span>{msg.timestamp}</span>
                      <strong style={{ color: '#475569' }}>You</strong>
                      <UserIcon size={12} />
                    </>
                  ) : (
                    <>
                      <Bot size={12} color="#4F46E5" />
                      <strong style={{ color: '#4F46E5' }}>Fixora Diagnostic AI</strong>
                      <span>• {msg.timestamp}</span>
                    </>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-assistant'}>
                  {/* User Uploaded Image Preview */}
                  {msg.imagePreview && (
                    <div style={{ marginBottom: '10px' }}>
                      <img
                        src={msg.imagePreview}
                        alt="Attached exterior inspection"
                        style={{
                          maxWidth: '240px',
                          maxHeight: '180px',
                          borderRadius: '12px',
                          objectFit: 'cover',
                          border: '2px solid rgba(255,255,255,0.4)',
                          display: 'block'
                        }}
                      />
                    </div>
                  )}

                  {/* Main Text Content */}
                  <div style={{ whiteSpace: 'pre-line', fontSize: '14px', lineHeight: '1.6' }}>
                    {msg.text}
                  </div>

                  {/* Structured Diagnostic Cards if Diagnosis Available */}
                  {diag && (
                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {/* Safety Alert Directive */}
                      <div
                        className={`alert ${diag.isDangerousHardware ? 'alert-danger' : 'alert-warning'}`}
                        style={{ fontSize: '13px', lineHeight: '1.4', margin: 0, borderRadius: '12px' }}
                      >
                        {diag.isDangerousHardware ? (
                          <ShieldAlert size={20} style={{ flexShrink: 0, color: '#DC2626' }} />
                        ) : (
                          <AlertTriangle size={20} style={{ flexShrink: 0, color: '#D97706' }} />
                        )}
                        <div>
                          <strong>{diag.safetyWarning}</strong>
                        </div>
                      </div>

                      {/* Problem Header & Mapped Service Domain */}
                      <div
                        style={{
                          background: '#F8FAFC',
                          padding: '12px 14px',
                          borderRadius: '12px',
                          border: '1px solid #E2E8F0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '8px'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>
                            Identified Malfunction
                          </div>
                          <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>
                            {diag.problem}
                          </div>
                        </div>
                        <span className="badge badge-info" style={{ fontSize: '11px' }}>
                          Domain: {diag.serviceDomain}
                        </span>
                      </div>

                      {/* Potential Causes */}
                      {diag.possibleCauses && diag.possibleCauses.length > 0 && (
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                            Potential Causes:
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {diag.possibleCauses.map((cause, idx) => (
                              <span
                                key={idx}
                                style={{
                                  padding: '4px 10px',
                                  background: '#F1F5F9',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  color: '#334155'
                                }}
                              >
                                • {cause}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Step-by-Step Safe Troubleshooting Steps */}
                      {diag.troubleshootingSteps && diag.troubleshootingSteps.length > 0 && (
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Safe Exterior Action Steps:
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {diag.troubleshootingSteps.map((step, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: 'flex',
                                  gap: '10px',
                                  padding: '10px 12px',
                                  borderRadius: '10px',
                                  background: '#F8FAFC',
                                  border: '1px solid #E2E8F0',
                                  fontSize: '13px',
                                  color: '#1E293B',
                                  lineHeight: '1.4'
                                }}
                              >
                                <span
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    background: '#4F46E5',
                                    color: '#FFF',
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                  }}
                                >
                                  {idx + 1}
                                </span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Escalation Condition */}
                      {diag.escalationCondition && (
                        <div
                          style={{
                            padding: '10px 14px',
                            background: '#F1F5F9',
                            borderRadius: '10px',
                            fontSize: '12px',
                            color: '#475569',
                            lineHeight: '1.4'
                          }}
                        >
                          <strong>Escalation Limit:</strong> {diag.escalationCondition}
                        </div>
                      )}

                      {/* Direct Technician Escalation Callout */}
                      {(diag.requiresService || diag.isDangerousHardware) && (
                        <div
                          style={{
                            padding: '14px 16px',
                            background: diag.isDangerousHardware ? '#FEF2F2' : '#EEF2FF',
                            borderRadius: '14px',
                            border: `1px solid ${diag.isDangerousHardware ? '#FECACA' : '#C7D2FE'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '12px',
                            marginTop: '4px'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: '800', color: diag.isDangerousHardware ? '#991B1B' : '#3730A3' }}>
                              {diag.isDangerousHardware ? 'Professional Repair Required' : 'Need On-Site Diagnostics?'}
                            </div>
                            <div style={{ fontSize: '12px', color: diag.isDangerousHardware ? '#B91C1C' : '#4338CA' }}>
                              Connect with verified {diag.device} specialists in your area
                            </div>
                          </div>

                          {isCustomerApproved ? (
                            <button
                              type="button"
                              onClick={() => onNavigate('providers', { category: diag.device, expertise: diag.serviceDomain })}
                              className="btn btn-primary btn-sm"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
                            >
                              Find Verified Technicians <ArrowRight size={14} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onNavigate('verification')}
                              className="btn btn-outline btn-sm"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
                              title="Unlock verified booking by completing Aadhaar check"
                            >
                              Verify to Book Service <ArrowRight size={14} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Interactive Suggested Replies Under Assistant Bubbles */}
                {!isUser && msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginTop: '8px',
                      marginBottom: '4px',
                      maxWidth: '90%'
                    }}
                  >
                    {msg.suggestedReplies.map((replyText, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(replyText)}
                        className="suggested-chip"
                        disabled={loading}
                      >
                        <span>{replyText}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px', fontSize: '11px', color: '#94A3B8' }}>
                <Bot size={12} color="#4F46E5" />
                <strong style={{ color: '#4F46E5' }}>Fixora Diagnostic AI</strong>
              </div>
              <div
                className="chat-bubble-assistant"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 18px'
                }}
              >
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
                <span style={{ fontSize: '13px', color: '#64748B' }}>
                  Analyzing symptoms and hardware safety directives...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Area */}
        <div style={{ background: '#FFFFFF', borderTop: '1px solid #E2E8F0', padding: '14px 20px' }}>
          {/* Staged Photo Attachment Preview Tag */}
          {imagePreview && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 12px',
                background: '#EEF2FF',
                border: '1px solid #C7D2FE',
                borderRadius: '10px',
                marginBottom: '10px'
              }}
            >
              <img
                src={imagePreview}
                alt="Selected attachment"
                style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '12px', color: '#4338CA', fontWeight: '600' }}>
                Exterior photo ready to send
              </span>
              <button
                type="button"
                onClick={removeSelectedImage}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#EF4444',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px'
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Input Form Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />

            {/* Photo Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-secondary"
              style={{
                padding: '11px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
              title="Attach exterior photo"
            >
              <Upload size={17} color="#475569" />
            </button>

            {/* Text Input Field */}
            <input
              type="text"
              className="form-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Describe symptoms for your ${deviceCategory} or click a prompt above...`}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 16px',
                fontSize: '14px',
                borderRadius: '12px',
                margin: 0
              }}
            />

            {/* Send Button */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || (!inputMessage.trim() && !selectedImage)}
              style={{
                padding: '12px 18px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flexShrink: 0
              }}
            >
              <Send size={16} />
              <span style={{ fontSize: '13px', fontWeight: '700' }}>Send</span>
            </button>
          </form>

          {/* Safety Notice Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '10px',
              fontSize: '11px',
              color: '#94A3B8'
            }}
          >
            <ShieldAlert size={12} color="#94A3B8" />
            <span>
              Fixora Safety Directive: Never open energized appliance panels or touch high-voltage internal capacitors.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
