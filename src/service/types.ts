export interface TodoGetParams{
    id: string
}
export interface TodoEntity{
    id: string
    description: string
}
export interface TodoCreateParams{
    description: string
}

export type TodoEditParams = TodoEntity
export type TodoDeleteParams = TodoGetParams
