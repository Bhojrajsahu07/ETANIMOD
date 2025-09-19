"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("railway-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("railway-user")
      }
    }
    setIsLoading(false)
  }, [])

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

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
