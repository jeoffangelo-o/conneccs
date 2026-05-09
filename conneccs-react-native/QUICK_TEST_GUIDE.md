# Quick Test Guide - Self-Rating Feature ⚡

## 🚀 Quick Start (30 seconds)

### Step 1: Hard Refresh
```
Press: Ctrl + Shift + R
```

### Step 2: Login
```
Email: bagaporo@cspc.edu.ph
Password: faculty123
```

### Step 3: Navigate
```
Click: Reportorial Requirements (from menu)
Click: Any requirement card (e.g., "LETTER OF INTENT")
```

### Step 4: Test Rating
```
Click: "Rate My Submission" button
Type: 4 in Quality field → See ⭐⭐⭐⭐
Type: 5 in Timeliness field → See ⭐⭐⭐⭐⭐
Click: "Save Rating"
```

### Step 5: Verify
```
✅ See Quality: ⭐⭐⭐⭐ 4/5
✅ See Timeliness: ⭐⭐⭐⭐⭐ 5/5
✅ See Average: ⭐⭐⭐⭐ 4.5/5 (green box)
```

---

## ✅ What Should Work

1. **Template Section**: Always visible (not hidden)
2. **Upload Modal**: Appears before file picker opens
3. **Rating Modal**: Both quality AND timeliness are manual input
4. **Live Stars**: ⭐ appear instantly as you type
5. **Rating Display**: Shows stars on card after saving
6. **Average Rating**: Shows in green box with stars

---

## ❌ What Should NOT Happen

1. ❌ Timeliness should NOT be read-only
2. ❌ Stars should NOT appear only after saving
3. ❌ Template section should NOT be hidden
4. ❌ File picker should NOT open without modal first

---

## 🐛 Troubleshooting

### "I don't see any changes!"
```
Solution: Hard refresh with Ctrl+Shift+R
```

### "Stars don't appear when I type!"
```
Check: Are you typing a number 1-5?
Check: Did you hard refresh?
```

### "Average is wrong!"
```
Formula: (Quality + Timeliness) / 2
Example: (4 + 5) / 2 = 4.5 ✅
```

### "Rating button doesn't show!"
```
Check: Did you upload a document first?
Note: Button only appears after upload
```

---

## 📸 Visual Checklist

### Before Rating:
```
[ ] Template section visible
[ ] "Rate My Submission" button visible
[ ] No ratings displayed yet
```

### During Rating:
```
[ ] Modal opens when button clicked
[ ] Can type in Quality field
[ ] Can type in Timeliness field
[ ] Stars appear as you type
[ ] Both fields show live indicators
```

### After Rating:
```
[ ] Quality shows with stars
[ ] Timeliness shows with stars
[ ] Average shows in green box
[ ] "Rate My Submission" button is gone
```

---

## 🎯 Success Criteria

You'll know it's working when you see:

```
┌─────────────────────────────────────┐
│ ✅ Submitted                        │
│ May 9, 2026                         │
│                                     │
│ 📄 document.pdf         [Preview]  │
│                                     │
│ Quality: ⭐⭐⭐⭐ 4/5                │
│ Timeliness: ⭐⭐⭐⭐⭐ 5/5           │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🌟 Average: ⭐⭐⭐⭐ 4.5/5      │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 🔥 Quick Test Script

Copy and paste this checklist:

```
✅ Step 1: Hard refresh (Ctrl+Shift+R)
✅ Step 2: Login as Bagaporo
✅ Step 3: Go to Reportorial Requirements
✅ Step 4: Click a requirement card
✅ Step 5: See template section
✅ Step 6: Click "Rate My Submission"
✅ Step 7: Type "4" → See ⭐⭐⭐⭐
✅ Step 8: Type "5" → See ⭐⭐⭐⭐⭐
✅ Step 9: Click "Save Rating"
✅ Step 10: See ratings with stars
✅ Step 11: See average in green box
```

---

## 📞 Need Help?

### Check These Files:
1. `SELF_RATING_COMPLETE.md` - Technical details
2. `SELF_RATING_VISUAL_GUIDE.md` - Visual examples
3. `CONTEXT_TRANSFER_SUMMARY.md` - Complete summary

### Common Issues:
- **Browser cache**: Always hard refresh first
- **Wrong credentials**: Use exact email/password
- **No upload**: Upload document before rating
- **Wrong numbers**: Use 1-5 only

---

## ⏱️ Time Estimate

- **Hard refresh**: 5 seconds
- **Login**: 10 seconds
- **Navigate**: 5 seconds
- **Test rating**: 10 seconds
- **Verify**: 5 seconds

**Total**: ~35 seconds

---

## 🎉 Expected Result

After following all steps, you should see:
- ✅ Live star indicators in modal
- ✅ Manual input for both ratings
- ✅ Stars on card after saving
- ✅ Average rating in green box
- ✅ Template section always visible

**If you see all of these, the feature is working perfectly!** 🎊

---

**Quick Reference**:
- Hard Refresh: `Ctrl+Shift+R`
- Login: `bagaporo@cspc.edu.ph` / `faculty123`
- Location: Reportorial Requirements → Any card
- Test: Type ratings → See stars → Save → Verify

**Status**: READY TO TEST ✅
