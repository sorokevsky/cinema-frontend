export type TableData = Record<string, unknown> & { id?: string | number }

type Float = 'right' | 'left'

export interface TableColumn<T = TableData> {
  key: string
  title: string
  float?: Float
  width?: number
  render?: (item: T) => VNode
}
