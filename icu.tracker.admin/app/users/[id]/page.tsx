"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getUser } from '@/utils/fakeBackend'
import { HospitalCard } from "@/components/HospitalCard"
import { User } from "@/types"
import { updateUser } from "@/utils/fakeBackend"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"



export default function UserPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  async function approveUser(userId: string) {
    // Add your approve logic here
    console.log(`User ${userId} approved`)
    try {
      setLoading(true)
      await updateUser(userId, { isVerified: true });

      setUser(prevUser => prevUser ? { ...prevUser, isVerified: true } : null)


    } catch (error) {
      console.error(error)
      setLoading(false)

    } finally {
      setLoading(false)
    }
  }

  async function disApproveUser(userId: string) {
    // Add your approve logic here
    console.log(`User ${userId} approved`)
    try {
      setLoading(true)
      await updateUser(userId, { isVerified: false });

      setUser(prevUser => prevUser ? { ...prevUser, isVerified: false } : null)


    } catch (error) {
      console.error(error)
      setLoading(false)

    } finally {
      setLoading(false)
    }
  }



  useEffect(() => {
    async function fetchUser() {
      const fetchedUser = await getUser(params.id)
      if (!fetchedUser) {
        notFound()
      } else {
        setUser(fetchedUser)
      }
    }
    fetchUser()
  }, [params.id])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-evenly m-4">
        <Button variant="secondary" onClick={() => window.history.back()}>Back</Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this user? This action cannot be undone.</p>
            <DialogFooter>
              <DialogClose asChild>

                <Button variant="destructive" >Confirm</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{user.name}</CardTitle>
            <Badge>{user.role}</Badge>
            {user.isVerified && <Badge>{"verified"}</Badge>}
            {!user.isVerified && <Badge variant={"destructive"}>{"Unverified"}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
          </div>
          {user.hospitalId && (
            <div>
              <p className="text-sm text-muted-foreground">Hospital ID</p>
              <p>{user.hospitalId}</p>
            </div>
          )}
        </CardContent>
      </Card>
      {
        loading ? (
          <div className="flex justify-center mt-4">
            <div className="loader">loading ...</div>
          </div>
        ) :
          !user.isVerified ? (
            <div className="flex justify-end mt-4 mb-4">
              <button
                className="mr-2 px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => approveUser(user.id)}
              >
                Approve
              </button>

            </div>
          ) : (

            <div className="flex justify-end mt-4 mb-4">
              <button
                className="mr-2 px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => disApproveUser(user.id)}
              >
                Disapprove
              </button>

            </div>
          )}
      <br />
      {user.hospital && HospitalCard(user.hospital)}

    </div>
  )
}