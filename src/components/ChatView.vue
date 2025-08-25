<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useChatStore } from '@/store/chat.js'

// icons
import userIcon from '@/assets/images/user-icon.png'
import brainIcon from '@/assets/images/brain-icon.png'
import sendIcon from '@/assets/images/send-icon.png'
import editIcon from '@/assets/images/edit-icon.png'

const props = defineProps({
  id: { type: String, required: true }
})

const store = useChatStore()
// reactive state
const chat = computed(() => store.chatById(props.id))
const msgs = computed(() => store.messages[props.id] || [])

const text = ref('')
const scroller = ref(null)
// autoscroll to bottom when new messages
const autoscroll = async () => {
  await nextTick()
  if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight
}

onMounted(async () => {
  // chat exists to load messages
  await store.ensureChat(props.id)
  await store.loadMessages(props.id)
  autoscroll()
})

watch(() => msgs.value.length, () => autoscroll())
//send message function for automatic scrolling
const send = async () => {
  if (!text.value.trim()) return
  const t = text.value.trim()
  await store.send(props.id, t)
  text.value = ''
}

// chat title editing
const editing = ref(false)
const draft = ref('')
const title_edit = ref(null)

const beginEdit = async () => {
  editing.value = true
  draft.value = chat.value?.title ?? 'New chat'
  await nextTick()
  title_edit.value?.focus()
  title_edit.value?.select()
}

const commitEdit = async () => {
  if (!editing.value) return
  const t = draft.value.trim() || (chat.value?.title ?? 'Chat')
  await store.updateChatTitle(props.id, t)
  editing.value = false
}

const cancelEdit = () => { editing.value = false }
</script>

<template>
  <div class="page">
    <!-- header -->
    <div class="title-bar">
      <div class="title-wrap">
        <template v-if="!editing">
          <span class="title-text">{{ chat?.title || 'New chat' }}</span>
          <button class="title-edit" title="Rename" @click="beginEdit">
            <img :src="editIcon" alt="Rename" class="edit-icon" />
          </button>
        </template>
        <template v-else>
          <!-- input title for editing -->
          <input
            ref="title_edit"
            v-model="draft"
            class="title-input"
            @keydown.enter.prevent="commitEdit"
            @keydown.esc.prevent="cancelEdit"
            @blur="commitEdit"
          />
        </template>
      </div>
    </div>

    <!-- thread -->
    <div ref="scroller" class="thread">
      <!-- messages w/dividers -->
      <div v-for="m in msgs" :key="m.key" class="line">
        <img
          v-if="m.role === 'user'"
          :src="userIcon"
          class="icon user-icon"
          alt="icon"
        />
        <span :class="['msg', m.role === 'user' ? 'msg--user' : '']">{{ m.text }}</span>
      </div>
    </div>

    <!-- center box for sending message -->
    <form class="box_center" @submit.prevent="send">
      <div class="box_center-inner">
        <img class="box_center-icon" :src="brainIcon" alt="" />
        <input
          class="box_center-input"
          v-model="text"
          placeholder="What's in your mind?..."
        />
        <button class="box_center-send" type="submit">
          <img :src="sendIcon" alt="Send" />
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.page {
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 1.25rem;
  background: #f6f7fb;
}

//title bar 
.title-bar {
  display: flex;
  align-items: center;
  margin-bottom: .75rem;
}

.title-wrap {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
}

.title-text {
  font-weight: 700;
  color: #0f172a;
  font-size: 1.05rem;
}

.title-edit {
  width: 1.8rem;
  height: 1.8rem;
  display: grid;
  place-items: center;
  border-radius: .5rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #111827;
  cursor: pointer;
}

.edit-icon {
  width: 1rem;
  height: 1rem;
}

.title-input {
  font-size: 1rem;
  padding: .25rem .45rem;
  border: 1px solid #e5e7eb;
  border-radius: .4rem;
  background: #ffffff;
  outline: none;
}

.thread {
  flex: 1;
  padding: .75rem .25rem;
  margin-bottom: 1.25rem;
  overflow-y: auto;
  background: transparent;
}

.line {
  display: flex;
  align-items: flex-start;
  gap: .6rem;
  padding: .9rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.line:last-child {
  border-bottom: none;
}

.icon {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.user-icon {
  border: 2px solid #5b4df2;
}

.msg {
  color: #0f172a;
  font-size: 1.00rem;
  line-height: 1.6;
  white-space: pre-wrap;
}

.msg--user {
  font-weight: 700;
}

.box_center {
  padding-top: .5rem;
}

.box_center-inner {
  position: relative;
  width: min(58rem, 96%);
  margin: 0 auto;
  background: #ffffff;
  border-radius: 2.25rem;
  padding: .75rem 4.25rem .75rem 3.5rem;
  box-shadow:
    0 .2rem 1.2rem hsla(236, 50%, 13%, 0.06),
    0 .4rem 2.2rem rgba(17, 19, 51, .06);
  transition: box-shadow .2s ease, transform .2s ease;
}

.box_center-inner:focus-within {
  box-shadow:
    0 .35rem 1.4rem #3c63ff1f,
    0 .6rem 2.4rem #3c63ff1f;
  transform: translateY(-.02rem);
}

.box_center-icon {
  position: absolute;
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 50%;
  object-fit: cover;
  opacity: .9;
}

.box_center-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1.05rem;
  line-height: 1.6;
  color: #0f172a;
}

.box_center-send {
  position: absolute;
  right: .6rem;
  top: 50%;
  transform: translateY(-50%);
  width: 3rem;
  height: 3rem;
  border: none;
  border-radius: 50%;
  background: #5255f5;
  display: grid;
  place-items: center;
  box-shadow:
    0 .35rem 1.1rem #5255f547,
    0 .1rem .3rem #5255f540;
  cursor: pointer;
}

.box_center-send img {
  width: 1.25rem;
  height: 1.25rem;
}

.box_center-send:hover {
  background: #474af1;
}
</style>