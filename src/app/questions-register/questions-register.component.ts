import { Component } from '@angular/core'
import { QuestionService } from '../services/question.service'
import { FormsModule } from '@angular/forms'
import { ToastrService } from 'ngx-toastr'
import { SocketService } from '../services/socket.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { QuillModule } from 'ngx-quill'

@Component({
  selector: 'app-questions-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    QuillModule
  ],
  providers: [
    //SocketService,
    QuestionService
  ],
  templateUrl: './questions-register.component.html',
  styleUrl: './questions-register.component.css'
})
export class QuestionsRegisterComponent {
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

              this.ngxSpinner.hide('question-ia-generator')
          }

          if(status.toLowerCase()=='failed'){
              this.ngxSpinner.hide('question-ia-generator')
              this.toastrService.error(`Erro na criação de questões.`)
          }
      },
      error => {
          this.ngxSpinner.hide('question-ia-generator')
          console.log('socket service getResultSource error: ', error)
          this.toastrService.error(`Erro de conexão.`)
      }
    )

    this.socketService.getConnecSource$.subscribe(
        connect => {
            if(connect){
                //this.fetchFiles()
            }else{
              this.ngxSpinner.hide('question-ia-generator')
            }
        }
    )

    this.loadQuestions()
    this.loadCredits()
    this.loadFormQuestionByText()
    this.loadFormQuestionManual()
    this.loadModel()
  }
  

  trackByQuestionId(index: number, question: any): any {
    return index; // Suponha que cada pergunta tem uma propriedade 'id' única
  }
  

/*   resposeReceive(): void {
    this.socketService.getResultSource$.subscribe(
      response => {
          const { status, job } = response
          if(status.toLowerCase()=='completed'){ 
              const { result } = response        
              const { credits, questions } = result
              this.credits = credits
              this.totalCredits += credits
         
              questions.forEach((question:any) => {
                this.questions.unshift(question)
              })

              this.saveQuestionsInLocalStorage()
              this.saveCredits()

              this.ngxSpinner.hide('question-ia-generator')
          }

          if(status.toLowerCase()=='failed'){
              this.ngxSpinner.hide('question-ia-generator')
          }
      },
      error => {
          console.log('socket service getResultSource error: ', error)
      }
    )

    this.socketService.getConnecSource$.subscribe(
        connect => {
            if(connect){
                //this.fetchFiles()
            }
        }
    )
  } */

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
    if(window.localStorage.getItem('provaText')){
      this.provaText = window.localStorage.getItem('provaText') as string
    }
    if(window.localStorage.getItem('gabaritoText')){
      this.gabaritoText = window.localStorage.getItem('gabaritoText') as string
    }
    if(window.localStorage.getItem('editalText')){
      this.editalText = window.localStorage.getItem('editalText') as string
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
    window.localStorage.setItem('provaText', this.provaText)
    window.localStorage.setItem('gabaritoText', this.gabaritoText)
    window.localStorage.setItem('editalText', this.editalText)
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
    this.ngxSpinner.show('question-manual-generator')
    this.questions.unshift(this.newQuestion)
    const awaitMoment = await new Promise(resolve=>{setTimeout(() => {
      this.toastrService.success('Questão adicionada com sucesso')
      this.saveFormQuestionManual()
      this.saveQuestionsInLocalStorage()
      this.ngxSpinner.hide('question-manual-generator')
      this.saveQuestionsInLocalStorage()
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
    this.ngxSpinner.show('question-ia-generator')

    if(!this.codProva || !this.provaFile) {
      this.ngxSpinner.hide('question-ia-generator')
      return
    }

    const formData: FormData = new FormData()
    formData.append('codProva', this.codProva)
    formData.append('provaFile', this.provaFile, this.provaFile.name)
    formData.append('gabaritoFile', this.gabaritoFile, this.gabaritoFile.name)
    formData.append('editalFile', this.editalFile, this.editalFile.name)

    this.questionService.createQuestions(formData, this.model, 'pdf').subscribe(
      (response) => {
        this.toastrService.success('Gerando questões...')
      },
      (error) => {
        this.toastrService.error('Erro na geração de questões.')
        this.ngxSpinner.hide('question-ia-generator')
      }
    )
  }

  questionsCreateWithPureText(): void {
    this.ngxSpinner.show('question-ia-generator')
    this.saveFormQuestionByText()

    if(!this.codProva || !this.provaText) {
      this.ngxSpinner.hide('question-ia-generator')
      return
    }

    const formData: FormData = new FormData()
    formData.append('codProva', this.codProva)
    formData.append('provaText', this.provaText)
    formData.append('gabaritoText', this.gabaritoText)
    formData.append('editalText', this.editalText)

    this.questionService.createQuestions(formData, this.model, 'text').subscribe(
      (response) => {
        this.toastrService.success('Gerando questões...')
      },
      (error) => {
        this.toastrService.error('Erro na geração de questões.')
        this.ngxSpinner.hide('question-ia-generator')
      }
    )
  }

  replicateQuestions(): void {
    this.ngxSpinner.show('question-ia-generator')
    const questions = this.getSelecteds()
    console.log(questions)
    if(questions.length==0) {
      this.ngxSpinner.hide('question-ia-generator')
      this.toastrService.info('Selecione questões.')
      return
    }
    
    this.questionService.createQuestions({ questions }, this.model, 'replic').subscribe(
      (response) => {
        this.toastrService.success('Gerando questões...')
      },
      (error) => {
        this.toastrService.error('Erro na geração de questões.')
        this.ngxSpinner.hide('question-ia-generator')
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
