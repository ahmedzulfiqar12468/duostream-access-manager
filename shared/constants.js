// Shared constants between Host and Relay PC applications

const SOCKET_EVENTS = {
  // Connection events
  RELAY_CONNECT: 'relay:connect',
  RELAY_DISCONNECT: 'relay:disconnect',
  RELAY_AUTHENTICATE: 'relay:authenticate',
  AUTH_SUCCESS: 'auth:success',
  AUTH_FAILED: 'auth:failed',
  
  // Client management
  CLIENT_REQUEST: 'client:request',
  CLIENT_APPROVE: 'client:approve',
  CLIENT_REJECT: 'client:reject',
  CLIENT_REVOKE: 'client:revoke',
  CLIENT_LIST: 'client:list',
  
  // Time management
  TIME_UPDATE: 'time:update',
  TIME_LIMIT_SET: 'time:limit:set',
  TIME_LIMIT_GET: 'time:limit:get',
  TIME_REMAINING: 'time:remaining',
  
  // Session management
  SESSION_START: 'session:start',
  SESSION_END: 'session:end',
  SESSION_LIST: 'session:list',
  SESSION_LOGOUT: 'session:logout',
  
  // Account management
  ACCOUNT_CREATE: 'account:create',
  ACCOUNT_UPDATE: 'account:update',
  ACCOUNT_DELETE: 'account:delete',
  ACCOUNT_LIST: 'account:list',
  
  // Schedule management
  SCHEDULE_SET: 'schedule:set',
  SCHEDULE_GET: 'schedule:get',
  SCHEDULE_UPDATE: 'schedule:update',
  
  // Concurrent user limits
  CONCURRENT_LIMIT_SET: 'concurrent:limit:set',
  CONCURRENT_LIMIT_GET: 'concurrent:limit:get',
  CONCURRENT_CHECK: 'concurrent:check',
  
  // Status
  STATUS_UPDATE: 'status:update',
  HEALTH_CHECK: 'health:check'
};

const TIME_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
};

const DEFAULT_PORTS = {
  HOST_PC: 3001,
  RELAY_PC: 3002
};

const CLIENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REVOKED: 'revoked',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  TIMEOUT: 'timeout'
};

const SESSION_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  TIMEOUT: 'timeout',
  LOGGED_OUT: 'logged_out'
};

module.exports = {
  SOCKET_EVENTS,
  TIME_TYPES,
  DEFAULT_PORTS,
  CLIENT_STATUS,
  SESSION_STATUS
};
