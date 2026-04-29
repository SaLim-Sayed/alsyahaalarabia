import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@cache:';

export const cache = {
  async set(key: string, value: any, ttl = 1000 * 60 * 60 * 24) { // Default 24 hours
    const item = {
      value,
      expiry: Date.now() + ttl,
    };
    await AsyncStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
  },

  async get(key: string) {
    const data = await AsyncStorage.getItem(CACHE_PREFIX + key);
    if (!data) return null;

    try {
      const item = JSON.parse(data);
      if (Date.now() > item.expiry) {
        await AsyncStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }
      return item.value;
    } catch (e) {
      return null;
    }
  },

  async remove(key: string) {
    await AsyncStorage.removeItem(CACHE_PREFIX + key);
  },
};
