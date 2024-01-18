import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";
function App() {
  const handleSetCookie = () => {
    document.cookie = "myCookie=myValue; samesite=None; secure";
  };
  const getCookie = () => {
    console.log(document.cookie);
  };

  const getIndexDb = (db) => {
    const openRequest = indexedDB.open("myDatabase", 2);
    openRequest.onsuccess = (e) => {
      const db = e.target.result;
      const transaction = db.transaction(["customers"], "readonly");
      const objectStore = transaction.objectStore("customers");
      const getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = function (event) {
        console.log(event.target.result);
      };

      getAllRequest.onerror = function (event) {
        console.error("Error fetching data:", event.target.error);
      };
    };
  };

  const setIndexDb = () => {
    const newItem = { ssn: "1", name: "New Item", description: "Description" };

    const request = indexedDB.open("myDatabase", 2);

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
      <p>app2</p>
      <button onClick={handleSetCookie}>setCookie</button>
      <button onClick={getCookie}>getCookie</button>
      <button onClick={setIndexDb}>setIndexDb</button>
      <button onClick={getIndexDb}>getIndexDb</button>
    </div>
  );
}

export default App;
