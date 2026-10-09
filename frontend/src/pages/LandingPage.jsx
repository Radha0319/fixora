// UI: Elevated Fixora Landing Page inspired by Reference UI (Image 2 - Notch SaaS Style)
import React from 'react';
import {
  Wrench,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
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
  Sparkles,
  Lock,
  Calendar,
  Clock,
  Star,
  Users
} from 'lucide-react';

const CATEGORIES = [
  { name: 'TV', icon: Tv, desc: 'Smart TV, Backlight, LED panel & HDMI circuits', color: '#4F46E5' },
  { name: 'Wi-Fi / Router', icon: Wifi, desc: 'Bandwidth drops, fiber links, mesh & DNS setup', color: '#0D9488' },
  { name: 'Laptop', icon: Laptop, desc: 'Display lines, battery drain, thermal paste & hinges', color: '#2563EB' },
  { name: 'Phone', icon: Smartphone, desc: 'Touch panels, charging ports, cameras & batteries', color: '#7C3AED' },
  { name: 'Projector / Home Theatre / Speaker', icon: Speaker, desc: 'Optical lamps, audio amplifiers & Bluetooth units', color: '#E11D48' },
  { name: 'Washing Machine', icon: Disc, desc: 'Drainage pumps, motor belts, spin imbalance & seals', color: '#0284C7' },
  { name: 'Refrigerator', icon: Refrigerator, desc: 'Compressor relays, cooling coils, frost & thermostats', color: '#059669' },
  { name: 'AC', icon: Wind, desc: 'Water leaks, capacitors, coolant gas & filters', color: '#2563EB' },
  { name: 'Computer', icon: Cpu, desc: 'POST failures, blue screen errors, SMPS & RAM issues', color: '#4F46E5' },
  { name: 'Microwave Oven', icon: Flame, desc: 'Turntables, magnetrons, heating & safety latches', color: '#EA580C' },
  { name: 'Printer', icon: Printer, desc: 'Paper feed jams, ink heads, toner & drivers', color: '#64748B' }
];

export const LandingPage = ({ onNavigate, onSelectCategory }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Hero Section: Atmospheric Twilight Blue/Indigo Gradient (Directly from Image 2) */}
      <section
        style={{
          background: 'linear-gradient(180deg, #1E1B4B 0%, #2E2875 50%, #4338CA 85%, #F8FAFC 100%)',
          padding: '70px 24px 80px 24px',
          textAlign: 'center',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Ambient Glow Orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(129, 140, 248, 0.25) 0%, rgba(30, 27, 75, 0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ maxWidth: '1080px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* Announcement Capsule Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              padding: '7px 20px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#E0E7FF',
              marginBottom: '28px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
            }}
          >
            <Sparkles size={14} color="#A5B4FC" />
            <span>Introducing Fixora 2.4 · Safe AI Diagnostics & Verified Technicians</span>
            <ArrowRight size={13} color="#C7D2FE" />
          </div>

          {/* Hero Main Headline */}
          <h1
            style={{
              fontSize: '52px',
              fontWeight: '900',
              letterSpacing: '-1.5px',
              lineHeight: '1.12',
              maxWidth: '880px',
              margin: '0 auto 20px auto',
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            Keep Your Appliances <br />
            <span style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #C7D2FE 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Running Smoothly
            </span>
          </h1>

          <p
            style={{
              fontSize: '18px',
              color: '#C7D2FE',
              maxWidth: '700px',
              margin: '0 auto 36px auto',
              lineHeight: '1.6',
              fontWeight: '400'
            }}
          >
            A shared platform where home appliance problems are diagnosed with non-invasive AI safety guards, verified technicians are matched by domain expertise, and repairs are completed with trust.
          </p>

          {/* Dual Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '56px' }}>
            <button
              onClick={() => onNavigate('chat')}
              className="btn btn-primary"
              style={{
                background: '#FFFFFF',
                color: '#1E1B4B',
                padding: '13px 28px',
                fontSize: '15px',
                fontWeight: '700',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
              }}
            >
              Start AI Diagnosis <ArrowRight size={16} />
            </button>

            <button
              onClick={() => onNavigate('login')}
              className="btn btn-glass"
              style={{
                padding: '13px 28px',
                fontSize: '15px',
                fontWeight: '600'
              }}
            >
              Access Dashboard
            </button>
          </div>

          {/* Hero Dashboard Preview Window Frame (Directly matching Image 2 mockup) */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              borderRadius: '24px',
              boxShadow: '0 30px 60px -15px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.2)',
              overflow: 'hidden',
              textAlign: 'left',
              color: '#0F172A',
              maxWidth: '980px',
              margin: '0 auto'
            }}
          >
            {/* Top Mockup Header Bar */}
            <div
              style={{
                background: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                padding: '14px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569', marginLeft: '12px' }}>
                  FIXORA SERVICE PORTAL · LIVE PLATFORM PREVIEW
                </span>
              </div>
              <span className="badge badge-verified" style={{ fontSize: '11px' }}>
                <ShieldCheck size={11} /> 100% Verified Technicians
              </span>
            </div>

            {/* Mockup Dashboard Content */}
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                <div style={{ padding: '16px', borderRadius: '14px', background: 'linear-gradient(135deg, #4F46E5, #3730A3)', color: '#FFF' }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', opacity: 0.9 }}>AC & COOLING SPECIALIST</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', marginTop: '6px' }}>Voltas 1.5T Drain Service</div>
                  <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>Match Score: 98% · Suresh Kumar</div>
                </div>

                <div style={{ padding: '16px', borderRadius: '14px', background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: '#FFF' }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', opacity: 0.9 }}>SMART TV DIAGNOSTICS</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', marginTop: '6px' }}>LED Backlight Repair</div>
                  <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>Match Score: 94% · Vikram Electronics</div>
                </div>

                <div style={{ padding: '16px', borderRadius: '14px', background: 'linear-gradient(135deg, #0D9488, #0F766E)', color: '#FFF' }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', opacity: 0.9 }}>PRECISION LAPTOP CLINIC</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', marginTop: '6px' }}>Display Ribbon Replacement</div>
                  <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>🆕 NEW · TechRevive Lab</div>
                </div>
              </div>

              {/* Status and Action bar inside mockup */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#F1F5F9',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  color: '#475569'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={15} color="#10B981" />
                  <span>Aadhaar customer verification + biometric webcam face registration active</span>
                </div>
                <button
                  onClick={() => onNavigate('login')}
                  className="btn btn-sm btn-primary"
                  style={{ fontSize: '12px', padding: '6px 14px' }}
                >
                  Enter Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Step Structured Journey */}
      <section style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
            Structured 3-Step Journey
          </h2>
          <p style={{ color: '#64748B', fontSize: '15px', marginTop: '4px' }}>
            Guaranteed safety and transparency from initial symptom to certified resolution
          </p>
        </div>

        <div className="grid-cols-3">
          <div className="card" style={{ borderTop: '4px solid #4F46E5', borderRadius: '18px' }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#4F46E5', marginBottom: '6px' }}>
              STEP 01
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>
              Select Device & Problem
            </h3>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.5' }}>
              Choose from 11 supported electronics categories, explain symptoms, and attach an exterior photo for precision diagnosis.
            </p>
          </div>

          <div className="card" style={{ borderTop: '4px solid #10B981', borderRadius: '18px' }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#10B981', marginBottom: '6px' }}>
              STEP 02
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>
              Safe AI Troubleshooting
            </h3>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.5' }}>
              Receive safe, exterior-only troubleshooting steps. High-voltage electrical and compressor hazards trigger instant safety escalation.
            </p>
          </div>

          <div className="card" style={{ borderTop: '4px solid #7C3AED', borderRadius: '18px' }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#7C3AED', marginBottom: '6px' }}>
              STEP 03
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>
              Verified Expert Matching
            </h3>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.5' }}>
              Connect with certified service providers ranked by domain expertise (50%), nearby availability (30%), and real ratings (20%).
            </p>
          </div>
        </div>
      </section>

      {/* 11 Device Categories Grid */}
      <section style={{ maxWidth: '1200px', margin: '48px auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
            11 Supported Electronics & Appliances
          </h2>
          <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>
            Tailored knowledge bases and verified technicians for each category
          </p>
        </div>

        <div className="grid-cols-4">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="card"
                onClick={() => {
                  if (onSelectCategory) onSelectCategory(cat.name);
                  onNavigate('chat');
                }}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '22px',
                  borderRadius: '16px'
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: `${cat.color}15`,
                    color: cat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '14px'
                  }}
                >
                  <Icon size={22} />
                </div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', marginBottom: '4px' }}>
                  {cat.name}
                </div>
                <div style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.4', flex: 1 }}>
                  {cat.desc}
                </div>
                <div
                  style={{
                    marginTop: '16px',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: cat.color,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Troubleshoot <ArrowRight size={12} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Servicer Recruitment Banner */}
      <section style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 24px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
            borderRadius: '24px',
            padding: '36px 40px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            boxShadow: '0 20px 40px -15px rgba(30, 27, 75, 0.4)'
          }}
        >
          <div style={{ maxWidth: '650px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.12)',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#A7F3D0',
                marginBottom: '12px',
                textTransform: 'uppercase'
              }}
            >
              <Wrench size={12} /> Technician Network
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
              Are you an appliance technician or electrical servicer?
            </h2>
            <p style={{ fontSize: '14px', color: '#C7D2FE', margin: 0, lineHeight: '1.6' }}>
              Join Fixora to connect with clients seeking verified diagnostics. Register with your qualifications, technical experience, and service areas to start receiving bookings.
            </p>
          </div>
          <button
            onClick={() => onNavigate('register-servicer')}
            className="btn btn-primary"
            style={{
              background: '#FFFFFF',
              color: '#1E1B4B',
              padding: '13px 28px',
              fontSize: '15px',
              fontWeight: '700',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Register as Servicer <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Trust & Safety Highlights */}
      <section style={{ maxWidth: '1200px', margin: '40px auto 60px auto', padding: '0 24px' }}>
        <div
          className="card"
          style={{
            padding: '36px',
            borderRadius: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4F46E5', marginBottom: '8px' }}>
              <ShieldCheck size={24} />
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>
                Strict Platform Verification
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.5' }}>
              Customers complete Aadhaar document review before gaining booking access. Technicians undergo device camera face registration and certificate validation.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', marginBottom: '8px' }}>
              <CheckCircle size={24} />
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>
                No Fake Ratings or Providers
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.5' }}>
              Only completed service requests can be reviewed. Newly approved technicians display the informational NEW badge without artificial rating inflation.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', marginBottom: '8px' }}>
              <Lock size={24} />
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>
                Hardware Safety First
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.5' }}>
              Our troubleshooting engine prohibits DIY manipulation of mains wiring, microwave magnetrons, or high-voltage capacitors to protect customer safety.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
