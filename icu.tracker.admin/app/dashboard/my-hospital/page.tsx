"use client"

import { useState } from "react"
import { Bed } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IcuHistoryGraph } from "@/components/IcuHistoryGraph"

export default function MyHospitalPage() {
  const [isEditing, setIsEditing] = useState(false)
  
  // TODO: Fetch hospital data
  const hospital = {
    id: "1",
    name: "Central Hospital",
    bedCapacity: 500,
    icuBeds: 50,
    availableIcuBeds: 10,
    nonFunctionalBeds: 5,
    icuHistories: [
      {
        date: "2024-01-01",
        availableIcuBeds: 10,
      },
      {
        date: "2024-01-02",
        availableIcuBeds: 12,
      },
      // Add more data points
    ],
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{hospital.name}</h1>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Save Changes" : "Update Capacity"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="bedCapacity">Bed Capacity</Label>
                <Input
                  id="bedCapacity"
                  type="number"
                  defaultValue={hospital.bedCapacity}
                />
              </div>
            ) : (
              <div className="text-2xl font-bold">{hospital.bedCapacity}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ICU Beds</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="icuBeds">ICU Beds</Label>
                <Input
                  id="icuBeds"
                  type="number"
                  defaultValue={hospital.icuBeds}
                />
              </div>
            ) : (
              <div className="text-2xl font-bold">{hospital.icuBeds}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available ICU Beds</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="availableIcuBeds">Available ICU Beds</Label>
                <Input
                  id="availableIcuBeds"
                  type="number"
                  defaultValue={hospital.availableIcuBeds}
                />
              </div>
            ) : (
              <div className="text-2xl font-bold">{hospital.availableIcuBeds}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non-functional Beds</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="nonFunctionalBeds">Non-functional Beds</Label>
                <Input
                  id="nonFunctionalBeds"
                  type="number"
                  defaultValue={hospital.nonFunctionalBeds}
                />
              </div>
            ) : (
              <div className="text-2xl font-bold">{hospital.nonFunctionalBeds}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {IcuHistoryGraph(hospital.icuHistories)}
    </div>
  )
}

