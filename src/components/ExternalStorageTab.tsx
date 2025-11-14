import React, { useState } from 'react';
import { Inventory, ExternalStorage, ExternalStorageType } from '../types';
import { generateId } from '../utils/calculations';
import { createDefaultInventory } from '../utils/storage';

interface ExternalStorageTabProps {
  inventory: Inventory;
  storageTypes: ExternalStorageType[];
  onUpdate: (inventory: Inventory) => void;
  onView: (storageId: string) => void;
}

const ExternalStorageTab: React.FC<ExternalStorageTabProps> = ({ 
  inventory, 
  storageTypes, 
  onUpdate, 
  onView 
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<ExternalStorage | null>(null);

  const handleAdd = (storage: Omit<ExternalStorage, 'id'>) => {
    const newStorage: ExternalStorage = { ...storage, id: generateId() };
    onUpdate({ ...inventory, externalStorages: [...inventory.externalStorages, newStorage] });
    setShowAdd(false);
  };

  const handleUpdate = (storageId: string, updates: Partial<ExternalStorage>) => {
    const newStorages = inventory.externalStorages.map(s => 
      s.id === storageId ? { ...s, ...updates } : s
    );
    onUpdate({ ...inventory, externalStorages: newStorages });
  };

  const handleDelete = (storageId: string) => {
    if (confirm('Delete this external storage? All items in it will be lost.')) {
      const newStorages = inventory.externalStorages.filter(s => s.id !== storageId);
      onUpdate({ ...inventory, externalStorages: newStorages });
    }
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>External Storage</h3>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            Add External Storage
          </button>
        </div>

        {inventory.externalStorages.length === 0 ? (
          <p style={{ color: '#b0b0b0' }}>
            No external storage created yet. Add mounts, carts, houses, etc. to store additional items.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Description</th>
                <th>Nearby</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.externalStorages.map(storage => {
                const storageType = storageTypes.find(t => t.id === storage.storageTypeId);
                return (
                  <tr key={storage.id}>
                    <td>{storage.name}</td>
                    <td>{storageType?.name || 'Unknown'}</td>
                    <td>{storage.description}</td>
                    <td>
                      <label className="checkbox-label">
                        <input 
                          type="checkbox"
                          checked={storage.nearby}
                          onChange={(e) => handleUpdate(storage.id, { nearby: e.target.checked })}
                        />
                      </label>
                    </td>
                    <td>
                      <button 
                        className="btn btn-primary"
                        style={{ marginRight: '0.5rem' }}
                        onClick={() => onView(storage.id)}
                      >
                        View
                      </button>
                      <button 
                        className="btn btn-secondary"
                        style={{ marginRight: '0.5rem' }}
                        onClick={() => setEditing(storage)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(storage.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showAdd && (
        <ExternalStorageModal
          storageTypes={storageTypes}
          onSave={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}

      {editing && (
        <ExternalStorageModal
          storage={editing}
          storageTypes={storageTypes}
          onSave={(updates) => {
            handleUpdate(editing.id, updates);
            setEditing(null);
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
};

interface ExternalStorageModalProps {
  storage?: ExternalStorage;
  storageTypes: ExternalStorageType[];
  onSave: (storage: Omit<ExternalStorage, 'id'>) => void;
  onClose: () => void;
}

const ExternalStorageModal: React.FC<ExternalStorageModalProps> = ({ 
  storage, 
  storageTypes, 
  onSave, 
  onClose 
}) => {
  const [name, setName] = useState(storage?.name || '');
  const [description, setDescription] = useState(storage?.description || '');
  const [storageTypeId, setStorageTypeId] = useState(storage?.storageTypeId || storageTypes[0]?.id || '');
  const [nearby, setNearby] = useState(storage?.nearby || false);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Please enter a name');
      return;
    }
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }

    onSave({
      name,
      description,
      storageTypeId,
      nearby,
      inventory: storage?.inventory || createDefaultInventory()
    });
  };

  const selectedType = storageTypes.find(t => t.id === storageTypeId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{storage ? 'Edit External Storage' : 'Add External Storage'}</h2>
        
        <div className="form-group">
          <label>Name *</label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Shadowfax"
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <input 
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Tall Black Warhorse"
          />
        </div>

        <div className="form-group">
          <label>Storage Type</label>
          <select 
            value={storageTypeId}
            onChange={(e) => setStorageTypeId(e.target.value)}
          >
            {storageTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {selectedType && (
          <div style={{ background: '#333', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Storage Capacity:</h4>
            <ul style={{ marginLeft: '1.5rem', color: '#b0b0b0' }}>
              <li>{selectedType.capacity} units</li>
              {selectedType.weaponSlots > 0 && <li>{selectedType.weaponSlots} weapon slots</li>}
              {selectedType.armorSlots > 0 && <li>{selectedType.armorSlots} armor slots</li>}
              <li>{selectedType.coinCapacity === -1 ? 'Unlimited coins' : `${selectedType.coinCapacity} coins`}</li>
            </ul>
          </div>
        )}

        <div className="form-group">
          <label className="checkbox-label">
            <input 
              type="checkbox"
              checked={nearby}
              onChange={(e) => setNearby(e.target.checked)}
            />
            Currently Nearby
          </label>
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

export default ExternalStorageTab;
