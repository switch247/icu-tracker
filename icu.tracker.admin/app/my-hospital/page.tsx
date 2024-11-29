'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from '@/contexts/AuthContext'
import { getHospital, updateIcuStatus, getIcuHistory } from '@/utils/fakeBackend'
import { Hospital, IcuHistory } from '@/types'
import { HospitalCard } from '@/components/HospitalCard'
import { IcuHistoryGraph } from '@/components/IcuHistoryGraph'
import { IcuHistoryTable } from '@/components/IcuHistoryTable'


export default function MyHospitalPage() {
  const { user } = useAuth()
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const { toast } = useToast()
  const [icuHistories, setIcuHistories] = useState<IcuHistory[]>([])
  const [formData, setFormData] = useState({
    bedCapacity: 0,
    icuBeds: 0,
    availableIcuBeds: 0,
    nonFunctionalBeds: 0,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const hospitalData = await getHospital(user.hospitalId!)
        if (hospitalData) {
          setHospital(hospitalData)
          setFormData({
            bedCapacity: hospitalData.bedCapacity,
            icuBeds: hospitalData.icuBeds,
            availableIcuBeds: hospitalData.availableIcuBeds,
            nonFunctionalBeds: hospitalData.nonFunctionalBeds,
          })
          const histories = await getIcuHistory(hospitalData.id)
          setIcuHistories(histories)
        }
      }
    }
    fetchData()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (hospital) {
      try {
        const updatedHospital = await updateIcuStatus(hospital.id, formData) as { status: number, data: Hospital }
        if (updatedHospital && updatedHospital.status === 200) {
          setHospital(updatedHospital.data)

          setIsEditing(false) // Exit edit mode after update
          toast({
            title: "Success",
            description: "ICU status updated successfully.",
            style: { backgroundColor: 'green', color: 'white' }

          })

        }

      } catch (error) {
        console.log(error)
        toast({
          title: "Error",
          description: "Failed to update ICU status. Please try again.",
          style: { backgroundColor: 'red', color: 'white' }

        })
        setIsEditing(false) // Exit edit mode after update
        setLoading(false)
      } finally {
        setIsEditing(false) // Exit edit mode after update
        setLoading(false)
      }
    }

  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: parseInt(e.target.value, 10),
    })
  }



  if (!hospital) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              You are not associated with any hospital.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {hospital && HospitalCard(hospital)}
      <div className="flex justify-between items-center m-2">
        <h1 className="text-3xl font-bold">{hospital.name}</h1>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Update Capacity"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            {!isEditing && <CardTitle className="text-sm font-medium">Total Beds</CardTitle>}
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="bedCapacity">Bed Capacity</Label>
                <Input
                  id="bedCapacity"
                  name="bedCapacity"
                  type="number"
                  value={formData.bedCapacity}
                  onChange={handleInputChange}
                />
              </div>
            ) : (
              <div className="text-2xl font-bold">{hospital.bedCapacity}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            {!isEditing && <CardTitle className="text-sm font-medium">ICU Beds</CardTitle>}
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="icuBeds">ICU Beds</Label>
                <Input
                  id="icuBeds"
                  name="icuBeds"
                  type="number"
                  value={formData.icuBeds}
                  onChange={handleInputChange}
                />
              </div>
            ) : (
              <div className="text-2xl font-bold">{hospital.icuBeds}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            {!isEditing && <CardTitle className="text-sm font-medium">Available ICU Beds</CardTitle>}
          </CardHeader>

          <CardContent>
            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="availableIcuBeds">Available ICU Beds</Label>
                <Input
                  id="availableIcuBeds"
                  name="availableIcuBeds"
                  type="number"
                  value={formData.availableIcuBeds}
                  onChange={handleInputChange}
                />
              </div>
            ) : (<div className="text-2xl font-bold">{hospital.availableIcuBeds}</div>

            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            {!isEditing && <CardTitle className="text-sm font-medium">Non-functional Beds</CardTitle>}
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="nonFunctionalBeds">Non-functional Beds</Label>
                <Input
                  id="nonFunctionalBeds"
                  name="nonFunctionalBeds"
                  type="number"
                  value={formData.nonFunctionalBeds}
                  onChange={handleInputChange}
                />
              </div>
            ) : (
              <div className="text-2xl font-bold">{hospital.nonFunctionalBeds}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {isEditing && (
        <div className="flex justify-end mt-4">
          {!loading ?
            <Button type="submit" onClick={handleSubmit}>
              Update
            </Button>
            :
            <Button disabled>
              Update
            </Button>}
        </div>
      )}
      <br />

      {/* Assuming IcuHistoryTable and IcuHistoryGraph are defined elsewhere */}
      {IcuHistoryTable(icuHistories)}
      {IcuHistoryGraph(icuHistories)}
    </div>
  )
}


