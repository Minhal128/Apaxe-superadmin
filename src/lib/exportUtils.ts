import * as XLSX from 'xlsx'

/**
 * Export data to XLSX file
 * @param data - Array of objects to export
 * @param filename - Name of the file (without extension)
 * @param sheetName - Name of the worksheet
 * @param columnMapping - Optional simple column mapping { dataKey: 'Display Name' }
 */
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  filename: string,
  sheetName: string = 'Sheet1',
  columnMapping?: Record<string, string>
): void {
  if (!data || data.length === 0) {
    console.warn('No data to export')
    return
  }

  let exportData: any[]

  if (columnMapping) {
    // Map data according to column mapping
    exportData = data.map(item => {
      const row: Record<string, any> = {}
      Object.entries(columnMapping).forEach(([key, header]) => {
        row[header] = item[key]
      })
      return row
    })
  } else {
    // Use data as-is with keys as headers
    exportData = data
  }

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData)

  // Auto-size columns
  const maxWidth = 50
  const colWidths = Object.keys(exportData[0] || {}).map(key => {
    const maxLength = Math.max(
      key.length,
      ...exportData.map(row => String(row[key] || '').length)
    )
    return { wch: Math.min(maxLength + 2, maxWidth) }
  })
  worksheet['!cols'] = colWidths

  // Create workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0]
  const fullFilename = `${filename}_${timestamp}.xlsx`

  // Save file
  XLSX.writeFile(workbook, fullFilename)
}

/**
 * Export multiple sheets to a single XLSX file
 */
export function exportMultipleSheets(
  sheets: { name: string; data: any[]; columns?: { header: string; key: string; transform?: (value: any) => any }[] }[],
  filename: string
): void {
  const workbook = XLSX.utils.book_new()

  sheets.forEach(sheet => {
    let exportData: any[]

    if (sheet.columns) {
      exportData = sheet.data.map(item => {
        const row: Record<string, any> = {}
        sheet.columns!.forEach(col => {
          const value = item[col.key]
          row[col.header] = col.transform ? col.transform(value) : value
        })
        return row
      })
    } else {
      exportData = sheet.data
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    
    // Auto-size columns
    if (exportData.length > 0) {
      const colWidths = Object.keys(exportData[0] || {}).map(key => {
        const maxLength = Math.max(
          key.length,
          ...exportData.map(row => String(row[key] || '').length)
        )
        return { wch: Math.min(maxLength + 2, 50) }
      })
      worksheet['!cols'] = colWidths
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name)
  })

  const timestamp = new Date().toISOString().split('T')[0]
  XLSX.writeFile(workbook, `${filename}_${timestamp}.xlsx`)
}

// Helper function to format date for export
export function formatDateForExport(date: string | Date): string {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// Helper function to format currency for export
export function formatCurrencyForExport(amount: number): string {
  if (amount === null || amount === undefined) return ''
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount)
}

// Helper function to format number for export
export function formatNumberForExport(num: number, decimals: number = 2): string {
  if (num === null || num === undefined) return ''
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num)
}
