<template>
    <side class="sidebar">
        <!-- Header -->
        <div class="top">
            <div class="brand">CHAT A.I+</div>
            <button class="icon" title="Search">
                <img :src="searchPng" />
            </button>
        </div>
/
        <button class="new_chat" @click="create">+ New chat</button>
        <!-- -->
        <!-- Scrollable middle -->
        <div class="scroll">
            <div class="section">
                <div class="section-head">
                    <span class="section-title">Your conversations</span>
                </div>

                <ul class="list">
                    <li v-for="c in chats" :key="c.id" :class="['row', activeId === c.id ? 'active' : '']"
                        @mouseenter="hoverId = c.id" @mouseleave="hoverId = ''">
                        <!-- left clickable area -->
                        <a class="row-main" href="#" @click.prevent="openChat(c.id)">
                            <img class="lead" :src="chatPng" alt="" />
                            <span v-if="editingId !== c.id" class="label ellipsis">{{ c.title }}</span>
                            <input v-else ref="editInput" class="edit" v-model="draftTitle"
                                @keydown.enter.prevent="commitEdit(c)" @keydown.esc.prevent="cancelEdit"
                                @blur="commitEdit(c)" />
                        </a>
                        <!-- href #semantics, click.prevent for opening a chat-->
                        <!-- right actions not in use anymore -->
                        
                    </li>
                    <!--if not chats present then don't click new chat-->
                </ul>
            </div>
        </div>

        <!-- Footer section -->
        <div class="footer">
            <button type="button" class="footer-row">
                <img class="footer-icon" :src="settingsPng" alt="" />
                <span class="footer-text">Settings</span>
            </button>

            <div class="footer-row footer-user">
                <img class="footer-avatar" :src="avatarPng" alt="Andrew Neilson" />
                <span class="footer-text">Andrew Neilson</span>
            </div>
        </div>
    </side>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/store/chat.js'

import writeBoxPng from '@/assets/images/write-box.png'
import settingsPng from '@/assets/images/settings.png'
import chatPng from '@/assets/images/chat-icon.png'
import avatarPng from '@/assets/images/user-avatar.png'
import searchPng from '@/assets/images/search.png'
//images
defineOptions({ name: 'Sidebar' })
//name of 
const router = useRouter()
const store = useChatStore()

// sorted list from the store
const chats = computed(() => store.chatsSorted)
//chat from list store
//active chat id
const activeId = ref('')
const hoverId = ref('')
const editingId = ref('')
const draftTitle = ref('')
const editInput = ref(null)

onMounted(async () => { await store.loadChats() })
// open chat based on the id
const openChat = async (id) => {
    activeId.value = id
    router.push(`/chats/${id}`)
}
//creating a new chat
const create = async () => {
    const id = crypto.randomUUID()
    await store.ensureChat(id, 'New chat')
    activeId.value = id
    router.push(`/chats/${id}`)
    //waiting for the next tick for chat to be created
}

const beginEdit = async (chat) => {
    editingId.value = chat.id
    draftTitle.value = chat.title
    //wait for the next tick to focus on the input
    await nextTick()
    editInput.value?.focus()
    editInput.value?.select()
    //scroll to the input
}

const commitEdit = async (chat) => {
    if (!editingId.value) return
    //if not title editing, then do nothing
    const newTitle = draftTitle.value.trim() || chat.title
    //keep old title if nothing typed
    if (newTitle !== chat.title) await store.updateChatTitle(chat.id, newTitle)
    //reset the eidting state
    editingId.value = ''
    //reste the title
}

const cancelEdit = () => { editingId.value = '' }
//check if sectinons are shown

const showActions = (id) =>
    hoverId.value === id || editingId.value === id || activeId.value === id
</script>

<style scoped lang="scss">
ul,li {
    list-style: none;
    margin: 0;
    padding: 0;
}


.sidebar {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 1rem;
    gap: .75rem;
}

.top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.brand {
    font-weight: 800;
    letter-spacing: .04em;
    font-size: 1.05rem;
}

.icon {
    width: 2rem;
    height: 2rem;
    display: grid;
    place-items: center;
    border-radius: .6rem;
    border: var(--with) solid var(--border);
    background: var(--page);
    color: var(--second);
}

.icon img {
    width: 1rem;
    height: 1rem;
    object-fit: contain;
}

.new {
    width: 100%;
    font-weight: 600;
    padding: .85rem 1rem;
}

.scroll {
    flex: 1 1 auto;
    overflow: auto;
    padding-right: .25rem;
}

.footer {
    display: flex;
    flex-direction: column;
    gap: .6rem;
    padding-top: .25rem;
}

.section {
    display: flex;
    flex-direction: column;
    gap: .35rem;
}

.section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.section-title {
    font-size: .9rem;
    color: #8a92a6;
}

.list {
    display: flex;
    flex-direction: column;
    gap: .15rem;
}

.row {
    position: relative;
    border-radius: 1rem;
    padding-right: 3.2rem;
}

.row-main {
    display: flex;
    align-items: center;
    gap: .5rem;
    width: 100%;
    padding: .5rem .6rem;
    border-radius: 1rem;
}

.row:hover {
    background: #eaecf1;
}

.row.active {
    background: rgb(236, 240, 253);
}

.lead {
    width: 1rem;
    height: 1rem;
    flex: 0 0 auto;
}

.label {
    font-size: .95rem;
    color: var(--main);
}

.ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.empty {
    padding: .75rem .6rem;
    color: var(--second);
}

.edit {
    width: 100%;
    font-size: .95rem;
    color: var(--main);
    padding: .3rem .45rem;
    border: 1px solid var(--border);
    border-radius: .5rem;
    outline: none;
    background: #ffffff;
}

.actions {
    position: absolute;
    right: .4rem;
    top: 50%;
    display: flex;
    gap: .4rem;
    opacity: 0;
}

.actions.show {
    opacity: 1;
}

.icon-ghost {
    width: 2rem;
    height: 2rem;
    display: grid;
    place-items: center;
    border-radius: .8rem;
    border: var(--hair) solid var(--border);
    background: var(--panel);
    //scss global
    color: #0c111c;
    cursor: pointer;
}

.wb {
    width: 1.05rem;
    height: 1.05rem;
    object-fit: contain;
}

.icon-ghost:hover {
    filter: brightness(1.05);
}

.footer-row {
    display: flex;
    align-items: center;
    gap: .6rem;
    width: 100%;
    padding: .6rem .8rem;
    border-radius: 1.4rem;
    background: var(--panel);
    border: var(--hair) solid var(--border);
    //scss global
    box-shadow: 0 .12rem .45rem #0f172a0f;
}

.footer-icon {
    width: 1.1rem;
    height: 1.1rem;
}

.footer-avatar {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    object-fit: cover;
}

.footer-text {
    font-size: .95rem;
    color: var(--main);
    //from scss global
}

.footer-user {
    padding: .55rem .8rem;
}
</style>