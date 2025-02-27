import Filter from './filter'
import { FilterT, FilterTypeOperators, KIND } from './types'

function FilterString(): FilterT {
    return Filter({
        kind: KIND.STRING,
        operators: FilterTypeOperators[KIND.STRING],
    })
}
export default FilterString
