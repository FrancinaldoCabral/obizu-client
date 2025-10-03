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
  
  private resultSourceExtraction = new Subject<any>()
  getResultSourceExtraction$ = this.resultSourceExtraction.asObservable()

  private connectSource = new Subject<any>()
  getConnecSource$ = this.connectSource.asObservable()

  private statusSource = new Subject<any>()
  getStatusSource$ = this.statusSource.asObservable()

  private resultSourceReplicate = new Subject<any>()
  getresultSourceReplicate$ = this.resultSourceReplicate.asObservable()

  socketIsConnect: boolean = false

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private env: EnvironmentService,
    private ngxSpinner: NgxSpinnerService
  ) { 

  }

  setupSocketConnection(): void { 
    this.socket = io(
      this.env.apiUrl, 
      //`https://209.145.57.84`,
      
      {
        auth: {
          token: this.auth.getToken()
        },
        withCredentials: true,

      }

    )

    this.socket.on('connect', ()=>{
      console.log('🔗 Socket.IO conectado com sucesso!')
      console.log('🔗 Socket ID: ', this.socket?.id)
      console.log('🔗 Conectado: ', this.socket?.connected)
      this.socketIsConnect = true
      this.connectSource.next(true)
    })

    this.socket.on('disconnect', ()=>{
      console.log('🔌 Socket.IO desconectado')
      console.log('🔌 Socket ID: ', this.socket?.id)
      this.socketIsConnect = false
      this.ngxSpinner.hide('ia-creator')
      this.toastr.warning('Conexão perdida', 'Socket.IO')
    })

    // Listener para todos os eventos (diagnóstico)
    this.socket.onAny((eventName, ...args) => {
      console.log(`📡 Evento Socket.IO recebido: ${eventName}`, args)
    })

    this.socket.on('extraction', (result)=>{
      console.log('📥 Resultado de extração recebido:', result)
      this.resultSourceExtraction.next(result)
    })

    this.socket.on('replicate', (result)=>{
      console.log('📤 Resultado de replicação recebido:', result)
      this.resultSourceReplicate.next(result)
    })

    this.socket.on('status', (result)=>{
      console.log('📊 Status recebido:', result)
      this.statusSource.next(result)
    })

    this.socket.on('test', (result)=>{
      console.log('🧪 Teste Socket.IO recebido:', result)
      this.toastr.info(`Teste recebido: ${result.message}`)
    })
    
    this.socket.on('failed', (result)=>{
      console.log('failed')
    })

    this.socket.on("connect_error", (err) => {
      // the reason of the error, for example "xhr poll error"
      this.socketIsConnect = false
      this.ngxSpinner.hide('ia-creator')
      this.toastr.warning('Falha de conexão.', 'Connection')

    })
  }

  emitReplicate(form:any): void {
    this.socket.emit('replicate', form)
    this.toastr.info('Enviado. Aguarde...')
  }

  emitExtraction(form:any): void {
    this.socket.emit('extraction', form)
    this.toastr.info('Enviado. Aguarde...')
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

  // Método para testar conexão Socket.IO
  testConnection(): void {
    if (this.socket?.connected) {
      console.log('🧪 Testando conexão Socket.IO...')
      this.socket.emit('test', {
        message: 'Teste de conexão do frontend',
        timestamp: new Date().toISOString()
      })
      this.toastr.info('Teste enviado via Socket.IO')
    } else {
      console.error('❌ Socket.IO não conectado')
      this.toastr.error('Socket.IO não conectado')
    }
  }

  // Método para diagnosticar conexão
  diagnoseConnection(): any {
    const diagnosis = {
      connected: this.socket?.connected || false,
      socketId: this.socket?.id || null,
      transport: this.socket?.io?.engine?.transport?.name || null,
      url: this.env.apiUrl,
      token: this.auth.getToken() ? 'Token presente' : 'Token ausente',
      timestamp: new Date().toISOString()
    }

    console.log('🔍 Diagnóstico de conexão Socket.IO:', diagnosis)
    return diagnosis
  }

  // Método para forçar reconexão
  reconnect(): void {
    console.log('🔄 Forçando reconexão Socket.IO...')
    if (this.socket) {
      this.socket.disconnect()
      setTimeout(() => {
        this.setupSocketConnection()
      }, 1000)
    } else {
      this.setupSocketConnection()
    }
  }
}
