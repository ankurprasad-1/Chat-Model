import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '@/components/ChatView.vue'

const routes = [
  { path: '/', redirect: '/chats' },
  // when an empty chat, shows a placeholder message
  { path: '/chats', component: { template: '<div class="empty">Create or pick a chat</div>' } },
  { path: '/chats/:id', name: 'chat', component: ChatView, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  //history creating a new history object
})

export default router