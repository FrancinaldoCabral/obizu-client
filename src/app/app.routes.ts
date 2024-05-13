import { Routes } from '@angular/router'
import { QuestionsRegisterComponent } from './questions-register/questions-register.component'
import { QuestionsEditComponent } from './questions-edit/questions-edit.component'
import { QuestionsRandomComponent } from './questions-random/questions-random.component'

export const routes: Routes = [
    //{ path:'questions-register', title:'Registro de questões', component: QuestionsRegisterComponent },
    { 
        path:'', 
        title:'Criação', 
        component: QuestionsRegisterComponent, 
    },
    { path:'edit', title:'Edição', component: QuestionsEditComponent },
    { path:'random', title:'Randômicas', component: QuestionsRandomComponent }
]
