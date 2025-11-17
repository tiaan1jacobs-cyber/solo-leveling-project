# Troubleshooting: Can't Make Edits

## **ISSUE: "I still cannot make any edits"**

### **Step 1: Are You Logged In?**

**THIS IS THE MOST COMMON ISSUE!**

✅ **Check if you're logged in:**
1. Look at the top-right corner of the screen
2. Do you see your email address or a profile icon?
3. Or do you see a "Login" button?

❌ **If you see "Login" button:** You need to log in first!

#### **How to Log In:**
1. Click the "Login" button (top-right or on landing page)
2. Enter your email and password
3. Click "Sign In"
4. OR click "Sign Up" if you don't have an account yet

### **Step 2: Look for the Yellow Warning**

When you open the schedule:

✅ **If you see a yellow warning box** that says:
```
⚠️ You must be logged in to edit your schedule. The buttons below require authentication.
```

**This confirms you're NOT logged in.**

**Solution:** Log in first, then the editing buttons will work.

---

## **Step 3: Find the "Manage Schedule" Button**

After logging in:

1. Navigate to **"Military Command"** in the sidebar (left side)
2. Scroll to the schedule section
3. Look for a **RED BUTTON** that says "Manage Schedule" (top-right of schedule)
4. This button should be **PULSING/GLOWING** to catch your attention

**Can't find it?**
- Make sure you're in the "Military Command" view (not Dashboard, not Combat, etc.)
- The button is at the top-right of the "DAILY SCHEDULE" section
- It's bright red and animated
- If you don't see it, you might not be logged in

---

## **Step 4: Click "Manage Schedule"**

1. Click the big red "Manage Schedule" button
2. The button should turn solid red and say **"Done Editing"**
3. You should see a red box appear that says:
   ```
   Schedule Management Mode: Add, edit, or delete time blocks...
   ```
4. This box has an "Add New Time Block" button

**If this doesn't happen:**
- Open browser console (F12 or Ctrl+Shift+I)
- Look for console.log messages
- It should say "Manage Schedule clicked, current mode: false"
- Take a screenshot and share

---

## **Step 5: Edit Buttons Should Now Be Visible**

In Manage Schedule mode, each schedule block should have:

1. **Blue "VIEW" button** (if not in manage mode)
2. **✏️ Edit icon** (pencil) - Edit instructions
3. **🕐 Clock icon** - Edit schedule block (times, activity name)
4. **🗑️ Trash icon** - Delete block (only for custom blocks)

**Can you see these icons?**
- If NO: You might not be logged in
- If YES but clicking doesn't work: Check browser console for errors

---

## **Common Problems & Solutions**

### **Problem 1: "I'm logged in but don't see the Manage Schedule button"**

**Solutions:**
1. Refresh the page (Ctrl+R or Cmd+R)
2. Navigate away and back to Military Command
3. Log out and log back in
4. Clear browser cache
5. Try a different browser

### **Problem 2: "The Manage Schedule button doesn't do anything when I click it"**

**Check:**
1. Open browser console (F12)
2. Click the button again
3. Look for console messages
4. Should say: "Manage Schedule clicked, current mode: false"
5. If you see errors, note them down

**Solutions:**
- Refresh the page
- Check for JavaScript errors in console
- Make sure you're using a modern browser (Chrome, Firefox, Edge, Safari)

### **Problem 3: "I clicked Edit but nothing opens"**

**For Instruction Editing (pencil icon):**
1. Open console (F12)
2. Click the pencil icon
3. Should log: "Edit instructions clicked for block: [block_id]"
4. A modal should appear

**For Schedule Block Editing (clock icon):**
1. Make sure "Manage Schedule" mode is ON
2. Open console (F12)
3. Click the clock icon
4. Should log: "Edit schedule block clicked for: [block_id]"
5. A modal should appear

**If no modal appears:**
- Check console for errors
- Try a different block
- Refresh the page

### **Problem 4: "I see 'Login Required' instead of Manage Schedule button"**

**This means you're definitely not logged in.**

**Solution:**
1. Click your profile picture or menu (top-right)
2. Click "Logout" if available
3. Then click "Login"
4. Enter credentials
5. After successful login, navigate back to Military Command
6. The button should now work

### **Problem 5: "Changes aren't saving"**

**Check:**
1. Are you clicking "SAVE CHANGES" or "SAVE BLOCK"?
2. Look for toast notifications (small popup messages)
3. Should say "Instruction updated" or "Schedule block created"
4. If you see error toasts, note the message

**Common save errors:**
- "Failed to save" = Database error (check console)
- "You must be logged in" = Session expired (log in again)
- "Block ID is required" = Fill in all required fields
- "End time must be after start time" = Fix the times

---

## **Debugging Checklist**

Use this to diagnose the issue:

- [ ] I am logged in (I see my email or profile, not "Login" button)
- [ ] I am in the "Military Command" view (left sidebar)
- [ ] I can see the schedule with time blocks
- [ ] I see a RED "Manage Schedule" button at top-right of schedule
- [ ] When I click it, it changes to "Done Editing"
- [ ] A red box appears with "Add New Time Block" button
- [ ] Each schedule block has small icons (pencil, clock, trash)
- [ ] When I click these icons, modals open
- [ ] I can type in the modal fields
- [ ] When I click "SAVE", I see a success toast message

**If ANY of these fail, that's where the problem is!**

---

## **Browser Console Instructions**

### **How to Open Console:**

**Chrome/Edge:**
- Windows: Press `F12` or `Ctrl+Shift+I`
- Mac: Press `Cmd+Option+I`

**Firefox:**
- Windows: Press `F12` or `Ctrl+Shift+K`
- Mac: Press `Cmd+Option+K`

**Safari:**
- Enable Developer menu first (Preferences > Advanced > Show Develop menu)
- Press `Cmd+Option+C`

### **What to Look For:**

1. **Red error messages** - These are problems
2. **Console.log messages** - These show what's happening:
   - "No user logged in" = Not logged in
   - "User logged in: [user_id]" = Logged in successfully
   - "Manage Schedule clicked" = Button working
   - "Edit instructions clicked" = Edit button working

3. **Network errors** - Failed API calls (usually red in Network tab)

---

## **Testing: Make Sure It Works**

### **Test 1: Basic Login**
1. Open the app
2. You should see a login screen OR be already logged in
3. If login screen: Sign up or log in
4. After login, you should see the main app

### **Test 2: Navigate to Schedule**
1. Click "Military Command" in the left sidebar
2. Scroll down to see the daily schedule
3. You should see time blocks (Wake Up, Meditation, etc.)

### **Test 3: Manage Schedule Mode**
1. Find the red "Manage Schedule" button (top-right of schedule)
2. Click it
3. Button should change to "Done Editing"
4. Red box should appear with "Add New Time Block"
5. Click "Done Editing" to turn off manage mode

### **Test 4: Edit Instructions**
1. Find any schedule block
2. Click the pencil icon (✏️)
3. A modal should open
4. You should see fields for Title, Description, Declarations, Checklist
5. Click the X or Cancel to close

### **Test 5: Edit Schedule Block**
1. Turn ON manage mode (click "Manage Schedule")
2. Find any schedule block
3. Click the clock icon (🕐)
4. A modal should open
5. You should see fields for Block ID, Activity, Times, etc.
6. Click Cancel to close

### **Test 6: Add New Block**
1. Turn ON manage mode
2. Click "Add New Time Block" in the red box
3. Modal should open
4. Fill in:
   - Block ID: test_block
   - Activity: Test Activity
   - Start Time: 15:00
   - End Time: 16:00
5. Click "SAVE BLOCK"
6. Toast should say "Schedule block created"
7. New block should appear in your schedule

**If all 6 tests pass, the system works!**

---

## **Still Having Issues?**

If you've tried everything and it still doesn't work:

### **Information to Provide:**

1. **Are you logged in?** Yes/No
2. **Which view are you in?** (Dashboard, Military Command, etc.)
3. **Do you see the "Manage Schedule" button?** Yes/No
4. **What happens when you click it?** (Nothing, error, works, etc.)
5. **Browser & version** (Chrome 120, Firefox 121, etc.)
6. **Console errors** (Copy/paste any red error messages)
7. **Screenshot** of the schedule page

### **Console Logs to Check:**

Look for these specific messages:
- `"No user logged in"` - You need to log in
- `"User logged in: ..."` - You're logged in (good!)
- `"Custom blocks loaded: N"` - How many custom blocks you have
- `"Manage Schedule clicked"` - Button is working
- `"Edit instructions clicked"` - Edit button working
- Any ERROR messages in red

---

## **Quick Fixes to Try First**

Before digging deep, try these:

1. **Hard Refresh:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear Cache:** Browser Settings > Clear browsing data > Cached files
3. **Try Incognito/Private Mode:** Rules out extension issues
4. **Different Browser:** Try Chrome if you're using Firefox, etc.
5. **Check Internet:** Make sure you're online
6. **Logout/Login:** Sign out completely, then sign back in

---

## **Expected Behavior (What SHOULD Happen)**

### **When Logged Out:**
- See yellow warning: "You must be logged in"
- "Manage Schedule" button says "Login Required"
- Clicking edit icons shows error toast
- Can VIEW schedule but can't EDIT

### **When Logged In:**
- NO yellow warning
- RED "Manage Schedule" button (pulsing)
- Clicking it enables manage mode
- All edit buttons work
- Modals open when clicked
- Changes save successfully

---

**If you follow this guide and still can't edit, there's a specific bug we need to identify. Provide the information requested above and we'll debug it!**
