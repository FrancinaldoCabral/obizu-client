import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AuthService } from '../services/auth.service'
import { QuillModule } from 'ngx-quill'
import { QuestionService } from '../services/question.service'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner'
import { SocketService } from '../services/socket.service'
import { ToastrService } from 'ngx-toastr'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-modules',
  standalone: true,
  imports: [
    CommonModule,
    NgxSpinnerModule,
    RouterModule,
    FormsModule,
    QuillModule
  ],
  templateUrl: './modules.component.html',
  styleUrl: './modules.component.css'
})
export class ModulesComponent {
  newModule: any = {
    title: '',
    description: '',
    imageUrl: '',
    indices: [], //
  }

  categories: any[] = []
  filters: any[] = []
  indiceTemp: any[] = []
  searchFilter:string = ''
  currentPage: number = 1
  pageSize: number = 10
  totalItems: number = 0
  modules: any[] = []
  searchModule: string = ''

  constructor(
    private questionService: QuestionService,
    private ngxSpinner: NgxSpinnerService,
    private socketService: SocketService,
    private toastrService: ToastrService,
    private auth: AuthService
  ){
    this.socketService.getConnecSource$.subscribe(
      (connect:any) => {
          if(connect){
            this.loadModules()
          }else{
            this.ngxSpinner.hide()
          }
      }
    )
  }
  
  ngOnInit(): void {
    if(this.socketService.getSocketIsConnect()) {
      this.loadModules()
    }
  }

  clearNewModule(): void {
    this.newModule = {
      title: '',
      description: '',
      imageUrl: '',
      indices: [] //
    }
  }

  loadCategories() {
    this.ngxSpinner.show()
    const filters = this.filters.map((filter:any)=>{ return filter._id })
    this.questionService.getCategories(filters).subscribe(
      (data:any) => {
        this.categories = data.categories
        this.ngxSpinner.hide()
      },
      (error:any)=> {
        console.log(error)
        this.ngxSpinner.hide()
        this.toastrService.error(`Erro no carregamento de questões. Erro: ${error.status}`)
      })
  }

  decodificarSequenciasUnicode(texto: string): string {
    return texto.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
    })
  }

  getCategories(): any[]{
    return this.categories.filter((c:any)=>{
      return !this.filters.includes(c) && this.containsSubstringIgnoreCase(c._id, this.searchFilter)
    })
  }

  getModules(): any[]{
    return this.modules.filter((module:any)=>{
      return module.product.name.toLowerCase().includes(this.searchModule.toLowerCase())
    })
  }

  containsSubstringIgnoreCase(str: string, substring: string): boolean {
    return str.toLowerCase().includes(substring.toLowerCase())
  }

  isAdmin(): boolean {
    return this.auth.getUser()?.role.includes('administrator') === true
  }

  mapFilters(): string[]{
    return this.filters.map((filter:any)=>{ return filter._id })
  }

  saveOneModule(newModule: any): void {
    this.ngxSpinner.show()
    this.questionService.saveModule(newModule).subscribe(
      (response) => {
        this.ngxSpinner.hide()
        this.loadModules()
        this.toastrService.success(`1 módulo adicionado`)
        this.clearNewModule()
      },
      (error) => {
        console.log('save in db error', error)
        this.toastrService.error('Erro no registro de módulos.')
        this.ngxSpinner.hide()
      },
      () => {
        this.ngxSpinner.hide()
      }
    )
  }

  removeModules(_id:any): void {
    this.ngxSpinner.show()
    this.questionService.deleteOneModule(_id).subscribe(
      success => {
        this.ngxSpinner.hide()
        this.loadModules()
        this.toastrService.success(`Questão atualizada com sucesso.`)
      },
      error => {
        this.toastrService.error(`Erro na atualização da questão.`)
        this.ngxSpinner.hide()
      }
    )
  }

  updateModule(module: any): void {
    console.log(module)
    this.ngxSpinner.show()
    this.questionService.updateOneModule(module).subscribe(
      success => {
        console.log(success)
        this.ngxSpinner.hide()
        this.loadModules()
        this.toastrService.success(`Questão atualizada com sucesso.`)
        this.clearNewModule()
        document.getElementById('newModuleBtn')?.click()
      },
      error => {
        this.toastrService.error(`Erro na atualização da questão.`)
        this.ngxSpinner.hide()
      }
    )
  }

  loadModules() {
    this.ngxSpinner.show()
    this.questionService.getModules(this.currentPage, this.pageSize).subscribe(
      data => {
        this.modules = data.items
        this.totalItems = data.totalItems
        this.ngxSpinner.hide()
        this.loadCategories()
      },
      error=> {
        console.log(error)
        this.ngxSpinner.hide()
        //this.toastrService.error(`Erro no carregamento de questões. Erro: ${error.status}`)
      })
  }

  editModule(module:any): void {
    this.newModule = module
    document.getElementById('newModuleBtn')?.click()
  }
}
