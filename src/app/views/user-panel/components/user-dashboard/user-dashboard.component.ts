import { Component, OnInit } from '@angular/core';
import $ from 'jquery';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit{
  ngOnInit(): void {
    $(document).ready(function () {
      $(this).scrollTop(0);
    });
  }



}
