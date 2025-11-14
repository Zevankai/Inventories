// Item Categories with default weights
export type ItemCategory = 
  | 'other'
  | 'large'
  | 'massive'
  | 'tool/kit'
  | 'light-armor'
  | 'medium-armor'
  | 'heavy-armor'
  | 'consumable'
  | 'instrument'
  | 'one-handed-weapon'
  | 'two-handed-weapon'
  | 'clothing'
  | 'light-ammunition'
  | 'ammunition'
  | 'jewelry'
  | 'shield'
  | 'magic-item'
  | 'literature'
  | 'camp';

export const ITEM_CATEGORY_WEIGHTS: Record<ItemCategory, number> = {
  'other': 1,
  'large': 10,
  'massive': 50,
  'tool/kit': 2,
  'light-armor': 5,
  'medium-armor': 8,
  'heavy-armor': 12,
  'consumable': 1,
  'instrument': 2,
  'one-handed-weapon': 2,
  'two-handed-weapon': 4,
  'clothing': 3,
  'light-ammunition': 0.05, // 1u per stack of 20
  'ammunition': 0.1, // 1u per stack of 10
  'jewelry': 1,
  'shield': 3,
  'magic-item': 2,
  'literature': 1,
  'camp': 3
};

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  weight: number; // Custom weight override
  requiresAttunement: boolean;
  isAttuned: boolean;
  description?: string;
  value?: number; // In copper pieces
  uses?: number; // For camp items (max 15)
}

export type EquipmentSlotType = 
  | 'weapon'
  | 'armor'
  | 'clothing'
  | 'jewelry'
  | 'utility';

export interface EquipmentSlots {
  weapon: number;
  armor: number;
  clothing: number;
  jewelry: number;
  utility: number;
}

export interface PackType {
  id: string;
  name: string;
  capacity: number; // In units
  utilitySlots: number;
  weaponModifier: number;
  armorModifier: number;
  clothingModifier: number;
  jewelryModifier: number;
  utilityEquipRules: ItemCategory[];
  description?: string;
}

export const DEFAULT_PACK_TYPES: PackType[] = [
  {
    id: 'npc-pack',
    name: 'NPC Pack',
    capacity: 100,
    utilitySlots: 0,
    weaponModifier: 0,
    armorModifier: 0,
    clothingModifier: 0,
    jewelryModifier: 0,
    utilityEquipRules: []
  },
  {
    id: 'simple-pack',
    name: 'Simple Pack',
    capacity: 25,
    utilitySlots: 3,
    weaponModifier: 0,
    armorModifier: 0,
    clothingModifier: 0,
    jewelryModifier: 0,
    utilityEquipRules: []
  },
  {
    id: 'standard-pack',
    name: 'Standard Pack',
    capacity: 55,
    utilitySlots: 4,
    weaponModifier: 0,
    armorModifier: 0,
    clothingModifier: 0,
    jewelryModifier: 0,
    utilityEquipRules: []
  },
  {
    id: 'warrior-pack',
    name: 'Warrior Pack',
    capacity: 30,
    utilitySlots: 6,
    weaponModifier: 0,
    armorModifier: 1,
    clothingModifier: 0,
    jewelryModifier: 0,
    utilityEquipRules: ['one-handed-weapon']
  },
  {
    id: 'explorer-pack',
    name: 'Explorer Pack',
    capacity: 30,
    utilitySlots: 6,
    weaponModifier: 0,
    armorModifier: 0,
    clothingModifier: 1,
    jewelryModifier: 0,
    utilityEquipRules: ['tool/kit']
  },
  {
    id: 'tinkerer-pack',
    name: "Tinkerer's Pack",
    capacity: 20,
    utilitySlots: 10,
    weaponModifier: 0,
    armorModifier: 0,
    clothingModifier: 0,
    jewelryModifier: 0,
    utilityEquipRules: ['tool/kit']
  },
  {
    id: 'travel-pack',
    name: 'Travel Pack',
    capacity: 35,
    utilitySlots: 8,
    weaponModifier: -2,
    armorModifier: 0,
    clothingModifier: 0,
    jewelryModifier: 0,
    utilityEquipRules: ['camp']
  },
  {
    id: 'shadow-pack',
    name: 'Shadow Pack',
    capacity: 15,
    utilitySlots: 10,
    weaponModifier: 0,
    armorModifier: -2,
    clothingModifier: 0,
    jewelryModifier: 0,
    utilityEquipRules: ['tool/kit', 'one-handed-weapon']
  },
  {
    id: 'mule-pack',
    name: "Mule's Pack",
    capacity: 150,
    utilitySlots: 1,
    weaponModifier: -3,
    armorModifier: -3,
    clothingModifier: 0,
    jewelryModifier: 0,
    utilityEquipRules: []
  },
  {
    id: 'utility-pack',
    name: 'Utility Pack',
    capacity: 10,
    utilitySlots: 14,
    weaponModifier: 0,
    armorModifier: 0,
    clothingModifier: 0,
    jewelryModifier: 0,
    utilityEquipRules: [] // Special rule: anything under 2 units
  }
];

export interface Currency {
  copper: number;
  silver: number;
  gold: number;
  platinum: number;
}

export const COIN_NAMES_DEFAULT = {
  copper: 'Copper',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum'
};

export interface Vault {
  id: string;
  name: string;
  location: string;
  currency: Currency;
  notes?: string;
  nearby: boolean;
}

export interface ExternalStorageType {
  id: string;
  name: string;
  capacity: number;
  weaponSlots: number;
  armorSlots: number;
  coinCapacity: number; // -1 for unlimited
  description?: string;
}

export const DEFAULT_EXTERNAL_STORAGE_TYPES: ExternalStorageType[] = [
  {
    id: 'small-pet',
    name: 'Small Pet',
    capacity: 20,
    weaponSlots: 2,
    armorSlots: 2,
    coinCapacity: 20
  },
  {
    id: 'large-pet',
    name: 'Large Pet',
    capacity: 100,
    weaponSlots: 2,
    armorSlots: 4,
    coinCapacity: 100
  },
  {
    id: 'standard-mount',
    name: 'Standard Mount',
    capacity: 150,
    weaponSlots: 0,
    armorSlots: 2,
    coinCapacity: 200
  },
  {
    id: 'large-mount',
    name: 'Large Mount',
    capacity: 250,
    weaponSlots: 0,
    armorSlots: 4,
    coinCapacity: 500
  },
  {
    id: 'small-cart',
    name: 'Small Cart',
    capacity: 300,
    weaponSlots: 0,
    armorSlots: 0,
    coinCapacity: 1000
  },
  {
    id: 'large-cart',
    name: 'Large Cart',
    capacity: 500,
    weaponSlots: 0,
    armorSlots: 0,
    coinCapacity: 2000
  },
  {
    id: 'boat',
    name: 'Boat',
    capacity: 500,
    weaponSlots: 0,
    armorSlots: 0,
    coinCapacity: 2000
  },
  {
    id: 'ship',
    name: 'Ship',
    capacity: 2000,
    weaponSlots: 0,
    armorSlots: 0,
    coinCapacity: -1
  },
  {
    id: 'house',
    name: 'House',
    capacity: 1000,
    weaponSlots: 0,
    armorSlots: 0,
    coinCapacity: -1
  },
  {
    id: 'warehouse',
    name: 'Warehouse',
    capacity: 2000,
    weaponSlots: 0,
    armorSlots: 0,
    coinCapacity: -1
  }
];

export interface ExternalStorage {
  id: string;
  name: string;
  description: string;
  storageTypeId: string;
  inventory: Inventory;
  nearby: boolean;
}

export interface EquippedItems {
  weapon: (string | null)[];
  armor: (string | null)[];
  clothing: (string | null)[];
  jewelry: (string | null)[];
  utility: (string | null)[];
}

export interface Inventory {
  items: Item[];
  equipped: EquippedItems;
  currency: Currency;
  packTypeId: string;
  vaults: Vault[];
  externalStorages: ExternalStorage[];
}

export interface PlayerData {
  tokenId: string;
  inventory: Inventory;
  favorites: string[]; // Item IDs
  lastAccessed: number;
}

export interface DMConfig {
  customPackTypes: PackType[];
  customExternalStorageTypes: ExternalStorageType[];
  customCategories: { category: ItemCategory; weight: number }[];
  coinNames: typeof COIN_NAMES_DEFAULT;
  favorites: string[]; // Item IDs
  notes: string;
}

export const BASE_EQUIPMENT_SLOTS: EquipmentSlots = {
  weapon: 4,
  armor: 4,
  clothing: 4,
  jewelry: 4,
  utility: 0 // Determined by pack
};

export const MAX_ATTUNED_ITEMS = 3;
export const COIN_CARRY_CAP = 40;
export const COIN_WEIGHT_THRESHOLD = 30;
export const COIN_WEIGHT_PENALTY_PER_10 = 1;
export const CAMP_ITEM_MAX_USES = 15;
