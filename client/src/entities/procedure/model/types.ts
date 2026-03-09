export type Procedure = {
    id: number,
    name: string,
    description: string | null,
    duration_min: number,
    price: number,
    is_active: boolean,
    createdAt: string,
    updatedAt: string
}

export type ProcedureState = {
    procedures: Procedure[],
    currentProcedure: Procedure | null,
    isLoading: boolean,    
    error: string | null
}

export const initialProcedureState: ProcedureState = {
    procedures: [],
    currentProcedure: null,
    isLoading: false,
    error: null
}