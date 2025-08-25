import { defineStore } from 'pinia'
import { saveChat, getChats, getChat, saveMessage, getMessages } from '@/services/database.js'
//import { getAnswer } from '@/utils/answerEngine.js'
import { ask } from '@/services/api.js'


const uid = () => crypto.randomUUID()

function titleFrom(text) {
  const t = (text || '').trim().replace(/\s+/g, ' ')
  if (!t) return 'New chat'
  const s = t.slice(0, 40)
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    chats: [],          // [{ id, title, createdAt, updatedAt }]
    messages: {}        // { [chatId]: [ {key, chatId, role, text, ts}, ... ] }
  }),

  getters: {//gettsr is predefined in pinia
    chatById: (s) => (id) => s.chats.find(c => c.id === id) || null,
    chatsSorted: (s) => [...s.chats].sort((a,b) => (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt)),
  },

  actions: {
    // Sidebar boot
    async loadChats() {
      this.chats = await getChats()
    },

    // Create a brand new chat and put it at the top of the sidebar
    async createChat(title = 'New chat') {
      const id = uid()
      const now = Date.now()
      const chat = { id, title, createdAt: now, updatedAt: now }
      await saveChat(chat)
      this.chats.unshift(chat)   // appears immediately at top
      this.messages[id] = []
      return id
    },

    // Ensure the chat exists (used when route opens a chat directly)
    async ensureChat(id) {
      let chat = await getChat(id)
      if (!chat) {
        const now = Date.now()
        chat = { id, title: 'New chat', createdAt: now, updatedAt: now }
        await saveChat(chat)
      }
      // make sure it’s in the in-memory list
      if (!this.chats.find(c => c.id === chat.id)) {
        this.chats.unshift(chat)
      }
      return chat
    },

    async loadMessages(id) {
      this.messages[id] = await getMessages(id)
    },

    // Auto-title from the first user message (only if it's "New chat")
    async maybeAutoTitle(id, text) {
      const chat = this.chatById(id)
      if (!chat) return
      if (!chat.title || /^new chat$/i.test(chat.title)) {
        chat.title = titleFrom(text)
        chat.updatedAt = Date.now()
        await saveChat(chat)
      }
    },

    // Send a message and append the bot reply
    async send(id, text) {
      const now = Date.now()
      const user = { key: uid(), chatId: id, role: 'user', text, ts: now }
      await saveMessage(user)

      const botText = await ask(text)
      const bot  = { key: uid(), chatId: id, role: 'bot', text: botText, ts: Date.now() }
      await saveMessage(bot)

      if (!this.messages[id]) this.messages[id] = []
      this.messages[id].push(user, bot)

      // bump chat "updatedAt" so it moves to top of sidebar sort
      const chat = this.chatById(id)
      if (chat) {
        chat.updatedAt = Date.now()
        await saveChat(chat)
      }

      // name the chat if needed
      await this.maybeAutoTitle(id, text)
    },

    async updateChatTitle(id, title) {
      const chat = this.chatById(id)
      if (!chat) return
      chat.title = title.trim() || chat.title
      chat.updatedAt = Date.now()
      await saveChat(chat)
    },

    // Optional: delete (only in-memory here unless you have a delete API)
    async deleteChat(id) {
      this.chats = this.chats.filter(c => c.id !== id)
      delete this.messages[id]
      // If you have a removeChat(id) in services/db.js, call it here.
    }
  }
})