"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, User, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

interface PassengerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  age: string
  seatPreference: "window" | "aisle" | "any"
}

export function BookingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const trainId = searchParams.get("trainId") || ""
  const from = searchParams.get("from") || ""
  const to = searchParams.get("to") || ""
  const departure = searchParams.get("departure") || ""
  const passengers = Number.parseInt(searchParams.get("passengers") || "1")
  const price = Number.parseFloat(searchParams.get("price") || "0")

  const [currentStep, setCurrentStep] = useState<"passenger-details" | "payment">("passenger-details")
  const [passengerDetails, setPassengerDetails] = useState<PassengerInfo[]>(
    Array.from({ length: passengers }, () => ({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      age: "",
      seatPreference: "any" as const,
    })),
  )
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const totalPrice = price * passengers
  const taxes = totalPrice * 0.08
  const finalTotal = totalPrice + taxes

  const updatePassengerDetail = (index: number, field: keyof PassengerInfo, value: string) => {
    const updated = [...passengerDetails]
    updated[index] = { ...updated[index], [field]: value }
    setPassengerDetails(updated)
  }

  const validatePassengerDetails = () => {
    return passengerDetails.every(
      (passenger) => passenger.firstName && passenger.lastName && passenger.email && passenger.phone && passenger.age,
    )
  }

  const handleContinueToPayment = () => {
    if (!validatePassengerDetails()) {
      alert("Please fill in all passenger details")
      return
    }
    setCurrentStep("payment")
  }

  const handleCompleteBooking = () => {
    if (!agreeToTerms) {
      alert("Please agree to the terms and conditions")
      return
    }

    if (paymentMethod === "card") {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        alert("Please fill in all payment details")
        return
      }
    }

    // Generate booking reference
    const bookingRef = "RB" + Math.random().toString(36).substr(2, 8).toUpperCase()

    // Navigate to confirmation page
    const confirmationParams = new URLSearchParams({
      bookingRef,
      from,
      to,
      departure,
      passengers: passengers.toString(),
      total: finalTotal.toFixed(2),
    })

    router.push(`/booking-confirmation?${confirmationParams.toString()}`)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div
              className={`flex items-center space-x-2 ${currentStep === "passenger-details" ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === "passenger-details" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                1
              </div>
              <span>Passenger Details</span>
            </div>
            <div className="w-12 h-px bg-border"></div>
            <div
              className={`flex items-center space-x-2 ${currentStep === "payment" ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === "payment" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                2
              </div>
              <span>Payment</span>
            </div>
          </div>

          {currentStep === "passenger-details" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Passenger Details</h2>

              {passengerDetails.map((passenger, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Passenger {index + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`firstName-${index}`}>First Name</Label>
                        <Input
                          id={`firstName-${index}`}
                          value={passenger.firstName}
                          onChange={(e) => updatePassengerDetail(index, "firstName", e.target.value)}
                          placeholder="Enter first name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`lastName-${index}`}>Last Name</Label>
                        <Input
                          id={`lastName-${index}`}
                          value={passenger.lastName}
                          onChange={(e) => updatePassengerDetail(index, "lastName", e.target.value)}
                          placeholder="Enter last name"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`email-${index}`}>Email</Label>
                        <Input
                          id={`email-${index}`}
                          type="email"
                          value={passenger.email}
                          onChange={(e) => updatePassengerDetail(index, "email", e.target.value)}
                          placeholder="Enter email address"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`phone-${index}`}>Phone</Label>
                        <Input
                          id={`phone-${index}`}
                          value={passenger.phone}
                          onChange={(e) => updatePassengerDetail(index, "phone", e.target.value)}
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`age-${index}`}>Age</Label>
                        <Input
                          id={`age-${index}`}
                          type="number"
                          value={passenger.age}
                          onChange={(e) => updatePassengerDetail(index, "age", e.target.value)}
                          placeholder="Enter age"
                          min="1"
                          max="120"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Seat Preference</Label>
                        <RadioGroup
                          value={passenger.seatPreference}
                          onValueChange={(value) => updatePassengerDetail(index, "seatPreference", value)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="window" id={`window-${index}`} />
                            <Label htmlFor={`window-${index}`}>Window</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="aisle" id={`aisle-${index}`} />
                            <Label htmlFor={`aisle-${index}`}>Aisle</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="any" id={`any-${index}`} />
                            <Label htmlFor={`any-${index}`}>Any</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={handleContinueToPayment} size="lg" className="w-full">
                Continue to Payment
              </Button>
            </div>
          )}

          {currentStep === "payment" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Payment Details</h2>
                <Button variant="outline" onClick={() => setCurrentStep("passenger-details")}>
                  Back to Details
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value: "card" | "paypal") => setPaymentMethod(value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Credit/Debit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                          placeholder="Enter cardholder name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "paypal" && (
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-muted-foreground">
                        You will be redirected to PayPal to complete your payment.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>

              <Button onClick={handleCompleteBooking} size="lg" className="w-full">
                Complete Booking - ${finalTotal.toFixed(2)}
              </Button>
            </div>
          )}
        </div>

        {/* Booking Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Route</span>
                  <span className="font-medium">
                    {from} → {to}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">
                    {new Date(departure).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Passengers</span>
                  <span className="font-medium">{passengers}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Ticket Price</span>
                  <span>
                    ${price.toFixed(2)} × {passengers}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Taxes & Fees</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">${finalTotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                <Shield className="h-4 w-4" />
                <span>Secure payment protected by SSL encryption</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
