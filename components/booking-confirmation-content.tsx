"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, Mail, MapPin, Clock, Calendar, Users, Smartphone, Printer } from "lucide-react"
import { useRouter } from "next/navigation"

export function BookingConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const bookingRef = searchParams.get("bookingRef") || ""
  const from = searchParams.get("from") || ""
  const to = searchParams.get("to") || ""
  const departure = searchParams.get("departure") || ""
  const passengers = searchParams.get("passengers") || "1"
  const total = searchParams.get("total") || "0"

  const [emailSent, setEmailSent] = useState(false)

  // Mock booking details - in a real app, this would come from the database
  const bookingDetails = {
    bookingReference: bookingRef,
    status: "Confirmed",
    trainNumber: "EX001",
    trainName: "Express Elite",
    departureTime: "06:30",
    arrivalTime: "09:45",
    duration: "3h 15m",
    platform: "Platform 3",
    coach: "B",
    seats: passengers === "1" ? ["12A"] : ["12A", "12B", "12C", "12D"].slice(0, Number.parseInt(passengers)),
    bookingDate: new Date().toISOString(),
    passengerNames:
      passengers === "1"
        ? ["John Doe"]
        : Array.from({ length: Number.parseInt(passengers) }, (_, i) => `Passenger ${i + 1}`),
  }

  const handleSendEmail = () => {
    // Simulate sending email
    setTimeout(() => {
      setEmailSent(true)
    }, 1000)
  }

  const handleDownloadTicket = () => {
    // In a real app, this would generate and download a PDF ticket
    alert("Ticket download would start here")
  }

  const handlePrintTicket = () => {
    window.print()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
        <p className="text-lg text-muted-foreground">Your train tickets have been successfully booked</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Ticket Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Reference */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Booking Reference</h2>
                  <p className="text-3xl font-bold text-primary tracking-wider">{bookingDetails.bookingReference}</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  {bookingDetails.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Please keep this reference number for your records. You'll need it for any changes or inquiries.
              </p>
            </CardContent>
          </Card>

          {/* Journey Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Journey Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Route and Date */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Route</div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{from}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-semibold">{to}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Travel Date</div>
                  <div className="font-semibold">
                    {new Date(departure).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Train Information */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Train</div>
                  <div>
                    <div className="font-semibold">{bookingDetails.trainName}</div>
                    <div className="text-sm text-muted-foreground">{bookingDetails.trainNumber}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Departure</div>
                  <div>
                    <div className="font-semibold text-lg">{bookingDetails.departureTime}</div>
                    <div className="text-sm text-muted-foreground">{bookingDetails.platform}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Arrival</div>
                  <div>
                    <div className="font-semibold text-lg">{bookingDetails.arrivalTime}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {bookingDetails.duration}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Seat Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Coach & Seats</div>
                  <div className="font-semibold">
                    Coach {bookingDetails.coach} - Seats {bookingDetails.seats.join(", ")}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Passengers
                  </div>
                  <div className="space-y-1">
                    {bookingDetails.passengerNames.map((name, index) => (
                      <div key={index} className="text-sm font-medium">
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card>
            <CardHeader>
              <CardTitle>Important Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Before You Travel</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Arrive at the station 30 minutes before departure</li>
                    <li>• Bring a valid photo ID for verification</li>
                    <li>• Check platform information on arrival</li>
                    <li>• Keep your ticket accessible during the journey</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cancellation Policy</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Free cancellation up to 24 hours before departure</li>
                    <li>• 50% refund for cancellations within 24 hours</li>
                    <li>• No refund for no-shows</li>
                    <li>• Changes subject to availability and fees</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Your Ticket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleDownloadTicket} className="w-full" variant="default">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={handlePrintTicket} className="w-full bg-transparent" variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print Ticket
              </Button>
              <Button
                onClick={handleSendEmail}
                className="w-full bg-transparent"
                variant="outline"
                disabled={emailSent}
              >
                <Mail className="h-4 w-4 mr-2" />
                {emailSent ? "Email Sent!" : "Email Ticket"}
              </Button>
            </CardContent>
          </Card>

          {/* Mobile Ticket */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Mobile Ticket
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                <div className="w-16 h-16 bg-muted rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <div className="w-8 h-8 bg-foreground rounded-sm"></div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Scan this QR code at the station for quick entry</p>
                <p className="text-xs text-muted-foreground">QR code will be sent to your email</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Booking Total</span>
                <span>${total}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Payment Method</span>
                <span>•••• 1234</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Transaction ID</span>
                <span>TXN{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Paid</span>
                <span className="text-green-600">${total}</span>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => router.push("/my-bookings")} className="w-full" variant="outline">
                View All Bookings
              </Button>
              <Button onClick={() => router.push("/")} className="w-full" variant="outline">
                Book Another Trip
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
