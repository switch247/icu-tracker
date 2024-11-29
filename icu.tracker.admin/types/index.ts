export type UserRole = 'USER' | 'HOSPITAL_ADMIN' | 'SUPER_ADMIN'

export type HospitalType = 'PUBLIC' | 'PRIVATE'

export type HospitalLevel = 'PRIMARY' | 'SECONDARY' | 'TERTIARY'

export interface User {
  id: string
  name: string
  phoneNumber: string
  isVerified: boolean
  email: string
  password?: string
  role: UserRole
  hospitalId?: string
  hospital?: Hospital
}

export interface Hospital {
  id: string
  name: string
  type: HospitalType
  level: HospitalLevel
  region: string
  zone: string
  address: string
  bedCapacity: number
  icuBeds: number
  latitude: number
  longitude: number
  availableIcuBeds: number
  nonFunctionalBeds: number
  advancedAmbulanceServices: boolean
}

export interface IcuHistory {
  id: string
  hospitalId: string
  date: Date
  totalBeds: number
  icuBeds: number
  availableIcuBeds: number
  nonFunctionalBeds: number
}



export interface HospitalCreationErrors {
  name?: string;
  address?: string;
  region?: string;
  zone?: string;
  latitude?: string;
  longitude?: string;
  type?: string;
  level?: string;
  bedCapacity?: string;
  icuBeds?: string;
  availableIcuBeds?: string;
  nonFunctionalBeds?: string;
  advancedAmbulanceServices?: string;
}
