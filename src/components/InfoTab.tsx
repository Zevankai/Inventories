import React, { useState } from 'react';
import { PackType, ExternalStorageType, DMConfig } from '../types';
import { saveDMConfig } from '../utils/storage';

interface InfoTabProps {
  packTypes: PackType[];
  storageTypes: ExternalStorageType[];
  dmConfig: DMConfig | null;
}

const InfoTab: React.FC<InfoTabProps> = ({ packTypes, storageTypes, dmConfig }) => {
  const [activeSection, setActiveSection] = useState<'packs' | 'storage' | 'notes'>('packs');
  const [notes, setNotes] = useState(dmConfig?.notes || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveNotes = async () => {
    if (dmConfig) {
      setIsSaving(true);
      await saveDMConfig({ ...dmConfig, notes });
      setIsSaving(false);
      alert('Notes saved successfully!');
    }
  };

  return (
    <div>
      <div className="card">
        <h3>Information</h3>
        <nav style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderBottom: '2px solid #3a3a3a' }}>
          <button 
            className={activeSection === 'packs' ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={() => setActiveSection('packs')}
            style={{ borderRadius: '4px 4px 0 0' }}
          >
            Pack Types
          </button>
          <button 
            className={activeSection === 'storage' ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={() => setActiveSection('storage')}
            style={{ borderRadius: '4px 4px 0 0' }}
          >
            Storage Types
          </button>
          <button 
            className={activeSection === 'notes' ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={() => setActiveSection('notes')}
            style={{ borderRadius: '4px 4px 0 0' }}
          >
            Notes
          </button>
        </nav>
      </div>

      {activeSection === 'packs' && (
        <div className="card">
          <h3>Pack Types</h3>
          <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>
            Available pack types and their properties.
          </p>
          {packTypes.map(pack => (
            <div key={pack.id} className="card" style={{ background: '#333' }}>
              <h4>{pack.name}</h4>
              <div className="stat-row">
                <span className="stat-label">Capacity:</span>
                <span className="stat-value">{pack.capacity} units</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Utility Slots:</span>
                <span className="stat-value">{pack.utilitySlots}</span>
              </div>
              {pack.weaponModifier !== 0 && (
                <div className="stat-row">
                  <span className="stat-label">Weapon Slots:</span>
                  <span className="stat-value">{pack.weaponModifier > 0 ? '+' : ''}{pack.weaponModifier}</span>
                </div>
              )}
              {pack.armorModifier !== 0 && (
                <div className="stat-row">
                  <span className="stat-label">Armor Slots:</span>
                  <span className="stat-value">{pack.armorModifier > 0 ? '+' : ''}{pack.armorModifier}</span>
                </div>
              )}
              {pack.clothingModifier !== 0 && (
                <div className="stat-row">
                  <span className="stat-label">Clothing Slots:</span>
                  <span className="stat-value">{pack.clothingModifier > 0 ? '+' : ''}{pack.clothingModifier}</span>
                </div>
              )}
              {pack.jewelryModifier !== 0 && (
                <div className="stat-row">
                  <span className="stat-label">Jewelry Slots:</span>
                  <span className="stat-value">{pack.jewelryModifier > 0 ? '+' : ''}{pack.jewelryModifier}</span>
                </div>
              )}
              {pack.utilityEquipRules.length > 0 && (
                <div className="stat-row">
                  <span className="stat-label">Special Rules:</span>
                  <span className="stat-value">{pack.utilityEquipRules.join(', ')} can be equipped to utility slots</span>
                </div>
              )}
              {pack.id === 'utility-pack' && (
                <div className="stat-row">
                  <span className="stat-label">Special Rule:</span>
                  <span className="stat-value">Any item under 2 units can be equipped to utility slots</span>
                </div>
              )}
              {pack.description && (
                <p style={{ marginTop: '0.5rem', color: '#b0b0b0', fontSize: '0.9rem' }}>
                  {pack.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {activeSection === 'storage' && (
        <div className="card">
          <h3>External Storage Types</h3>
          <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>
            Available external storage types and their capacities.
          </p>
          {storageTypes.map(type => (
            <div key={type.id} className="card" style={{ background: '#333' }}>
              <h4>{type.name}</h4>
              <div className="stat-row">
                <span className="stat-label">Capacity:</span>
                <span className="stat-value">{type.capacity} units</span>
              </div>
              {type.weaponSlots > 0 && (
                <div className="stat-row">
                  <span className="stat-label">Weapon Slots:</span>
                  <span className="stat-value">{type.weaponSlots}</span>
                </div>
              )}
              {type.armorSlots > 0 && (
                <div className="stat-row">
                  <span className="stat-label">Armor Slots:</span>
                  <span className="stat-value">{type.armorSlots}</span>
                </div>
              )}
              <div className="stat-row">
                <span className="stat-label">Coin Capacity:</span>
                <span className="stat-value">
                  {type.coinCapacity === -1 ? 'Unlimited' : `${type.coinCapacity} coins`}
                </span>
              </div>
              {type.description && (
                <p style={{ marginTop: '0.5rem', color: '#b0b0b0', fontSize: '0.9rem' }}>
                  {type.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {activeSection === 'notes' && (
        <div className="card">
          <h3>Notes for Improvement</h3>
          <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>
            Share ideas, feedback, and suggestions for improving this extension. 
            All players can view and edit these notes.
          </p>
          <textarea 
            rows={10}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter notes here..."
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <button 
            className="btn btn-primary"
            onClick={handleSaveNotes}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Notes'}
          </button>
        </div>
      )}
    </div>
  );
};

export default InfoTab;
