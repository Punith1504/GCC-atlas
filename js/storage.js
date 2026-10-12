// GCC Atlas - Resilient Local Storage Manager
// Handles quota errors, corrupt JSON, disabled cookies, and multi-tab synchronization gracefully.

(function (window) {
  'use strict';

  const STORAGE_KEY = 'gcc_atlas_shortlist';
  const listeners = new Set();
  let memoryFallback = [];
  let storageAvailable = true;

  // Test localStorage availability
  try {
    const testKey = '__gcc_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    storageAvailable = true;
  } catch (e) {
    console.warn('[GCC Atlas] localStorage unavailable, falling back to in-memory state.', e);
    storageAvailable = false;
  }

  function readStoredIds() {
    if (!storageAvailable) {
      return [...memoryFallback];
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(id => typeof id === 'string');
      }
      console.warn('[GCC Atlas] Stored shortlist was not an array; resetting.');
      writeStoredIds([]);
      return [];
    } catch (e) {
      console.warn('[GCC Atlas] Corrupt localStorage data detected; resetting to empty.', e);
      writeStoredIds([]);
      return [];
    }
  }

  function writeStoredIds(ids) {
    const cleanIds = Array.from(new Set(ids.filter(id => typeof id === 'string')));
    if (!storageAvailable) {
      memoryFallback = cleanIds;
      notifyListeners(cleanIds);
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanIds));
    } catch (e) {
      console.warn('[GCC Atlas] Failed writing to localStorage; using memory fallback.', e);
      memoryFallback = cleanIds;
    }
    notifyListeners(cleanIds);
  }

  function notifyListeners(ids) {
    listeners.forEach(fn => {
      try {
        fn(ids);
      } catch (err) {
        console.error('[GCC Atlas] Error in storage listener:', err);
      }
    });
  }

  // Window storage event for multi-tab sync
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      notifyListeners(readStoredIds());
    }
  });

  window.GCC_STORAGE = {
    getShortlistIds() {
      return readStoredIds();
    },

    isSaved(companyId) {
      if (!companyId) return false;
      const ids = readStoredIds();
      return ids.includes(companyId);
    },

    add(companyId) {
      if (!companyId) return;
      const ids = readStoredIds();
      if (!ids.includes(companyId)) {
        ids.push(companyId);
        writeStoredIds(ids);
      }
    },

    remove(companyId) {
      if (!companyId) return;
      const ids = readStoredIds().filter(id => id !== companyId);
      writeStoredIds(ids);
    },

    toggleSave(companyId) {
      if (!companyId) return false;
      const ids = readStoredIds();
      const index = ids.indexOf(companyId);
      let isNowSaved = false;
      if (index === -1) {
        ids.push(companyId);
        isNowSaved = true;
      } else {
        ids.splice(index, 1);
        isNowSaved = false;
      }
      writeStoredIds(ids);
      return isNowSaved;
    },

    clearShortlist() {
      writeStoredIds([]);
    },

    subscribe(callback) {
      listeners.add(callback);
      // Immediately call with current IDs
      callback(readStoredIds());
      return () => listeners.delete(callback);
    }
  };
})(window);
