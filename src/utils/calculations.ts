import { 
  Item, 
  Currency, 
  PackType, 
  EquipmentSlots, 
  BASE_EQUIPMENT_SLOTS,
  ITEM_CATEGORY_WEIGHTS,
  COIN_WEIGHT_THRESHOLD,
  COIN_WEIGHT_PENALTY_PER_10
} from '../types';

export const calculateItemWeight = (item: Item): number => {
  const baseWeight = item.weight > 0 ? item.weight : ITEM_CATEGORY_WEIGHTS[item.category];
  return baseWeight * item.quantity;
};

export const calculateTotalWeight = (items: Item[]): number => {
  return items.reduce((total, item) => total + calculateItemWeight(item), 0);
};

export const getTotalCoins = (currency: Currency): number => {
  return currency.copper + currency.silver + currency.gold + currency.platinum;
};

export const calculateCoinWeight = (currency: Currency): number => {
  const totalCoins = getTotalCoins(currency);
  if (totalCoins <= COIN_WEIGHT_THRESHOLD) {
    return 0;
  }
  const overage = totalCoins - COIN_WEIGHT_THRESHOLD;
  return Math.ceil(overage / 10) * COIN_WEIGHT_PENALTY_PER_10;
};

export const calculateCurrencyValue = (currency: Currency): number => {
  // All values in copper pieces
  return currency.copper + 
         (currency.silver * 10) + 
         (currency.gold * 100) + 
         (currency.platinum * 1000);
};

export const getEquipmentSlots = (packType: PackType): EquipmentSlots => {
  return {
    weapon: Math.max(0, BASE_EQUIPMENT_SLOTS.weapon + packType.weaponModifier),
    armor: Math.max(0, BASE_EQUIPMENT_SLOTS.armor + packType.armorModifier),
    clothing: Math.max(0, BASE_EQUIPMENT_SLOTS.clothing + packType.clothingModifier),
    jewelry: Math.max(0, BASE_EQUIPMENT_SLOTS.jewelry + packType.jewelryModifier),
    utility: packType.utilitySlots
  };
};

export const canEquipToUtilitySlot = (
  item: Item, 
  packType: PackType
): boolean => {
  // Utility Pack special rule: anything under 2 units
  if (packType.id === 'utility-pack') {
    const itemWeight = item.weight > 0 ? item.weight : ITEM_CATEGORY_WEIGHTS[item.category];
    return itemWeight < 2;
  }
  
  return packType.utilityEquipRules.includes(item.category);
};

export const canEquipItem = (
  item: Item,
  slotType: 'weapon' | 'armor' | 'clothing' | 'jewelry' | 'utility'
): boolean => {
  const category = item.category;
  
  switch (slotType) {
    case 'weapon':
      return category === 'one-handed-weapon' || 
             category === 'two-handed-weapon' || 
             category === 'shield' ||
             category === 'instrument';
    case 'armor':
      return category === 'light-armor' || 
             category === 'medium-armor' || 
             category === 'heavy-armor';
    case 'clothing':
      return category === 'clothing';
    case 'jewelry':
      return category === 'jewelry';
    case 'utility':
      // This should be checked with canEquipToUtilitySlot
      return true;
    default:
      return false;
  }
};

export const countAttunedItems = (items: Item[]): number => {
  return items.filter(item => item.isAttuned).length;
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
