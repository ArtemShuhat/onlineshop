import { useMemo, useState } from 'react'

export type SortDirection = 'asc' | 'desc'

export function useSortable<T extends string>(
	defaultColumn: T,
	defaultDirection: SortDirection = 'desc'
) {
	const [sortColumn, setSortColumn] = useState<T>(defaultColumn)
	const [sortDirection, setSortDirection] =
		useState<SortDirection>(defaultDirection)

	const handleSort = (column: T) => {
		if (sortColumn === column) {
			setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
		} else {
			setSortColumn(column)
			setSortDirection(column === 'id' ? 'desc' : 'asc')
		}
	}

	const getSortedData = <TData>(
		data: TData[],
		compareFn: (a: TData, b: TData, column: T) => number
	): TData[] => {
		return useMemo(() => {
			const sorted = [...data]
			sorted.sort((a, b) => {
				const compareResult = compareFn(a, b, sortColumn)
				return sortDirection === 'asc' ? compareResult : -compareResult
			})
			return sorted
		}, [data, sortColumn, sortDirection])
	}

	return {
		sortColumn,
		sortDirection,
		handleSort,
		getSortedData
	}
}
