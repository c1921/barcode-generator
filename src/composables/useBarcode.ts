import { ref, watch } from 'vue'
import JsBarcode from 'jsbarcode'
import JSZip from 'jszip'
import { parseLine } from '../utils/parseLine'
import {
  defaultBarcodeOptions,
  type BarcodeOptions,
  type ImageFormat,
} from '../types/barcode'
import { jsBarcodeSupportedFormats } from '../config/barcodeTypes'
import { save } from '@tauri-apps/plugin-dialog'
import { writeFile } from '@tauri-apps/plugin-fs'
import { downloadDir, join } from '@tauri-apps/api/path'

/** 是否运行在 Tauri 桌面环境中 */
const isTauri = '__TAURI_INTERNALS__' in globalThis

/** 浏览器环境下的兜底下载：将 Blob 保存为文件 */
function downloadBlobInBrowser(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * 跨环境保存文件：Tauri 下弹"另存为"对话框（默认到下载目录）并写盘；
 * 浏览器下回退到 <a download> 下载。用户取消对话框时静默返回 false。
 */
async function saveFile(
  data: Blob | string,
  defaultName: string,
  filters: { name: string; extensions: string[] }[],
): Promise<boolean> {
  // 字符串（SVG）转 Blob 以便统一处理
  const blob =
    typeof data === 'string'
      ? new Blob([data], { type: 'image/svg+xml;charset=utf-8' })
      : data

  if (!isTauri) {
    downloadBlobInBrowser(blob, defaultName)
    return true
  }

  let defaultPath = defaultName
  try {
    defaultPath = await join(await downloadDir(), defaultName)
  } catch {
    /* 获取下载目录失败时退化为仅文件名 */
  }

  const filePath = await save({ defaultPath, filters })
  if (!filePath) return false // 用户取消

  const bytes = new Uint8Array(await blob.arrayBuffer())
  await writeFile(filePath, bytes)
  return true
}

/** 按导出格式构造文件过滤器 */
function filtersFor(imageFormat: ImageFormat) {
  return [{ name: imageFormat.toUpperCase(), extensions: [imageFormat] }]
}

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

  /**
   * 将单个 SVG 字符串导出为指定格式的 Blob
   */
  function exportToBlob(
    svgString: string,
    imageFormat: ImageFormat,
  ): Promise<Blob | string> {
    return new Promise((resolve, reject) => {
      if (imageFormat === 'svg') {
        resolve(svgString)
        return
      }

      // 将 SVG 渲染到 Canvas 上再导出为图片
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas 2D context 不可用'))
        return
      }

      const svgBlob = new Blob([svgString], {
        type: 'image/svg+xml;charset=utf-8',
      })
      const url = URL.createObjectURL(svgBlob)
      const img = new Image()

      img.onload = () => {
        // 确保 canvas 有合理尺寸
        const w = img.naturalWidth || 400
        const h = img.naturalHeight || 200
        canvas.width = w
        canvas.height = h

        // 填充背景色
        ctx.fillStyle = options.value.background || '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)

        URL.revokeObjectURL(url)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('图片生成失败'))
            }
          },
          `image/${imageFormat}`,
          imageFormat === 'jpg' ? 0.92 : 1,
        )
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('SVG 渲染失败'))
      }

      img.src = url
    })
  }

  /**
   * 下载单个条码
   */
  async function downloadSingle(index: number, imageFormat: ImageFormat) {
    if (index < 0 || index >= output.value.length) return

    const svgString = output.value[index]
    const data = await exportToBlob(svgString, imageFormat)

    const defaultName = `barcode-${options.value.format}_${index + 1}.${imageFormat}`
    await saveFile(
      imageFormat === 'svg' ? (data as string) : (data as Blob),
      defaultName,
      filtersFor(imageFormat),
    )
  }

  /**
   * 下载所有条码（单个直接下载，多个打包为 zip）
   */
  async function downloadAll(imageFormat: ImageFormat) {
    if (output.value.length === 0) return

    error.value = null

    try {
      if (output.value.length === 1) {
        // 单个条码直接下载
        const data = await exportToBlob(output.value[0], imageFormat)
        const defaultName = `barcode-${options.value.format}.${imageFormat}`
        await saveFile(
          imageFormat === 'svg' ? (data as string) : (data as Blob),
          defaultName,
          filtersFor(imageFormat),
        )
      } else {
        // 多个条码打包 zip
        const zip = new JSZip()

        for (let i = 0; i < output.value.length; i++) {
          const data = await exportToBlob(output.value[i], imageFormat)
          const ext = imageFormat
          if (imageFormat === 'svg') {
            zip.file(`barcode-${options.value.format}_${i + 1}.${ext}`, data as string)
          } else {
            zip.file(`barcode-${options.value.format}_${i + 1}.${ext}`, data as Blob)
          }
        }

        const content = await zip.generateAsync({ type: 'blob' })
        await saveFile(content, 'barcodes.zip', [
          { name: 'ZIP', extensions: ['zip'] },
        ])
      }
    } catch (e) {
      error.value = `导出失败: ${e}`
    }
  }

  return {
    input,
    options,
    output,
    error,
    setFormat,
    updateOption,
    generate,
    downloadSingle,
    downloadAll,
  }
}
