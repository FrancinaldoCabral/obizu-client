import { Injectable } from '@angular/core'

@Injectable()
export class ModelService  {
    llmsNames: string [] = ['Hard', 'Medium', 'Low']
    llmsModel: string [] = ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307']
    actualLlmModel: string

    constructor(){
        this.actualLlmModel =  window.localStorage.getItem('model') || 'claude-3-sonnet-20240229'
        console.log(window.localStorage.getItem('model'))
    }

    getLlmModels(): string [] {
        return this.llmsModel
    }

    getLlmModelsNames(): string[] {
        return this.llmsNames
    }

    getActualModel(): string {
        return this.actualLlmModel
    }

    setActualModel(model:string): void {
        window.localStorage.setItem('model', model)
        this.actualLlmModel = model
    }
}