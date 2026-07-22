import { ref, watch } from 'vue'
import JsBarcode from 'jsbarcode'
import { parseLine } from '../utils/parseLine'
import { defaultBarcodeOptions, type BarcodeOptions } from '../types/barcode'
import { jsBarcodeSupportedFormats } from '../config/barcodeTypes'

export function useBarcode() {
  const input = ref('')
  const options = ref<BarcodeOptions>({ ...defaultBarcodeOptions })
  const output = ref<string[]>([])
  const error = ref<string | null>(null)

  function generate() {
    const lines = input.value
      .split('\n')
      .filter((line) => line.trim() !== '')

    if (lines.length === 0) {
      output.value = []
      error.value = null
      return
    }

    const format = options.value.format.toUpperCase()

    try {
      const barcodes = lines.map((line) => {
        const { barcodeValue, displayText } = parseLine(line)

        if (!jsBarcodeSupportedFormats.includes(format)) {
          throw new Error(`不支持的条码格式: ${format}`)
        }

        const svg = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'svg',
        )

        const config: Record<string, unknown> = {
          format,
          width: options.value.width,
          height: options.value.height,
          displayValue: options.value.displayValue,
          font: options.value.font,
          fontSize: options.value.fontSize,
          fontOptions: options.value.fontOptions,
          textAlign: options.value.textAlign,
          textPosition: options.value.textPosition,
          textMargin: options.value.textMargin,
          margin: options.value.margin,
          background: options.value.background,
          lineColor: options.value.lineColor,
          flat: options.value.flat,
        }

        // 自定义覆盖显示文字
        if (options.value.text) {
          config.text = options.value.text
        } else if (options.value.displayValue && displayText !== undefined) {
          config.text = displayText
        }

        try {
          JsBarcode(svg, barcodeValue, config)
        } catch (e) {
          throw new Error(`条码生成失败「${barcodeValue}」: ${e}`)
        }

        return svg.outerHTML
      })

      output.value = barcodes
      error.value = null
    } catch (e) {
      error.value = String(e)
      output.value = []
    }
  }

  // 监听 input 和 options 变化自动重新生成
  watch([input, options], generate, { deep: true, immediate: true })

  function setFormat(format: string) {
    options.value.format = format.toUpperCase()
  }

  function updateOption<K extends keyof BarcodeOptions>(
    key: K,
    value: BarcodeOptions[K],
  ) {
    options.value[key] = value
  }

  return {
    input,
    options,
    output,
    error,
    setFormat,
    updateOption,
    generate,
  }
}
