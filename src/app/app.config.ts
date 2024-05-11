import { ApplicationConfig, importProvidersFrom, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { provideRouter } from '@angular/router'

import { routes } from './app.routes'
import { AuthService } from './services/auth.service'
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http'
import { TokenInterceptor } from './services/token.interceptor'
import { SocketService } from './services/socket.service'
import { ChatService } from './services/chat.service'
import { LanguageService } from './services/language.service'
import { ToastrModule, ToastrService, provideToastr } from 'ngx-toastr'
import { CreateQuestionsService } from './services/create-questions.service'
import { ModelService } from './services/llm.service'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner'
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { NgxLoadingModule } from 'ngx-loading'

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(CommonModule), 
    importProvidersFrom(HttpClientModule), 
    importProvidersFrom(FormsModule), 
    provideAnimations(),
    provideToastr(),
    importProvidersFrom(NgxSpinnerModule),
    provideRouter(routes)
  ]
}
