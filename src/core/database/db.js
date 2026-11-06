const DB_NAME = 'abc-electronics'
const DB_VERSION = 1

export const STORES = {
  CHAT_MESSAGES: 'chatMessages',
}

let connection = null

function openDatabase() {
  if (connection) return connection

  connection = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      // 자동 증가 키를 쓰므로 getAll()이 저장한 순서대로 돌려준다.
      request.result.createObjectStore(STORES.CHAT_MESSAGES, {
        keyPath: 'seq',
        autoIncrement: true,
      })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  }).catch((error) => {
    connection = null
    throw error
  })

  return connection
}

export async function runInStore(storeName, mode, operation) {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, mode)
    const request = operation(transaction.objectStore(storeName))

    transaction.oncomplete = () => resolve(request.result)
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)
  })
}
