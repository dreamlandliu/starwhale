import { IResourceSchema } from '@/domain/base/schemas/resource'

export type IBaseImageSchema = IResourceSchema
export type IDeviceSchema = IResourceSchema

export interface IDeleteAgentSchema {
    serialNumber: string
}

export interface ISystemVersionSchema {
    id: string
    version: string
}

export interface IAgentSchema {
    connectedTime: number
    id: string
    ip: string
    serialNumber: string
    status: string
    version: string
}

export type ISystemSettingSchema = string

export type ISystemResource = {
    name: string
    max: number
    min: number
    defaults: number
}
export type ISystemResourcePool = {
    name: string
    nodeSelector: Record<string, string>
    resources: ISystemResource[]
}
