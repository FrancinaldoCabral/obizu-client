import { Routes } from '@angular/router'
import { QuestionsRegisterComponent } from './questions-register/questions-register.component'
import { QuestionsEditComponent } from './questions-edit/questions-edit.component'
import { ModulesComponent } from './modules/modules.component'
import { ModuleComponent } from './module/module.component'
import { ModuleAdminComponent } from './module-admin/module-admin.component'
import { QuestionComponent } from './question/question.component'
import { ResponsesComponent } from './responses/responses.component'
import { QuestionViewComponent } from './question-view/question-view.component'

export const routes: Routes = [
    //{ path:'questions-register', title:'Registro de questões', component: QuestionsRegisterComponent },
    { path:'admin/new', title:'Criação - admin', component: QuestionsRegisterComponent },
    { path:'admin/edit', title:'Questões - admin', component: QuestionsEditComponent },
    { path:'admin/modules', title:'Módulos - admin', component: ModuleAdminComponent },
    
    { path:'modules', title:'Módulos', component: ModulesComponent },
    { path:'modules/:id', title:'Módulo', component: ModuleComponent },
    { path:'modules/:id/questions', title:'Questionário', component: QuestionComponent },

    { path:'question/:id', title:'Questão', component: QuestionViewComponent },
    
    { path:'responses', title:'Respostas', component: ResponsesComponent },
    
    { path: '',   redirectTo: '/modules', pathMatch: 'full' }
]
