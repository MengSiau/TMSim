import { Edge, Node } from "@xyflow/react";

let request: IDBOpenDBRequest;
let db: IDBDatabase;
let version = 1;
export const DB_NAME = "turingDB";

export interface Machine {
  id: string;
  nodes: Node[];
  edges: Edge[];
}

export interface Tape {
  id: string;
  contents: string[];
}

export enum Stores {
  Machines = "machines",
  Tapes = "tapes",
}

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(Stores.Machines)) {
        db.createObjectStore(Stores.Machines, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(Stores.Tapes)) {
        db.createObjectStore(Stores.Tapes, { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      resolve(true);
    };

    request.onerror = () => {
      reject(new Error("Failed to open the database"));
    };
  });
};

export const addData = <T>(
  storeName: string,
  data: T
): Promise<T | string | null> => {
  return new Promise((resolve) => {
    request = indexedDB.open(DB_NAME, version);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      store.add(data);
      resolve(data);
    };

    request.onerror = () => {
      const error = request.error?.message;
      if (error) {
        resolve(error);
      } else {
        resolve("Unknown error");
      }
    };
  });
};

export const getStoreData = <T>(storeName: Stores): Promise<T[]> => {
  return new Promise((resolve) => {
    request = indexedDB.open(DB_NAME);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const res = store.getAll();
      res.onsuccess = () => {
        resolve(res.result);
      };
    };
  });
};

export const saveTape = async (id: string, contents: string[]) => {
  try {
    await addData(Stores.Tapes, { id, contents });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error("Something went wrong");
    }
  }
};

// Save machine to database
export const saveMachine = async (id: string, nodes: Node[], edges: Edge[]) => {
  try {
    await addData(Stores.Machines, { id, nodes, edges });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error("Something went wrong");
    }
  }
};

// Delete machine from database
export const deleteMachine = async (id: string) => {
  try {
    request = indexedDB.open(DB_NAME, version);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(Stores.Machines, "readwrite");
      const store = tx.objectStore(Stores.Machines);
      store.delete(id);
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error("Something went wrong with delete");
    }
  }
};

// Delete tape from database
export const deleteTape = async (id: string) => {
  try {
    request = indexedDB.open(DB_NAME, version);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(Stores.Tapes, "readwrite");
      const store = tx.objectStore(Stores.Tapes);
      store.delete(id);
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error("Something went wrong with delete");
    }
  }
};
