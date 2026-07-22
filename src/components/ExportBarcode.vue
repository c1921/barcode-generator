<script setup lang="ts">
import { ref } from 'vue'
import type { ImageFormat } from '../types/barcode'
import { imageFormatOptions } from '../types/barcode'

const props = defineProps<{
  disabled: boolean
  count: number
}>()

const emit = defineEmits<{
  downloadAll: [format: ImageFormat]
}>()

const imageFormat = ref<ImageFormat>('png')

function onDownload() {
  if (props.count === 0) return
  emit('downloadAll', imageFormat.value)
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <button
      :disabled="disabled"
      class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      @click="onDownload"
    >
      <!-- 下载图标 -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="h-4 w-4"
      >
        <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
        <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
      </svg>
      <span>导出</span>
    </button>

    <span class="text-xs text-gray-400 dark:text-gray-500">格式</span>

    <div class="flex gap-1 rounded-lg border border-gray-200 bg-white p-0.5 shadow-sm dark:border-gray-600 dark:bg-gray-800">
      <button
        v-for="fmt in imageFormatOptions"
        :key="fmt.value"
        :class="[
          'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
          imageFormat === fmt.value
            ? 'bg-blue-500 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
        ]"
        @click="imageFormat = fmt.value"
      >
        {{ fmt.label }}
      </button>
    </div>

    <span v-if="count > 1" class="text-xs text-gray-400 dark:text-gray-500">
      共 {{ count }} 个条码，将打包为 ZIP
    </span>
  </div>
</template>
