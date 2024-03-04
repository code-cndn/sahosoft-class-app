import { Component } from '@angular/core';
import { TopHeaderComponent } from '../headers/top-header/top-header.component';
import { FooterComponent } from '../footer/footer.component';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from '../../../views/auth/login/login.component';
import $ from 'jquery';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [TopHeaderComponent, FooterComponent, SideMenuComponent, RouterOutlet, LoginComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  backtotop(){
    $("html, body").animate({scrollTop: 0}, 1000);
  }
 
}
