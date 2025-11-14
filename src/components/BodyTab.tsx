import React from 'react';
import { Inventory, PackType, MAX_ATTUNED_ITEMS } from '../types';
import { getEquipmentSlots, canEquipItem, countAttunedItems } from '../utils/calculations';

interface BodyTabProps {
  inventory: Inventory;
  packTypes: PackType[];
  onUpdate: (inventory: Inventory) => void;
}

const BodyTab: React.FC<BodyTabProps> = ({ inventory, packTypes, onUpdate }) => {
  const currentPack = packTypes.find(p => p.id === inventory.packTypeId) || packTypes[0];
  const slots = getEquipmentSlots(currentPack);
  const attunedCount = countAttunedItems(inventory.items);

  const handleEquip = (slotType: 'weapon' | 'armor' | 'clothing' | 'jewelry', slotIndex: number, itemId: string | null) => {
    const newEquipped = { ...inventory.equipped };
    const slotArray = [...newEquipped[slotType]];
    
    // Ensure array has enough slots
    while (slotArray.length < slots[slotType]) {
      slotArray.push(null);
    }
    
    slotArray[slotIndex] = itemId;
    newEquipped[slotType] = slotArray;
    
    onUpdate({ ...inventory, equipped: newEquipped });
  };

  const getEquippableItems = (slotType: 'weapon' | 'armor' | 'clothing' | 'jewelry') => {
    return inventory.items.filter(item => canEquipItem(item, slotType));
  };

  const renderSlots = (slotType: 'weapon' | 'armor' | 'clothing' | 'jewelry', slotCount: number) => {
    const slotArray = inventory.equipped[slotType] || [];
    const availableItems = getEquippableItems(slotType);
    
    return Array.from({ length: slotCount }, (_, i) => {
      const equippedItemId = slotArray[i];
      const equippedItem = equippedItemId ? inventory.items.find(it => it.id === equippedItemId) : null;
      
      return (
        <div key={i} className="equipment-slot">
          <div className="equipment-slot-header">
            {slotType.charAt(0).toUpperCase() + slotType.slice(1)} Slot {i + 1}
          </div>
          
          {equippedItem ? (
            <div className="equipment-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>
                  {equippedItem.name}
                  {equippedItem.isAttuned && <span className="attuned-badge">★ Attuned</span>}
                </span>
                <button 
                  className="btn btn-danger"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                  onClick={() => handleEquip(slotType, i, null)}
                >
                  Unequip
                </button>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#b0b0b0', marginTop: '0.25rem' }}>
                {equippedItem.category}
              </div>
            </div>
          ) : (
            <div>
              <select 
                value=""
                onChange={(e) => handleEquip(slotType, i, e.target.value || null)}
                style={{ width: '100%' }}
              >
                <option value="">Select item...</option>
                {availableItems.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} {item.isAttuned ? '★' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div>
      <div className="card">
        <h3>Equipment Slots</h3>
        <div className="stat-row">
          <span className="stat-label">Attuned Items:</span>
          <span className={`stat-value ${attunedCount > MAX_ATTUNED_ITEMS ? 'error' : ''}`}>
            {attunedCount} / {MAX_ATTUNED_ITEMS}
          </span>
        </div>
        {attunedCount > MAX_ATTUNED_ITEMS && (
          <p className="error" style={{ marginTop: '0.5rem' }}>
            You can only have {MAX_ATTUNED_ITEMS} attuned items at once!
          </p>
        )}
      </div>

      <div className="card">
        <h3>Armor Slots ({slots.armor})</h3>
        <div className="equipment-grid">
          {renderSlots('armor', slots.armor)}
        </div>
      </div>

      <div className="card">
        <h3>Clothing Slots ({slots.clothing})</h3>
        <div className="equipment-grid">
          {renderSlots('clothing', slots.clothing)}
        </div>
      </div>

      <div className="card">
        <h3>Jewelry Slots ({slots.jewelry})</h3>
        <div className="equipment-grid">
          {renderSlots('jewelry', slots.jewelry)}
        </div>
      </div>
    </div>
  );
};

export default BodyTab;
