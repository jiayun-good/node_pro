import dotenv from 'dotenv';
dotenv.config();

// Mock console.log to reduce noise in tests
const originalConsole = console;
global.console = {
  ...originalConsole,
  log: () => {},
  info: () => {},
  debug: () => {},
};