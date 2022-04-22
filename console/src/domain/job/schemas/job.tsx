import { IResourceSchema } from '@/domain/base/schemas/resource'
import { IUserSchema } from '@user/schemas/user'
import { IModelSchema } from '@model/schemas/model'
import { IDatasetSchema } from '@dataset/schemas/dataset'
import { IModelVersionSchema } from '@/domain/model/schemas/modelVersion'
import { IBaseImageSchema, IDeviceSchema } from '../../runtime/schemas/runtime'
import { IIndicator } from '@/components/Indicator/types'

export type JobActionType = 'cancel' | 'suspend' | 'resume'
export enum JobStatusType {
    preparing = 0,
    runnning,
    completed,
    cancelling,
    cancelled,
    failed,
}

export interface IJobSchema extends IResourceSchema {
    uuid: string
    name: string
    owner?: IUserSchema
    modelName?: string
    modelVersion?: string
    dataset?: IDatasetSchema
    baseImage?: IBaseImageSchema
    device?: IDeviceSchema
    deviceCount: number
    duration: number
    createTime: number
    stopTime: number
    jobStatus: JobStatusType
}

export interface IJobDetailSchema extends IJobSchema {}

export interface IUpdateJobSchema {}

export interface ICreateJobSchema {
    modelVersionId: string
    datasetVersionIds?: string
    baseImageId?: string
    deviceId?: string
    deviceCount?: number
    // resultOutputPath?: string
}

export interface IJobFormSchema extends IJobSchema {
    modelId: string
    datasetId: string
    datasetVersionId: string
    datasetVersionIdsArr?: Array<string>
}
export interface ICreateJobFormSchema extends ICreateJobSchema {
    modelId: string
    datasetId: string
    datasetVersionId: string
    datasetVersionIdsArr?: Array<string>
}

export type IJobResultSchema = any
