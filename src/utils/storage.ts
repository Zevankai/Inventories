import OBR from '@owlbear-rodeo/sdk';
import { PlayerData, DMConfig, Inventory, DEFAULT_PACK_TYPES, COIN_NAMES_DEFAULT } from '../types';

const METADATA_KEY = 'com.zevankai.inventory';
const PLAYER_DATA_KEY = 'com.zevankai.inventory.playerData';
const DM_CONFIG_KEY = 'com.zevankai.inventory.dmConfig';
const STICKY_TOKEN_KEY = 'com.zevankai.inventory.stickyToken';

export const getTokenMetadata = async (tokenId: string): Promise<Inventory | null> => {
  try {
    const items = await OBR.scene.items.getItems([tokenId]);
    if (items.length === 0) return null;
    
    const metadata = items[0].metadata[METADATA_KEY];
    return metadata ? (metadata as Inventory) : null;
  } catch (error) {
    console.error('Error getting token metadata:', error);
    return null;
  }
};

export const saveTokenMetadata = async (tokenId: string, inventory: Inventory): Promise<void> => {
  try {
    await OBR.scene.items.updateItems([tokenId], (items) => {
      for (const item of items) {
        item.metadata[METADATA_KEY] = inventory;
      }
    });
  } catch (error) {
    console.error('Error saving token metadata:', error);
  }
};

export const getPlayerData = async (): Promise<Record<string, PlayerData>> => {
  try {
    const data = await OBR.player.getMetadata();
    return (data[PLAYER_DATA_KEY] as Record<string, PlayerData>) || {};
  } catch (error) {
    console.error('Error getting player data:', error);
    return {};
  }
};

export const savePlayerData = async (tokenId: string, playerData: Partial<PlayerData>): Promise<void> => {
  try {
    const allData = await getPlayerData();
    allData[tokenId] = {
      ...allData[tokenId],
      ...playerData,
      tokenId,
      lastAccessed: Date.now()
    } as PlayerData;
    
    await OBR.player.setMetadata({
      [PLAYER_DATA_KEY]: allData
    });
  } catch (error) {
    console.error('Error saving player data:', error);
  }
};

export const getStickyToken = async (): Promise<string | null> => {
  try {
    const data = await OBR.player.getMetadata();
    return (data[STICKY_TOKEN_KEY] as string) || null;
  } catch (error) {
    console.error('Error getting sticky token:', error);
    return null;
  }
};

export const setStickyToken = async (tokenId: string): Promise<void> => {
  try {
    await OBR.player.setMetadata({
      [STICKY_TOKEN_KEY]: tokenId
    });
  } catch (error) {
    console.error('Error setting sticky token:', error);
  }
};

export const getDMConfig = async (): Promise<DMConfig> => {
  try {
    const data = await OBR.room.getMetadata();
    const config = data[DM_CONFIG_KEY] as DMConfig;
    
    if (!config) {
      return {
        customPackTypes: [],
        customExternalStorageTypes: [],
        customCategories: [],
        coinNames: COIN_NAMES_DEFAULT,
        favorites: [],
        notes: ''
      };
    }
    
    return config;
  } catch (error) {
    console.error('Error getting DM config:', error);
    return {
      customPackTypes: [],
      customExternalStorageTypes: [],
      customCategories: [],
      coinNames: COIN_NAMES_DEFAULT,
      favorites: [],
      notes: ''
    };
  }
};

export const saveDMConfig = async (config: DMConfig): Promise<void> => {
  try {
    await OBR.room.setMetadata({
      [DM_CONFIG_KEY]: config
    });
  } catch (error) {
    console.error('Error saving DM config:', error);
  }
};

export const createDefaultInventory = (): Inventory => {
  return {
    items: [],
    equipped: {
      weapon: [],
      armor: [],
      clothing: [],
      jewelry: [],
      utility: []
    },
    currency: {
      copper: 0,
      silver: 0,
      gold: 0,
      platinum: 0
    },
    packTypeId: DEFAULT_PACK_TYPES[2].id, // Standard Pack
    vaults: [],
    externalStorages: []
  };
};

export const getFavorites = async (): Promise<string[]> => {
  try {
    const playerData = await getPlayerData();
    const allFavorites = Object.values(playerData).flatMap(data => data.favorites || []);
    return [...new Set(allFavorites)];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const addToFavorites = async (tokenId: string, itemId: string): Promise<void> => {
  try {
    const allData = await getPlayerData();
    const data = allData[tokenId] || { tokenId, inventory: createDefaultInventory(), favorites: [], lastAccessed: Date.now() };
    
    if (!data.favorites.includes(itemId)) {
      data.favorites.push(itemId);
      await savePlayerData(tokenId, data);
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
};

export const removeFromFavorites = async (tokenId: string, itemId: string): Promise<void> => {
  try {
    const allData = await getPlayerData();
    const data = allData[tokenId];
    
    if (data) {
      data.favorites = data.favorites.filter(id => id !== itemId);
      await savePlayerData(tokenId, data);
    }
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
};
