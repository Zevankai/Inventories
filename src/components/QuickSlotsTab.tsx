import React from 'react';
import { Inventory, PackType } from '../types';
import { getEquipmentSlots, canEquipToUtilitySlot } from '../utils/calculations';

interface QuickSlotsTabProps {
  inventory: Inventory;
  packTypes: PackType[];
  onUpdate: (inventory: Inventory) => void;
}

const QuickSlotsTab: React.FC<QuickSlotsTabProps> = ({ inventory, packTypes, onUpdate }) => {
  const currentPack = packTypes.find(p => p.id === inventory.packTypeId) || packTypes[0];
  const slots = getEquipmentSlots(currentPack);

  const handleEquip = (slotIndex: number, itemId: string | null) => {
    const newEquipped = { ...inventory.equipped };
    const slotArray = [...(newEquipped.utility || [])];
    
    // Ensure array has enough slots
    while (slotArray.length < slots.utility) {
      slotArray.push(null);
    }
    
    slotArray[slotIndex] = itemId;
    newEquipped.utility = slotArray;
    
    onUpdate({ ...inventory, equipped: newEquipped });
  };

  const getEquippableItems = () => {
    return inventory.items.filter(item => canEquipToUtilitySlot(item, currentPack));
  };

  const renderSlots = () => {
    const slotArray = inventory.equipped.utility || [];
    const availableItems = getEquippableItems();
    
    return Array.from({ length: slots.utility }, (_, i) => {
      const equippedItemId = slotArray[i];
      const equippedItem = equippedItemId ? inventory.items.find(it => it.id === equippedItemId) : null;
      
      return (
        <div key={i} className="equipment-slot">
          <div className="equipment-slot-header">
            Utility Slot {i + 1}
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
                  onClick={() => handleEquip(i, null)}
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
                onChange={(e) => handleEquip(i, e.target.value || null)}
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
        <h3>Utility Slots ({slots.utility})</h3>
        <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>
          Your {currentPack.name} provides {slots.utility} utility slots.
          {currentPack.utilityEquipRules.length > 0 && (
            <span> Special rules allow: {currentPack.utilityEquipRules.join(', ')}</span>
          )}
          {currentPack.id === 'utility-pack' && (
            <span> Special rule: Any item under 2 units can be equipped.</span>
          )}
        </p>
        <div className="equipment-grid">
          {renderSlots()}
        </div>
      </div>
    </div>
  );
};

export default QuickSlotsTab;
