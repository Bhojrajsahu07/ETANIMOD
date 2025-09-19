import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, MapPin } from "lucide-react"

const popularRoutes = [
  {
    from: "New York",
    to: "Washington DC",
    duration: "3h 20m",
    price: 89,
    frequency: "Every 30 mins",
  },
  {
    from: "Los Angeles",
    to: "San Francisco",
    duration: "12h 15m",
    price: 156,
    frequency: "3 times daily",
  },
  {
    from: "Chicago",
    to: "Detroit",
    duration: "5h 45m",
    price: 67,
    frequency: "4 times daily",
  },
  {
    from: "Boston",
    to: "New York",
    duration: "4h 10m",
    price: 95,
    frequency: "Every hour",
  },
  {
    from: "Seattle",
    to: "Portland",
    duration: "3h 30m",
    price: 45,
    frequency: "5 times daily",
  },
  {
    from: "Miami",
    to: "Orlando",
    duration: "5h 20m",
    price: 78,
    frequency: "3 times daily",
  },
]

export function FeaturedRoutes() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {popularRoutes.map((route, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{route.frequency}</span>
              </div>
              <div className="text-2xl font-bold text-primary">${route.price}</div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-lg">{route.from}</div>
                  <div className="text-sm text-muted-foreground">Departure</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-px bg-border"></div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {route.duration}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg">{route.to}</div>
                  <div className="text-sm text-muted-foreground">Arrival</div>
                </div>
              </div>
            </div>

            <Button
              className="w-full mt-4 group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors bg-transparent"
              variant="outline"
            >
              Book Now
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
