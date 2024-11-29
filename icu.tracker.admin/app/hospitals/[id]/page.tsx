"use client"

import React, { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast" // Assuming you have a hook for toast notifications
import { getHospital, getIcuHistory, updateHospital } from '@/utils/fakeBackend'
import { Hospital, IcuHistory } from "@/types"
import { IcuHistoryGraph } from "@/components/IcuHistoryGraph"
import { IcuHistoryTable } from '@/components/IcuHistoryTable'
import { Toaster } from "@/components/ui/toaster"
import { deleteHospital } from "@/utils/fakeBackend"

export default function HospitalPage({ params }: { params: { id: string } }) {
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const [hospitalHistory, setHospitalHistory] = useState<IcuHistory[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Hospital | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchHospital() {
      const data = await getHospital(params.id)
      const historydata = await getIcuHistory(params.id)
      if (!data) {
        notFound()
      } else {
        setHospital(data)
        setHospitalHistory(historydata)
        setFormData(data) // Initialize form data for editing
      }
    }
    fetchHospital()
  }, [params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      const { name, value } = e.target
      setFormData({ ...formData, [name]: value })
    }
  }
  const hadleDelete = async () => {
    try {
      await deleteHospital(params.id)
      toast({ title: "Hospital deleted successfully!", description: "success", style: { backgroundColor: 'green', color: 'white' } })
      window.history.back()
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Failed to delete Hospital. Please try again.",
        style: { backgroundColor: 'red', color: 'white' }
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData) {
      try {
        setIsEditing(false) // Exit edit mode
        await updateHospital(params.id, formData)
        setHospital(formData) // Update the displayed hospital info
        toast({ title: "Hospital updated successfully!", description: "success", style: { backgroundColor: 'green', color: 'white' } })
      } catch (error) {
        console.log(error)
        toast({
          title: "Error",
          description: "Failed to update Hospital. Please try again.",
          style: { backgroundColor: 'red', color: 'white' }

        })
      } finally {
        setIsEditing(false) // Exit edit mode
      }
    }
  }

  if (!hospital) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Toaster />
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
              <p>Are you sure you want to delete this hospital? This action cannot be undone.</p>
              <DialogFooter>
                <DialogClose asChild>

                  <Button variant="destructive" onClick={hadleDelete}>Confirm</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{hospital.name}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={hospital.type === "PUBLIC" ? "default" : "secondary"}>
                      {hospital.type}
                    </Badge>
                    <Badge variant="outline">{hospital.level}</Badge>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData?.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="region">Region</Label>
                      <Input
                        id="region"
                        name="region"
                        value={formData?.region || ""}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zone">Zone</Label>
                      <Input
                        id="zone"
                        name="zone"
                        value={formData?.zone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        name="latitude"
                        type="number"
                        value={formData ? parseFloat(formData.latitude.toString()) : 0}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        name="longitude"
                        type="number"
                        value={formData ? parseFloat(formData.longitude.toString()) : 0}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{hospital.address}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Region</p>
                      <p>{hospital.region}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Zone</p>
                      <p>{hospital.zone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Latitude</p>
                      <p>{hospital.latitude}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Longitude</p>
                      <p>{hospital.longitude}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Capacity Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Beds</p>
                    <p className="text-2xl font-bold">{hospital.bedCapacity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ICU Beds</p>
                    <p className="text-2xl font-bold">{hospital.icuBeds}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Available ICU Beds</p>
                    <p className="text-2xl font-bold">{hospital.availableIcuBeds}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Non-functional Beds</p>
                    <p className="text-2xl font-bold">{hospital.nonFunctionalBeds}</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Badge variant={hospital.advancedAmbulanceServices ? "default" : "secondary"}>
                      {hospital.advancedAmbulanceServices ? "Available" : "Not Available"}
                    </Badge>
                    Advanced Ambulance Services
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <br />
        {IcuHistoryTable(hospitalHistory)}
        <br />
        {IcuHistoryGraph(hospitalHistory)}
      </div>
    </>

  )
}