'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  PageHeader,
  Card,
  CardBody,
  CardHeader,
  Button,
  EmptyState,
  StatusBadge,
  Badge,
} from '@micronest/ui'
import type { StayNestReceiptWithDetails } from '@micronest/db'
import { regenerateReceiptAction } from '@/lib/staynest/actions'

const paymentMethodLabel: Record<string, string> = {
  cash: 'Cash',
  upi: 'UPI',
  bank_transfer: 'Bank Transfer',
  other: 'Other',
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ReceiptsContent({
  receipts,
  organizationId,
}: {
  receipts: StayNestReceiptWithDetails[]
  organizationId: string | null
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [viewingReceipt, setViewingReceipt] = useState<StayNestReceiptWithDetails | null>(null)
  const [loadingRegenerate, setLoadingRegenerate] = useState<string | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  const handleRegenerate = useCallback(async (receiptId: string) => {
    setError(null)
    setLoadingRegenerate(receiptId)
    const result = await regenerateReceiptAction(receiptId)
    if (result?.error) {
      setError(result.error)
      setLoadingRegenerate(null)
    } else {
      setLoadingRegenerate(null)
      setViewingReceipt(null)
      router.refresh()
    }
  }, [router])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const activeReceipts = receipts.filter((r) => r.status === 'active')

  return (
    <div>
      <PageHeader
        title="Receipts"
        description="View and manage payment receipts"
      />

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {activeReceipts.length === 0 ? (
        <EmptyState
          title="No receipts yet"
          description="Receipts are automatically generated when a rent payment is recorded."
        />
      ) : (
        <div className="space-y-3">
          {activeReceipts.map((receipt) => (
            <Card key={receipt.id} padding="md">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {receipt.receipt_number}
                    </h3>
                    <Badge variant="indigo">
                      {monthNames[receipt.billing_month - 1]} {receipt.billing_year}
                    </Badge>
                  </div>
                  <div className="mt-1.5 space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium text-gray-900">{receipt.resident_name}</span>
                      {receipt.room_number && <span> &middot; Room {receipt.room_number}</span>}
                    </p>
                    <p>
                      {formatCurrency(receipt.amount_paid)} via {paymentMethodLabel[receipt.payment_method] ?? receipt.payment_method}
                      <span className="ml-2 text-gray-400">
                        {formatDate(receipt.payment_date)}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setViewingReceipt(receipt)}
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    loading={loadingRegenerate === receipt.id}
                    onClick={() => handleRegenerate(receipt.id)}
                  >
                    Re-generate
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 print:static print:bg-white">
          <div ref={printRef} className="mt-8 w-full max-w-lg print:mx-auto print:mt-0">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg print:border-0 print:shadow-none">
              <div className="mb-6 flex items-start justify-between print:hidden">
                <h2 className="text-lg font-bold text-gray-900">Receipt</h2>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={handlePrint}>
                    Print
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setViewingReceipt(null)}>
                    Close
                  </Button>
                </div>
              </div>

              <div className="receipt-print">
                <div className="mb-6 border-b border-gray-200 pb-4">
                  <h1 className="text-2xl font-bold text-gray-900">RECEIPT</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    {viewingReceipt.receipt_number}
                  </p>
                </div>

                <div className="mb-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Resident</span>
                    <span className="text-sm text-gray-900">{viewingReceipt.resident_name}</span>
                  </div>
                  {viewingReceipt.room_number && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Room</span>
                      <span className="text-sm text-gray-900">{viewingReceipt.room_number}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Rent Month</span>
                    <span className="text-sm text-gray-900">
                      {monthNames[viewingReceipt.billing_month - 1]} {viewingReceipt.billing_year}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Payment Date</span>
                    <span className="text-sm text-gray-900">
                      {formatDate(viewingReceipt.payment_date)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Payment Method</span>
                    <span className="text-sm text-gray-900">
                      {paymentMethodLabel[viewingReceipt.payment_method] ?? viewingReceipt.payment_method}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-900">Amount Paid</span>
                    <span className="text-base font-bold text-gray-900">
                      {formatCurrency(viewingReceipt.amount_paid)}
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between">
                    <span className="text-sm text-gray-500">Rent Amount</span>
                    <span className="text-sm text-gray-500">
                      {formatCurrency(viewingReceipt.rent_amount)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-4 text-center text-xs text-gray-400 print:block">
                  Generated on {formatDateTime(viewingReceipt.created_at)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-print,
          .receipt-print * {
            visibility: visible;
          }
          .receipt-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .fixed {
            position: static !important;
            background: white !important;
          }
        }
      `}</style>
    </div>
  )
}
