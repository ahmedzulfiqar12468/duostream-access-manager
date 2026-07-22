# DuoStream Access Manager - Setup Guide

## Prerequisites

- Node.js 16 or higher
- npm or yarn
- Tailscale installed and configured on both Host and Relay PCs

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/duostream-access-manager.git
cd duostream-access-manager
```

### 2. Install Dependencies

```bash
npm run install:all
```

This will install dependencies for the root project, Host PC, and Relay PC applications.

## Running the Applications

### Host PC Application

Run on the Host PC machine:

```bash
npm run start:host
```

This will launch the Host PC application on `http://localhost:3001`

### Relay PC Application

Run on the Relay PC machine:

```bash
npm run start:relay
```

This will launch the Relay PC application on `http://localhost:3002`

## Configuration

### Host PC Setup

1. **Set Master Password**
   - Go to Settings page
   - Set a strong master password (at least 8 characters)
   - This password will be used by Relay PCs to authenticate

2. **Configure Access Control**
   - Set the maximum number of concurrent users
   - This prevents too many simultaneous connections

3. **Create Accounts**
   - Go to Accounts page
   - Create DuoStream user accounts
   - These are the accounts clients will use

### Relay PC Setup

1. **Connect to Host PC**
   - Go to Host Connection page
   - Enter the Host PC's Tailscale IP address
   - Enter the master password from Host PC
   - Click "Connect to Host PC"

2. **Create Clients**
   - Go to Clients page
   - Click "Add Client" to create new client access tokens
   - Each client gets a unique token for authentication

3. **Configure Time Limits**
   - Click "Manage" on a client
   - Set daily, weekly, and monthly time limits (in minutes)
   - Example: 480 minutes = 8 hours per day

4. **Set Connection Schedules**
   - Add schedules to restrict when clients can connect
   - Example: Only allow Monday-Friday, 3 PM - 10 PM

## Features

### Host PC
- 🔐 Master password authentication
- 👥 Manage DuoStream accounts
- 📊 Monitor active sessions in real-time
- 🔌 Accept connections from multiple Relay PCs
- ⏱️ Track and manage user time limits
- 🚪 Force logout users when time expires

### Relay PC
- 🔑 Generate unique access tokens for clients
- ⏲️ Set daily, weekly, monthly time limits
- 📅 Create connection schedules by day/time
- 👤 Manage concurrent user limits
- ⏳ Monitor remaining time per client
- 🎛️ Adjust time limits dynamically

## API Endpoints

### Host PC (Port 3001)

```
GET /api/health - Check server status
GET /api/accounts - List all accounts
POST /api/accounts - Create new account
GET /api/sessions - List active sessions
GET /api/relay-connections - List connected relay PCs
```

### Relay PC (Port 3002)

```
GET /api/health - Check server status
GET /api/clients - List all clients
POST /api/clients - Create new client
GET /api/clients/:id - Get client details
PUT /api/clients/:id/time-limits - Update time limits
POST /api/clients/:id/schedule - Add schedule
GET /api/sessions - List active sessions
POST /api/sessions/:id/logout - Logout user
POST /api/connect-to-host - Connect to Host PC
```

## Socket.io Events

Real-time communication between Host and Relay PC:

- `relay:authenticate` - Relay PC authentication
- `auth:success` - Authentication successful
- `auth:failed` - Authentication failed
- `client:approve` - Approve new client
- `time:update` - Update time usage
- `session:start` - Session started
- `session:end` - Session ended
- `session:logout` - Force logout user

## Development

### Dev Mode

For development with hot-reload:

```bash
# Host PC
npm run dev:host

# Relay PC
npm run dev:relay
```

### Building

To build executables:

```bash
# Host PC
cd apps/host-pc
npm run build:win  # Windows
npm run build:mac  # macOS
npm run build:linux # Linux

# Relay PC
cd apps/relay-pc
npm run build:win  # Windows
npm run build:mac  # macOS
npm run build:linux # Linux
```

## Database

Both applications use SQLite databases stored locally:

- **Host PC**: `~/.config/duostream-host-pc/host-pc.db`
- **Relay PC**: `~/.config/duostream-relay-pc/relay-pc.db`

## Security Considerations

1. **Master Password**: Use a strong password with uppercase, lowercase, numbers, and symbols
2. **Tailscale Network**: Keep your Tailscale network secure and restricted
3. **Access Tokens**: Share tokens only with trusted clients
4. **Time Limits**: Set appropriate limits to prevent abuse
5. **HTTPS**: Consider adding SSL/TLS for production deployments

## Troubleshooting

### Host PC won't connect
- Check if Host PC is running and server is accessible
- Verify Tailscale IP address is correct
- Ensure master password is correct
- Check firewall settings

### Sessions not tracking time correctly
- Verify system time is synchronized on both PCs
- Check database permissions
- Restart both applications

### High memory usage
- Clear inactive sessions regularly
- Reduce logging level
- Restart application

## License

MIT License - See LICENSE file for details

## Support

For issues or questions, please create an issue on GitHub.
