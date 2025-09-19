"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock, Calendar, Search, Download, MoreHorizontal } from "lucide-react"

// Mock booking data
const mockBookings = [
  {
    id: "1",
    bookingRef: "RB12345678",
    status: "confirmed",
    from: "New York",
    to: "Washington DC",
    date: "2024-01-15",
    departureTime: "06:30",
    arrivalTime: "09:45",
    trainName: "Express Elite",
    trainNumber: "EX001",
    seats: ["12A"],
    total: 97.5,
    passengers: 1,
  },
  {
    id: "2",
    bookingRef: "RB87654321",
    status: "upcoming",
    from: "Boston",
    to: "New York",
    date: "2024-01-20",
    departureTime: "14:30",
    arrivalTime: "18:45",
    trainName: "Business Express",
    trainNumber: "EX004",
    seats: ["8B", "8C"],
    total: 190.0,
    passengers: 2,
  },
  {
    id: "3",
    bookingRef: "RB11223344",
    status: "completed",
    from: "Chicago",
    to: "Detroit",
    date: "2023-12-10",
    departureTime: "10:00",
    arrivalTime: "15:45",
    trainName: "City Connect",
    trainNumber: "LC003",
    seats: ["15A"],
    total: 75.2,
    passengers: 1,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800 border-green-200"
    case "upcoming":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "completed":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "confirmed":
      return "Confirmed"
    case "upcoming":
      return "Upcoming"
    case "completed":
      return "Completed"
    case "cancelled":
      return "Cancelled"
    default:
      return status
  }
}

export function MyBookingsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.to.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && booking.status === activeTab
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-muted-foreground">Manage your train reservations and travel history</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by booking reference or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No bookings found</p>
                <Button onClick={() => (window.location.href = "/")}>Book Your First Trip</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={getStatusColor(booking.status)}>
                          {getStatusText(booking.status)}
                        </Badge>
                        <div>
                          <div className="font-semibold">{booking.trainName}</div>
                          <div className="text-sm text-muted-foreground">{booking.trainNumber}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg">${booking.total.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          {booking.passengers} {booking.passengers === 1 ? "passenger" : "passengers"}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center justify-between md:justify-start">
                        <div>
                          <div className="text-lg font-semibold">{booking.departureTime}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {booking.from}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center text-muted-foreground mb-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {(() => {
                              const dep = new Date(`2000-01-01 ${booking.departureTime}`)
                              const arr = new Date(`2000-01-01 ${booking.arrivalTime}`)
                              const diff = arr.getTime() - dep.getTime()
                              const hours = Math.floor(diff / (1000 * 60 * 60))
                              const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                              return `${hours}h ${minutes}m`
                            })()}
                          </span>
                        </div>
                        <div className="w-full h-px bg-border relative">
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end">
                        <div className="text-right">
                          <div className="text-lg font-semibold">{booking.arrivalTime}</div>
                          <div className="text-sm text-muted-foreground flex items-center justify-end">
                            <MapPin className="h-3 w-3 mr-1" />
                            {booking.to}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground flex items-center justify-center mb-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(booking.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground">Seats: {booking.seats.join(", ")}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Booking Ref: <span className="font-mono font-medium">{booking.bookingRef}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
