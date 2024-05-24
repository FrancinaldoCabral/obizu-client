import { Component, OnInit } from '@angular/core'
import { QuestionService } from '../services/question.service'
import { FormsModule } from '@angular/forms'
import { ToastrService } from 'ngx-toastr'
import { SocketService } from '../services/socket.service'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner'
import { CommonModule, DecimalPipe } from '@angular/common'
import { QuillModule } from 'ngx-quill'

import { v4 as uuidv4 } from 'uuid'
import { AuthService } from '../services/auth.service'

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
    NgxSpinnerService,
    DecimalPipe
  ],
  templateUrl: './questions-register.component.html',
  styleUrl: './questions-register.component.css'
})
export class QuestionsRegisterComponent implements OnInit{
  models: string [] = [
    'claude-3-haiku-20240307',
    'gpt-3.5-turbo-0125',
    'claude-3-sonnet-20240229',
    'gpt-4o',
    'gpt-4-turbo', 
    'claude-3-opus-20240229'
  ]
  disabledModels: string [] = ['claude-3-sonnet-20240229', 'claude-3-haiku-20240307']
  model: string = 'gpt-4o' || window.localStorage.getItem('model')
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

  coustTotal: number = 0

  selectedItems: Set<number> = new Set<number>()

  questionsInFailed: any[]=[]

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
  othersInstructions: string = ''

  constructor(
    private questionService: QuestionService,
    private toastrService: ToastrService,
    private socketService: SocketService,
    private ngxSpinner: NgxSpinnerService,
    private auth: AuthService
  ){
    this.socketService.getConnecSource$.subscribe(
      connect => {
          if(connect){
            this.loadCoust()
          }else{
            this.ngxSpinner.hide('question-ia-generator')
          }
      }
    )
    this.socketService.getresultSourceReplicate$.subscribe(
      response => {
        const { credits, questions } = response
        this.toastrService.success(`${questions.length} questões criadas.`)
        this.credits = credits
        this.totalCredits += credits
   
        questions.forEach((question:any) => {
          if (!question.id) question.id = uuidv4()
          this.questions.push(question)
        })

        this.saveQuestionsInLocalStorage()
        this.saveCredits()
        this.loadQuestionsInFailed()
        this.loadCoust()
        this.ngxSpinner.hide('ia-creator')

      },
      error => {
        this.ngxSpinner.hide('ia-creator')
        this.status=''
        this.jobId=''
        this.toastrService.error(`Erro de conexão.`)
      }
    )
    this.socketService.getResultSourceExtraction$.subscribe(
      response => {
        const { credits, questions } = response
        this.toastrService.success(`${questions.length} questões criadas.`)
        this.credits = credits
        this.totalCredits += credits
   
        questions.forEach((question:any) => {
          if (!question.id) question.id = uuidv4()
          this.questions.push(question)
        })

        this.saveQuestionsInLocalStorage()
        this.saveCredits()
        this.loadQuestionsInFailed()
        this.loadCoust()
        this.ngxSpinner.hide('ia-creator')

      },
      error => {
        this.ngxSpinner.hide('ia-creator')
        this.status=''
        this.jobId=''
        console.log('socket service getResultSource error: ', error)
        this.toastrService.error(`Erro de conexão.`)
      }
    )

    this.socketService.getStatusSource$.subscribe(
      response => {
        const { status, job } = response
        //this.jobId = job.id
        this.status = status
      },
      error => {
        //this.ngxSpinner.hide('ia-creator')
        this.status=''
        this.jobId=''
        console.log('socket service getResultSource error: ', error)
        this.toastrService.error(`Erro de conexão.`)
      }
    )

    this.loadQuestionsInFailed()
    this.loadQuestions()
    this.loadCredits()
    this.loadFormQuestionByText()
    this.loadFormQuestionManual()
    this.loadModel()
  }

  ngOnInit(): void {
    if(this.socketService.getSocketIsConnect()) {
      this.loadCoust()
    }
  }

  toggleSelection(item: any): void {
    if (this.selectedItems.has(item.id)) {
      this.selectedItems.delete(item.id);
    } else {
      this.selectedItems.add(item.id);
    }
  }

  removeSelectedItems(): void {
    this.questions = this.questions.filter(item => !this.selectedItems.has(item.id));
    this.selectedItems.clear()
    this.saveQuestionsInLocalStorage()
  }

  loadCoust() {
    this.questionService.getCousts().subscribe(
      data => {
        this.coustTotal = data.coustTotal
      },
      error=> {
        console.log(error)
        this.toastrService.error(`Erro no carregamento de custos. Erro: ${error.status}`)
      }
    )
  }
  
  trackByQuestionId(index: number, question: any): any {
    return index // Suponha que cada pergunta tem uma propriedade 'id' única
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
      const questions = JSON.parse(window.localStorage.getItem('questions') as any)
      this.questions = questions.map((q:any, index:number)=>{
        if(!q.id){
          q.id = index
          return q
        }else{
          return q
        }
      })
    }
  }

  loadQuestionsInFailed(): void {
    this.questionService.getQuestionsInFailed().subscribe(
      success => {
        this.questionsInFailed = success
      },
      error => {
        console.log(error)
      }
    )
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

  saveFormReplic(): void {
    window.localStorage.setItem('othersInstructions', this.othersInstructions)
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
  }

  getSelecteds(): any[]{
      return this.questions.filter(item => this.selectedItems.has(item.id))
  }

  saveQuestionsInLocalStorage(): void {
    window.localStorage.setItem('questions', JSON.stringify(this.questions))
  }

  removeQuestion(index: number): void{
    this.questions.splice(index, 1)
    this.toastrService.success('Questão removida com sucesso.')
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

    const form = {     
      model: this.model, 
      codProva: this.codProva,
      qtdeQuestions: this.qtdeQuestions,
      contentToQuestions: this.contentToQuestions, 
      metadata: { userId: this.auth.getUser().id } } 

    this.questionService.createQuestions(form, this.model, 'text').subscribe(
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
    const qtdeQuestions = this.qtdeQuestions

    if(questions.length==0) {
      this.ngxSpinner.hide('ia-creator')
      this.toastrService.info('Selecione questões.')
      return
    }
    
    this.questionService.createQuestions({ questions, qtdeQuestions }, this.model, 'replic').subscribe(
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

  replicateQuestionsByParts(): void {
    this.ngxSpinner.show('ia-creator')
    this.status = `Replicando questões. Modelo ${this.model}`

    if(this.getSelecteds().length==0) {
      this.ngxSpinner.hide('ia-creator')
      this.toastrService.info('Selecione questões.')
      return
    }

    const form = {     
      model: this.model, 
      questionsOrigin: this.getSelecteds(),
      qtdeQuestions: this.qtdeQuestions,
      othersInstructions: this.othersInstructions, 
      metadata: { userId: this.auth.getUser().id } }
    
    this.socketService.emitReplicate(form)
  }

  extractionQuestionsByParts(): void {
    this.ngxSpinner.show('ia-creator')
    this.status = `Replicando questões. Modelo ${this.model}`

    if(this.getSelecteds().length==0) {
      this.ngxSpinner.hide('ia-creator')
      this.toastrService.info('Selecione questões.')
      return
    }

    const form = {     
      model: this.model, 
      codProva: this.codProva,
      qtdeQuestions: this.qtdeQuestions,
      contentToQuestions: this.contentToQuestions, 
      metadata: { userId:1 } }
    
    this.socketService.emitExtraction(form)
  }

  cancelCreator(id:string): void {
    this.questionService.cancelCreation(id).subscribe(
      success => {
        this.status = 'Cancelando...'
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
    this.ngxSpinner.show('transactional')
    const questionsWithoudIdTemp = questions.map((q:any)=>{
      const { id, ...questionWithoudId } = q
      return questionWithoudId
    })
    this.questionService.saveQuestionsInDB(questionsWithoudIdTemp).subscribe(
      (response) => {
        this.toastrService.success('Questões adicionadas no DB')
        this.ngxSpinner.hide('transactional')
      },
      (error) => {
        console.log('save in db error', error)
        this.toastrService.error('Erro no registro de questões.')
        this.ngxSpinner.hide('transactional')
      },
      () => {
        this.ngxSpinner.hide('transactional')
      }
    )
  }
  saveOneQuestionInDB(question: any): void {
    this.ngxSpinner.show('transactional')
    const { id, ...questionWithoutId } = question
    this.questionService.saveQuestionsInDB([questionWithoutId]).subscribe(
      (response) => {
        this.ngxSpinner.hide('transactional')
        this.toastrService.success(`1 questão adicionada no DB`)
      },
      (error) => {
        console.log('save in db error', error)
        this.toastrService.error('Erro no registro de questões.')
        this.ngxSpinner.hide('transactional')
      },
      () => {
        this.ngxSpinner.hide('transactional')
      }
    )
  }

  selectAll(): void {
    this.questions.forEach(item => this.selectedItems.add(item.id));
  }

  deselectAll(): void {
    this.selectedItems.clear();
  }

  toggleSelectAll(): void {
    if (this.selectedItems.size === this.questions.length) {
      this.deselectAll()
    } else {
      this.selectAll()
    }
  }

  downloadQuestionsSelecteds(): void {
    const questions = this.getSelecteds()
    if(questions.length==0) {
      this.ngxSpinner.hide('ia-creator')
      this.toastrService.info('Selecione questões.')
      return
    }

    const jsonStr = JSON.stringify(questions, null, 2) 
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'questions.json'
    a.click()

    window.URL.revokeObjectURL(url)
  }

  downloadQuestionsInFailed(): void {
    if(this.questionsInFailed.length==0) {
      this.ngxSpinner.hide('ia-creator')
      this.toastrService.info('Selecione questões.')
      return
    }
    const jsonStr = JSON.stringify(this.questionsInFailed, null, 2) 
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'fail_questions.json'
    a.click()

    window.URL.revokeObjectURL(url)
    this.ngxSpinner.hide('ia-creator')
  }

  openFiles(): void {
    document.getElementById('uploadQuestions')?.click()
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0]
    if (file && file.type === 'application/json') {
      const reader = new FileReader()
      reader.onload = (e: any) => {
        try {
          const uploadedJsonObject = JSON.parse(e.target.result)
          uploadedJsonObject.forEach((question:any, i:number)=>{
            if(!question.id) question.id = uuidv4()
            this.questions.unshift(question)
          })
          this.saveQuestionsInLocalStorage()
        } catch (error) {
          this.toastrService.info('O arquivo deve ter um formato válido.')
        }
      }
      reader.readAsText(file)
    } else {
      console.error('Please select a valid JSON file.')
    }
  }

  copyQuestions(): void {
    if(this.getSelecteds().length==0){
      this.toastrService.info('Selecione questões para copiar.')
      return 
    }
    const questions = this.getSelecteds()
    window.localStorage.setItem('copiedQuestions', JSON.stringify(questions))
    this.toastrService.info(`Pronto!`)
  }

  pasteQuestions(): void {
    const questionsCopiedStorage = window.localStorage.getItem('copiedQuestions')
    if(questionsCopiedStorage) {
      const questions = JSON.parse(questionsCopiedStorage)
      for (let index = 0; index < questions.length; index++) {
        const question = questions[index]
        if (!question.id) question.id = uuidv4()
        this.questions.push(question)
      }
      this.saveQuestionsInLocalStorage()
      window.localStorage.removeItem('copiedQuestions')
      this.toastrService.info(`Pronto!`)
    }else{
      this.toastrService.info(`Não há questões para colar.`)
      window.localStorage.removeItem('copiedQuestions')
    }
  }

  getCopiedQuestions(): any[]{
    const questionsCopiedStorage = window.localStorage.getItem('copiedQuestions') as any
    if(questionsCopiedStorage){
      return JSON.parse(questionsCopiedStorage)
    } else{
      return []
    }
  }

  clearCopiedQuestions(): void {
    window.localStorage.removeItem('copiedQuestions')
    this.toastrService.info('Pronto!')
  }

  copyOneQuestion(question: any): void {
    window.localStorage.setItem('copiedQuestions', JSON.stringify([question]))
    this.toastrService.info(`Pronto!`)
  }

  getSocketIsConnected(): boolean {
    return this.socketService.getSocketIsConnect()
  }
}
