import { Header } from "@/components/header"
import { MyBookingsContent } from "@/components/my-bookings-content"

export default function MyBookingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MyBookingsContent />
    </div>
  )
}
