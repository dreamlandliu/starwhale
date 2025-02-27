export interface DynamicSelectorPropsT<T> {
    value?: SelectorItemValueT[]
    onChange?: (args: SelectorItemValueT[]) => void
    startEnhancer?: (() => React.ReactNode) | React.ReactNode
    endEnhancer?: (() => React.ReactNode) | React.ReactNode
    placeholder?: React.ReactNode
    options?: SelectorItemOptionT<T>[]
    data?: T
}

export type SelectorItemValueT = {
    id?: string | number
    value?: any
}

export type SelectorItemOptionT<T = any> = {
    id?: string | number
    label: ((item: SelectorItemOptionT) => React.ReactNode) | string
    getComponent: (item: SelectorItemOptionT) => React.FC<any>
    getData: (data: T, id: string | number) => any
    getDataToLabel: (data: T) => string
    getDataToValue: (data: T) => string | number
    info?: T
    multiple?: boolean
    [key: string]: any
}

export type SelectorSharedPropsT = {
    $isEditing?: boolean
    $multiple?: boolean
}

export type SelectorItemRenderPropsT = {
    isEditing?: boolean
    isFocus?: boolean
    value?: SelectorItemValueT
    onChange?: (args: SelectorItemValueT) => void
    onRemove?: () => void
    options?: SelectorItemOptionT[]
    style?: React.CSSProperties
    addItemRef?: (ref: React.RefObject<any>) => void
}

export type SelectorItemPropsT = {
    value?: SelectorItemValueT
    onChange?: (args: SelectorItemValueT) => void
    search?: string
    inputRef?: React.RefObject<HTMLInputElement>
    data?: any
    info?: SelectorItemOptionT['info']
} & SelectorSharedPropsT
