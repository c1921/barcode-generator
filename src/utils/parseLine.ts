/**
 * 解析单行输入为 { barcodeValue, displayText }
 *
 * 格式: "value\tcaption"
 *   - 如果存在 Tab 分隔符，Tab 之前为条码内容，之后为显示文字
 *   - 如果没有 Tab，整行即为条码内容，显示文字由条码库默认渲染
 */
export const parseLine = (
  line: string,
): { barcodeValue: string; displayText: string | undefined } => {
  const tabIndex = line.indexOf('\t')
  if (tabIndex !== -1) {
    const barcodeValue = line.slice(0, tabIndex).trim()
    const caption = line.slice(tabIndex + 1).trim()
    return {
      barcodeValue,
      displayText: caption !== '' ? caption : undefined,
    }
  }
  return { barcodeValue: line.trim(), displayText: undefined }
}
