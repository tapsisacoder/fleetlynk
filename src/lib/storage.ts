// Simple storage abstraction using localStorage
// In production, this would connect to a real backend

class StorageManager {
  private prefix = "fleetlynk_";

  async set(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(this.prefix + key, value);
    } catch (error) {
      console.error("Storage set error:", error);
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(this.prefix + key);
    } catch (error) {
      console.error("Storage get error:", error);
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
      console.error("Storage list error:", error);
      return [];
    }
  }

  async delete(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error("Storage delete error:", error);
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
