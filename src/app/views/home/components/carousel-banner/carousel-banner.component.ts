import { Component } from '@angular/core';
import { LoginComponent } from '../../../auth/login/login.component';

@Component({
  selector: 'app-carousel-banner',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './carousel-banner.component.html',
  styleUrl: './carousel-banner.component.scss'
})
export class CarouselBannerComponent {

}
