"use client"

import React, { useState } from "react"
import { MapPin } from 'lucide-react'
import { CardContent, Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast" // Assuming you have a hook for toast notifications
import { updateHospital } from '@/utils/fakeBackend'
import { Hospital } from "@/types"
import { Badge } from "@/components/ui/badge"

function HospitalInfoUpdater({ hospital, setHospital }: { hospital: Hospital, setHospital: React.Dispatch<React.SetStateAction<Hospital | null>> }): JSX.Element {
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<Hospital | null>(hospital)
    const { toast } = useToast()
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (formData) {
            const { name, value } = e.target
            setFormData({ ...formData, [name]: value })
        }
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData) {
            try {
                setIsEditing(false) // Exit edit mode
                await updateHospital(hospital.id, formData)
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
    return <Card>
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
        </CardHeader><CardContent>
            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            name="address"
                            value={formData?.address}
                            onChange={handleInputChange}
                            required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="region">Region</Label>
                            <Input
                                id="region"
                                name="region"
                                value={formData?.region || ""}
                                onChange={handleInputChange}
                                required />
                        </div>
                        <div>
                            <Label htmlFor="zone">Zone</Label>
                            <Input
                                id="zone"
                                name="zone"
                                value={formData?.zone}
                                onChange={handleInputChange} />
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
                                required />
                        </div>
                        <div>
                            <Label htmlFor="longitude">Longitude</Label>
                            <Input
                                id="longitude"
                                name="longitude"
                                type="number"
                                value={formData ? parseFloat(formData.longitude.toString()) : 0}
                                onChange={handleInputChange}
                                required />
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
}


export default HospitalInfoUpdater