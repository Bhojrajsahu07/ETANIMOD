"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, ArrowRightLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function TrainSearchForm() {
  const [fromStation, setFromStation] = useState("")
  const [toStation, setToStation] = useState("")
  const [departureDate, setDepartureDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [passengers, setPassengers] = useState("1")
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way")
  const router = useRouter()

  const handleSwapStations = () => {
    const temp = fromStation
    setFromStation(toStation)
    setToStation(temp)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!fromStation || !toStation || !departureDate) {
      alert("Please fill in all required fields")
      return
    }

    // Navigate to search results with query parameters
    const searchParams = new URLSearchParams({
      from: fromStation,
      to: toStation,
      departure: departureDate,
      passengers,
      tripType,
      ...(tripType === "round-trip" && returnDate && { return: returnDate }),
    })

    router.push(`/search-results?${searchParams.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="space-y-6">
      {/* Trip Type Toggle */}
      <div className="flex gap-4 justify-center">
        <Button
          type="button"
          variant={tripType === "one-way" ? "default" : "outline"}
          onClick={() => setTripType("one-way")}
          className="px-6"
        >
          One Way
        </Button>
        <Button
          type="button"
          variant={tripType === "round-trip" ? "default" : "outline"}
          onClick={() => setTripType("round-trip")}
          className="px-6"
        >
          Round Trip
        </Button>
      </div>

      {/* Station Selection */}
      <div className="grid md:grid-cols-2 gap-4 relative">
        <div className="space-y-2">
          <Label htmlFor="from">From</Label>
          <Input
            id="from"
            placeholder="Departure station"
            value={fromStation}
            onChange={(e) => setFromStation(e.target.value)}
            className="text-lg py-3"
            required
          />
        </div>

        {/* Swap Button */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute left-1/2 top-8 -translate-x-1/2 z-10 bg-background border-2 hover:bg-muted"
          onClick={handleSwapStations}
        >
          <ArrowRightLeft className="h-4 w-4" />
        </Button>

        <div className="space-y-2">
          <Label htmlFor="to">To</Label>
          <Input
            id="to"
            placeholder="Arrival station"
            value={toStation}
            onChange={(e) => setToStation(e.target.value)}
            className="text-lg py-3"
            required
          />
        </div>
      </div>

      {/* Date Selection */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="departure">Departure Date</Label>
          <div className="relative">
            <Input
              id="departure"
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="text-lg py-3 pr-10"
              min={new Date().toISOString().split("T")[0]}
              required
            />
            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {tripType === "round-trip" && (
          <div className="space-y-2">
            <Label htmlFor="return">Return Date</Label>
            <div className="relative">
              <Input
                id="return"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="text-lg py-3 pr-10"
                min={departureDate || new Date().toISOString().split("T")[0]}
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Passengers */}
      <div className="space-y-2">
        <Label htmlFor="passengers">Passengers</Label>
        <select
          id="passengers"
          value={passengers}
          onChange={(e) => setPassengers(e.target.value)}
          className="w-full px-3 py-3 text-lg border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <option key={num} value={num.toString()}>
              {num} {num === 1 ? "Passenger" : "Passengers"}
            </option>
          ))}
        </select>
      </div>

      {/* Search Button */}
      <Button type="submit" size="lg" className="w-full text-lg py-6">
        Search Trains
      </Button>
    </form>
  )
}
