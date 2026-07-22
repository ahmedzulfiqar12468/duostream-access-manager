# DuoStream Access Manager - Installation & Quick Start

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
npm run install:all
```

### Step 2: Start Host PC Application

On your Host PC:

```bash
npm run start:host
```

The Host PC application will open at `http://localhost:3001`

### Step 3: Start Relay PC Application

On your Relay PC:

```bash
npm run start:relay
```

The Relay PC application will open at `http://localhost:3002`

## 🔧 Initial Configuration

### Host PC (Do this first!)

1. **Go to Settings**
2. **Set Master Password**
   - Enter a strong password (min 8 characters)
   - This is required for Relay PCs to authenticate
   - Save the password securely
3. **Set Max Concurrent Users** (recommended: 5)

### Relay PC

1. **Go to Host Connection**
2. **Enter Host PC Details**
   - Host IP: Your Host PC's Tailscale IP (e.g., 100.x.x.x)
   - Port: 3001 (default)
   - Master Password: From Host PC settings
   - Relay Name: Give it a name (e.g., "Living Room PC")
3. **Click Connect**

## 📋 Create Your First Client

### On Relay PC:

1. **Go to Clients**
2. **Click "Add Client"**
3. **Enter Account Name** (e.g., "John's Gaming")
4. **Click "Create Client"**
5. **Copy the Access Token** - Share this with your client

### Manage Time Limits:

1. **Go to Clients**
2. **Click "Manage" on a client**
3. **Set Time Limits:**
   - Daily: 480 minutes (8 hours)
   - Weekly: 2400 minutes (40 hours)
   - Monthly: 10080 minutes (168 hours)
4. **Add Schedules** (Optional)
   - Restrict access to specific days/times
   - Example: Monday-Friday, 3 PM - 10 PM
5. **Save**

## 🎯 Features Overview

### Host PC Features
- ✅ Password-protected authentication
- ✅ Real-time session monitoring
- ✅ User time tracking
- ✅ Auto-logout when time expires
- ✅ Concurrent user limits

### Relay PC Features
- ✅ Secure token-based access
- ✅ Flexible time limit management
- ✅ Schedule-based access control
- ✅ Client approval workflow
- ✅ Real-time usage tracking

## 📱 Modern UI Features

- 🌙 Dark mode by default (toggle in sidebar)
- 📱 Responsive design (works on different screen sizes)
- ⚡ Real-time updates via Socket.io
- 🎨 Beautiful Tailwind CSS styling
- 🎯 Intuitive navigation and controls

## 🔐 Security Tips

1. Use strong master passwords
2. Change passwords regularly
3. Only share tokens with trusted clients
4. Monitor active sessions
5. Set appropriate time limits
6. Use Tailscale's ACL settings

## 📊 Dashboard Overview

### Host PC Dashboard shows:
- Connected Relay PCs count
- Active Sessions count
- Total Accounts
- System Health Status

### Relay PC Dashboard shows:
- Total Clients
- Approved Clients
- Active Sessions
- Pending Approvals

## ⚙️ System Requirements

- Windows 10+ / macOS 10.13+ / Linux (Ubuntu 18.04+)
- Node.js 16+
- 2GB RAM minimum
- Stable internet connection
- Tailscale installed and running

## 🆘 Common Issues

**Issue**: Relay PC can't connect to Host PC
- Check Host PC is running on correct IP/port
- Verify master password is correct
- Check Tailscale connectivity

**Issue**: Time tracking not working
- Verify system time is correct
- Restart both applications
- Check database file permissions

**Issue**: GUI looks broken
- Clear browser cache (Ctrl+Shift+Delete)
- Restart application
- Update Electron: `npm install --save electron@latest`

## 📚 Documentation

For detailed setup and configuration, see [SETUP.md](./SETUP.md)

## 🎉 You're All Set!

Your DuoStream Access Management system is now ready to use. Start managing client access with time limits and schedules!

**Next Steps:**
1. Create accounts on Host PC
2. Connect Relay PC to Host PC
3. Create clients on Relay PC
4. Set time limits and schedules
5. Share access tokens with clients

Enjoy! 🚀
