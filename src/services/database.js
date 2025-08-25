// deep clone helper
// to avoid shared references in the store
// simple way to clone the objects
// for more complex cases, consider using libraries like lodash or immer
const clone = (x) => JSON.parse(JSON.stringify(x))

//localstorage
const LS_CHATS = 'chats'
const LS_MSGS  = 'msgs'

const load = (k) => JSON.parse(localStorage.getItem(k) || 'null')
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v))
//k for key, v for value
export async function getChats() {
  const arr = load(LS_CHATS) || []
  // return deep copies to avoid shared references in the store
  return clone(arr)
}

//get the chat by id
export async function getChat(id) {
  const arr = load(LS_CHATS) || []
  const item = arr.find(c => c.id === id) || null
  return item ? clone(item) : null
}
//save chat, and make new one
export async function saveChat(chat) {
  const arr = load(LS_CHATS) || []
  const i = arr.findIndex(c => c.id === chat.id)
  const payload = clone(chat)
  if (i === -1) arr.unshift(payload)
    //if chat exist, then update it
  else arr[i] = payload
  save(LS_CHATS, arr)
  return payload
}

export async function getMessages(chatId) {
  const map = load(LS_MSGS) || {}
  //return deep copies to avoid sharing same references
  return clone(map[chatId] || [])
}//chatId for messages

export async function saveMessage(msg) {
  const map = load(LS_MSGS) || {}
  const curr = map[msg.chatId] || []
  curr.push(clone(msg))
  map[msg.chatId] = curr
  //curr for current
  save(LS_MSGS, map)
  //return all saved messages
}