// DB: Service Provider Expertise and Service Area Manager
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { Layers, MapPin, CheckCircle, Save, Sparkles, Award, Sliders } from 'lucide-react';

const ALL_CATEGORIES = [
  'TV',
  'Wi-Fi / Router',
  'Laptop',
  'Phone',
  'Projector / Home Theatre / Speaker',
  'Washing Machine',
  'Refrigerator',
  'AC',
  'Computer',
  'Microwave Oven',
  'Printer'
];

export const ProviderExpertise = () => {
  const { profile, refreshProfile } = useAuth();
  const [selectedCats, setSelectedCats] = useState(profile?.categories || ['AC']);
  const [expertiseInput, setExpertiseInput] = useState((profile?.expertise || []).join(', '));
  const [serviceAreaInput, setServiceAreaInput] = useState((profile?.serviceArea || []).join(', '));
  const [experienceYears, setExperienceYears] = useState(profile?.experienceYears || 2);
  const [city, setCity] = useState(profile?.location?.city || 'Bangalore');
  const [bio, setBio] = useState(profile?.bio || '');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const toggleCategory = (cat) => {
    if (selectedCats.includes(cat)) {
      if (selectedCats.length > 1) {
        setSelectedCats(selectedCats.filter((c) => c !== cat));
      }
    } else {
      setSelectedCats([...selectedCats, cat]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSavedMsg('');

      const expertiseArray = expertiseInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const serviceAreaArray = serviceAreaInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await api.updateProviderExpertise({
        categories: selectedCats,
        expertise: expertiseArray,
        serviceArea: serviceAreaArray,
        experienceYears: Number(experienceYears),
        location: { city },
        bio
      });

      if (res.success) {
        setSavedMsg('Expertise and service domains updated successfully!');
        await refreshProfile();
      }
    } catch (err) {
      alert(err.message || 'Failed to update expertise.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '840px' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '9999px', background: 'rgba(79, 70, 229, 0.08)', color: '#4F46E5', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>
          <Sliders size={14} /> Domain Targeting
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
          Service Domains & Coverage Areas
        </h1>
        <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>
          Configure your supported appliance categories, problem keywords, and dispatch territories for precision customer matching.
        </p>
      </div>

      {savedMsg && (
        <div className="alert alert-success" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={18} color="#10B981" />
          <span>{savedMsg}</span>
        </div>
      )}

      <div className="card" style={{ padding: '28px', background: 'rgba(255, 255, 255, 0.95)' }}>
        <form onSubmit={handleSave}>
          {/* Category selection */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ fontWeight: '800', fontSize: '15px', color: '#0F172A' }}>
              Supported Appliance & Device Categories
            </label>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '12px' }}>
              Select the device categories your certified technicians are equipped to service:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {ALL_CATEGORIES.map((cat) => {
                const active = selectedCats.includes(cat);
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    style={{
                      background: active ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : '#F8FAFC',
                      color: active ? '#FFFFFF' : '#334155',
                      border: '1px solid',
                      borderColor: active ? '#4F46E5' : '#E2E8F0',
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      fontSize: '13px',
                      fontWeight: active ? '700' : '500',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                      boxShadow: active ? '0 4px 12px rgba(79, 70, 229, 0.25)' : 'none'
                    }}
                  >
                    {active && <CheckCircle size={13} color="#FFFFFF" />}
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Problem tags */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: '700' }}>
              Specific Problem Keywords & Expertise Tags (comma-separated)
            </label>
            <input
              type="text"
              className="form-input"
              value={expertiseInput}
              onChange={(e) => setExpertiseInput(e.target.value)}
              placeholder="e.g. AC Gas Leakage, TV Backlight Inverter, Laptop Screen Replacement, Refrigerator Compressor"
              style={{ borderRadius: '12px', padding: '12px 14px' }}
            />
            <span style={{ fontSize: '12px', color: '#4F46E5', fontWeight: '600', marginTop: '6px', display: 'block' }}>
              ⚡ Directly computed in Fixora's provider ranking formula (50% match score weight).
            </span>
          </div>

          {/* City & Experience */}
          <div className="grid-cols-2" style={{ gap: '16px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '700' }}>Primary Operational City</label>
              <input
                type="text"
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bangalore"
                style={{ borderRadius: '12px', padding: '12px 14px' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '700' }}>Experience (Years)</label>
              <input
                type="number"
                className="form-input"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                min="0"
                style={{ borderRadius: '12px', padding: '12px 14px' }}
              />
            </div>
          </div>

          {/* Localities */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: '700' }}>Localities / Sub-Areas Covered (comma-separated)</label>
            <input
              type="text"
              className="form-input"
              value={serviceAreaInput}
              onChange={(e) => setServiceAreaInput(e.target.value)}
              placeholder="e.g. Indiranagar, Koramangala, HSR Layout, Whitefield, Electronic City"
              style={{ borderRadius: '12px', padding: '12px 14px' }}
            />
            <span style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', display: 'block' }}>
              Used in proximity calculations for technician dispatch.
            </span>
          </div>

          {/* Bio */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ fontWeight: '700' }}>Professional Workshop Bio / Service Summary</label>
            <textarea
              className="form-textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your tools, certified parts guarantee, response turnaround time, and safety practices..."
              rows={4}
              style={{ borderRadius: '14px', padding: '12px 14px' }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', fontSize: '15px' }}
          >
            {saving ? 'Saving...' : 'Update Expertise & Service Areas'}
          </button>
        </form>
      </div>
    </div>
  );
};
