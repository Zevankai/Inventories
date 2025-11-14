import React, { useState } from 'react';
import { DMConfig, PackType, ExternalStorageType } from '../types';
import { saveDMConfig } from '../utils/storage';
import { generateId } from '../utils/calculations';

interface DMScreenProps {
  config: DMConfig;
  onSave: (config: DMConfig) => void;
  onClose: () => void;
}

const DMScreen: React.FC<DMScreenProps> = ({ config, onSave, onClose }) => {
  const [activeSection, setActiveSection] = useState<'packs' | 'storage' | 'categories' | 'coins'>('packs');
  const [customPackTypes, setCustomPackTypes] = useState<PackType[]>(config.customPackTypes);
  const [customStorageTypes, setCustomStorageTypes] = useState<ExternalStorageType[]>(config.customExternalStorageTypes);
  const [coinNames, setCoinNames] = useState(config.coinNames);
  const [editingPack, setEditingPack] = useState<PackType | null>(null);
  const [editingStorage, setEditingStorage] = useState<ExternalStorageType | null>(null);

  const handleSave = async () => {
    const newConfig: DMConfig = {
      customPackTypes,
      customExternalStorageTypes: customStorageTypes,
      customCategories: config.customCategories,
      coinNames,
      favorites: config.favorites,
      notes: config.notes
    };
    
    await saveDMConfig(newConfig);
    onSave(newConfig);
    alert('DM configuration saved successfully!');
  };

  const handleAddPack = () => {
    const newPack: PackType = {
      id: generateId(),
      name: 'New Pack',
      capacity: 50,
      utilitySlots: 5,
      weaponModifier: 0,
      armorModifier: 0,
      clothingModifier: 0,
      jewelryModifier: 0,
      utilityEquipRules: [],
      description: ''
    };
    setCustomPackTypes([...customPackTypes, newPack]);
    setEditingPack(newPack);
  };

  const handleUpdatePack = (packId: string, updates: Partial<PackType>) => {
    setCustomPackTypes(customPackTypes.map(p => 
      p.id === packId ? { ...p, ...updates } : p
    ));
  };

  const handleDeletePack = (packId: string) => {
    if (confirm('Delete this pack type?')) {
      setCustomPackTypes(customPackTypes.filter(p => p.id !== packId));
    }
  };

  const handleAddStorage = () => {
    const newStorage: ExternalStorageType = {
      id: generateId(),
      name: 'New Storage Type',
      capacity: 100,
      weaponSlots: 0,
      armorSlots: 0,
      coinCapacity: 100,
      description: ''
    };
    setCustomStorageTypes([...customStorageTypes, newStorage]);
    setEditingStorage(newStorage);
  };

  const handleUpdateStorage = (storageId: string, updates: Partial<ExternalStorageType>) => {
    setCustomStorageTypes(customStorageTypes.map(s => 
      s.id === storageId ? { ...s, ...updates } : s
    ));
  };

  const handleDeleteStorage = (storageId: string) => {
    if (confirm('Delete this storage type?')) {
      setCustomStorageTypes(customStorageTypes.filter(s => s.id !== storageId));
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#1a1a1a', overflow: 'auto', zIndex: 2000 }}>
      <div className="app-container">
        <header className="app-header">
          <h1>🎲 DM Screen</h1>
          <div>
            <button className="btn btn-success" style={{ marginRight: '1rem' }} onClick={handleSave}>
              Save All Changes
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </header>

        <nav className="tab-nav">
          <button 
            className={activeSection === 'packs' ? 'active' : ''}
            onClick={() => setActiveSection('packs')}
          >
            Pack Types
          </button>
          <button 
            className={activeSection === 'storage' ? 'active' : ''}
            onClick={() => setActiveSection('storage')}
          >
            Storage Types
          </button>
          <button 
            className={activeSection === 'coins' ? 'active' : ''}
            onClick={() => setActiveSection('coins')}
          >
            Coin Names
          </button>
        </nav>

        <main className="tab-content">
          {activeSection === 'packs' && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Custom Pack Types</h3>
                <button className="btn btn-primary" onClick={handleAddPack}>
                  Add Pack Type
                </button>
              </div>

              {customPackTypes.length === 0 ? (
                <p style={{ color: '#b0b0b0' }}>No custom pack types created yet.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Capacity</th>
                      <th>Utility</th>
                      <th>Modifiers</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customPackTypes.map(pack => (
                      <tr key={pack.id}>
                        <td>{pack.name}</td>
                        <td>{pack.capacity}u</td>
                        <td>{pack.utilitySlots}</td>
                        <td>
                          W:{pack.weaponModifier > 0 ? '+' : ''}{pack.weaponModifier}{' '}
                          A:{pack.armorModifier > 0 ? '+' : ''}{pack.armorModifier}{' '}
                          C:{pack.clothingModifier > 0 ? '+' : ''}{pack.clothingModifier}{' '}
                          J:{pack.jewelryModifier > 0 ? '+' : ''}{pack.jewelryModifier}
                        </td>
                        <td>
                          <button 
                            className="btn btn-secondary"
                            style={{ marginRight: '0.5rem' }}
                            onClick={() => setEditingPack(pack)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-danger"
                            onClick={() => handleDeletePack(pack.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {editingPack && (
                <PackTypeModal
                  pack={editingPack}
                  onSave={(updates) => {
                    handleUpdatePack(editingPack.id, updates);
                    setEditingPack(null);
                  }}
                  onClose={() => setEditingPack(null)}
                />
              )}
            </div>
          )}

          {activeSection === 'storage' && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Custom Storage Types</h3>
                <button className="btn btn-primary" onClick={handleAddStorage}>
                  Add Storage Type
                </button>
              </div>

              {customStorageTypes.length === 0 ? (
                <p style={{ color: '#b0b0b0' }}>No custom storage types created yet.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Capacity</th>
                      <th>Weapon</th>
                      <th>Armor</th>
                      <th>Coins</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customStorageTypes.map(storage => (
                      <tr key={storage.id}>
                        <td>{storage.name}</td>
                        <td>{storage.capacity}u</td>
                        <td>{storage.weaponSlots}</td>
                        <td>{storage.armorSlots}</td>
                        <td>{storage.coinCapacity === -1 ? '∞' : storage.coinCapacity}</td>
                        <td>
                          <button 
                            className="btn btn-secondary"
                            style={{ marginRight: '0.5rem' }}
                            onClick={() => setEditingStorage(storage)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-danger"
                            onClick={() => handleDeleteStorage(storage.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {editingStorage && (
                <StorageTypeModal
                  storage={editingStorage}
                  onSave={(updates) => {
                    handleUpdateStorage(editingStorage.id, updates);
                    setEditingStorage(null);
                  }}
                  onClose={() => setEditingStorage(null)}
                />
              )}
            </div>
          )}

          {activeSection === 'coins' && (
            <div className="card">
              <h3>Customize Coin Names</h3>
              <p style={{ color: '#b0b0b0', marginBottom: '1.5rem' }}>
                Change the names of the four coin types without affecting existing player inventories.
              </p>

              {(['copper', 'silver', 'gold', 'platinum'] as const).map(coin => (
                <div key={coin} className="form-group">
                  <label>{coin.charAt(0).toUpperCase() + coin.slice(1)} Coin Name</label>
                  <input 
                    type="text"
                    value={coinNames[coin]}
                    onChange={(e) => setCoinNames({ ...coinNames, [coin]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

interface PackTypeModalProps {
  pack: PackType;
  onSave: (pack: Partial<PackType>) => void;
  onClose: () => void;
}

const PackTypeModal: React.FC<PackTypeModalProps> = ({ pack, onSave, onClose }) => {
  const [name, setName] = useState(pack.name);
  const [capacity, setCapacity] = useState(pack.capacity);
  const [utilitySlots, setUtilitySlots] = useState(pack.utilitySlots);
  const [weaponModifier, setWeaponModifier] = useState(pack.weaponModifier);
  const [armorModifier, setArmorModifier] = useState(pack.armorModifier);
  const [clothingModifier, setClothingModifier] = useState(pack.clothingModifier);
  const [jewelryModifier, setJewelryModifier] = useState(pack.jewelryModifier);
  const [description, setDescription] = useState(pack.description || '');

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Please enter a pack name');
      return;
    }

    onSave({
      name,
      capacity,
      utilitySlots,
      weaponModifier,
      armorModifier,
      clothingModifier,
      jewelryModifier,
      description
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Pack Type</h2>
        
        <div className="form-group">
          <label>Name *</label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Capacity (units)</label>
          <input 
            type="number"
            min="0"
            value={capacity}
            onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Utility Slots</label>
          <input 
            type="number"
            min="0"
            value={utilitySlots}
            onChange={(e) => setUtilitySlots(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Weapon Slot Modifier</label>
          <input 
            type="number"
            value={weaponModifier}
            onChange={(e) => setWeaponModifier(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Armor Slot Modifier</label>
          <input 
            type="number"
            value={armorModifier}
            onChange={(e) => setArmorModifier(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Clothing Slot Modifier</label>
          <input 
            type="number"
            value={clothingModifier}
            onChange={(e) => setClothingModifier(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Jewelry Slot Modifier</label>
          <input 
            type="number"
            value={jewelryModifier}
            onChange={(e) => setJewelryModifier(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea 
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

interface StorageTypeModalProps {
  storage: ExternalStorageType;
  onSave: (storage: Partial<ExternalStorageType>) => void;
  onClose: () => void;
}

const StorageTypeModal: React.FC<StorageTypeModalProps> = ({ storage, onSave, onClose }) => {
  const [name, setName] = useState(storage.name);
  const [capacity, setCapacity] = useState(storage.capacity);
  const [weaponSlots, setWeaponSlots] = useState(storage.weaponSlots);
  const [armorSlots, setArmorSlots] = useState(storage.armorSlots);
  const [coinCapacity, setCoinCapacity] = useState(storage.coinCapacity);
  const [description, setDescription] = useState(storage.description || '');

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Please enter a storage type name');
      return;
    }

    onSave({
      name,
      capacity,
      weaponSlots,
      armorSlots,
      coinCapacity,
      description
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Storage Type</h2>
        
        <div className="form-group">
          <label>Name *</label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Capacity (units)</label>
          <input 
            type="number"
            min="0"
            value={capacity}
            onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Weapon Slots</label>
          <input 
            type="number"
            min="0"
            value={weaponSlots}
            onChange={(e) => setWeaponSlots(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Armor Slots</label>
          <input 
            type="number"
            min="0"
            value={armorSlots}
            onChange={(e) => setArmorSlots(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Coin Capacity (-1 for unlimited)</label>
          <input 
            type="number"
            value={coinCapacity}
            onChange={(e) => setCoinCapacity(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea 
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default DMScreen;
