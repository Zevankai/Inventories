import React from 'react';
import { Inventory, ExternalStorage } from '../types';
import { calculateItemWeight } from '../utils/calculations';

interface TransferTabProps {
  playerInventory: Inventory;
  storage: ExternalStorage;
  onUpdate: (playerInv: Inventory, storageInv: Inventory) => void;
}

const TransferTab: React.FC<TransferTabProps> = ({ playerInventory, storage, onUpdate }) => {
  const handleTransferToStorage = (itemId: string) => {
    const item = playerInventory.items.find(i => i.id === itemId);
    if (!item || !storage.nearby) return;

    // De-attune if needed
    const transferredItem = { ...item, isAttuned: false };

    // Remove from player inventory
    const newPlayerItems = playerInventory.items.filter(i => i.id !== itemId);

    // Add to storage inventory
    const newStorageItems = [...storage.inventory.items, transferredItem];

    onUpdate(
      { ...playerInventory, items: newPlayerItems },
      { ...storage.inventory, items: newStorageItems }
    );
  };

  const handleTransferToPlayer = (itemId: string) => {
    const item = storage.inventory.items.find(i => i.id === itemId);
    if (!item || !storage.nearby) return;

    // De-attune if needed
    const transferredItem = { ...item, isAttuned: false };

    // Remove from storage inventory
    const newStorageItems = storage.inventory.items.filter(i => i.id !== itemId);

    // Add to player inventory
    const newPlayerItems = [...playerInventory.items, transferredItem];

    onUpdate(
      { ...playerInventory, items: newPlayerItems },
      { ...storage.inventory, items: newStorageItems }
    );
  };

  if (!storage.nearby) {
    return (
      <div className="card">
        <h3>Transfer Items</h3>
        <p style={{ color: '#e2b44a', textAlign: 'center', padding: '2rem' }}>
          This external storage is not nearby. Mark it as nearby to enable transfers.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h3>Transfer Items</h3>
        <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>
          Transfer items between your character and {storage.name}. Items will be automatically de-attuned when transferred.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="card">
          <h3>Player Inventory</h3>
          {playerInventory.items.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '1rem' }}>No items</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Qty</th>
                  <th>Weight</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {playerInventory.items.map(item => (
                  <tr key={item.id}>
                    <td>
                      {item.name}
                      {item.isAttuned && <span className="attuned-badge">★</span>}
                    </td>
                    <td>{item.quantity}</td>
                    <td>{calculateItemWeight(item).toFixed(1)}u</td>
                    <td>
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleTransferToStorage(item.id)}
                      >
                        To Storage →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <h3>{storage.name}</h3>
          {storage.inventory.items.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '1rem' }}>No items</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Qty</th>
                  <th>Weight</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {storage.inventory.items.map(item => (
                  <tr key={item.id}>
                    <td>
                      {item.name}
                      {item.isAttuned && <span className="attuned-badge">★</span>}
                    </td>
                    <td>{item.quantity}</td>
                    <td>{calculateItemWeight(item).toFixed(1)}u</td>
                    <td>
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleTransferToPlayer(item.id)}
                      >
                        ← To Player
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransferTab;
