<template>
  <div class="sidebar">
    <!-- Top: Brand + New chat -->
    <div class="top">
      <h1 class="brand">CHAT A.I+</h1>

      <button class="new-btn" @click="createNew">
        <span>+ New chat</span>
      </button>
    </div>

    <!-- Scrollable chat list -->
    <div class="lists">
      <p class="section-title">Your conversations</p>

      <div v-if="allChats.length" class="chat-list">
        <div
          v-for="c in allChats"
          :key="c.id"
          :class="['chat-item', { active: c.id === activeId }]"
          @click="open(c.id)"
        >
          <span class="chat-title">{{ c.title || 'New chat' }}</span>
          <img
            class="delete-icon"
            :src="deleteIcon"
            alt="Delete"
            title="Delete chat"
            @click.stop="remove(c.id)"
          />
        </div>
      </div>
    </div>

    <!-- Bottom: settings + profile -->
    <div class="bottom">
      <button class="card" type="button">
        <img class="card-icon" :src="settingsIcon" alt="Settings" />
        <span class="card-text">Settings</span>
      </button>

      <div class="card">
        <img class="avatar" :src="avatarIcon" alt="Profile" />
        <span class="card-text">Andrew Neilson</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useChatStore } from '@/store/chat.js'

// images
import settingsIcon from '@/assets/images/settings.png'
import avatarIcon from '@/assets/images/user-icon.png'
import deleteIcon from '@/assets/images/delete-icon.png'

const router = useRouter()
const route = useRoute()
const store = useChatStore()

onMounted(() => {
  store.loadChats()
})

const activeId = computed(() => route.params.id ?? null)

// sorting logic (first by updatedAt, then createdAt)
const allChats = computed(() =>
  [...store.chats].sort(
    (a, b) =>
      (b.updatedAt ?? b.createdAt ?? 0) - (a.updatedAt ?? a.createdAt ?? 0)
  )
)

async function createNew() {
  const id = await store.createChat('New chat')
  router.push(`/chats/${id}`)
}

function open(id) {
  router.push(`/chats/${id}`)
}

async function remove(id) {
  await store.deleteChat(id)
  if (activeId.value === id) {
    const next = store.chats[0]?.id
    router.push(next ? `/chats/${next}` : '/chats')
  }
}
</script>

<style scoped lang="scss">
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 22rem;
  background: #ffffff;
  border-right: 1px solid #eceff3;
  padding: 1rem;
  box-sizing: border-box;
}

.top {
  display: flex;
  align-items: center;
  gap: .8rem;
  margin-bottom: 1rem;
}

.brand {
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0;
  color: #0f172a;
  flex: 1;
}

.new-btn {
  background: #5b4df2;
  color: #fff;
  border: none;
  border-radius: .9rem;
  padding: .7rem 1rem;
  font-size: .95rem;
  cursor: pointer;
}

.lists {
  flex: 1;
  overflow: auto;
  padding-right: .25rem;
}

.section-title {
  font-size: 1rem;
  color: #6b7280;
  margin: .75rem 0 .5rem;
}

.divider {
  height: 1px;
  background: #e8ebf1;
  margin: 1rem 0 .25rem;
}

.chat-list {
  display: flex;
  flex-direction: column;
  gap: .2rem;
}

.chat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 2.6rem;
  border-radius: .9rem;
  padding: .6rem .9rem;
  color: #0f172a;
}

.chat-item:hover {
  background: #eef1ff;
  cursor: pointer;
}

.chat-item.active {
  background: #e8ecff;
}

.chat-title {
  flex: 1;
  font-size: 1.05rem;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.delete-icon {
  width: 1.2rem;
  height: 1.2rem;
  opacity: .65;
  margin-left: .6rem;
  cursor: pointer;
}

.delete-icon:hover {
  opacity: 1;
}

.muted {
  color: #9aa1ad;
  font-size: .95rem;
  margin: .25rem 0 0 .2rem;
}

.bottom {
  border-top: 1px solid #f6f6f6;
  padding-top: .9rem;
  display: flex;
  flex-direction: column;
  gap: .5rem;
}

.card {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  background: #fff;
  border: 1px solid #eceff3;
  border-radius: 1rem;
  padding: .8rem 1rem;
}

.card-text {
  color: #0f172a;
  font-size: 1rem;
}

.card-icon {
  width: 1.4rem;
  height: 1.4rem;
}

.avatar {
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  object-fit: cover;
}
</style>
