"use client"

import React, { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast" // Assuming you have a hook for toast notifications
import { getHospital, getIcuHistory, deleteHospital } from '@/utils/fakeBackend'
import { Hospital, IcuHistory } from "@/types"
import { IcuHistoryGraph } from "@/components/IcuHistoryGraph"
import { IcuHistoryTable } from '@/components/IcuHistoryTable'
import { Toaster } from "@/components/ui/toaster"
import HospitalInfoUpdater from "../components/HospitalInfoUpdater"
import { Spinner } from '@/components/ui/spinner';



export default function HospitalPage({ hospital: initialHospital }: { hospital: Hospital }) {
    const [hospital, setHospital] = useState<Hospital | null>(initialHospital)
    const [hospitalHistory, setHospitalHistory] = useState<IcuHistory[]>([])
    // const [isEditing, setIsEditing] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        async function fetchHospital() {
            const data = await getHospital(initialHospital.id)
            const historydata = await getIcuHistory(initialHospital.id)
            if (!data) {
                notFound()
            } else {
                setHospital(data)
                setHospitalHistory(historydata)
            }
        }
        fetchHospital()
    }, [initialHospital])


    const hadleDelete = async () => {
        try {
            await deleteHospital(initialHospital.id)
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



    if (!hospital) {
        return <div className="flex h-screen justify-center items-center">      <Spinner />    </div>
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

                    <HospitalInfoUpdater hospital={hospital} setHospital={setHospital} />

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
                                <div className="pt-4 border-t mb-4">
                                    <div className="flex flex-wrap">

                                        <div className="border border-gray-200 p-1 rounded m-1">
                                            <p className="text-sm text-muted-foreground">General Icu Beds</p>
                                            <p className="text-2xl font-bold">{hospital.general}</p>
                                        </div>
                                        <div className="border border-gray-200 p-1 rounded m-1">
                                            <p className="text-sm text-muted-foreground">Medical Beds</p>
                                            <p className="text-2xl font-bold">{hospital.medical}</p>
                                        </div>
                                        <div className="border border-gray-200 p-1 rounded m-1">
                                            <p className="text-sm text-muted-foreground">Surgical Beds</p>
                                            <p className="text-2xl font-bold">{hospital.surgical}</p>
                                        </div>
                                        <div className="border border-gray-200 p-1 rounded m-1">
                                            <p className="text-sm text-muted-foreground">Pediatrics Beds</p>
                                            <p className="text-2xl font-bold">{hospital.pediatrics}</p>
                                        </div>
                                        <div className="border border-gray-200 p-1 rounded m-1">
                                            <p className="text-sm text-muted-foreground">Cardiac Beds</p>
                                            <p className="text-2xl font-bold">{hospital.cardiac}</p>
                                        </div>
                                        <div className="border border-gray-200 p-1 rounded m-1">
                                            <p className="text-sm text-muted-foreground">Maternal Beds</p>
                                            <p className="text-2xl font-bold">{hospital.maternal}</p>
                                        </div>
                                        <div className="border border-gray-200 p-1 rounded m-1">
                                            <p className="text-sm text-muted-foreground">Other ICU Beds</p>
                                            <p className="text-2xl font-bold">{hospital.otherICU}</p>
                                        </div>
                                    </div>

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
