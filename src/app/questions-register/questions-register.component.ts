import { Component, OnInit } from '@angular/core'
import { QuestionService } from '../services/question.service'
import { FormsModule } from '@angular/forms'
import { ToastrService } from 'ngx-toastr'
import { SocketService } from '../services/socket.service'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { QuillModule } from 'ngx-quill'

@Component({
  selector: 'app-questions-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    QuillModule,
    NgxSpinnerModule
  ],
  providers: [
    //SocketService,
    QuestionService,
    NgxSpinnerService
  ],
  templateUrl: './questions-register.component.html',
  styleUrl: './questions-register.component.css'
})
export class QuestionsRegisterComponent implements OnInit{
  models: string [] = ['claude-3-haiku-20240307', 'claude-3-sonnet-20240229', 'claude-3-opus-20240229']
  model: string = 'claude-3-haiku-20240307' || window.localStorage.getItem('model')
  codProva:string = ''
  qtdeQuestions:number = 0

  provaFile: any
  gabaritoFile: any
  editalFile: any

  provaText: string = ''
  gabaritoText: string = ''
  editalText: string = ''

  edit: boolean[] = []
  formType: string = 'pdf'

  uploadSpinner: boolean = false

  credits: number = 0
  totalCredits: number = 0 
  questions: any[] = []

  selectedQuestions: number[] = []

  newQuestion: any = {
    categories: [],
    statement:'',
    alternatives: [],
    answer: 0,
    comment: ''
  }

  newAlternative:any=''

  indexEdit:any = null

  questionsSelecteds: any[]=[]

  status: string = ''
  jobId: string = ''

  contentToQuestions: string = ''

  constructor(
    private questionService: QuestionService,
    private toastrService: ToastrService,
    private socketService: SocketService,
    private ngxSpinner: NgxSpinnerService
  ){
    this.socketService.getResultSource$.subscribe(
      response => {
          const { status, job } = response
          if(status.toLowerCase()=='completed'){ 
              const { result } = response        
              console.log('result in component: ', result)
              const { credits, questions } = result
              this.toastrService.success(`${questions.length} questões criadas.`)
              this.credits = credits
              this.totalCredits += credits
         
              questions.forEach((question:any) => {
                this.questions.unshift(question)
              })

              this.saveQuestionsInLocalStorage()
              this.saveCredits()

              this.ngxSpinner.hide('ia-creator')
          }else if(status.toLowerCase()=='failed'){
              this.ngxSpinner.hide('ia-creator')
              this.status=''
              this.jobId=''
              this.toastrService.error(`Erro na criação de questões.`)
          }else if(status.toLowerCase()=='active'){
            this.status = 'Iniciando...'
          }else{
            this.status = status
          }
      },
      error => {
          this.ngxSpinner.hide('ia-creator')
          this.status=''
          this.jobId=''
          console.log('socket service getResultSource error: ', error)
          this.toastrService.error(`Erro de conexão.`)
      }
    )

    this.loadQuestions()
    this.loadCredits()
    this.loadFormQuestionByText()
    this.loadFormQuestionManual()
    this.loadModel()
  }
  ngOnInit(): void {

  }
  

  trackByQuestionId(index: number, question: any): any {
    return index; // Suponha que cada pergunta tem uma propriedade 'id' única
  }
 
  saveCredits(): void {
    window.localStorage.setItem('credits', JSON.stringify(this.credits))
    window.localStorage.setItem('total_credits', JSON.stringify(this.totalCredits))
  }

  loadCredits(): void {
    if(window.localStorage.getItem('credits')){
      this.credits = JSON.parse(window.localStorage.getItem('credits') as any)
    }
    if(window.localStorage.getItem('total_credits')){
      this.totalCredits = JSON.parse(window.localStorage.getItem('total_credits') as any)
    }
  }

  loadFormQuestionByText(): void {
    if(window.localStorage.getItem('contentToQuestions')){
      this.contentToQuestions = window.localStorage.getItem('contentToQuestions') as string
    }
    if(window.localStorage.getItem('codProva')){
      this.codProva = window.localStorage.getItem('codProva') as string
    }
    if(window.localStorage.getItem('qtdeQuestions')){
      this.qtdeQuestions = parseInt(window.localStorage.getItem('qtdeQuestions') as any)
    }
  }

  loadFormQuestionManual(): void {
    if(window.localStorage.getItem('newQuestion')){
      this.newQuestion = JSON.parse(window.localStorage.getItem('newQuestion') as any)
    }
  }

  loadQuestions(): void {
    if(window.localStorage.getItem('questions')){
      this.questions = JSON.parse(window.localStorage.getItem('questions') as any)
    }
  }

  loadModel(): void {
    if(window.localStorage.getItem('model')){
      this.model = window.localStorage.getItem('model') as string
    }
  }

  saveFormQuestionManual(): void {
    window.localStorage.setItem('newQuestion', JSON.stringify(this.newQuestion))
  }

  saveFormQuestionByText(): void {
    window.localStorage.setItem('contentToQuestions', this.contentToQuestions)
    window.localStorage.setItem('codProva', this.codProva)
    window.localStorage.setItem('qtdeQuestions', this.qtdeQuestions.toString())
  }

  onOptionChange(event: any): void {
    this.model = event.target.value
    window.localStorage.setItem('model', this.model)
  }

  clearNewQuestion(): void {
    this.newQuestion = {
      categories: [],
      statement:'',
      alternatives: [],
      answer: 0,
      comment: ''
    }
  }

  selectQuestion(iQuestions: number): void {
    this.questionsSelecteds[iQuestions]=!this.questionsSelecteds[iQuestions]
    console.log(this.questionsSelecteds)
  }

  getSelecteds(): any[]{
      const indices = this.questionsSelecteds.map((q:any, i:number)=> i )
      const questionsSelecteds = this.questions.filter((q:any, i:number)=> { return indices.includes(i) })
      return questionsSelecteds
  }

  saveQuestionsInLocalStorage(): void {
    window.localStorage.setItem('questions', JSON.stringify(this.questions))
  }

  removeQuestion(index: number): void{
    this.questions.splice(index, 1)
    this.toastrService.success('Questão removida com sucesso.')
    this.saveQuestionsInLocalStorage()
  }

  removeAll(): void {
    this.toastrService.success(`${this.questions.length} questões removidas.`)
    this.questions=[]
    this.saveQuestionsInLocalStorage()
  }

  mapIndexOfEdits(): number {
    return this.edit.filter((qEdited:boolean)=>{return qEdited==true})
    .map((result:boolean, index:number)=> index)[0]
  }

  async addNewQuestion(): Promise<void> {
    this.status = `Criação manual...`
    this.ngxSpinner.show('ia-creator')
    this.questions.unshift(this.newQuestion)
    const awaitMoment = await new Promise(resolve=>{setTimeout(() => {
      this.toastrService.success('Questão adicionada com sucesso')
      this.saveFormQuestionManual()
      this.saveQuestionsInLocalStorage()
      this.ngxSpinner.hide('ia-creator')
      this.saveQuestionsInLocalStorage()
      this.status = ``
      resolve(true)
    }, 1000)})
  }

  onProvaSelected(event: any): void {
    this.provaFile = event.target.files[0]
    //this.uploadFile()
  }

  onGabaritoSelected(event: any): void {
    this.gabaritoFile = event.target.files[0]
    //this.uploadFile()
  }

  onEditalSelected(event: any): void {
    this.editalFile = event.target.files[0]
    //this.uploadFile()
  }

  questionsCreateWithPdf(): void {
    this.status = `Criando a partir de pdf. Modelo ${this.model}`
    this.ngxSpinner.show('ia-creator')

    if(!this.codProva || !this.provaFile) {
      this.status = ''
      this.ngxSpinner.hide('ia-creator')
      return
    }

    const formData: FormData = new FormData()
    formData.append('codProva', this.codProva)
    formData.append('qtdeQuestions', this.qtdeQuestions.toString())
    formData.append('provaFile', this.provaFile, this.provaFile.name)
    formData.append('gabaritoFile', this.gabaritoFile, this.gabaritoFile.name)
    formData.append('editalFile', this.editalFile, this.editalFile.name)

    this.questionService.createQuestions(formData, this.model, 'pdf').subscribe(
      (response) => {
        this.jobId = response.id
      },
      (error) => {
        this.toastrService.error('Erro na geração de questões.')
        this.jobId = ''
        this.status = ''
        this.ngxSpinner.hide('ia-creator')
      }
    )
  }

  questionsCreateWithPureText(): void {
    this.status = `Criando a partir de textos. Modelo ${this.model}`
    this.ngxSpinner.show('ia-creator')
    
    this.saveFormQuestionByText()

    if(!this.codProva || !this.qtdeQuestions || !this.contentToQuestions) {
      this.ngxSpinner.hide('ia-creator')
      this.toastrService.info('Concurso, Qtde de questões e o conteúdo são necessários.')
      return
    }

    const formData: FormData = new FormData()
    formData.append('codProva', this.codProva)
    formData.append('qtdeQuestions', this.qtdeQuestions.toString())
    formData.append('contentToQuestions', this.contentToQuestions)

    this.questionService.createQuestions(formData, this.model, 'text').subscribe(
      (response) => {
        this.jobId = response.id
      },
      (error) => {
        this.toastrService.error('Erro na geração de questões.')
        this.status = ''
        this.jobId = ''
        this.ngxSpinner.hide('ia-creator')
      }
    )
  }

  replicateQuestions(): void {
    this.ngxSpinner.show('ia-creator')
    this.status = `Replicando questões. Modelo ${this.model}`
    const questions = this.getSelecteds()
    console.log(questions)
    if(questions.length==0) {
      this.ngxSpinner.hide('ia-creator')
      this.toastrService.info('Selecione questões.')
      return
    }
    
    this.questionService.createQuestions({ questions }, this.model, 'replic').subscribe(
      (response) => {
        this.jobId = response.id
      },
      (error) => {
        this.toastrService.error('Erro na geração de questões.')
        this.jobId = ''
        this.status = ''
        this.ngxSpinner.hide('ia-creator')
      }
    )
  }

  cancelCreator(id:string): void {
    console.log('cancelarrrrrr')
    this.questionService.cancelCreation(id).subscribe(
      success => {
        this.status = 'Cancelando...'
        console.log('enviado cancelamento', success)
      },
      error => {
        this.toastrService.show('Não foi possível cancelar.')
        console.log(error)
      }
    )
  }

  resetCredits(): void {
    this.credits = 0
    this.totalCredits = 0
    this.saveCredits()
  }

  decodificarSequenciasUnicode(texto: string): string {
    return texto.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
    })
  }

  saveQuestionsInDB(questions: any[]): void {
    this.ngxSpinner.show()
    this.questionService.saveQuestionsInDB(questions).subscribe(
      (response) => {
        console.log(response)
        this.toastrService.success('Questões adicionadas no DB')
      },
      (error) => {
        console.log('save in db error', error)
        this.toastrService.error('Erro no registro de questões.')
        this.ngxSpinner.hide()
      },
      () => {
        this.ngxSpinner.hide()
      }
    )
  }
  saveOneQuestionInDB(question: any): void {
    this.ngxSpinner.show()
    this.questionService.saveQuestionsInDB([question]).subscribe(
      (response) => {
        console.log(response)
        this.toastrService.success(`1 questão adicionada no DB`)
      },
      (error) => {
        console.log('save in db error', error)
        this.toastrService.error('Erro no registro de questões.')
        this.ngxSpinner.hide()
      },
      () => {
        this.ngxSpinner.hide()
      }
    )
  }
}
