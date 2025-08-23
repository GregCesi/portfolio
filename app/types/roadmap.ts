export interface Step {
    title: string
    descriptions: string[]  // Array parce que tu as 2 descriptions par étape

}

export interface StepStatus {
    active: boolean
    past: boolean
    future: boolean
}