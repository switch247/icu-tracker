import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast" // Assuming you have a hook for toast notifications
import { createHospital } from "@/utils/fakeBackend"
export function CreateHospitalDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        region: '',
        zone: '',
        latitude: '',
        longitude: '',
        type: 'PUBLIC',
        level: 'PRIMARY',
        bedCapacity: '',
        icuBeds: '',
        availableIcuBeds: '',
        nonFunctionalBeds: '',
        advancedAmbulanceServices: false,
    })
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleInputChange = (e: any) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        })
    }

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault()
        setLoading(true)
        try {
            const dataToSubmit = {
                ...formData,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                bedCapacity: parseInt(formData.bedCapacity, 10),
                icuBeds: parseInt(formData.icuBeds, 10),
                availableIcuBeds: parseInt(formData.availableIcuBeds, 10),
                nonFunctionalBeds: parseInt(formData.nonFunctionalBeds, 10),
            }
            // Replace with your API call to create the hospital
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await createHospital(dataToSubmit as any)
            toast({
                title: "Hospital created successfully!",
                description: "The hospital details have been saved.",
                variant: "default", // Assuming `variant` is part of your toast options
            })
            setIsOpen(false)

        } catch (error) {
            console.error(error)
            toast({
                title: "Error creating hospital.",
                description: "Please try again later.",
                variant: "destructive", // Assuming this displays an error toast
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Create Hospital</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Create Hospital</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a new hospital.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Input fields */}
                    <div>
                        <Label htmlFor="name">Hospital Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <Label htmlFor="region">Region</Label>
                            <Input
                                id="region"
                                name="region"
                                value={formData.region}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="zone">Zone</Label>
                            <Input
                                id="zone"
                                name="zone"
                                value={formData.zone}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <Label htmlFor="latitude">Latitude</Label>
                            <Input
                                id="latitude"
                                name="latitude"
                                type="number"
                                value={parseFloat(formData.latitude)}
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
                                value={parseFloat(formData.longitude)}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <Label htmlFor="type">Type</Label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                            >
                                <option value="PUBLIC">Public</option>
                                <option value="PRIVATE">Private</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="level">Level</Label>
                            <select
                                name="level"
                                value={formData.level}
                                onChange={handleInputChange}
                            >
                                <option value="PRIMARY">Primary</option>
                                <option value="GENERAL">General</option>
                                <option value="TERTIARY">Tertiary</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="bedCapacity">Bed Capacity</Label>
                        <Input
                            id="bedCapacity"
                            name="bedCapacity"
                            type="number"
                            value={parseInt(formData.bedCapacity)}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="icuBeds">ICU Beds</Label>
                        <Input
                            id="icuBeds"
                            name="icuBeds"
                            type="number"
                            value={parseInt(formData.icuBeds)}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="availableIcuBeds">Available ICU Beds</Label>
                        <Input
                            id="availableIcuBeds"
                            name="availableIcuBeds"
                            type="number"
                            value={parseInt(formData.availableIcuBeds)}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="nonFunctionalBeds">Non-functional Beds</Label>
                        <Input
                            id="nonFunctionalBeds"
                            name="nonFunctionalBeds"
                            type="number"
                            value={parseInt(formData.nonFunctionalBeds)}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="flex justify-between">
                        <Label className="flex items-center space-x-2">
                            <Input
                                type="checkbox"
                                name="advancedAmbulanceServices"
                                checked={formData.advancedAmbulanceServices}
                                onChange={handleInputChange}
                            />
                            <span>Advanced Ambulance Services</span>
                        </Label>
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Hospital"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

