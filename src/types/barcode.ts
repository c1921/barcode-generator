/**
 * JsBarcode 可配置参数类型定义
 * 参考：https://github.com/lindell/JsBarcode#options
 */
export interface BarcodeOptions {
  format: string
  width: number
  height: number
  displayValue: boolean
  text?: string
  font: string
  fontSize: number
  fontOptions: string
  textAlign: CanvasTextAlign
  textPosition: 'bottom' | 'top'
  textMargin: number
  margin: number
  background: string
  lineColor: string
  flat: boolean
}

/** 默认配置 */
export const defaultBarcodeOptions: BarcodeOptions = {
  format: 'CODE128',
  width: 2,
  height: 80,
  displayValue: true,
  font: 'Arial',
  fontSize: 15,
  fontOptions: '',
  textAlign: 'center',
  textPosition: 'bottom',
  textMargin: 2,
  margin: 10,
  background: '#ffffff',
  lineColor: '#000000',
  flat: false,
}

/** 格式选项列表（用于下拉菜单） */
export const formatOptions = [
  { label: 'Code 128', value: 'CODE128' },
  { label: 'Code 128A', value: 'CODE128A' },
  { label: 'Code 128B', value: 'CODE128B' },
  { label: 'Code 128C', value: 'CODE128C' },
  { label: 'EAN-13', value: 'EAN13' },
] as const

/** 字体选项 */
export const fontOptions = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Courier New', value: 'Courier New' },
  { label: 'Verdana', value: 'Verdana' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'monospace', value: 'monospace' },
] as const

/** 字重/style 选项 */
export const fontStyleOptions = [
  { label: '正常', value: '' },
  { label: 'Bold', value: 'bold' },
  { label: 'Italic', value: 'italic' },
  { label: 'Bold Italic', value: 'bold italic' },
] as const

/** textAlign 选项 */
export const textAlignOptions = [
  { label: '左对齐', value: 'left' as const },
  { label: '居中', value: 'center' as const },
  { label: '右对齐', value: 'right' as const },
]

/** textPosition 选项 */
export const textPositionOptions = [
  { label: '底部', value: 'bottom' as const },
  { label: '顶部', value: 'top' as const },
]
