import React, { useState } from 'react';
import { Inventory, Currency, Vault, COIN_NAMES_DEFAULT, COIN_CARRY_CAP } from '../types';
import { getTotalCoins, calculateCoinWeight, calculateCurrencyValue } from '../utils/calculations';
import { generateId } from '../utils/calculations';

interface CoinsTabProps {
  inventory: Inventory;
  coinNames?: typeof COIN_NAMES_DEFAULT;
  onUpdate: (inventory: Inventory) => void;
}

const CoinsTab: React.FC<CoinsTabProps> = ({ inventory, coinNames = COIN_NAMES_DEFAULT, onUpdate }) => {
  const [showAddVault, setShowAddVault] = useState(false);
  const [editingVault, setEditingVault] = useState<Vault | null>(null);

  const totalCoins = getTotalCoins(inventory.currency);
  const coinWeight = calculateCoinWeight(inventory.currency);
  const totalValue = calculateCurrencyValue(inventory.currency);

  // Calculate totals from nearby vaults and external storages
  const nearbyVaults = inventory.vaults.filter(v => v.nearby);
  const nearbyStorages = inventory.externalStorages.filter(s => s.nearby);
  
  const vaultTotal = nearbyVaults.reduce((sum, v) => sum + calculateCurrencyValue(v.currency), 0);
  const storageTotal = nearbyStorages.reduce((sum, s) => sum + calculateCurrencyValue(s.inventory.currency), 0);
  const grandTotal = totalValue + vaultTotal + storageTotal;

  const handleCurrencyChange = (coin: keyof Currency, value: number) => {
    const newCurrency = { ...inventory.currency, [coin]: Math.max(0, value) };
    onUpdate({ ...inventory, currency: newCurrency });
  };

  const handleAddVault = (vault: Omit<Vault, 'id'>) => {
    const newVault: Vault = { ...vault, id: generateId() };
    onUpdate({ ...inventory, vaults: [...inventory.vaults, newVault] });
    setShowAddVault(false);
  };

  const handleUpdateVault = (vaultId: string, updates: Partial<Vault>) => {
    const newVaults = inventory.vaults.map(v => 
      v.id === vaultId ? { ...v, ...updates } : v
    );
    onUpdate({ ...inventory, vaults: newVaults });
  };

  const handleDeleteVault = (vaultId: string) => {
    if (confirm('Delete this vault?')) {
      const newVaults = inventory.vaults.filter(v => v.id !== vaultId);
      onUpdate({ ...inventory, vaults: newVaults });
    }
  };

  // Transfer functions can be implemented later for direct vault-to-pack transfers
  // Currently vaults are managed through the vault edit modal

  return (
    <div>
      <div className="card">
        <h3>Currency on Hand</h3>
        
        <div className="stat-row">
          <span className="stat-label">Total Coins:</span>
          <span className={`stat-value ${totalCoins > COIN_CARRY_CAP ? 'error' : totalCoins > 30 ? 'warning' : ''}`}>
            {totalCoins} / {COIN_CARRY_CAP}
          </span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Coin Weight:</span>
          <span className="stat-value">
            {coinWeight} units
          </span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Total Value:</span>
          <span className="stat-value">
            {totalValue} cp
          </span>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          {(['platinum', 'gold', 'silver', 'copper'] as const).map(coin => (
            <div key={coin} className="form-group">
              <label>{coinNames[coin]} ({coin.charAt(0)})</label>
              <input 
                type="number"
                min="0"
                value={inventory.currency[coin]}
                onChange={(e) => handleCurrencyChange(coin, parseInt(e.target.value) || 0)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Combined Wealth (Nearby)</h3>
        <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>
          Total value from pack, nearby vaults, and nearby external storages
        </p>
        
        <div className="stat-row">
          <span className="stat-label">Pack Value:</span>
          <span className="stat-value">{totalValue} cp</span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Vault Value:</span>
          <span className="stat-value">{vaultTotal} cp</span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Storage Value:</span>
          <span className="stat-value">{storageTotal} cp</span>
        </div>
        
        <div className="stat-row" style={{ borderTop: '2px solid #444', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
          <span className="stat-label">Grand Total:</span>
          <span className="stat-value" style={{ fontSize: '1.2rem', color: '#4ae24a' }}>
            {grandTotal} cp
          </span>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Vaults</h3>
          <button className="btn btn-primary" onClick={() => setShowAddVault(true)}>
            Add Vault
          </button>
        </div>

        {inventory.vaults.length === 0 ? (
          <p style={{ color: '#b0b0b0' }}>No vaults created yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Value</th>
                <th>Nearby</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.vaults.map(vault => (
                <tr key={vault.id}>
                  <td>{vault.name}</td>
                  <td>{vault.location}</td>
                  <td>{calculateCurrencyValue(vault.currency)} cp</td>
                  <td>
                    <label className="checkbox-label">
                      <input 
                        type="checkbox"
                        checked={vault.nearby}
                        onChange={(e) => handleUpdateVault(vault.id, { nearby: e.target.checked })}
                      />
                    </label>
                  </td>
                  <td>
                    <button 
                      className="btn btn-secondary"
                      style={{ marginRight: '0.5rem' }}
                      onClick={() => setEditingVault(vault)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDeleteVault(vault.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddVault && (
        <VaultModal
          onSave={handleAddVault}
          onClose={() => setShowAddVault(false)}
          coinNames={coinNames}
        />
      )}

      {editingVault && (
        <VaultModal
          vault={editingVault}
          onSave={(updates) => {
            handleUpdateVault(editingVault.id, updates);
            setEditingVault(null);
          }}
          onClose={() => setEditingVault(null)}
          coinNames={coinNames}
        />
      )}
    </div>
  );
};

interface VaultModalProps {
  vault?: Vault;
  onSave: (vault: Omit<Vault, 'id'>) => void;
  onClose: () => void;
  coinNames: typeof COIN_NAMES_DEFAULT;
}

const VaultModal: React.FC<VaultModalProps> = ({ vault, onSave, onClose, coinNames }) => {
  const [name, setName] = useState(vault?.name || '');
  const [location, setLocation] = useState(vault?.location || '');
  const [notes, setNotes] = useState(vault?.notes || '');
  const [nearby, setNearby] = useState(vault?.nearby || false);
  const [currency, setCurrency] = useState<Currency>(vault?.currency || { copper: 0, silver: 0, gold: 0, platinum: 0 });

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Please enter a vault name');
      return;
    }
    if (!location.trim()) {
      alert('Please enter a location');
      return;
    }

    onSave({ name, location, currency, notes, nearby });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{vault ? 'Edit Vault' : 'Add New Vault'}</h2>
        
        <div className="form-group">
          <label>Name *</label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Location *</label>
          <input 
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Bank of Waterdeep"
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input 
              type="checkbox"
              checked={nearby}
              onChange={(e) => setNearby(e.target.checked)}
            />
            Nearby (can transfer coins)
          </label>
        </div>

        <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Currency</h4>
        {(['platinum', 'gold', 'silver', 'copper'] as const).map(coin => (
          <div key={coin} className="form-group">
            <label>{coinNames[coin]}</label>
            <input 
              type="number"
              min="0"
              value={currency[coin]}
              onChange={(e) => setCurrency({ ...currency, [coin]: parseInt(e.target.value) || 0 })}
            />
          </div>
        ))}

        <div className="form-group">
          <label>Notes</label>
          <textarea 
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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

export default CoinsTab;
