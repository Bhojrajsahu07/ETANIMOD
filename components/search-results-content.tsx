"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Users, Wifi, Coffee, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

interface Train {
  id: string
  trainNumber: string
  name: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  availableSeats: number
  amenities: string[]
  trainType: "Express" | "Local" | "High-Speed"
}

// Mock train data - in a real app, this would come from an API
const generateTrainResults = (from: string, to: string, date: string): Train[] => {
  const baseTrains = [
    {
      id: "1",
      trainNumber: "EX001",
      name: "Express Elite",
      departureTime: "06:30",
      arrivalTime: "09:45",
      duration: "3h 15m",
      price: 89,
      availableSeats: 45,
      amenities: ["wifi", "food", "power"],
      trainType: "Express" as const,
    },
    {
      id: "2",
      trainNumber: "HS002",
      name: "Lightning Rail",
      departureTime: "08:15",
      arrivalTime: "10:50",
      duration: "2h 35m",
      price: 156,
      availableSeats: 23,
      amenities: ["wifi", "food", "power"],
      trainType: "High-Speed" as const,
    },
    {
      id: "3",
      trainNumber: "LC003",
      name: "City Connect",
      departureTime: "10:00",
      arrivalTime: "14:20",
      duration: "4h 20m",
      price: 67,
      availableSeats: 78,
      amenities: ["wifi"],
      trainType: "Local" as const,
    },
    {
      id: "4",
      trainNumber: "EX004",
      name: "Business Express",
      departureTime: "14:30",
      arrivalTime: "17:45",
      duration: "3h 15m",
      price: 95,
      availableSeats: 34,
      amenities: ["wifi", "food", "power"],
      trainType: "Express" as const,
    },
    {
      id: "5",
      trainNumber: "HS005",
      name: "Rapid Transit",
      departureTime: "18:00",
      arrivalTime: "20:25",
      duration: "2h 25m",
      price: 145,
      availableSeats: 12,
      amenities: ["wifi", "food", "power"],
      trainType: "High-Speed" as const,
    },
  ]

  return baseTrains
}

const getAmenityIcon = (amenity: string) => {
  switch (amenity) {
    case "wifi":
      return <Wifi className="h-4 w-4" />
    case "food":
      return <Coffee className="h-4 w-4" />
    case "power":
      return <Zap className="h-4 w-4" />
    default:
      return null
  }
}

const getTrainTypeColor = (type: string) => {
  switch (type) {
    case "High-Speed":
      return "bg-red-100 text-red-800 border-red-200"
    case "Express":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Local":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function SearchResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [trains, setTrains] = useState<Train[]>([])
  const [loading, setLoading] = useState(true)

  const from = searchParams.get("from") || ""
  const to = searchParams.get("to") || ""
  const departure = searchParams.get("departure") || ""
  const passengers = searchParams.get("passengers") || "1"
  const tripType = searchParams.get("tripType") || "one-way"

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const results = generateTrainResults(from, to, departure)
      setTrains(results)
      setLoading(false)
    }, 1000)
  }, [from, to, departure])

  const handleSelectTrain = (train: Train) => {
    const bookingParams = new URLSearchParams({
      trainId: train.id,
      from,
      to,
      departure,
      passengers,
      tripType,
      price: train.price.toString(),
    })

    router.push(`/booking?${bookingParams.toString()}`)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Search Summary */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          {from} → {to}
        </h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>
            {new Date(departure).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>•</span>
          <span>
            {passengers} {passengers === "1" ? "Passenger" : "Passengers"}
          </span>
          <span>•</span>
          <span className="capitalize">{tripType.replace("-", " ")}</span>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {trains.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No trains found for your search criteria.</p>
              <Button variant="outline" className="mt-4 bg-transparent" onClick={() => router.back()}>
                Modify Search
              </Button>
            </CardContent>
          </Card>
        ) : (
          trains.map((train) => (
            <Card key={train.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getTrainTypeColor(train.trainType)}>
                      {train.trainType}
                    </Badge>
                    <div>
                      <div className="font-semibold">{train.name}</div>
                      <div className="text-sm text-muted-foreground">{train.trainNumber}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">${train.price}</div>
                    <div className="text-sm text-muted-foreground">per person</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-semibold">{train.departureTime}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {from}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center text-muted-foreground mb-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">{train.duration}</span>
                    </div>
                    <div className="w-full h-px bg-border relative">
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <div className="text-xl font-semibold">{train.arrivalTime}</div>
                      <div className="text-sm text-muted-foreground flex items-center justify-end">
                        <MapPin className="h-3 w-3 mr-1" />
                        {to}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {train.amenities.map((amenity) => (
                        <div key={amenity} className="text-muted-foreground" title={amenity}>
                          {getAmenityIcon(amenity)}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      {train.availableSeats} seats left
                    </div>
                  </div>

                  <Button onClick={() => handleSelectTrain(train)} className="px-8">
                    Select
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
