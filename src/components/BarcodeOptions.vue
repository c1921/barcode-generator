<script setup lang="ts">
import {
  formatOptions,
  fontOptions,
  fontStyleOptions,
  textAlignOptions,
  textPositionOptions,
  type BarcodeOptions,
} from '../types/barcode'
import { barcodeTypes } from '../config/barcodeTypes'

defineProps<{
  options: BarcodeOptions
}>()

const emit = defineEmits<{
  update: [key: keyof BarcodeOptions, value: any]
}>()

function onUpdate(key: keyof BarcodeOptions, value: any) {
  emit('update', key, value)
}

/** 切换格式时填入示例数据 */
function onFormatChange(value: string) {
  onUpdate('format', value)
  for (const category of barcodeTypes) {
    const match = category.types.find(
      (t) => t.value.toUpperCase() === value.toUpperCase(),
    )
    if (match) {
      // 触发 input 区域的示例数据更新通过暴露方法实现，这里只改 format
      return
    }
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- 格式 -->
    <div class="flex flex-col gap-1">
      <label class="text-xs font-medium text-gray-600 dark:text-gray-300">
        条码格式
      </label>
      <select
        :value="options.format"
        class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        @change="onFormatChange(($event.target as HTMLSelectElement).value)"
      >
        <option
          v-for="fmt in formatOptions"
          :key="fmt.value"
          :value="fmt.value"
        >
          {{ fmt.label }}
        </option>
      </select>
    </div>

    <!-- 尺寸行 -->
    <div class="grid grid-cols-2 gap-3">
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-gray-600 dark:text-gray-300">
          条宽 (px): {{ options.width }}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          step="0.5"
          :value="options.width"
          class="h-2 cursor-pointer rounded-lg bg-gray-200 accent-blue-500 dark:bg-gray-600"
          @input="onUpdate('width', Number(($event.target as HTMLInputElement).value))"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-gray-600 dark:text-gray-300">
          高度 (px): {{ options.height }}
        </label>
        <input
          type="range"
          min="20"
          max="200"
          step="1"
          :value="options.height"
          class="h-2 cursor-pointer rounded-lg bg-gray-200 accent-blue-500 dark:bg-gray-600"
          @input="onUpdate('height', Number(($event.target as HTMLInputElement).value))"
        />
      </div>
    </div>

    <!-- 边距 & 文字间距 -->
    <div class="grid grid-cols-2 gap-3">
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-gray-600 dark:text-gray-300">
          边距 (px): {{ options.margin }}
        </label>
        <input
          type="range"
          min="0"
          max="40"
          step="1"
          :value="options.margin"
          class="h-2 cursor-pointer rounded-lg bg-gray-200 accent-blue-500 dark:bg-gray-600"
          @input="onUpdate('margin', Number(($event.target as HTMLInputElement).value))"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-gray-600 dark:text-gray-300">
          文字间距 (px): {{ options.textMargin }}
        </label>
        <input
          type="range"
          min="0"
          max="20"
          step="1"
          :value="options.textMargin"
          class="h-2 cursor-pointer rounded-lg bg-gray-200 accent-blue-500 dark:bg-gray-600"
          @input="onUpdate('textMargin', Number(($event.target as HTMLInputElement).value))"
        />
      </div>
    </div>

    <!-- 文字设置 -->
    <div class="flex flex-col gap-1">
      <label class="text-xs font-medium text-gray-600 dark:text-gray-300">
        <!-- displayValue 开关 inline -->
        <span class="flex items-center justify-between">
          <span>显示文字</span>
          <button
            :class="[
              'relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors',
              options.displayValue ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600',
            ]"
            role="switch"
            :aria-checked="options.displayValue"
            @click="onUpdate('displayValue', !options.displayValue)"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                options.displayValue ? 'translate-x-[18px]' : 'translate-x-[2px]',
              ]"
            />
          </button>
        </span>
      </label>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-gray-600 dark:text-gray-300">
          字体
        </label>
        <select
          :value="options.font"
          class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          @change="onUpdate('font', ($event.target as HTMLSelectElement).value)"
        >
          <option
            v-for="f in fontOptions"
            :key="f.value"
            :value="f.value"
          >
            {{ f.label }}
          </option>
        </select>
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-gray-600 dark:text-gray-300">
          字号 (px): {{ options.fontSize }}
        </label>
        <input
          type="range"
          min="8"
          max="32"
          step="1"
          :value="options.fontSize"
          class="h-2 cursor-pointer rounded-lg bg-gray-200 accent-blue-500 dark:bg-gray-600"
          @input="onUpdate('fontSize', Number(($event.target as HTMLInputElement).value))"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-gray-600 dark:text-gray-300">
          字重/样式
        </label>
        <select
          :value="options.fontOptions"
          class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          @change="onUpdate('fontOptions', ($event.target as HTMLSelectElement).value)"
        >
          <option
            v-for="fs in fontStyleOptions"
            :key="fs.value"
            :value="fs.value"
          >
            {{ fs.label }}
          </option>
        </select>
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-gray-600 dark:text-gray-300">
          自定义文字
        </label>
        <input
          type="text"
          :value="options.text ?? ''"
          placeholder="留空则显示条码值"
          class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          @input="onUpdate('text', ($event.target as HTMLInputElement).value || undefined)"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-gray-600 dark:text-gray-300">
          文字对齐
        </label>
        <select
          :value="options.textAlign"
          class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          @change="onUpdate('textAlign', ($event.target as HTMLSelectElement).value)"
        >
          <option
            v-for="ta in textAlignOptions"
            :key="ta.value"
            :value="ta.value"
          >
            {{ ta.label }}
          </option>
        </select>
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-gray-600 dark:text-gray-300">
          文字位置
        </label>
        <select
          :value="options.textPosition"
          class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          @change="onUpdate('textPosition', ($event.target as HTMLSelectElement).value)"
        >
          <option
            v-for="tp in textPositionOptions"
            :key="tp.value"
            :value="tp.value"
          >
            {{ tp.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- 颜色 -->
    <div class="grid grid-cols-2 gap-3">
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-gray-600 dark:text-gray-300">
          背景色
        </label>
        <div class="flex items-center gap-2">
          <input
            type="color"
            :value="options.background"
            class="h-8 w-10 cursor-pointer rounded border border-gray-300 bg-transparent p-0.5"
            @input="onUpdate('background', ($event.target as HTMLInputElement).value)"
          />
          <span class="font-mono text-xs text-gray-500">{{ options.background }}</span>
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-gray-600 dark:text-gray-300">
          条码颜色
        </label>
        <div class="flex items-center gap-2">
          <input
            type="color"
            :value="options.lineColor"
            class="h-8 w-10 cursor-pointer rounded border border-gray-300 bg-transparent p-0.5"
            @input="onUpdate('lineColor', ($event.target as HTMLInputElement).value)"
          />
          <span class="font-mono text-xs text-gray-500">{{ options.lineColor }}</span>
        </div>
      </div>
    </div>

    <!-- EAN-13 flat -->
    <div v-if="options.format === 'EAN13'" class="flex flex-col gap-1">
      <label class="text-xs font-medium text-gray-600 dark:text-gray-300">
        <span class="flex items-center justify-between">
          <span>附加码平齐 (flat)</span>
          <button
            :class="[
              'relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors',
              options.flat ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600',
            ]"
            role="switch"
            :aria-checked="options.flat"
            @click="onUpdate('flat', !options.flat)"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                options.flat ? 'translate-x-[18px]' : 'translate-x-[2px]',
              ]"
            />
          </button>
        </span>
      </label>
    </div>
  </div>
</template>
