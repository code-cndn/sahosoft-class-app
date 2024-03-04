import { Component } from '@angular/core';
import { LoaderService } from '../loader/loader.service';

@Component({
  selector: 'app-page-loader',
  standalone: true,
  imports: [],
  templateUrl: './page-loader.component.html',
  styleUrl: './page-loader.component.scss'
})
export class PageLoaderComponent {
  constructor(public loaderService: LoaderService){}
  get loaderEnabled() {
    // console.log(this.loaderService.loaderEnabled);
    
    return this.loaderService.loaderEnabled;
  }
}
