<script setup>
import ChatList from '@/components/ChatList.vue'
</script>

<template>
  <div class="layout">
    <ChatList class="left" />
    <main class="right">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout{
  display: grid;
  grid-template-columns: 22rem 1fr;  /* sidebar width + content */
  height: 100vh;
  background: #f6f7fb;
}
.left{
  border-right: 1px solid #eef0f4;
  background: #ffffff;
}
.right{
  overflow: auto;
}
</style>