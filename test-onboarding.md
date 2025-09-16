# Onboarding Flow Test

## Steps to Test

1. **Clear localStorage** (if testing again):
   ```javascript
   localStorage.clear();
   ```

2. **Start the servers**:
   ```bash
   # Terminal 1 - Backend
   cd Backend
   npm start
   
   # Terminal 2 - Frontend  
   cd Frontend
   npm run dev
   ```

3. **Test the onboarding flow**:
   - Open browser to `http://localhost:5173`
   - Should see onboarding page
   - Fill out the 3 steps:
     - Step 1: Phone number (e.g., `1234567890`)
     - Step 2: Email (e.g., `test@example.com`)
     - Step 3: City, Locality, Full Address
   - Click "Complete"
   - Should see "Welcome!" toast
   - Should automatically navigate to home page

4. **Check console logs**:
   - Should see logs like:
     ```
     Starting onboarding completion with data: {...}
     Data saved to Google Sheets successfully
     Profile saved to localStorage: {...}
     Calling onComplete with data: {...}
     Onboarding completed with data: {...}
     App: isOnboardingCompleted changed to: true
     App: Showing main app, isOnboardingCompleted: true
     ```

5. **Verify data in Google Sheets**:
   - Check the "Users Info" sheet
   - Should see the new user data with "Alerts" column set to "green"

6. **Test logout and re-onboarding**:
   - Go to Settings page
   - Click "Logout & Switch User"
   - Should redirect to onboarding
   - Complete onboarding with different data
   - Should work again

## Expected Behavior

- ✅ Onboarding saves data to Google Sheets
- ✅ Onboarding saves data to localStorage
- ✅ App automatically shows home page after completion
- ✅ Alert monitoring starts for the user
- ✅ Logout clears data and allows re-onboarding

## Debugging

If onboarding doesn't navigate to home page:

1. Check browser console for errors
2. Check localStorage:
   ```javascript
   console.log('onboardingCompleted:', localStorage.getItem('onboardingCompleted'));
   console.log('userProfile:', localStorage.getItem('userProfile'));
   ```
3. Check backend logs for Google Sheets errors
4. Verify backend server is running on port 4000
