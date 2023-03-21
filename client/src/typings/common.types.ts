export type BUTTON_STYLE = 'default' | 'add' | 'dismiss' | 'disabled';
export type BUTTON_SIZE = 'small' | 'medium' | 'big';

/**
 * The selected store mode by the user:
 * 
 * - online: the user is online and the app is connected to the server
 * - offline: the user is offline and the app is not connected to the server
 */
export type STORE_MODE = 'online' | 'offline' | 'error';

/**
 * The connection state of the app:
 * 
 * - connected: the app is connected to the server
 * - disconnected: the app is not connected to the server
 * - serverError: the app is connected to the server but the server is not responding
 */
export type CONNECTION_STATE = 'connected' | 'disconnected' | 'serverError';

/**
 * The sync status of the task.
 * 
 * - none: The task is not synced with the server.
 * - synced: The task is synced with the server.
 * - error: The task is not synced with the server.
 */
export type SYNC_STATUS = 'unsynced' | 'synced' | 'error';

export type THEME = 'dark' | 'light';