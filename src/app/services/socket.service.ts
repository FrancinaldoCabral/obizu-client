import { Injectable } from '@angular/core'
import { io, Socket } from 'socket.io-client'
import { Subject } from 'rxjs'
import { AuthService } from './auth.service'
import { ToastrService } from 'ngx-toastr'
import { EnvironmentService } from './environment.service'
import { NgxSpinnerService } from 'ngx-spinner'

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket!: Socket
  
  private resultSource = new Subject<any>()
  getResultSource$ = this.resultSource.asObservable()

  private connectSource = new Subject<any>()
  getConnecSource$ = this.connectSource.asObservable()

  socketIsConnect: boolean = false

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private env: EnvironmentService,
    private ngxSpinner: NgxSpinnerService
  ) { 

  }

  setupSocketConnection(): void {
    console.log('socket start')
    
    this.socket = io(
      this.env.apiUrl, 
      //`https://209.145.57.84`,
      
      {
        auth: {
          token: this.auth.getToken()
        }
      }
    )

    this.socket.on('connect', ()=>{ 
      console.log('socket id: ', this.socket?.id) 
      this.socketIsConnect = true
      this.connectSource.next(true)
      //this.toastr.success('You is connected', 'Connection')
    })
    this.socket.on('disconnect', ()=>{ 
      console.log('socket id: ', this.socket?.id) 
      this.socketIsConnect = false
      this.ngxSpinner.hide('ia-creator')
      this.toastr.warning('You is disconnect', 'Connection')
    })
    
    this.socket.on('results', (result)=>{
      console.log(result)
      this.resultSource.next(result)
    })
    this.socket.on('failed', (result)=>{
      console.log('failed')
    })

    this.socket.on("connect_error", (err) => {
      // the reason of the error, for example "xhr poll error"
      this.toastr.warning('Falha de conexão.', 'Connection')

    })
  }

  getSocketIsConnect(): boolean {
    return this.socketIsConnect
  }

  disconnect(): void {
    if (this.socket) {
        this.socket.disconnect()
    }
  }

  getSocket(): Socket | undefined {
    return this.socket
  }  
}