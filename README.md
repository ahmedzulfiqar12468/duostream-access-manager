# DuoStream Access Manager

A comprehensive access management system for DuoStream with Tailscale integration. Manage client tokens, time limits, connection schedules, and concurrent user limits across relay and host PCs.

## 📋 Features

### Host PC Application
- 🔐 Master password authentication for relay PC connections
- 👥 Manage DuoStream user accounts
- ⏱️ Monitor active sessions and user connections
- 🎛️ Control concurrent user limits
- 📊 Real-time analytics and monitoring
- 🔌 Accept connections from relay PC via Tailscale IP

### Relay PC Application
- 🔑 Generate and manage client access tokens
- ⏲️ Set daily, weekly, and monthly time limits per account
- 📅 Schedule allowed connection times
- 👤 Manage concurrent user access limits
- ⏳ Monitor and adjust remaining time
- 🚪 Auto-logout when time expires
- 📱 Modern, beautiful dark mode UI

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Tailscale installed and configured

### Installation & Running

```bash
# Clone and install dependencies
git clone https://github.com/ahmedzulfiqar12468/duostream-access-manager.git
cd duostream-access-manager
npm run install:all

# Start Host PC Application
npm run start:host

# Or start Relay PC Application
npm run start:relay
```

## 📁 Project Structure

```
duostream-access-manager/
├── apps/
│   ├── host-pc/                 # Host PC Application
│   │   ├── src/
│   │   │   ├── main.js          # Electron main process
│   │   │   ├── preload.js       # IPC bridge
│   │   │   ├── server.js        # Express & Socket.io server
│   │   │   ├── database.js      # SQLite database setup
│   │   │   ├── renderer/        # React frontend
│   │   │   │   ├── App.jsx
│   │   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   └── index.css
│   │   │   └── assets/
│   │   ├── public/
│   │   └── package.json
│   │
│   └── relay-pc/                # Relay PC Application
│       ├── src/
│       │   ├── main.js          # Electron main process
│       │   ├── preload.js       # IPC bridge
│       │   ├── server.js        # Express & Socket.io client
│       │   ├── database.js      # SQLite database setup
│       │   ├── renderer/        # React frontend
│       │   │   ├── App.jsx
│       │   │   ├── components/
│       │   │   ├── pages/
│       │   │   └── index.css
│       │   └── assets/
│       ├── public/
│       └── package.json
│
├── shared/                      # Shared utilities
│   └── constants.js
│
└── package.json                 # Root package.json
```

## 🔐 Security Features

- Password-protected relay PC connections
- bcryptjs for password hashing
- Socket.io authentication
- Token-based client access
- Time-based access control
- Session management

## 🎨 UI/UX

- Built with React and Tailwind CSS
- Shadcn/ui components for modern design
- Dark mode support
- Real-time updates via Socket.io
- Responsive design
- Intuitive user interface

## 📡 Communication

- **Socket.io** for real-time bidirectional communication
- **Express** REST API for additional endpoints
- **Tailscale IP** for secure networking

## 📝 Configuration

Each application has its own configuration:
- Host PC: Set master password, manage accounts
- Relay PC: Configure host PC connection details

## 🛠️ Development

```bash
# Start Host PC in dev mode
npm run dev:host

# Start Relay PC in dev mode
npm run dev:relay
```

## 📦 Dependencies

- **electron** - Desktop app framework
- **electron-builder** - Build and package
- **react** - UI library
- **tailwindcss** - Utility-first CSS
- **shadcn/ui** - Beautiful components
- **express** - Web server
- **socket.io** - Real-time communication
- **sqlite3** - Database
- **bcryptjs** - Password hashing
- **axios** - HTTP client
- **uuid** - ID generation

## 🤝 Support

For issues or feature requests, please create an issue on GitHub.

## 📄 License

MIT

---

**Version:** 1.0.0  
**Author:** Your Name  
**Created:** 2024
