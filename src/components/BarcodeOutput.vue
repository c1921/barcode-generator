<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  output: string[]
  error: string | null
}>()

const numberedOutput = computed(() => {
  if (props.output.length === 0) return ''
  return props.output
    .map((svg, index) => {
      const numberSpan =
        props.output.length > 1
          ? `<span class="barcode-number">${index + 1}.</span>`
          : ''
      return `<div class="barcode-item">${numberSpan}${svg}</div>`
    })
    .join('')
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">
      预览
      <span class="ml-2 text-xs font-normal text-gray-400">
        共 {{ output.length }} 个条码
      </span>
    </label>
    <div
      v-if="error"
      class="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-600 dark:bg-red-900/30 dark:text-red-300"
    >
      {{ error }}
    </div>
    <div
      v-else-if="output.length === 0"
      class="flex aspect-[4/3] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400 dark:border-gray-600 dark:bg-gray-800/50"
    >
      输入内容后将在此处预览条形码
    </div>
    <div
      v-else
      class="flex max-h-[70vh] flex-col gap-3 overflow-auto rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <div
        class="flex flex-col gap-4"
        v-html="numberedOutput"
      />
    </div>
  </div>
</template>

<style scoped>
:deep(.barcode-item) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.barcode-item:last-child) {
  border-bottom: none;
}

:deep(.barcode-number) {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  min-width: 1.5rem;
  flex-shrink: 0;
}

:deep(.barcode-item svg) {
  max-width: 100%;
  height: auto;
}

.dark :deep(.barcode-item) {
  border-bottom-color: #374151;
}

.dark :deep(.barcode-number) {
  color: #9ca3af;
}
</style>
