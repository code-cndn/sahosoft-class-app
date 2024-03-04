import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserSidebarComponent } from './components/user-sidebar/user-sidebar.component';
// declare var FingerprintJS: any;
@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [RouterOutlet, UserSidebarComponent],
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.scss'
})
export class UserPanelComponent implements OnInit {
  fp: any;
  ngOnInit(): void {
    // const setFp = async () => {
    //   const fp = await FingerprintJS.load();

    //   const { visitorId } = await fp.get();
    //   console.log(visitorId);
      
    // }
    // setFp();
  }

}
