'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { register } from '@/utils/fakeBackend'
import { Region, UserRole } from '@/types'

export function CreateUserDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [region, setRegion] = useState<Region | null>(null)
    const [role, setRole] = useState<UserRole>('USER')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!name || !email || !password || !role || !phoneNumber) {
            setError('Please fill in all fields')
            return
        }

        try {
            setLoading(true)
            const user = await register({
                name,
                email,
                password,
                phoneNumber,
                role,
                isVerified: false
            })
            if (user) {
                setLoading(false)
                console.log(user)
                router.push('/auth/login')
                setIsOpen(false)
            } else {
                setLoading(false)
                setError('Registration failed. Please try again.')
            }
        } catch (err) {
            setLoading(false)
            const errorMessage = (err as any).response?.data?.error || (err as any).message || 'An unknown error occurred'
            setError(`An error occurred: ${errorMessage}. Please try again.`)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Create User</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Create User</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a new user.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                required
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">User</SelectItem>
                                    <SelectItem value="HOSPITAL_ADMIN">Hospital Admin</SelectItem>
                                    <SelectItem value="REGIONAL_ADMIN">Regional Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>


                        <div className="space-y-2">
                            <Label htmlFor="region">Region</Label>
                            <Select value={region || undefined} onValueChange={(value: string) => setRegion(value as Region)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select region" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ADDIS_ABABA">Addis Ababa</SelectItem>
                                    <SelectItem value="AFAR">Afar</SelectItem>
                                    <SelectItem value="AMHARA">Amhara</SelectItem>
                                    <SelectItem value="BENISHANGUL_GUMUZ">Benishangul Gumuz</SelectItem>
                                    <SelectItem value="CENTRAL_ETHIOPIA">Central Ethiopia</SelectItem>
                                    <SelectItem value="DIRE_DAWA">Dire Dawa</SelectItem>
                                    <SelectItem value="GAMBELA">Gambela</SelectItem>
                                    <SelectItem value="HARARI">Harari</SelectItem>
                                    <SelectItem value="OROMIA">Oromia</SelectItem>
                                    <SelectItem value="SIDAMA">Sidama</SelectItem>
                                    <SelectItem value="SOMALI">Somali</SelectItem>
                                    <SelectItem value="SOUTH_ETHIOPIA">South Ethiopia</SelectItem>
                                    <SelectItem value="SOUTH_WEST_ETHIOPIA_PEOPLES">South West Ethiopia Peoples</SelectItem>
                                    <SelectItem value="TIGRAY">Tigray</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Creating..." : "Create User"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
