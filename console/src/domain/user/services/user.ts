import axios from 'axios'
import { IListQuerySchema, IListSchema } from '@/domain/base/schemas/list'
import { IProjectRoleSchema } from '@project/schemas/project'
import {
    IUserSchema,
    ILoginUserSchema,
    IChangePasswordSchema,
    ICloudLoginRespSchema,
    ISignupUserSchema,
} from '../schemas/user'

export async function loginUser(data: ILoginUserSchema): Promise<IUserSchema> {
    const bodyFormData = new FormData()
    bodyFormData.append('userName', data.userName)
    bodyFormData.append('userPwd', data.userPwd)

    const resp = await axios({
        method: 'post',
        url: '/api/v1/login',
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data' },
    })

    return resp.data
}

export async function fetchUser(userName: string): Promise<IUserSchema> {
    const resp = await axios.get<IUserSchema>(`/api/v1/users/${userName}`)
    return resp.data
}

export async function fetchCurrentUser(): Promise<IUserSchema> {
    const resp = await axios.get<IUserSchema>('/api/v1/user/current')
    return resp.data
}

export async function fetchCurrentUserRoles(projectId?: string): Promise<IProjectRoleSchema[]> {
    const config = { params: { projectUrl: projectId ?? '0' } }
    const resp = await axios.get<IProjectRoleSchema[]>('/api/v1/user/current/role', config)
    return resp.data
}

export async function listUsers(query: IListQuerySchema): Promise<IListSchema<IUserSchema>> {
    const resp = await axios.get<IListSchema<IUserSchema>>('/api/v1/user', {
        params: query,
    })
    return resp.data
}

export async function changePassword(data: IChangePasswordSchema) {
    const resp = await axios({
        method: 'put',
        url: '/api/v1/user/current/pwd',
        data: JSON.stringify({ currentUserPwd: data.originPwd, newPwd: data.userPwd }),
        headers: { 'Content-Type': 'application/json' },
    })

    return resp.data
}

export async function changeUserState(userId: string, enable: boolean) {
    const resp = await axios({
        method: 'put',
        url: `/api/v1/user/${userId}/state`,
        data: JSON.stringify({ isEnabled: enable }),
        headers: { 'Content-Type': 'application/json' },
    })

    return resp.data
}

export async function createUser(userName: string, userPwd: string): Promise<IUserSchema> {
    const { data } = await axios({
        method: 'post',
        url: '/api/v1/user',
        data: JSON.stringify({ userName, userPwd }),
        headers: { 'Content-Type': 'application/json' },
    })
    return data
}

export async function checkUserPasswd(passwd: string) {
    const resp = await axios({
        method: 'post',
        url: '/api/v1/user/current/pwd',
        data: JSON.stringify({ currentUserPwd: passwd }),
        headers: { 'Content-Type': 'application/json' },
    })

    return resp.data
}

export async function changeUserPasswd(user: string, currentUserPwd: string, newPwd: string) {
    const resp = await axios({
        method: 'put',
        url: `/api/v1/user/${user}/pwd`,
        data: JSON.stringify({ currentUserPwd, newPwd }),
        headers: { 'Content-Type': 'application/json' },
    })

    return resp.data
}

export async function createAccount(userName: string, verification: string): Promise<ICloudLoginRespSchema> {
    const { data } = await axios({
        method: 'post',
        url: '/swcloud/api/v1/register/account',
        data: { userName, verification },
    })
    return data
}

export async function loginUserWithEmail(data: ILoginUserSchema): Promise<ICloudLoginRespSchema> {
    const bodyFormData = new FormData()
    bodyFormData.append('email', data.userName)
    bodyFormData.append('password', data.userPwd)

    const resp = await axios({
        method: 'post',
        url: '/swcloud/api/v1/login/email',
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data' },
    })

    return resp.data
}

export async function signupWithEmail(data: ISignupUserSchema): Promise<ICloudLoginRespSchema> {
    const resp = await axios({
        method: 'post',
        url: '/swcloud/api/v1/register/email',
        data: JSON.stringify({ email: data.userName, password: data.userPwd, callback: data.callback }),
        headers: { 'Content-Type': 'application/json' },
    })

    return resp.data
}

export async function resendEmail(data: ISignupUserSchema): Promise<ICloudLoginRespSchema> {
    return signupWithEmail(data)
}

export async function sendResetPasswordEmail(email: string, callback: string) {
    const resp = await axios({
        method: 'post',
        url: '/swcloud/api/v1/register/account/password/email',
        data: JSON.stringify({ email, callback }),
        headers: { 'Content-Type': 'application/json' },
    })

    return resp.data
}

export async function resetPassword(password: string, verification: string) {
    const resp = await axios({
        method: 'put',
        url: '/swcloud/api/v1/register/account/password',
        data: JSON.stringify({ password, verification }),
        headers: { 'Content-Type': 'application/json' },
    })

    return resp.data
}
