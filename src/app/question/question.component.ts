import { CommonModule } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner'
import { QuestionService } from '../services/question.service'
import { ToastrService } from 'ngx-toastr'
import { SocketService } from '../services/socket.service'
import { Router, RouterModule } from '@angular/router'
import { QuestionDetailsComponent } from '../question-details/question-details.component'

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgxSpinnerModule,
    QuestionDetailsComponent
  ],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css'
})
export class QuestionComponent implements OnInit {
  @Input() filters!: string[]
  @Input() id!: string
  questions: any[] = []
  iQuestions: number = 0
  responses: number[]=[]
  confirmeds: boolean[]=[]
  verifySpinner: boolean = false
  
  tapAlternativeAudio: HTMLAudioElement = new Audio()
  pageTurnAudio: HTMLAudioElement = new Audio()
  verifySuccessAudio: HTMLAudioElement = new Audio()
  verifyErrorAudio: HTMLAudioElement = new Audio()

  constructor(
    private ngxSpinner: NgxSpinnerService,
    private questionService: QuestionService,
    private toastrService: ToastrService,
    private socketService: SocketService,
    private router: Router
  ){

    this.socketService.getConnecSource$.subscribe(
      connect => {
          if(connect){
            this.loadData()
          }else{
            this.ngxSpinner.hide()
          }
      }
    )
  }

  loadAudios(): void {
    this.tapAlternativeAudio.src = 'assets/audio/tap-alternative-audio.mp3'
    this.tapAlternativeAudio.load()
    this.pageTurnAudio.src = 'assets/audio/page-turn-audio.wav'
    this.pageTurnAudio.load()
    this.verifySuccessAudio.src = 'assets/audio/verify-click-success.wav'
    this.verifySuccessAudio.load()
    this.verifyErrorAudio.src = 'assets/audio/verify-click-error.mp3'
    this.verifyErrorAudio.load()
  }

  ngOnInit(): void {
    this.loadAudios()
    if(this.socketService.getSocketIsConnect()) {
      this.loadData()
    }
  }

  async loadData(): Promise<void> {
    this.ngxSpinner.show('transactional')
    await new Promise((resolve, reject)=>{
      this.questionService.randomQuestions(this.filters).subscribe(
        data => {
          data.questions.forEach((question:any) => {
            this.questions.push(question)
          })
          this.ngxSpinner.hide('transactional')
          resolve
        },
        error=> {
          console.log(error)
          this.router.navigateByUrl(`/modules/${this.id}`)
          this.ngxSpinner.hide('transactional')
          //this.toastrService.error(`Erro no carregamento de questões. Erro: ${error.status}`)
          reject
        })
    })
  }

  toRespond(iAlternative: number): void {
    if(iAlternative===this.responses[this.iQuestions]) this.responses.splice(this.iQuestions, 1)
    else this.responses[this.iQuestions] = iAlternative
    this.tapAlternativeAudio.play()
  }

  previous(): void {
    this.pageTurnAudio.play()
    this.iQuestions--
    if(this.iQuestions<=0) {
      this.iQuestions = 0
      this.toastrService.info('Você está no início.')
    }
  }

  async next(): Promise<void> {
    this.pageTurnAudio.play() 
    this.iQuestions++
    if(this.iQuestions>=this.questions.length) {
      await this.loadData()
    }
  }

  verify(): void {
    this.verifySpinner = true
    this.questionService.respond(this.questions[this.iQuestions]._id, this.responses[this.iQuestions]).subscribe(
      data => {
        const userResponses = data.userResponses
        if(userResponses.isCorrect){
          this.toastrService.success('Consulte solução comentada logo abaixo.', 'Correto', {
            timeOut: 2000,
            positionClass: 'toast-top-center'
          })
          this.verifySuccessAudio.play()
          console.log(userResponses)
        }else{
          this.toastrService.error('Consulte solução comentada logo abaixo.', 'Incorreto', {
            timeOut: 2000,
            positionClass: 'toast-top-center'
          })
          this.verifyErrorAudio.play()
          console.log(userResponses)
        }
        this.confirmeds[this.iQuestions]=true
        this.verifySpinner = false
      },
      error => {
        this.verifySpinner = false
        console.log(error)
      },
      () => {
        this.verifySpinner = false
      }
    )
  }

  decodificarSequenciasUnicode(texto: string): string {
    return texto.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
    })
  }
}
