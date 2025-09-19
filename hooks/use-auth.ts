"use client"

import { useState, useEffect, createContext, useContext } from "react"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  register: (userData: any) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const context = useContext(AuthContext)

  useEffect(() => {
    const savedUser = localStorage.getItem("railway-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  if (context === undefined) {
    // Return a mock implementation for demo purposes

    const login = (email: string, password: string) => {
      // Demo login - accept demo@railway.com / password
      if (email === "demo@railway.com" && password === "password") {
        const demoUser = {
          id: "1",
          email: "demo@railway.com",
          firstName: "Demo",
          lastName: "User",
        }
        setUser(demoUser)
        localStorage.setItem("railway-user", JSON.stringify(demoUser))
        return true
      }
      return false
    }

    const register = (userData: any) => {
      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      }
      setUser(newUser)
      localStorage.setItem("railway-user", JSON.stringify(newUser))
      return true
    }

    const logout = () => {
      setUser(null)
      localStorage.removeItem("railway-user")
    }

    return {
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }
  }
  return context
}
