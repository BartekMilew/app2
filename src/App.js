import "./App.css";
function App() {
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
      <p>App2 - updated ver2</p>

      <button onClick={setIndexDb}>setIndexDb</button>
      <button onClick={getIndexDb}>getIndexDb</button>
      <button onClick={() => localStorage.setItem("user", "one")}>
        setoLocal
      </button>
      <button onClick={() => console.log(localStorage.getItem("user"))}>
        getLocalstorage
      </button>
    </div>
  );
}

export default App;
