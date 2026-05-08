# OPCR Excel File Format Guide

## Required Columns

The OPCR Excel file must have the following columns in this exact order:

| Column | Name | Description | Example |
|--------|------|-------------|---------|
| 0 | ID | Unique identifier for the target | "1.1", "2.3", "KRA1-01" |
| 1 | KRA | Key Result Area | "KRA 1", "KRA 2", "Strategic" |
| 2 | Function | Major function or category | "Instruction", "Research", "Extension" |
| 3 | Indicator | Success indicator description | "Submitted PPMP as required" |
| 4 | Target Value | Target value or percentage | "100%", "5 papers", "On time" |
| 5 | Weight | Category weight | "Strategic", "Core", "Support" |
| 6 | Period | Timeline or period | "Jan-Dec", "Midyear", "Q1-Q4" |
| 7 | Accountable | Accountable units/persons | "Faculty, Coordinator", "All Staff" |
| 8 | **Q³** | **Quality rating required** | **"x" or empty** |
| 9 | **E²** | **Efficiency rating required** | **"x" or empty** |
| 10 | **T³** | **Timeliness rating required** | **"x" or empty** |

## Rating Requirement Columns (Q³, E², T³)

These columns determine which ratings are required for each target:

- **Q³ (Quality)** - Column 8
  - Put "x" if Quality rating is required
  - Leave empty if not required

- **E² (Efficiency)** - Column 9
  - Put "x" if Efficiency rating is required
  - Leave empty if not required

- **T³ (Timeliness)** - Column 10
  - Put "x" if Timeliness rating is required
  - Leave empty if not required

## Example Excel File

```
| ID  | KRA   | Function    | Indicator                           | Target | Weight     | Period  | Accountable | Q³ | E² | T³ |
|-----|-------|-------------|-------------------------------------|--------|------------|---------|-------------|----|----|----| 
| 1.1 | KRA 1 | Instruction | Submitted PPMP as required          | 100%   | Strategic  | Jan-Dec | Faculty     | x  | x  | x  |
| 1.2 | KRA 1 | Instruction | Ensured 100% submission of QO Graph | 100%   | Core       | Midyear | Faculty     | x  |    | x  |
| 2.1 | KRA 2 | Research    | Submitted final Midyear report      | 1      | Core       | July 10 | Faculty     | x  |    |    |
| 3.1 | KRA 3 | Extension   | Conducted community outreach        | 2      | Core       | Q1-Q4   | Faculty     | x  | x  | x  |
| 4.1 | KRA 4 | Production  | Produced learning materials         | 5      | Support    | Jan-Dec | Faculty     |    | x  | x  |
```

## Rating Requirements Interpretation

Based on the example above:

1. **Target 1.1** (Q³=x, E²=x, T³=x)
   - Requires: Quality, Efficiency, and Timeliness
   - Faculty must provide all three ratings
   - Average = (Q + E + T) / 3

2. **Target 1.2** (Q³=x, T³=x)
   - Requires: Quality and Timeliness only
   - Faculty provides only Q and T ratings
   - Average = (Q + T) / 2

3. **Target 2.1** (Q³=x only)
   - Requires: Quality only
   - Faculty provides only Q rating
   - Average = Q

4. **Target 3.1** (Q³=x, E²=x, T³=x)
   - Requires: All three ratings
   - Average = (Q + E + T) / 3

5. **Target 4.1** (E²=x, T³=x)
   - Requires: Efficiency and Timeliness only
   - Faculty provides only E and T ratings
   - Average = (E + T) / 2

## Important Notes

1. **Case Insensitive**: The system accepts both "x" and "X" in rating columns
2. **Default Behavior**: If all three columns (Q³, E², T³) are empty, the system defaults to requiring all three ratings
3. **File Naming**: The Excel filename must contain "OPCR" (case insensitive) to be accepted
4. **File Format**: Supported formats are .xlsx and .xls
5. **Header Row**: Row 0 should contain column headers (will be skipped during parsing)
6. **Data Rows**: Data starts from row 1 onwards

## Creating the Excel File

### Option 1: From Scratch
1. Open Excel or Google Sheets
2. Create columns as shown in the table above
3. Add header row with column names
4. Fill in data rows with target information
5. Mark required ratings with "x" in Q³, E², T³ columns
6. Save as .xlsx file with "OPCR" in the filename

### Option 2: From Template
1. Download the OPCR template (if available)
2. Fill in the target information
3. Mark required ratings with "x"
4. Save with "OPCR" in the filename

### Option 3: From PDF
1. Open the OPCR PDF document
2. Export/Save As Excel Workbook
3. Verify columns are in correct order
4. Ensure Q³, E², T³ columns have "x" marks
5. Save as .xlsx file

## Common Issues

### Issue 1: "No OPCR targets found"
**Cause:** Missing required columns or empty rows  
**Solution:** Ensure all 11 columns exist and have data

### Issue 2: "Invalid OPCR Document"
**Cause:** Filename doesn't contain "OPCR"  
**Solution:** Rename file to include "OPCR" (e.g., "OPCR_2026.xlsx")

### Issue 3: All targets require all three ratings
**Cause:** Q³, E², T³ columns are missing or empty  
**Solution:** Add columns 8, 9, 10 and mark with "x" as needed

### Issue 4: Ratings not showing correctly
**Cause:** Wrong column order or data in wrong columns  
**Solution:** Verify Q³ is column 8, E² is column 9, T³ is column 10

## Validation Checklist

Before uploading the OPCR Excel file:

- [ ] File has .xlsx or .xls extension
- [ ] Filename contains "OPCR"
- [ ] All 11 columns are present
- [ ] Column order matches the specification
- [ ] Q³, E², T³ columns have "x" marks where needed
- [ ] No empty rows between data
- [ ] ID and Indicator columns are filled for all rows
- [ ] Weight column contains only: Strategic, Core, or Support

## Example Filenames

✅ **Valid:**
- `OPCR_2026.xlsx`
- `OPCR_Midyear_2026.xlsx`
- `College_OPCR_2026.xls`
- `opcr-targets.xlsx`

❌ **Invalid:**
- `targets_2026.xlsx` (missing "OPCR")
- `performance_review.xlsx` (missing "OPCR")
- `OPCR_2026.pdf` (wrong format, must be Excel)

---

**Last Updated:** May 8, 2026  
**For Questions:** Contact your system administrator or IT support
