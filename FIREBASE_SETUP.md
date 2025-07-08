# Firebase Setup Guide for Mobile Store App

## 🚀 Quick Setup Steps

### 1. Enable Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `mobilestore-fc956`
3. Click **Authentication** in the left sidebar
4. Click the **Sign-in method** tab
5. Find **Email/Password** in the providers list
6. Click on it and toggle **Enable** to ON
7. Click **Save**

### 2. Set up Firestore Database

1. In Firebase Console, click **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location close to you
5. Click **Done**

### 3. Configure Firestore Security Rules

In the Firestore console:
1. Go to the **Rules** tab
2. Replace the default rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read phones
    match /phones/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow authenticated users to manage their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

### 4. Test the Setup

After completing the above steps:

1. **Refresh your app** (the page should reload automatically)
2. Try **Sign Up** with a new account
3. **Log in** with your credentials
4. Access the **Admin Panel** to add/edit phones
5. The "Demo Mode" banner should disappear

## 🔍 Troubleshooting

If you still see issues:

1. **Check Browser Console**: Open Developer Tools (F12) and look for any Firebase errors
2. **Verify Project ID**: Make sure you're in the correct Firebase project
3. **Clear Browser Cache**: Sometimes cached data can cause issues
4. **Check Network**: Ensure you have internet connectivity

## ✅ Success Indicators

You'll know it's working when:
- No "Demo Mode" banner appears
- You can sign up/login successfully
- Admin panel shows "Firebase (Full CRUD)" instead of "Local Data (Read-only)"
- You can add/edit/delete phones in the admin panel

## 📞 Need Help?

If you encounter any issues, check the browser console for specific error messages and let me know what you see!