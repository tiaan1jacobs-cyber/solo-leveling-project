# Complete Editing Guide
## Everything You Can Edit in the System

---

## **HOW TO EDIT SCHEDULE INSTRUCTIONS**

### **Step 1: Navigate to Your Schedule**
1. Log in to the app
2. Go to "Military Command Center" or click the schedule view
3. You'll see all your daily blocks

### **Step 2: Click the Edit Button**
1. Find the schedule block you want to edit (e.g., "WAKE UP" at 6:30 AM)
2. Click the small **pencil/edit icon** (Edit2 icon) in the top-right corner of that block
3. The Schedule Instruction Editor will open

### **Step 3: Edit the Instruction**

The editor lets you modify:

#### **TITLE**
- The main heading (e.g., "WAKE UP & CORE DECLARATIONS")
- This appears at the top of the modal

#### **DESCRIPTION**
- Brief explanation of what this task is about
- Shown below the title

#### **DECLARATIONS**
- The "I AM" statements you say out loud
- Click "+ Add Declaration" to add more
- Each declaration is numbered
- Can delete any declaration with the trash icon
- Example: "I AM a warrior in complete control of my mind and body"

#### **CHECKLIST ITEMS**
- Step-by-step instructions for completing the task
- Click "+ Add Item" to add more steps
- Each item is numbered automatically
- Can mark items as "CRITICAL" (shows red badge)
- Can delete any item with trash icon
- Example: "Alarm goes off at 6:30 AM"

### **Step 4: Save Your Changes**
1. Click **"SAVE CHANGES"** button at the bottom
2. Changes are immediately saved to the database
3. Modal closes automatically
4. Refresh or reopen the block to see your changes

---

## **WHAT YOU CAN EDIT**

### ✅ **Schedule Instructions** (Full Control)
- **Title** - Change the heading
- **Description** - Update the explanation
- **Declarations** - Add, edit, or remove affirmations
- **Checklist Items** - Add, edit, reorder, or remove steps
- **Critical Flags** - Mark important steps

### ✅ **Block Completion Progress**
- When you click a block and check off items, progress saves to database
- Your completion history is tracked per day
- Can view past progress

### ✅ **User Profile Settings**
- Through Settings view (if available)
- Can update preferences

---

## **WHAT EACH BLOCK CONTAINS**

### **Current Structure in Database:**

```
schedule_instructions table:
- day_of_week: "Monday" through "Sunday"
- block_id: "wake", "meditation", "breakfast", etc.
- title: Main heading
- description: Brief explanation
- declarations: Array of affirmations to say
- order_index: Order to display

instruction_checklist_items table:
- instruction_id: Links to parent instruction
- item_text: The step to complete
- order_index: Order of steps
- is_critical: Whether this is a critical step
```

---

## **EXAMPLE: EDITING THE WAKE UP BLOCK**

### **Before:**
```
Title: WAKE UP PROTOCOL
Description: Start your day immediately
Declarations:
  1. I AM a warrior
  2. I AM disciplined
Checklist:
  1. Alarm goes off
  2. Stand up within 5 seconds
```

### **How to Edit:**
1. Click the schedule block for "WAKE UP"
2. Click the edit icon (pencil)
3. Change title to: "WAKE UP & CORE DECLARATIONS"
4. Update description to: "Start your day with immediate action and powerful declarations"
5. Add more declarations:
   - "I AM building an empire while others sleep"
   - "I AM earning $5,000 per month"
6. Add more checklist items:
   - "Say each declaration with conviction"
   - "Walk to bathroom immediately"
7. Mark critical items (check the "Mark as CRITICAL" box)
8. Click "SAVE CHANGES"

### **After:**
```
Title: WAKE UP & CORE DECLARATIONS
Description: Start your day with immediate action and powerful declarations
Declarations:
  1. I AM a warrior
  2. I AM disciplined
  3. I AM building an empire while others sleep
  4. I AM earning $5,000 per month
Checklist:
  1. Alarm goes off (CRITICAL)
  2. Stand up within 5 seconds (CRITICAL)
  3. Say each declaration with conviction
  4. Walk to bathroom immediately
```

---

## **CREATING NEW INSTRUCTIONS**

### **For Blocks Without Instructions:**

If you click a schedule block that shows "No detailed instructions available", you can:

1. Click the edit icon on that block
2. The editor opens with empty fields
3. Fill in:
   - Title
   - Description
   - Declarations (if needed)
   - Checklist items
4. Click "SAVE CHANGES"
5. Now that block has full instructions!

---

## **ADVANCED EDITING**

### **Reordering Items:**
- Currently items are ordered by their position in the list
- To reorder, you need to:
  1. Delete items
  2. Re-add them in desired order
  - OR -
  1. Copy the text
  2. Delete the item
  3. Insert new item in correct position
  4. Paste the text

### **Critical Items:**
- Check the "Mark as CRITICAL" box
- These show a red "CRITICAL" badge
- Use for non-negotiable steps

### **Declarations vs Checklist:**
- **Declarations** = Things to say out loud (affirmations)
- **Checklist** = Actions to complete (steps)
- Both are optional but recommended

---

## **DATA SAFETY**

### ✅ **Your Data is Safe:**
- All changes save immediately to Supabase database
- Data persists between sessions
- Backed up automatically
- Can't accidentally lose progress

### ✅ **Can't Break Anything:**
- Only edits YOUR schedule instructions
- Doesn't affect other users
- Can always fix mistakes
- Worst case: re-enter the data

---

## **TIPS FOR EFFECTIVE EDITING**

### **1. Be Specific in Checklist Items**
❌ Bad: "Do morning routine"
✅ Good: "Turn alarm off immediately without snoozing"

### **2. Use Strong Declarations**
❌ Weak: "I will try to be disciplined"
✅ Strong: "I AM disciplined beyond what others think is possible"

### **3. Mark True Essentials as Critical**
- Don't mark everything critical
- Only mark the 2-3 truly non-negotiable items
- Critical = If you skip this, the whole task fails

### **4. Keep Descriptions Brief**
- 1-2 sentences max
- Explain the "why" not the "how"
- Save details for checklist items

### **5. Order Matters**
- Put declarations first (say these first)
- Order checklist in chronological order
- Most important items at top

---

## **COMMON EDITING SCENARIOS**

### **Scenario 1: Adding More Affirmations**
1. Edit the block
2. Scroll to "DECLARATIONS TO SAY OUT LOUD"
3. Click "+ Add Declaration"
4. Type your affirmation
5. Repeat for each new declaration
6. Save

### **Scenario 2: Breaking Down Complex Steps**
1. Edit the block
2. Find the complex step
3. Delete it
4. Add multiple smaller, specific steps
5. Save

Example:
- Before: "Complete morning routine"
- After:
  - "Brush teeth (2 minutes)"
  - "Wash face with cold water"
  - "Put on workout clothes"
  - "Make bed"

### **Scenario 3: Removing Unnecessary Items**
1. Edit the block
2. Find the item you don't need
3. Click the trash icon
4. Save

### **Scenario 4: Making Instructions More Detailed**
1. Edit the block
2. Add more checklist items between existing ones
3. Add time estimates
4. Add success criteria
5. Save

---

## **TROUBLESHOOTING**

### **"Edit button doesn't work"**
- Make sure you're logged in
- Refresh the page
- Check browser console for errors

### **"Changes aren't saving"**
- Check your internet connection
- Make sure title field isn't empty
- Wait for "SAVING..." to change to saved
- Check browser console for errors

### **"Can't see my edits"**
- Close and reopen the modal
- Refresh the page
- Check you edited the correct day/block

### **"Modal won't close"**
- Click the X button in top-right
- Click "CANCEL" button
- Press ESC key

---

## **CURRENT SEEDED DATA**

### **Blocks With Full Instructions:**
✅ **WAKE UP (wake)** - All 7 days
  - 7 core declarations
  - 18 checklist items
  - Includes cold shower protocol

✅ **MEDITATION (meditation)** - All 7 days
  - 5 meditation declarations
  - 15 checklist items
  - Includes breathing and mantras

### **Blocks Without Instructions Yet:**
You can add instructions to any block by clicking edit:
- breakfast
- work
- tennis
- combat training
- dinner
- evening reflection
- etc.

---

## **NEXT STEPS**

### **1. Add Instructions to All Your Blocks**
- Go through each time block
- Add declarations and checklists
- Make them specific to your goals

### **2. Refine Existing Instructions**
- Wake and meditation are seeded with examples
- Customize them to match your style
- Add or remove as needed

### **3. Mark Critical Steps**
- Review each checklist
- Identify the 2-3 most important items
- Check "Mark as CRITICAL"

### **4. Test Your Instructions**
- Actually follow them for a day
- See what's missing
- See what's unnecessary
- Edit and improve

---

## **FUTURE FEATURES**

Coming soon (if you want them):
- Drag-and-drop reordering
- Duplicate instructions across days
- Template library
- Bulk editing
- Version history
- Undo/redo

---

**You now have FULL control over your schedule instructions!**

Edit everything to match YOUR exact routine and goals.

Make it perfect for YOU.

Every block. Every declaration. Every step.

CUSTOMIZE EVERYTHING.
