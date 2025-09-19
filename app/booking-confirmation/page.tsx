"use client"

import { Suspense } from "react"
import { BookingConfirmationContent } from "@/components/booking-confirmation-content"
import { Header } from "@/components/header"

export default function BookingConfirmationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }
      >
        <BookingConfirmationContent />
      </Suspense>
    </div>
  )
}
