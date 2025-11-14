import React, { useState, useMemo } from 'react';
import { Inventory, Item, PackType, ItemCategory, ITEM_CATEGORY_WEIGHTS, CAMP_ITEM_MAX_USES } from '../types';
import { calculateTotalWeight, calculateItemWeight, generateId } from '../utils/calculations';
import { addToFavorites, removeFromFavorites, getPlayerData } from '../utils/storage';

interface PackTabProps {
  inventory: Inventory;
  packTypes: PackType[];
  onUpdate: (inventory: Inventory) => void;
  tokenId: string;
}

const PackTab: React.FC<PackTabProps> = ({ inventory, packTypes, onUpdate, tokenId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const currentPack = packTypes.find(p => p.id === inventory.packTypeId) || packTypes[0];
  const totalWeight = calculateTotalWeight(inventory.items);

  useMemo(async () => {
    const playerData = await getPlayerData();
    const data = playerData[tokenId];
    setFavorites(data?.favorites || []);
  }, [tokenId]);

  const filteredItems = inventory.items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = (item: Omit<Item, 'id'>) => {
    const newItem: Item = { ...item, id: generateId() };
    onUpdate({ ...inventory, items: [...inventory.items, newItem] });
    setShowAddItem(false);
  };

  const handleUpdateItem = (itemId: string, updates: Partial<Item>) => {
    const newItems = inventory.items.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    onUpdate({ ...inventory, items: newItems });
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Delete this item?')) {
      const newItems = inventory.items.filter(item => item.id !== itemId);
      onUpdate({ ...inventory, items: newItems });
    }
  };

  const handleSellItem = (item: Item) => {
    const quantity = prompt(`How many ${item.name} do you want to sell?`, '1');
    if (quantity) {
      const qty = parseInt(quantity);
      if (qty > 0 && qty <= item.quantity) {
        if (item.quantity === qty) {
          handleDeleteItem(item.id);
        } else {
          handleUpdateItem(item.id, { quantity: item.quantity - qty });
        }
      }
    }
  };

  const handleUseItem = (item: Item) => {
    if (item.category === 'ammunition' || item.category === 'light-ammunition' || item.category === 'consumable') {
      if (item.quantity > 1) {
        handleUpdateItem(item.id, { quantity: item.quantity - 1 });
      } else {
        handleDeleteItem(item.id);
      }
    } else if (item.category === 'camp') {
      const currentUses = item.uses || CAMP_ITEM_MAX_USES;
      if (currentUses > 1) {
        handleUpdateItem(item.id, { uses: currentUses - 1 });
      } else {
        handleDeleteItem(item.id);
      }
    }
  };

  const handleToggleFavorite = async (itemId: string) => {
    if (favorites.includes(itemId)) {
      await removeFromFavorites(tokenId, itemId);
      setFavorites(favorites.filter(id => id !== itemId));
    } else {
      await addToFavorites(tokenId, itemId);
      setFavorites([...favorites, itemId]);
    }
  };

  return (
    <div>
      <div className="card">
        <h3>Pack Information</h3>
        <div className="form-group">
          <label>Pack Type</label>
          <select 
            value={inventory.packTypeId}
            onChange={(e) => onUpdate({ ...inventory, packTypeId: e.target.value })}
          >
            {packTypes.map(pack => (
              <option key={pack.id} value={pack.id}>
                {pack.name} ({pack.capacity} units, {pack.utilitySlots} utility slots)
              </option>
            ))}
          </select>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Total Weight:</span>
          <span className={`stat-value ${totalWeight > currentPack.capacity ? 'error' : ''}`}>
            {totalWeight.toFixed(1)} / {currentPack.capacity} units
          </span>
        </div>
        
        {currentPack.description && (
          <p style={{ marginTop: '1rem', color: '#b0b0b0' }}>{currentPack.description}</p>
        )}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Items</h3>
          <button className="btn btn-primary" onClick={() => setShowAddItem(true)}>
            Add Item
          </button>
        </div>
        
        <input 
          type="text"
          className="search-bar"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <table>
          <thead>
            <tr>
              <th>⭐</th>
              <th>Name</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Weight</th>
              <th>Attune</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td>
                  <span 
                    className={`favorite-star ${favorites.includes(item.id) ? 'active' : ''}`}
                    onClick={() => handleToggleFavorite(item.id)}
                  >
                    {favorites.includes(item.id) ? '★' : '☆'}
                  </span>
                </td>
                <td>{item.name}</td>
                <td>
                  <select
                    value={item.category}
                    onChange={(e) => {
                      const newCategory = e.target.value as ItemCategory;
                      handleUpdateItem(item.id, { 
                        category: newCategory,
                        weight: ITEM_CATEGORY_WEIGHTS[newCategory]
                      });
                    }}
                  >
                    {Object.keys(ITEM_CATEGORY_WEIGHTS).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input 
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleUpdateItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                    style={{ width: '60px' }}
                  />
                </td>
                <td>{calculateItemWeight(item).toFixed(1)}u</td>
                <td>
                  {item.requiresAttunement && (
                    <label className="checkbox-label">
                      <input 
                        type="checkbox"
                        checked={item.isAttuned}
                        onChange={(e) => handleUpdateItem(item.id, { isAttuned: e.target.checked })}
                      />
                      <span>{item.isAttuned ? '★' : '☆'}</span>
                    </label>
                  )}
                </td>
                <td>
                  <button 
                    className="btn btn-secondary" 
                    style={{ marginRight: '0.5rem' }}
                    onClick={() => setEditingItem(item)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-secondary"
                    style={{ marginRight: '0.5rem' }}
                    onClick={() => handleSellItem(item)}
                  >
                    Sell
                  </button>
                  {(item.category === 'ammunition' || item.category === 'light-ammunition' || 
                    item.category === 'consumable' || item.category === 'camp') && (
                    <button 
                      className="btn btn-primary"
                      style={{ marginRight: '0.5rem' }}
                      onClick={() => handleUseItem(item)}
                    >
                      Use {item.category === 'camp' && item.uses ? `(${item.uses}/${CAMP_ITEM_MAX_USES})` : ''}
                    </button>
                  )}
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddItem && (
        <ItemModal
          onSave={handleAddItem}
          onClose={() => setShowAddItem(false)}
        />
      )}

      {editingItem && (
        <ItemModal
          item={editingItem}
          onSave={(updates) => {
            handleUpdateItem(editingItem.id, updates);
            setEditingItem(null);
          }}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
};

interface ItemModalProps {
  item?: Item;
  onSave: (item: Omit<Item, 'id'>) => void;
  onClose: () => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ item, onSave, onClose }) => {
  const [name, setName] = useState(item?.name || '');
  const [category, setCategory] = useState<ItemCategory>(item?.category || 'other');
  const [quantity, setQuantity] = useState(item?.quantity || 1);
  const [weight, setWeight] = useState(item?.weight || ITEM_CATEGORY_WEIGHTS[category]);
  const [requiresAttunement, setRequiresAttunement] = useState(item?.requiresAttunement || false);
  const [isAttuned, setIsAttuned] = useState(item?.isAttuned || false);
  const [description, setDescription] = useState(item?.description || '');
  const [value, setValue] = useState(item?.value || 0);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Please enter an item name');
      return;
    }

    onSave({
      name,
      category,
      quantity,
      weight,
      requiresAttunement,
      isAttuned: requiresAttunement ? isAttuned : false,
      description,
      value,
      uses: category === 'camp' ? (item?.uses || CAMP_ITEM_MAX_USES) : undefined
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{item ? 'Edit Item' : 'Add New Item'}</h2>
        
        <div className="form-group">
          <label>Name *</label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select 
            value={category}
            onChange={(e) => {
              const newCategory = e.target.value as ItemCategory;
              setCategory(newCategory);
              setWeight(ITEM_CATEGORY_WEIGHTS[newCategory]);
            }}
          >
            {Object.keys(ITEM_CATEGORY_WEIGHTS).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input 
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          />
        </div>

        <div className="form-group">
          <label>Weight (per unit)</label>
          <input 
            type="number"
            min="0"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input 
              type="checkbox"
              checked={requiresAttunement}
              onChange={(e) => setRequiresAttunement(e.target.checked)}
            />
            Requires Attunement
          </label>
        </div>

        {requiresAttunement && (
          <div className="form-group">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={isAttuned}
                onChange={(e) => setIsAttuned(e.target.checked)}
              />
              Currently Attuned
            </label>
          </div>
        )}

        <div className="form-group">
          <label>Value (in copper)</label>
          <input 
            type="number"
            min="0"
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value) || 0)}
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

export default PackTab;
