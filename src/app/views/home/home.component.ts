import { Component, OnInit, inject } from '@angular/core';
import { CarouselBannerComponent } from './components/carousel-banner/carousel-banner.component';
import { AmazingFeaturesComponent } from './components/amazing-features/amazing-features.component';
import { CryptoService } from '../../shared/crypto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselBannerComponent, AmazingFeaturesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  _crypto = inject(CryptoService);
  router = inject(Router);
  ngOnInit(): void {

    let userDetsils = JSON.parse(this._crypto.getStorage("SYSUSER_DT")) || null;
    if (userDetsils && userDetsils != null) {
      this.router.navigate(['user/dashboard']);
    }
  }

}
