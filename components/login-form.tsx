"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const success = login(email, password)

    if (success) {
      router.push("/my-bookings")
    } else {
      alert("Invalid credentials. Try demo@railway.com / password")
    }

    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <strong>Demo credentials:</strong>
          <br />
          Email: demo@railway.com
          <br />
          Password: password
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-emerald-600 hover:underline">
            Sign up
          </Link>
        </div>
        <Link href="/" className="text-sm text-emerald-600 hover:underline">
          Back to Home
        </Link>
      </CardFooter>
    </Card>
  )
}
