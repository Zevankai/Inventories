# Complete Feature List - Owlbear Rodeo Inventory Extension

## 🎯 Core Features

### 1. **Persistent Storage System**
- All inventory data stored in Owlbear Rodeo token metadata
- No external database required
- Data persists across sessions
- Per-token inventory tracking

### 2. **Sticky Token Memory**
- Extension remembers the last token you opened
- Click toolbar icon or refresh browser to reload same token
- Seamless experience across sessions

### 3. **Favorites System**
- Star items to add to personal favorites
- Per-player favorites list
- Quick access to commonly used items

---

## 📦 Pack System (10 Types)

### Base Equipment Slots
Every character starts with:
- 4 Weapon slots
- 4 Armor slots
- 4 Clothing slots
- 4 Jewelry slots

### Pack Type Details

| Pack Type | Capacity | Utility | Weapon | Armor | Clothing | Jewelry | Special Rules |
|-----------|----------|---------|--------|-------|----------|---------|---------------|
| **NPC Pack** | 100u | 0 | - | - | - | - | None |
| **Simple Pack** | 25u | 3 | - | - | - | - | None |
| **Standard Pack** | 55u | 4 | - | - | - | - | None |
| **Warrior Pack** | 30u | 6 | - | +1 | - | - | One-handed weapons in utility |
| **Explorer Pack** | 30u | 6 | - | - | +1 | - | Tools/kits in utility |
| **Tinkerer's Pack** | 20u | 10 | - | - | - | - | Tools/kits in utility |
| **Travel Pack** | 35u | 8 | -2 | - | - | - | Camp items in utility |
| **Shadow Pack** | 15u | 10 | - | -2 | - | - | Tools/kits + one-handed weapons |
| **Mule's Pack** | 150u | 1 | -3 | -3 | - | - | None |
| **Utility Pack** | 10u | 14 | - | - | - | - | Items <2u in utility |

---

## ⚔️ Equipment & Attunement System

### Equipment Tabs
1. **Body Tab**
   - Armor section (modified by pack)
   - Clothing section (modified by pack)
   - Jewelry section (modified by pack)
   
2. **Quick Slots Tab**
   - Utility slots (determined by pack)
   - Special rules apply based on pack type

### Attunement
- Maximum 3 attuned items at once
- Mark items as "Requires Attunement"
- Toggle attunement with star icon (★/☆)
- Visual warning when exceeding limit
- Auto-deattune on item transfer

---

## 💰 Currency System

### Coin Types (Customizable by DM)
- Copper (c)
- Silver (s) - Worth 10 copper
- Gold (g) - Worth 100 copper
- Platinum (p) - Worth 1000 copper

### Carry Limits
- **Hard Cap**: 40 total coins
- **Weight Threshold**: 30 coins
- **Penalty**: +1 unit weight per 10 coins over 30
  - Example: 52 coins = +3 weight (22 over threshold / 10 = 2.2, rounded up to 3)

### Vault System
- Create named vaults at banks
- Store unlimited currency value
- Mark as "nearby" to include in wealth calculations
- Transfer between pack, vaults, and external storage

---

## 🎒 Item Management

### Item Categories (19 Types)

| Category | Default Weight | Notes |
|----------|----------------|-------|
| Other | 1u | General items |
| Large | 10u | Large objects |
| Massive | 50u | Very heavy items |
| Tool/Kit | 2u | - |
| Light Armor | 5u | - |
| Medium Armor | 8u | - |
| Heavy Armor | 12u | - |
| Consumable | 1u | Use to consume |
| Instrument | 2u | Equips as one-handed weapon |
| One-handed Weapon | 2u | - |
| Two-handed Weapon | 4u | - |
| Clothing | 3u | - |
| Light Ammunition | 1u per 20 | Auto-calculates |
| Ammunition | 1u per 10 | Auto-calculates |
| Jewelry | 1u | - |
| Shield | 3u | Equips as one-handed weapon |
| Magic Item | 2u | - |
| Literature | 1u | Books, scrolls |
| Camp | 3u | 15-use limit |

### Pack Tab Features
- Spreadsheet-style editor
- Real-time search/filter
- Inline quantity editing
- Category dropdown editing
- Sell multiples from stacks
- Use button for consumables/ammunition/camp items
- Weight calculations with overrides

### Item Actions
- **Ammunition/Consumable**: Use button deducts 1
- **Camp Items**: Use button deducts from 15-use limit, destroyed at 0
- **Sell**: Choose quantity to sell from stack
- **Edit**: Modify all item properties
- **Delete**: Remove item completely

---

## 🐴 External Storage System (10 Types)

### Storage Types

| Type | Capacity | Weapon | Armor | Coins | Use Case |
|------|----------|--------|-------|-------|----------|
| **Small Pet** | 20u | 2 | 2 | 20 | Cat, dog |
| **Large Pet** | 100u | 2 | 4 | 100 | Wolf, bear |
| **Standard Mount** | 150u | 0 | 2 | 200 | Horse, pony |
| **Large Mount** | 250u | 0 | 4 | 500 | Warhorse, elephant |
| **Small Cart** | 300u | 0 | 0 | 1,000 | Hand cart |
| **Large Cart** | 500u | 0 | 0 | 2,000 | Wagon |
| **Boat** | 500u | 0 | 0 | 2,000 | Small boat |
| **Ship** | 2,000u | 0 | 0 | ∞ | Large vessel |
| **House** | 1,000u | 0 | 0 | ∞ | Home base |
| **Warehouse** | 2,000u | 0 | 0 | ∞ | Storage facility |

### External Storage Features
- Create named storage with custom descriptions
- Each has independent inventory system
- View storage inventory by clicking "View"
- Separate tabs for Pack, Body, Quick Slots, Coins
- **Transfer Tab** shows side-by-side inventories
- "Nearby" toggle controls transfer availability
- Items auto-deattune when transferred
- Currency can be stored in storage

---

## 🔍 Global Search

### Search Features
- Search across ALL locations simultaneously:
  - Player pack
  - All vaults
  - All external storages
- Results show regardless of "nearby" status
- Transfer items directly from search results
- Transfers only work if storage is "nearby"
- Real-time filtering

---

## 🎲 DM Screen (Password: Cadmian)

### DM Tools
1. **Custom Pack Types**
   - Create new pack types
   - Set capacity and utility slots
   - Adjust slot modifiers
   - Define special utility rules

2. **Custom Storage Types**
   - Create new storage types
   - Set capacity limits
   - Define weapon/armor slots
   - Set coin capacity (or unlimited)

3. **Coin Name Customization**
   - Change names of all 4 coin types
   - Changes apply globally
   - Doesn't affect existing inventories

4. **DM Favorites**
   - Separate favorites list for DM
   - Manage across all campaigns

---

## ℹ️ Info Tab

### Three Sections
1. **Pack Types**
   - View all available pack types
   - See capacities and modifiers
   - Real-time updates with DM additions

2. **Storage Types**
   - View all available storage types
   - See capacities and slot counts
   - Real-time updates with DM additions

3. **Notes**
   - Shared notes section
   - Editable by all players
   - Great for feedback and ideas

---

## 🎨 User Interface

### Tab Navigation
- **Pack**: Main inventory management
- **Body**: Armor, Clothing, Jewelry equipment
- **Quick Slots**: Utility slot management
- **Coins**: Currency and vaults
- **External Storage**: Manage storage locations
- **Transfer**: Move items (appears when viewing storage)
- **Global Search**: Search all locations
- **Info**: Reference information

### Design Features
- Dark theme optimized for Owlbear Rodeo
- Responsive layout
- Real-time updates
- Modal dialogs for editing
- Visual indicators for:
  - Attuned items (★)
  - Over-capacity warnings (red)
  - Near-capacity warnings (yellow)
  - Favorites (⭐)

---

## 🔧 Technical Details

### Technology Stack
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **SDK**: @owlbear-rodeo/sdk
- **Styling**: Custom CSS

### Data Storage
- Token metadata for inventories
- Player metadata for favorites
- Room metadata for DM config
- No external database required

### Performance
- Lightweight bundle (~300KB)
- Fast load times
- Efficient re-renders
- Local-first architecture

---

## 📋 Future Enhancement Ideas

- Drag-and-drop item management
- Bulk item operations
- Import/export inventory
- Item templates and presets
- Quick-add common items
- Party-wide inventory view
- Trade system between players
- Item crafting/combining
- Automatic weight calculations for containers
- Treasure distribution tools

---

## 🐛 Known Limitations

- Context menu integration requires Owlbear SDK v3+
- Maximum recommended items per inventory: ~500
- Favorites are per-player, not per-character
- DM password is static (Cadmian)

---

## 📝 Version History

### v1.0.0 (Initial Release)
- Complete inventory system
- 10 pack types
- 10 external storage types
- Equipment and attunement
- Currency and vaults
- Global search
- DM customization tools
- Transfer system
- Info tab with notes

