// Simple storage abstraction using localStorage
// In production, this would connect to a real backend

class StorageManager {
  private prefix = "lynkfleet_";

  async set(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(this.prefix + key, value);
    } catch (error) {
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(this.prefix + key);
    } catch (error) {
      return null;
    }
  }

  async list(prefix: string): Promise<string[]> {
    try {
      const keys: string[] = [];
      const fullPrefix = this.prefix + prefix;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(fullPrefix)) {
          keys.push(key);
        }
      }
      
      return keys;
    } catch (error) {
      return [];
    }
  }

  async delete(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      throw error;
    }
  }
}

// Make it globally available
declare global {
  interface Window {
    storage: StorageManager;
  }
}

export const storage = new StorageManager();
window.storage = storage;
