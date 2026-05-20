import * as FileSystem from "expo-file-system/legacy";

export async function exportDatabase(): Promise<string> {
  // expo-sqlite stores DB in different locations per platform; common path used by SQLite on Android/iOS
  const dbName = "fudiobite.db";
  const dest = FileSystem.documentDirectory + dbName;
  try {
    const src = FileSystem.documentDirectory + "SQLite/" + dbName; // common Expo path
    // if src exists, copy; otherwise, still return expected dest
    const info = await FileSystem.getInfoAsync(src);
    if (info.exists) {
      await FileSystem.copyAsync({ from: src, to: dest });
      return dest;
    }
    return src;
  } catch (e) {
    throw e;
  }
}
