import { WorkOut } from "./workout"

export type User = {
    id: string
    bloodType: string
    date: date
    email: string
    fullname: string
    gender: string
    healthConditions: string
    height: number
    job: string
    password: string
    username: string
    weight: number
    workouts: WorkOut[]
    nutrition: nutrition[]
    address: string
    
}