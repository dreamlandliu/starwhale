import Filter from './filter'
import { FilterT, FilterTypeOperators, KIND } from './types'

function FilterBoolean(): FilterT {
    return Filter({
        kind: KIND.BOOLEAN,
        operators: FilterTypeOperators[KIND.BOOLEAN],
    })
}
export default FilterBoolean
