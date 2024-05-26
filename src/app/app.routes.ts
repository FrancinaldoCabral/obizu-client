import { Routes } from '@angular/router'
import { QuestionsRegisterComponent } from './questions-register/questions-register.component'
import { QuestionsEditComponent } from './questions-edit/questions-edit.component'
import { ModulesComponent } from './modules/modules.component'
import { ModuleComponent } from './module/module.component'
import { ModuleAdminComponent } from './module-admin/module-admin.component'

export const routes: Routes = [
    //{ path:'questions-register', title:'Registro de questões', component: QuestionsRegisterComponent },
    { path:'admin/new', title:'Admin - Criação', component: QuestionsRegisterComponent },
    { path:'admin/edit', title:'Admin - Questões', component: QuestionsEditComponent },
    { path:'admin/modules', title:'Admin - Módulos', component: ModuleAdminComponent },
    { 
        path:'', title:'Módulos', component: ModulesComponent
    },
    { path:':id', title:'Módulo', component: ModuleComponent },
]
