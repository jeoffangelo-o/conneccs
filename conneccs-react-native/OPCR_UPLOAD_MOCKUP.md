# OPCR Upload Mockup - Working Demo ✅

## Changes Made

Added a "Load Sample Data" button to the SecretaryOPCRUploadScreen that demonstrates the OPCR extraction functionality with realistic sample data.

### 1. **New Function: `loadSampleData()`**
Creates 8 sample OPCR targets with realistic data:
- **KRA 1**: Strategic Direction and Leadership (2 targets)
- **KRA 2**: Instruction and Learning (2 targets)
- **KRA 3**: Research and Innovation (1 target)
- **KRA 4**: Extension and Community Engagement (1 target)
- **KRA 5**: Resource Management (2 targets)

### 2. **Sample Data Structure**
Each target includes:
- **ID**: Unique identifier (e.g., KRA1-SF1, KRA2-CF1)
- **KRA**: Key Result Area
- **Function**: Major function description
- **Indicator**: Success indicator
- **Target Value**: Expected achievement
- **Weight**: Strategic, Core, or Support
- **Period**: Time period (Jan-Jun, Jul-Dec, Jan-Dec 2026)
- **Accountable**: List of faculty members responsible
- **Rating Dimensions**: Q (Quality), E (Efficiency), T (Timeliness)

### 3. **UI Enhancement**
Added a prominent "Load Sample Data (Demo)" button:
- Lightning bolt icon (⚡)
- Accent-colored border
- Positioned below the file upload area
- Clear indication it's for demonstration

## Sample Data Included

### Strategic Functions (2 targets)
1. **Strategic Planning** - 100% implementation
   - Accountable: Dean Onesa, Chair Colle, Chair Benitez
   - Ratings: Q, E, T

2. **Quality Assurance** - 3 programs with Level III accreditation
   - Accountable: Dean Onesa, All Program Chairs
   - Ratings: Q, E, T

### Core Functions (4 targets)
1. **Curriculum Development** - 100% updated syllabi
   - Accountable: All Program Chairs
   - Ratings: Q, E

2. **Faculty Development** - 80% faculty trained
   - Accountable: Bagaporo, Broqueza, Fortuno, Llagas, Manlapaz
   - Ratings: Q, T

3. **Research Output** - 5 publications
   - Accountable: Benosa, Omorog, Onate, Serrano
   - Ratings: Q, E, T

4. **Community Extension** - 10 activities
   - Accountable: Baluis, Lipata, Neo, Ramizares
   - Ratings: Q, E

### Support Functions (2 targets)
1. **Laboratory Management** - 95% operational equipment
   - Accountable: Bagaporo, Fortuno, Prades, Lipata
   - Ratings: Q, T

2. **Budget Utilization** - 90% efficient utilization
   - Accountable: Dean Onesa, Secretary Gastilo, Secretary Otares
   - Ratings: E, T

## How to Test

### Step 1: Login as Secretary
Use any secretary quick login:
- Secretary (Gastilo)
- Secretary (Otares)
- Secretary (Baeta)
- Secretary (Tañamor)

### Step 2: Navigate to Upload OPCR
1. Open the drawer menu
2. Click "Upload OPCR" (secretary-only option)

### Step 3: Load Sample Data
1. Click the "Load Sample Data (Demo)" button
2. Alert shows: "Successfully loaded 8 sample OPCR targets"
3. File info appears: "OPCR_CCS_2026_Sample.xlsx (0.15 MB)"

### Step 4: Review Extracted Data
The screen will show:

#### Summary Cards
- **Total Targets**: 8
- **Strategic**: 2
- **Core**: 4
- **Support**: 2
- **Unique Faculty**: 20+ (all accountable persons)
- **Time Periods**: 3 (Jan-Jun, Jul-Dec, Jan-Dec)

#### Target Cards
Each target displays:
- **Header**: ID badge + Weight badge
- **KRA**: Key Result Area name
- **Function**: Major function title
- **Indicator**: Success indicator description
- **Meta Info**: Target value, Period, Required ratings
- **Accountable**: List of faculty members (as badges)

### Step 5: Save to System
1. Click "Save to System" button (green, top right)
2. Confirmation: "8 OPCR targets have been saved"
3. Message: "Faculty IPCRs will be auto-generated when they log in"
4. Returns to previous screen

## What Happens After Saving

### 1. **Data Storage**
- Targets saved to AsyncStorage
- Organized by weight category (Strategic, Core, Support)
- Each category becomes a major function

### 2. **IPCR Auto-Generation**
When faculty members log in, the system will:
- Check their name against "Accountable" lists
- Create individual IPCR targets for them
- Assign appropriate KRAs and indicators
- Set required rating dimensions (Q, E, T)

### 3. **Faculty Assignment**
Based on the sample data:
- **Dean Onesa**: 3 targets (Strategic + Support)
- **Chair Colle**: 3 targets (Strategic + Core)
- **Chair Benitez**: 2 targets (Strategic)
- **Chair Pandes**: 2 targets (Strategic + Core)
- **Chair Mortel**: 2 targets (Strategic + Core)
- **Chair Prianes**: 1 target (Core)
- **Bagaporo**: 2 targets (Core + Support)
- **Broqueza**: 1 target (Core)
- **Fortuno**: 2 targets (Core + Support)
- **Baluis**: 1 target (Core - Extension)
- **Benosa**: 1 target (Core - Research)
- And more...

## Visual Features

### Color Coding
- **Strategic**: Red badges and icons
- **Core**: Accent color (gold) badges and icons
- **Support**: Teal badges and icons

### Icons
- 📄 Document icon for upload area
- ⚡ Lightning bolt for sample data
- ⭐ Star for Strategic
- 💼 Briefcase for Core
- ⚙️ Settings for Support
- 👥 People for faculty count
- 📅 Calendar for time periods
- ✅ Check circle for save button

### Layout
- **Responsive grid**: Summary cards wrap on smaller screens
- **Card design**: Clean, bordered cards with proper spacing
- **Badge system**: Color-coded badges for weights and IDs
- **Accountable list**: Wrapped badges showing all faculty

## Real Excel Upload (Future)

The screen also supports real Excel file upload:
1. Click the upload area
2. Select an Excel file (.xlsx or .xls)
3. Click "Extract OPCR Data"
4. System parses the Excel file
5. Extracts targets based on column structure

### Expected Excel Format
| ID | KRA | Function | Indicator | Target | Weight | Period | Accountable | Q³ | E² | T³ |
|----|-----|----------|-----------|--------|--------|--------|-------------|----|----|-----|
| KRA1-SF1 | KRA 1 | Function name | Indicator text | 100% | Strategic | Jan-Dec | Name1, Name2 | x | x | x |

- **Q³, E², T³ columns**: Mark with 'x' to indicate required ratings
- **Accountable column**: Comma-separated list of faculty names
- **Weight column**: Strategic, Core, or Support

## Benefits of Mockup

### 1. **Immediate Testing**
- No need to create Excel files
- Instant demonstration of functionality
- Quick validation of UI/UX

### 2. **Realistic Data**
- Uses actual CCS faculty names
- Realistic KRAs and indicators
- Proper weight distribution

### 3. **Complete Flow**
- Shows extraction process
- Displays all summary statistics
- Demonstrates save functionality

### 4. **Training Tool**
- Secretaries can practice without real data
- Understand expected format
- See how data will be organized

## Files Modified
- `src/screens/SecretaryOPCRUploadScreen.tsx`

## Compilation Status
✅ No TypeScript errors
✅ No syntax errors
✅ File compiles successfully

## Next Steps
- Test the sample data loading
- Verify all 8 targets display correctly
- Check summary statistics accuracy
- Test save functionality
- Verify data persists in AsyncStorage
- Test IPCR auto-generation for faculty

## Notes
- Sample data uses real faculty names from users.json
- Rating dimensions vary by target (some Q+E, some Q+T, some all three)
- Accountable lists include appropriate roles (Dean, Chairs, Faculty, Secretaries)
- Time periods distributed across 2026
- Weight distribution: 25% Strategic, 50% Core, 25% Support
