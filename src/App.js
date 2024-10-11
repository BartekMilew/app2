import { useState } from "react";
import "./App.css";
function App() {
  const [dbIndex, setDbIndex] = useState(1);
  const getIndexDb = (indexDB) => {
    const openRequest = indexedDB.open(indexDB, 1);
    openRequest.onsuccess = (e) => {
      const db = e.target.result;
      const transaction = db.transaction(["customers"], "readonly");
      const objectStore = transaction.objectStore("customers");
      const getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = function (event) {
        alert(`dbIndex:${dbIndex}`);
        console.log(event.target.result);
      };

      getAllRequest.onerror = function (event) {
        console.error("Error fetching data:", event.target.error);
      };
    };
  };

  const setIndexDb = (indexDB) => {
    const newItem = { ssn: "1", name: "New Item", description: "Description" };

    const request = indexedDB.open(indexDB, 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      const objectStore = db.createObjectStore("customers", {
        keyPath: "ssn",
      });
      objectStore.createIndex("name", "name", { unique: false });
      objectStore.createIndex("description", "description", { unique: false });
      objectStore.transaction.oncomplete = (event) => {
        const customerObjectStore = db
          .transaction("customers", "readwrite")
          .objectStore("customers");
        customerObjectStore.add(newItem);
      };
    };
  };

  return (
    <div className="App">
      <p>indexDB</p>
      <input
        type="text"
        value={dbIndex}
        onChange={(e) => setDbIndex(e.target.value)}
      />
      <button onClick={() => setIndexDb(dbIndex)}>setIndexDb_</button>
      <button onClick={() => getIndexDb(dbIndex)}>getIndexDb_</button>
    </div>
  );
}

export default App;
