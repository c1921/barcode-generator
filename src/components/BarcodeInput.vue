<script setup lang="ts">
import { ref } from 'vue'

const input = defineModel<string>({ required: true })

const textareaRef = ref<HTMLTextAreaElement | null>(null)

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Tab') {
    e.preventDefault()
    const el = e.currentTarget as HTMLTextAreaElement
    const start = el.selectionStart
    const end = el.selectionEnd
    const newValue = input.value.slice(0, start) + '\t' + input.value.slice(end)
    input.value = newValue
    requestAnimationFrame(() => {
      el.selectionStart = start + 1
      el.selectionEnd = start + 1
    })
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">
      输入内容
      <span class="ml-2 text-xs font-normal text-gray-400">
        每行一个条码，Tab 分隔值和显示文字
      </span>
    </label>
    <textarea
      ref="textareaRef"
      v-model="input"
      class="h-36 w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-500"
      placeholder="ABC-abc-1234&#10;5901234123457&#10;value&#9;自定义显示文字"
      @keydown="handleKeydown"
    />
  </div>
</template>
