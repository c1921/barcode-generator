<script setup lang="ts">
import { computed } from 'vue'
import BarcodeInput from './components/BarcodeInput.vue'
import BarcodeOptions from './components/BarcodeOptions.vue'
import BarcodeOutput from './components/BarcodeOutput.vue'
import ExportBarcode from './components/ExportBarcode.vue'
import { useBarcode } from './composables/useBarcode'
import { barcodeTypes } from './config/barcodeTypes'

const { input, options, output, error, updateOption, downloadAll } = useBarcode()

/** 当前格式的示例数据 */
const currentInitData = computed(() => {
  for (const category of barcodeTypes) {
    const match = category.types.find(
      (t) => t.value.toUpperCase() === options.value.format.toUpperCase(),
    )
    if (match) return match.initData
  }
  return ''
})

function fillSampleData() {
  input.value = currentInitData.value
}
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-6xl flex-col bg-gray-50 dark:bg-gray-900">
    <!-- 顶栏 -->
    <header class="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-700 dark:bg-gray-800">
      <h1 class="text-lg font-bold text-gray-800 dark:text-gray-100">
        📦 条形码生成器
      </h1>
      <button
        class="rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-sm text-gray-600 shadow-sm transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        @click="fillSampleData"
      >
        填充示例
      </button>
    </header>

    <!-- 主体：两栏布局 -->
    <div class="flex flex-1 gap-4 p-4 lg:flex-row">
      <!-- 左栏：输入 + 选项 -->
      <div class="flex w-full flex-col gap-4 lg:w-1/2">
        <BarcodeInput v-model="input" />

        <details class="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800" open>
          <summary class="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-750">
            选项设置
          </summary>
          <div class="px-4 pb-4 pt-2">
            <BarcodeOptions
              :options="options"
              @update="(key, value) => updateOption(key, value)"
            />
          </div>
        </details>
      </div>

      <!-- 右栏：预览 -->
      <div class="w-full lg:w-1/2">
        <div class="sticky top-4 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div class="p-4">
            <BarcodeOutput
              :output="output"
              :error="error"
            />
            <div class="border-t border-gray-100 px-4 py-3 dark:border-gray-700">
              <ExportBarcode
                :disabled="output.length === 0"
                :count="output.length"
                @download-all="(fmt) => downloadAll(fmt)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
