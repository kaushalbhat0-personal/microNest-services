import type { Metadata } from 'next'
import { ExportContent } from './export-content'

export const metadata: Metadata = {
  title: 'Export',
}

export default function ExportPage() {
  return <ExportContent />
}
