/* eslint-disable */
var DB_VERSION = 2;
var DB_NAME = "lpwa-messages";

var openDatabase = function() {
  return new Promise(function(resolve, reject) {
    if (!self.indexedDB) {
      reject("IndexedDB not supported");
    }

    var request = self.indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = function(event) {
      reject("Database error: " + event.target.error);
    };

    request.onupgradeneeded = function(event) {
      var db = event.target.result;
      var upgradeTransaction = event.target.transaction;
      var messagesStore;
      if (!db.objectStoreNames.contains("messages")) {
        messagesStore = db.createObjectStore("messages",
          { keyPath: "id" }
        );
      } else {
        messagesStore = upgradeTransaction.objectStore("messages");
      }

      if (!messagesStore.indexNames.contains("idx_status")) {
        messagesStore.createIndex("idx_status", "status", { unique: false });
      }  
    };

    request.onsuccess = function(event) {
      resolve(event.target.result);
    };
  });
}

var openObjectStore = function(db, storeName, transactionMode) {
  return db
  .transaction(storeName, transactionMode)
  .objectStore(storeName)
};

var addToObjectStore = function(storeName, object) {
  return new Promise(function(resolve, reject) {
    openDatabase().then(function(db) {
      openObjectStore(db, storeName, "readwrite")
        .add(object).onsuccess = resolve;
    }).catch(function(errorMessage) {
      reject(errorMessage);
    });
  });
};

var updateInObjectStore = function(storeName, id, object) {
  return new Promise(function(resolve, reject) {
    openDatabase()
      .then(function(db) {
        openObjectStore(db, storeName, "readwrite")
        .openCursor().onsuccess = function(event) {
          var cursor = event.target.result;
          console.log('cursor', cursor);
          if (!cursor) {
            reject("Message not found in object store");
          }
          if (cursor.value.id === id) {
            cursor.update(object).onsuccess = resolve;
            return;
          }
          cursor.continue();
        };
      }).catch(function(errorMessage) {
        reject(errorMessage);
      });  
  });
};

var getMessages = function(indexName, indexValue) {
  return new Promise(function(resolve) {
    openDatabase().then(function(db) {
      var objectStore = openObjectStore(db, "messages");
      var messages = [];
      var cursor;

      if (indexName && indexValue) {
        cursor = objectStore.index(indexName).openCursor(indexValue);
      } else {
        cursor = objectStore.openCursor();
      }

      cursor.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          messages.push(cursor.value);
          cursor.continue();
        } else {
          if (messages.length > 0) {
            resolve(messages);
          } else {
            getMessagesFromServer().then(function(messages) {
              openDatabase().then(function(db) {
                var objectStore = openObjectStore(db, "messages", "readwrite");
                for (var i = 0; i < messages.length; i++) {
                  objectStore.add(messages[i]);
                }
                resolve(messages);
              });
            });
          }
        }
      };      
    }).catch(function() {
      getMessagesFromServer().then(function(messages) {
        resolve(messages);
      });
    });
  });
};

var getMessagesFromServer = function() {
  return new Promise(function(resolve) {
    if (self.$) {
      $.getJSON("/messages.json", function(response) {
        var json = response;
        if (typeof json.status !== "undefined" && typeof json.data !== "undefined") {
          json = json.data;
        }

        resolve(json);
      });
    } else {
      fetch("/messages.json")
        .then(function(response) {
          var json = response.json();
          if (typeof json.status !== "undefined" && typeof json.data !== "undefined") {
            json = json.data;
          }

          return json;
        })
        .then(function(messages) {
          resolve(messages);
        });
    }
  });
};