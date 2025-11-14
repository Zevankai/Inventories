import React, { useState, useEffect } from 'react';
import OBR from '@owlbear-rodeo/sdk';
import { 
  Inventory, 
  DMConfig, 
  PackType, 
  ExternalStorageType,
  DEFAULT_PACK_TYPES,
  DEFAULT_EXTERNAL_STORAGE_TYPES
} from './types';
import { 
  getTokenMetadata, 
  saveTokenMetadata, 
  getStickyToken, 
  setStickyToken,
  getDMConfig,
  createDefaultInventory
} from './utils/storage';
import PackTab from './components/PackTab';
import BodyTab from './components/BodyTab';
import QuickSlotsTab from './components/QuickSlotsTab';
import CoinsTab from './components/CoinsTab';
import ExternalStorageTab from './components/ExternalStorageTab';
import GlobalSearchTab from './components/GlobalSearchTab';
import InfoTab from './components/InfoTab';
import DMScreen from './components/DMScreen';
import './App.css';

type Tab = 'pack' | 'body' | 'quick-slots' | 'coins' | 'external' | 'search' | 'info' | 'dm';

const App: React.FC = () => {
  const [currentTokenId, setCurrentTokenId] = useState<string | null>(null);
  const [inventory, setInventory] = useState<Inventory>(createDefaultInventory());
  const [activeTab, setActiveTab] = useState<Tab>('pack');
  const [packTypes, setPackTypes] = useState<PackType[]>(DEFAULT_PACK_TYPES);
  const [storageTypes, setStorageTypes] = useState<ExternalStorageType[]>(DEFAULT_EXTERNAL_STORAGE_TYPES);
  const [dmConfig, setDMConfig] = useState<DMConfig | null>(null);
  const [isDM, setIsDM] = useState(false);
  const [showDMScreen, setShowDMScreen] = useState(false);
  const [viewingExternalStorage, setViewingExternalStorage] = useState<string | null>(null);
  const [tokenName, setTokenName] = useState<string>('');

  useEffect(() => {
    OBR.onReady(async () => {
      // Check if user is DM
      const role = await OBR.player.getRole();
      setIsDM(role === 'GM');

      // Load DM config
      const config = await getDMConfig();
      setDMConfig(config);
      
      // Merge custom pack types
      const allPackTypes = [...DEFAULT_PACK_TYPES, ...config.customPackTypes];
      setPackTypes(allPackTypes);
      
      // Merge custom storage types
      const allStorageTypes = [...DEFAULT_EXTERNAL_STORAGE_TYPES, ...config.customExternalStorageTypes];
      setStorageTypes(allStorageTypes);

      // Try to load sticky token
      const stickyTokenId = await getStickyToken();
      if (stickyTokenId) {
        await loadInventory(stickyTokenId);
      }

      // Context menu will trigger through popover action automatically

      // Listen for action icon click
      OBR.action.onOpenChange(async (isOpen) => {
        if (isOpen && stickyTokenId) {
          await loadInventory(stickyTokenId);
        }
      });
    });
  }, []);

  const loadInventory = async (tokenId: string) => {
    setCurrentTokenId(tokenId);
    await setStickyToken(tokenId);
    
    // Get token name
    const items = await OBR.scene.items.getItems([tokenId]);
    if (items.length > 0) {
      setTokenName(items[0].name);
    }
    
    // Load inventory from token metadata
    let inv = await getTokenMetadata(tokenId);
    if (!inv) {
      inv = createDefaultInventory();
      await saveTokenMetadata(tokenId, inv);
    }
    
    setInventory(inv);
    setViewingExternalStorage(null);
  };

  const saveInventory = async (newInventory: Inventory) => {
    setInventory(newInventory);
    if (currentTokenId) {
      await saveTokenMetadata(currentTokenId, newInventory);
    }
  };

  const loadExternalStorage = (storageId: string) => {
    setViewingExternalStorage(storageId);
  };

  const handleDMAccess = (password: string) => {
    if (password === 'Cadmian') {
      setShowDMScreen(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (!currentTokenId) {
    return (
      <div className="app-container">
        <div className="no-token">
          <h2>No Token Selected</h2>
          <p>Right-click a character token and select "Inventory" to open their inventory.</p>
        </div>
      </div>
    );
  }

  if (showDMScreen) {
    return (
      <DMScreen 
        config={dmConfig!}
        onSave={async (newConfig) => {
          setDMConfig(newConfig);
          const allPackTypes = [...DEFAULT_PACK_TYPES, ...newConfig.customPackTypes];
          setPackTypes(allPackTypes);
          const allStorageTypes = [...DEFAULT_EXTERNAL_STORAGE_TYPES, ...newConfig.customExternalStorageTypes];
          setStorageTypes(allStorageTypes);
        }}
        onClose={() => setShowDMScreen(false)}
      />
    );
  }

  const currentStorage = viewingExternalStorage 
    ? inventory.externalStorages.find(s => s.id === viewingExternalStorage)
    : null;

  const displayInventory = currentStorage ? currentStorage.inventory : inventory;
  const displayName = currentStorage ? currentStorage.name : tokenName;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Inventory: {displayName}</h1>
        {isDM && !showDMScreen && (
          <button 
            className="dm-button"
            onClick={() => {
              const password = prompt('Enter DM password:');
              if (password) handleDMAccess(password);
            }}
          >
            DM Screen
          </button>
        )}
        {viewingExternalStorage && (
          <button 
            className="back-button"
            onClick={() => setViewingExternalStorage(null)}
          >
            Back to Character
          </button>
        )}
      </header>

      <nav className="tab-nav">
        <button 
          className={activeTab === 'pack' ? 'active' : ''}
          onClick={() => setActiveTab('pack')}
        >
          Pack
        </button>
        <button 
          className={activeTab === 'body' ? 'active' : ''}
          onClick={() => setActiveTab('body')}
        >
          Body
        </button>
        <button 
          className={activeTab === 'quick-slots' ? 'active' : ''}
          onClick={() => setActiveTab('quick-slots')}
        >
          Quick Slots
        </button>
        <button 
          className={activeTab === 'coins' ? 'active' : ''}
          onClick={() => setActiveTab('coins')}
        >
          Coins
        </button>
        <button 
          className={activeTab === 'external' ? 'active' : ''}
          onClick={() => setActiveTab('external')}
        >
          External Storage
        </button>
        <button 
          className={activeTab === 'search' ? 'active' : ''}
          onClick={() => setActiveTab('search')}
        >
          🔍 Global Search
        </button>
        <button 
          className={activeTab === 'info' ? 'active' : ''}
          onClick={() => setActiveTab('info')}
        >
          Info
        </button>
      </nav>

      <main className="tab-content">
        {activeTab === 'pack' && (
          <PackTab 
            inventory={displayInventory}
            packTypes={packTypes}
            onUpdate={(inv) => {
              if (currentStorage) {
                const newStorages = inventory.externalStorages.map(s => 
                  s.id === viewingExternalStorage ? { ...s, inventory: inv } : s
                );
                saveInventory({ ...inventory, externalStorages: newStorages });
              } else {
                saveInventory(inv);
              }
            }}
            tokenId={currentTokenId}
          />
        )}
        {activeTab === 'body' && (
          <BodyTab 
            inventory={displayInventory}
            packTypes={packTypes}
            onUpdate={(inv) => {
              if (currentStorage) {
                const newStorages = inventory.externalStorages.map(s => 
                  s.id === viewingExternalStorage ? { ...s, inventory: inv } : s
                );
                saveInventory({ ...inventory, externalStorages: newStorages });
              } else {
                saveInventory(inv);
              }
            }}
          />
        )}
        {activeTab === 'quick-slots' && (
          <QuickSlotsTab 
            inventory={displayInventory}
            packTypes={packTypes}
            onUpdate={(inv) => {
              if (currentStorage) {
                const newStorages = inventory.externalStorages.map(s => 
                  s.id === viewingExternalStorage ? { ...s, inventory: inv } : s
                );
                saveInventory({ ...inventory, externalStorages: newStorages });
              } else {
                saveInventory(inv);
              }
            }}
          />
        )}
        {activeTab === 'coins' && (
          <CoinsTab 
            inventory={inventory}
            coinNames={dmConfig?.coinNames}
            onUpdate={saveInventory}
          />
        )}
        {activeTab === 'external' && !viewingExternalStorage && (
          <ExternalStorageTab 
            inventory={inventory}
            storageTypes={storageTypes}
            onUpdate={saveInventory}
            onView={loadExternalStorage}
          />
        )}
        {activeTab === 'search' && (
          <GlobalSearchTab 
            inventory={inventory}
            onUpdate={saveInventory}
          />
        )}
        {activeTab === 'info' && (
          <InfoTab 
            packTypes={packTypes}
            storageTypes={storageTypes}
            dmConfig={dmConfig}
          />
        )}
      </main>
    </div>
  );
};

export default App;
