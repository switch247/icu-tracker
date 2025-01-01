/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { User, Hospital, IcuHistory } from '@/types'
import { get, put, post, del } from './api_helper'

// Simulated database
// let users: User[] = [
//   { id: '1', name: 'John Doe', email: 'john@example.com', role: 'USER', password: 'password' },
//   { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'HOSPITAL_ADMIN', password: 'password', hospitalId: '1' },
//   { id: '3', name: 'Jane Smith', email: 'jefery@example.com', role: 'SUPER_ADMIN', password: 'password', hospitalId: '1' },
// ]

// let hospitals: Hospital[] = [
//   {
//     id: '1',
//     name: 'Central Hospital',
//     address: '123 Main St',
//     region: 'Central',
//     zone: 'Urban',
//     type: 'PUBLIC',
//     level: 'TERTIARY',
//     bedCapacity: 500,
//     icuBeds: 50,
//     availableIcuBeds: 10,
//     nonFunctionalBeds: 5,
//     advancedAmbulanceServices: true,
//   },
// ]

// let icuHistories: IcuHistory[] = [
//   {
//     id: '1',
//     hospitalId: '1',
//     date: new Date(),
//     totalBeds: 500,
//     icuBeds: 50,
//     availableIcuBeds: 10,
//     nonFunctionalBeds: 5,
//   },
// ]

// Utility functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Auth functions
export const login = async (email: string, password: string): Promise<{ user: User, token: string } | null> => {
  await delay(500) // Simulate network delay
  const response = await post("auth/login", { email, password })
  const { user, token } = response.data
  if (user) {
    const { password, ...userWithoutPassword } = user
    return { user: { ...userWithoutPassword }, token }
  }
  return null
}

export const register = async (user: Omit<User, 'id'>): Promise<User | null> => {
  const response = await post("auth/register", { ...user })
  const newUser = response.data
  if (newUser) {
    const { password, ...userWithoutPassword } = newUser

    return userWithoutPassword
  }
  return null
}

// Data fetching functions
export const getHospitals = async (config?: Record<string, any>): Promise<Hospital[]> => {
  // console.log(config?.params?.region)
  const region_filter = config?.params?.region
  const data = await get('hospitals', config).then((response) => {
    return response.data
  })
  // console.log(region_filter == undefined)
  if (region_filter == null || region_filter == undefined || region_filter == '') {
    return data;
  } else {
    return data.filter((hospital: Hospital) => hospital.region === config?.params?.region)
  }
}

export const getHospital = async (id: string): Promise<Hospital | null> => {
  return await get(`hospitals/${id}`).then((response) => {
    return response
  })
}

export const getUsers = async (config?: Record<string, any>): Promise<User[]> => {

  const data = await get('users', config).then((response) => {
    return response.map((user: User) => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })
  })
  const region_filter = config?.params?.region

  if (region_filter == null || region_filter == undefined || region_filter == '') {
    return data;
  } else {
    return data.filter((user: User) => user.region === config?.params?.region)
  }
}

export const getUser = async (id: string): Promise<User | null> => {
  const user = await get(`users/${id}`);
  if (user) {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}

export const updateUser = async (id: string, data: Partial<User>): Promise<User | null> => {
  const response = await put(`users/${id}`, data)
  return response.data
}

export const updateProfile = async (id: string, data: Partial<User>): Promise<User | null> => {
  const response = await put(`users/${id}`, data)
  return response.data
}

export const getMyHospital = async (userId: string): Promise<Hospital | null> => {
  const resp = await getUser(userId)
  if (resp) {
    return resp.hospital ?? null
  }
  return null
}

export const deleteUser = async (userId: string): Promise<unknown | null> => {
  return await del(`users/${userId}`)
}

// TODO: Make this functional
export const deleteHospital = async (hospitalId: string): Promise<unknown | null> => {
  return await del(`hospitals/${hospitalId}`)
}

export const createHospital = async (data: Partial<Hospital>): Promise<Hospital | null | unknown> => {
  return await post('hospitals', data)
}

export const updateHospital = async (hospitalId: string, data: Partial<Hospital>): Promise<Hospital | null | unknown> => {
  return await put(`hospitals/${hospitalId}`, data)
}


export const updateIcuStatus = async (hospitalId: string, data: Partial<Hospital>): Promise<Hospital | null | unknown> => {
  return await put(`hospitals/${hospitalId}`, data)
}

export const getIcuHistory = async (hospitalId: string): Promise<IcuHistory[]> => {
  return await get(`hospitals/${hospitalId}/history`).then((response) => {
    return response
  })
}

