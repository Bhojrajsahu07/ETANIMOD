"use client"

import { Suspense } from "react"
import { BookingContent } from "@/components/booking-content"
import { Header } from "@/components/header"

export default function BookingPage() {
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
        <BookingContent />
      </Suspense>
    </div>
  )
}
