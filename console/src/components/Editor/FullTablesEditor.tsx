import React, { useMemo, useRef } from 'react'
import EditorContextProvider, { StoreType } from '@starwhale/core/context/EditorContextProvider'
import { createCustomStore } from '@starwhale/core/store'
import WidgetRenderTree from '@starwhale/core/widget/WidgetRenderTree'
import { EventBusSrv } from '@starwhale/core/events'
import { useDatastoreTablesByPrefix, WidgetStoreState } from '@starwhale/core'
import BusyPlaceholder from '@starwhale/ui/BusyLoaderWrapper/BusyPlaceholder'
import { tranformState } from './utils'
import { withEditorRegister } from '.'

function witEditorContext(EditorApp: React.FC) {
    return function EditorContexted(props: any) {
        const { prefix } = props.dynamicVars
        const { isLoading, isSuccess, names } = useDatastoreTablesByPrefix(prefix)
        const store = useRef<StoreType>()
        const state = useMemo(() => {
            return tranformState({
                key: 'widgets',
                tree: [
                    {
                        type: 'ui:dndList',
                        children: [
                            {
                                type: 'ui:section',
                                // @ts-ignore
                                optionConfig: {
                                    layout: {
                                        width: 600,
                                        height: 500,
                                    },
                                },
                                children: names?.map((name) => {
                                    return {
                                        type: 'ui:panel:table',
                                        fieldConfig: {
                                            data: {
                                                chartType: 'ui:panel:table',
                                                tableName: name,
                                            },
                                        },
                                    }
                                }),
                            },
                        ],
                    },
                ],
                widgets: {},
                defaults: {},
            })
        }, [names])

        const value = useMemo(() => {
            if (!isSuccess) return undefined

            if (!store.current) {
                store.current = createCustomStore(state as WidgetStoreState)
            }
            const eventBus = new EventBusSrv()
            return {
                store: store.current,
                eventBus,
            }
        }, [isSuccess, state])

        if (isLoading) {
            return <BusyPlaceholder type='spinner' />
        }

        if (!value) {
            return <BusyPlaceholder type='empty' />
        }

        return (
            <EditorContextProvider
                value={{
                    ...value,
                    dynamicVars: props.dynamicVars,
                }}
            >
                <EditorApp {...props} />
            </EditorContextProvider>
        )
    }
}

export const FullTablesEditor = withEditorRegister(witEditorContext(WidgetRenderTree))
