import { ref, get, set } from "firebase/database";


export const getData = async (database, path) => {
  try {
    const dataRef = ref(database, path);
    const snapshot = await get(dataRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error getting data:", error);
    return null;
  }
};


export const updateData = async (database, path, data) => {
  try {
    const dataRef = ref(database, path);
    await set(dataRef, data);
    console.log(`${path} data updated successfully`);
  } catch (error) {
    console.error(`Error updating ${path} data:`, error);
  }
};
