export interface Step {
    title: string
    descriptions: string[]  // Array parce que tu as 2 descriptions par étape
    planetTexture: string   // Nom de la texture à utiliser pour cette étape
}

export interface StepStatus {
    active: boolean
    past: boolean
    future: boolean
}