import type { Metadata } from 'next'
import { SearchContent } from './search-content'

export const metadata: Metadata = {
  title: 'Search',
}

export default function SearchPage() {
  return <SearchContent />
}
