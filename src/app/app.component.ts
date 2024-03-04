import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PageLoaderComponent } from './shared/components/other/page-loader/page-loader.component';
import { invoke } from '@tauri-apps/api'


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PageLoaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   // Check if the pressed key is a function key (F1 to F12)
  //   if (event.key.startsWith('F')) {
  //     event.preventDefault();
  //   }
  // }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: Event): void {
    event.preventDefault();
  }
data:any;
  ngOnInit(): void {
  //   invoke('create_point')
  // .then((message) => {
  //   this.data = message;
  //   console.log(this.data);
    
  // })
  // .catch((error) => console.error(error))
  }


  constructor() { }

}
