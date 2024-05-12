import { ApplicationConfig, importProvidersFrom } from '@angular/core'
import { provideRouter } from '@angular/router'

import { routes } from './app.routes'
import { HttpClientModule } from '@angular/common/http'
import { provideToastr } from 'ngx-toastr'
import { NgxSpinnerModule } from 'ngx-spinner'
import { provideAnimations } from '@angular/platform-browser/animations'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import {  provideQuillConfig } from 'ngx-quill'

const toolbar = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote'],

  //[{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
 // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

//  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean'],                                         // remove formatting button

  ['link', 'image', 'video']                         // link and image, video
]

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(CommonModule), 
    importProvidersFrom(HttpClientModule), 
    importProvidersFrom(FormsModule), 
    provideAnimations(),
    provideToastr(),
    importProvidersFrom(NgxSpinnerModule),
    provideQuillConfig({
      modules: {
        //syntax: true,
        toolbar: toolbar
      }
    }),
    provideRouter(routes)
  ]
}
