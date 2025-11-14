# Inventory Management Extension for Owlbear Rodeo

A comprehensive inventory management system for Owlbear Rodeo with advanced features including pack systems, equipment slots, currency management, external storage, and more.

## Features

### Core Mechanics
- **Persistent Storage**: All inventory data is stored in Owlbear Rodeo token metadata
- **Context Menu**: Access by right-clicking character tokens
- **Sticky Token**: Extension remembers the last token opened
- **Favorites System**: Star items to add to your personal favorites
- **DM Screen**: Password-protected screen (password: `Cadmian`) for DM customization

### Pack System
- Dynamic equipment slot system based on pack type
- Base slots: 4 Weapon, 4 Armor, 4 Clothing, 4 Jewelry
- Pack modifiers adjust these base slots
- Utility slots determined by pack type
- Special pack rules allow specific items in utility slots

#### Available Pack Types
- **NPC Pack**: 100u capacity, 0 utility slots
- **Simple Pack**: 25u capacity, 3 utility slots
- **Standard Pack**: 55u capacity, 4 utility slots
- **Warrior Pack**: 30u capacity, 6 utility slots, +1 armor, allows one-handed weapons in utility
- **Explorer Pack**: 30u capacity, 6 utility slots, +1 clothing, allows tools/kits in utility
- **Tinkerer's Pack**: 20u capacity, 10 utility slots, allows tools/kits in utility
- **Travel Pack**: 35u capacity, 8 utility slots, -2 weapon, allows camp items in utility
- **Shadow Pack**: 15u capacity, 10 utility slots, -2 armor, allows tools/kits and one-handed weapons in utility
- **Mule's Pack**: 150u capacity, 1 utility slot, -3 weapon, -3 armor
- **Utility Pack**: 10u capacity, 14 utility slots, allows items under 2u in utility

### Equipment & Attunement
- Separate Body tab for Armor, Clothing, and Jewelry
- Quick Slots tab for utility items
- Maximum 3 attuned items at once
- Mark items as requiring attunement
- Toggle attunement status with star icon

### Currency System
- Four coin types: Copper, Silver, Gold, Platinum
- 40 coin carry cap
- Weight penalty for carrying over 30 coins (+1u per 10 coins over threshold)
- Vault system for storing currency in banks
- Transfer between pack, vaults, and external storage (when nearby)

### Item Management
- Spreadsheet-style Pack tab editor
- Real-time search and filtering
- Sell multiples from stacks
- Edit quantity and category inline
- Use button for ammunition, consumables, and camp items
- Camp items have 15-use limit

### Item Categories (with weights)
- Other (1u), Large (10u), Massive (50u)
- Tool/Kit (2u), Instruments (2u)
- Light/Medium/Heavy Armor (5u/8u/12u)
- One-handed/Two-handed Weapons (2u/4u)
- Shields (3u), Clothing (3u), Jewelry (1u)
- Ammunition (1u per 10), Light Ammunition (1u per 20)
- Consumables (1u), Magic Items (2u)
- Literature (1u), Camp (3u)

### External Storage
- Create named storage locations (mounts, carts, houses, etc.)
- Each has independent inventory
- Transfer items between character and storage
- Nearby toggle controls transfer availability
- Items auto-deattune when transferred

#### Storage Types
- **Small Pet**: 20u, 2 weapon, 2 armor, 20 coins
- **Large Pet**: 100u, 2 weapon, 4 armor, 100 coins
- **Standard Mount**: 150u, 2 armor, 200 coins
- **Large Mount**: 250u, 4 armor, 500 coins
- **Small Cart**: 300u, 1000 coins
- **Large Cart**: 500u, 2000 coins
- **Boat**: 500u, 2000 coins
- **Ship**: 2000u, unlimited coins
- **House**: 1000u, unlimited coins
- **Warehouse**: 2000u, unlimited coins

### Global Search
- Search across all storage locations
- View items regardless of location
- Transfer from nearby external storage to pack

### Info Tab
- View all pack types
- View all storage types
- Shared notes section (editable by all players)

### DM Tools
- Custom pack type creation
- Custom storage type creation
- Customize coin names
- DM favorites
- All changes update in real-time

## Installation

1. Clone this repository
2. Install dependencies: `npm install`
3. Build the extension: `npm run build`
4. The built extension will be in the `dist` folder

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Usage

1. Install the extension in Owlbear Rodeo
2. Right-click any character token
3. Select "Inventory" from the context menu
4. Manage your inventory across all tabs

### For DMs
1. Click the "DM Screen" button
2. Enter password: `Cadmian`
3. Customize pack types, storage types, and coin names

## License

MIT License - See LICENSE file for details

## Author

Zevankai
