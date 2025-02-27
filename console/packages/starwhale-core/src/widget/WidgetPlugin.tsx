// eslint-disable-next-line max-classes-per-file
import { WidgetComponent, WidgetConfig, WidgetFieldConfig, WidgetMeta } from '../types'

export type WidgetState = Record<string, unknown>

class BaseWidget<T extends WidgetMeta = WidgetMeta> {
    meta?: T
}

class WidgetPlugin<
    O extends object = any,
    S extends WidgetFieldConfig = WidgetFieldConfig
> extends BaseWidget<WidgetMeta> {
    renderer: WidgetComponent<O, S> | null

    defaults: WidgetConfig<O, S>

    constructor(renderer: WidgetComponent<O, S>, config: WidgetConfig<O, S>) {
        super()
        this.renderer = renderer
        this.defaults = config
    }
}

export default WidgetPlugin
