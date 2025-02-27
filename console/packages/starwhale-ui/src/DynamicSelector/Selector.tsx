import React, { useState, useRef } from 'react'
import { useClickAway } from 'react-use'
import SelectorItemRender from './SelectorItemRender'
import { DynamicSelectorPropsT, SelectorItemPropsT, SelectorItemValueT } from './types'
import {
    defalutPlaceholder,
    defaultEndEnhancer,
    EndEnhancer,
    Placeholder,
    SelectorContainer,
    SelectorItemsContainer,
    StartEnhancer,
} from './StyledComponent'
import Tree from '../Tree/Tree'
import { KEY_STRINGS } from 'baseui/menu'
import useTranslation from '@/hooks/useTranslation'

// @ts-ignore
const containsNode = (parent, child) => {
    return child && parent && parent.contains(child as any)
}

export function SelectorItemByTree({ value, onChange, search, inputRef, info, $multiple }: SelectorItemPropsT) {
    return (
        <Tree
            data={info.data}
            selectedIds={value as any}
            onSelectedIdsChange={onChange as any}
            search={search}
            searchable={false}
            multiple={$multiple}
            keyboardControlNode={inputRef as any}
        />
    )
}

export function DynamicSelector<T = any>({
    onChange,
    startEnhancer,
    endEnhancer = defaultEndEnhancer(),
    options = [],
    ...rest
}: DynamicSelectorPropsT<T>) {
    const [t] = useTranslation()
    const placeholder = rest.placeholder ?? t('selector.placeholder')
    const ref = useRef<HTMLDivElement>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [values, setValues] = useState<SelectorItemValueT[]>(rest.value ?? [])
    const [editingIndex, setEditingIndex] = useState<number>(0)
    const itemRefs = useRef<{
        [key: string]: {
            inputRef: { current: null | HTMLInputElement }
        }
    }>({})

    useClickAway(ref, (e) => {
        if (containsNode(ref.current, e.target)) return
        if (containsNode(document.querySelector('.popover'), e.target)) return
        setIsEditing(false)
    })

    function focusItem(index: number) {
        if (itemRefs.current[index]) {
            itemRefs.current[index]?.inputRef?.current?.focus()
        }
    }

    const handleReset = () => {
        setIsEditing(false)
    }

    const handleClick = (index: number) => {
        if (editingIndex !== index) setEditingIndex(editingIndex)
    }

    const handelRemove = (index: number) => {
        const newValues = values.filter((key, i) => i !== index)
        setValues(newValues)
        onChange?.(newValues)
    }

    const handleEdit = (e: React.BaseSyntheticEvent) => {
        if (e.target.classList.contains('label-remove')) return
        setIsEditing(true)
        focusItem(values.length)
    }

    const handleAddItemRef = (itemRef: any, index: number) => {
        if (!itemRef) return
        itemRefs.current[index] = itemRef
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
            case KEY_STRINGS.Escape:
                handleReset()
                break
            default:
                handleEdit(event as any)
                break
        }
    }

    const handleChange = (newValue: any, index: number) => {
        let newValues = []
        if (!newValue) {
            newValues = values.filter((key, i) => i !== index)
        } else {
            newValues = values.map((tmp, i) => (i === index ? newValue : tmp))
        }
        setValues(newValues)
        onChange?.(newValues)
        setEditingIndex(newValues.length)
    }

    const getSharedProps = React.useCallback(
        (i: number) => {
            return {
                isEditing,
                options,
                containerRef: ref,
                onRemove: () => handelRemove(i),
                onKeyDown: (e: KeyboardEvent) => handleKeyDown(e),
                onClick: () => handleClick(i),
                addItemRef: (itemRef: HTMLInputElement) => handleAddItemRef(itemRef, i),
                onChange: (newValue: any) => handleChange(newValue, i),
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isEditing, options, ref]
    )

    const $values = React.useMemo(() => {
        const tmps = []
        const lastIndex = values.length
        tmps.push(
            // @ts-ignore
            <SelectorItemRender
                key={0}
                value={{}}
                isFocus
                {...getSharedProps(lastIndex)}
                onChange={(newValue: any) => {
                    setValues(newValue)
                    onChange?.(newValue)
                }}
            />
        )

        return tmps
    }, [values, onChange, getSharedProps])

    const shareProps = {
        $isEditing: isEditing,
        $isGrid: true,
    }

    return (
        <SelectorContainer
            {...shareProps}
            role='button'
            tabIndex={0}
            ref={ref}
            onKeyDown={handleKeyDown as any}
            onClick={handleEdit}
        >
            {startEnhancer && (
                <StartEnhancer {...shareProps}>
                    {typeof startEnhancer === 'function' ? startEnhancer() : startEnhancer}
                </StartEnhancer>
            )}
            <Placeholder {...shareProps}>
                {!isEditing && values.length === 0 && defalutPlaceholder(placeholder)}
            </Placeholder>
            <SelectorItemsContainer {...shareProps}>{$values}</SelectorItemsContainer>
            {endEnhancer && (
                <EndEnhancer
                    {...shareProps}
                    onClick={(e: React.SyntheticEvent) => {
                        e.stopPropagation()
                        setIsEditing(!isEditing)
                    }}
                >
                    {typeof endEnhancer === 'function' ? endEnhancer() : endEnhancer}
                </EndEnhancer>
            )}
        </SelectorContainer>
    )
}

export default DynamicSelector

// const treeData = [
//     {
//         id: '1',
//         label: 'Fruit',
//         isExpanded: true,
//         info: { label: 'Fruit' },
//         children: [
//             {
//                 id: '2',
//                 label: 'Apple',
//                 isExpanded: true,
//                 children: [],
//             },

//             {
//                 id: '3',
//                 label: 'Test',
//                 isExpanded: true,
//                 children: [],
//             },

//             {
//                 id: '4',
//                 label: 'Test2',
//                 isExpanded: true,
//                 children: [],
//             },

//             {
//                 id: '5',
//                 label: 'Test2',
//                 isExpanded: true,
//                 children: [],
//             },

//             {
//                 id: '6',
//                 label: 'Test2',
//                 isExpanded: true,
//                 children: [],
//             },
//         ],
//     },
// ]

// export default (props: DynamicSelectorPropsT<any>) => {
//     const options = [
//         {
//             id: 'tree',
//             info: {
//                 data: treeData,
//             },
//             multiple: false,
//             getData: (info: any, id: string) => findTreeNode(info.data, id),
//             getDataToLabel: (data: any) => data?.label,
//             getDataToValue: (data: any) => data?.id,
//             render: SelectorItemByTree as React.FC<any>,
//         },
//     ]
//     const options2 = [
//         {
//             id: 'tree',
//             info: {
//                 data: treeData,
//             },
//             multiple: true,
//             getData: (info: any, id: string) => findTreeNode(info.data, id),
//             getDataToLabel: (data: any) => data?.label,
//             getDataToValue: (data: any) => data?.id,
//             render: SelectorItemByTree as React.FC<any>,
//         },
//     ]
//     return (
//         <>
//             <DynamicSelector {...props} options={options} />
//             <DynamicSelector options={options2} />
//         </>
//     )
// }
