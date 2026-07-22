/**
 * 精简的条码类型配置 — 仅保留 Code128 系列和 EAN-13
 * 后续可按需扩展其他格式
 */
export interface BarcodeTypeItem {
  name: string
  value: string
  initData: string
}

export interface BarcodeCategory {
  name: string
  types: BarcodeTypeItem[]
}

export const barcodeTypes: BarcodeCategory[] = [
  {
    name: 'Code 128',
    types: [
      { name: 'Code 128', value: 'CODE128', initData: 'ABC-abc-1234' },
      { name: 'Code 128A', value: 'CODE128A', initData: 'ABC123' },
      { name: 'Code 128B', value: 'CODE128B', initData: 'Hello World!' },
      { name: 'Code 128C', value: 'CODE128C', initData: '123456' },
    ],
  },
  {
    name: 'EAN / UPC',
    types: [
      { name: 'EAN-13', value: 'EAN13', initData: '5901234123457' },
    ],
  },
]

/** JsBarcode 支持的所有格式列表（用于快速判断） */
export const jsBarcodeSupportedFormats = [
  'CODE128',
  'CODE128A',
  'CODE128B',
  'CODE128C',
  'EAN13',
]
