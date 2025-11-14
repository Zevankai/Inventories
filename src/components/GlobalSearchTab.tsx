import React, { useState } from 'react';
import { Inventory, Item } from '../types';
import { calculateItemWeight } from '../utils/calculations';

interface SearchResult {
  item: Item;
  location: string;
  storageId?: string;
  vaultId?: string;
  canTransfer: boolean;
}

interface GlobalSearchTabProps {
  inventory: Inventory;
  onUpdate: (inventory: Inventory) => void;
}

const GlobalSearchTab: React.FC<GlobalSearchTabProps> = ({ inventory, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const searchAllLocations = (): SearchResult[] => {
    const results: SearchResult[] = [];

    // Search player pack
    inventory.items.forEach(item => {
      if (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push({
          item,
          location: 'Player Pack',
          canTransfer: false // Already in player pack
        });
      }
    });

    // Search external storages
    inventory.externalStorages.forEach(storage => {
      storage.inventory.items.forEach(item => {
        if (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({
            item,
            location: storage.name,
            storageId: storage.id,
            canTransfer: storage.nearby
          });
        }
      });
    });

    return results;
  };

  const handleTransferToPack = (result: SearchResult) => {
    if (!result.storageId || !result.canTransfer) return;

    // Remove item from storage and add to player pack
    const storage = inventory.externalStorages.find(s => s.id === result.storageId);
    if (!storage) return;

    const itemToTransfer = { ...result.item };
    
    // De-attune if needed
    if (itemToTransfer.isAttuned) {
      itemToTransfer.isAttuned = false;
    }

    // Remove from storage
    const newStorageItems = storage.inventory.items.filter(i => i.id !== result.item.id);
    
    // Add to player pack
    const newPlayerItems = [...inventory.items, itemToTransfer];

    // Update storages
    const newStorages = inventory.externalStorages.map(s => 
      s.id === result.storageId 
        ? { ...s, inventory: { ...s.inventory, items: newStorageItems } }
        : s
    );

    onUpdate({ 
      ...inventory, 
      items: newPlayerItems,
      externalStorages: newStorages
    });
  };

  const results = searchTerm.length >= 2 ? searchAllLocations() : [];

  return (
    <div>
      <div className="card">
        <h3>Global Search</h3>
        <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>
          Search for items across your pack, all vaults, and all external storages. 
          You can transfer items from nearby external storages directly to your pack.
        </p>

        <input 
          type="text"
          className="search-bar"
          placeholder="Search all locations (min 2 characters)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {searchTerm.length < 2 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
            Enter at least 2 characters to search
          </p>
        ) : results.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
            No items found matching "{searchTerm}"
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Weight</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={`${result.location}-${result.item.id}-${index}`}>
                  <td>
                    {result.item.name}
                    {result.item.isAttuned && <span className="attuned-badge">★ Attuned</span>}
                  </td>
                  <td>{result.item.category}</td>
                  <td>{result.item.quantity}</td>
                  <td>{calculateItemWeight(result.item).toFixed(1)}u</td>
                  <td>
                    {result.location}
                    {result.storageId && !result.canTransfer && (
                      <span style={{ color: '#e2b44a', marginLeft: '0.5rem' }}>(Not Nearby)</span>
                    )}
                  </td>
                  <td>
                    {result.storageId && result.canTransfer && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleTransferToPack(result)}
                      >
                        Transfer to Pack
                      </button>
                    )}
                    {result.storageId && !result.canTransfer && (
                      <button className="btn btn-secondary" disabled>
                        Not Nearby
                      </button>
                    )}
                    {!result.storageId && (
                      <span style={{ color: '#b0b0b0' }}>In Pack</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default GlobalSearchTab;
