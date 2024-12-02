'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
export default function HomePage() {
  const { user } = useAuth()
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Icu Tracker System</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {user && (user.role == "SUPER_ADMIN") && (
          <>
          <Link href="/hospitals">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Hospitals</CardTitle>
                <CardDescription>View and manage hospitals</CardDescription>
              </CardHeader>
              <CardContent>
                Browse through the list of hospitals, view their details, and check ICU bed availability.
              </CardContent>
            </Card>
          </Link>
          <Link href="/users">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage system users</CardDescription>
              </CardHeader>
              <CardContent>
                View and manage users of the Icu Tracker System.
              </CardContent>
            </Card>
          </Link>
        </>

        )}
        {user && (user.role != "SUPER_ADMIN") && (<Link href="/my-hospital">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>My Hospital</CardTitle>
              <CardDescription>Manage your hospital</CardDescription>
            </CardHeader>
            <CardContent>
              Update ICU status and view history for your hospital.
            </CardContent>
          </Card>
        </Link>)}


      </div>
    </div>
  )
}

