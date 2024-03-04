import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { UserPanelComponent } from './views/user-panel/user-panel.component';
import { HomeComponent } from './views/home/home.component';
import { UserDashboardComponent } from './views/user-panel/components/user-dashboard/user-dashboard.component';
import { UserMyCoursesComponent } from './views/user-panel/components/user-my-courses/user-my-courses.component';
import { PlayVideosVideoplayerComponent } from './views/play-videos-videoplayer/play-videos-videoplayer.component';
import { AuthGuard } from './views/auth/auth.guard';
import { VideoPlayerComponent } from './views/user-panel/components/video-player/video-player.component';
import { VideoPanelComponent } from './views/play-videos-videoplayer/video-panel/video-panel.component';
import { SettingsComponent } from './views/user-panel/components/settings/settings.component';

export const routes: Routes = [
   {path:'', component:LayoutComponent, children:[
      {path:'', redirectTo:'home', pathMatch:"full"},
      {path:'home', component:HomeComponent, title:'Sahosoft'},
      {path:'user', component:UserPanelComponent, children:[
         {path:'', redirectTo:'dashboard', pathMatch:'full'},
         {path:'dashboard', component: UserDashboardComponent, title:'Dashboard'},
         {path:'my-courses', component: UserMyCoursesComponent, title:'My Courses'},
         {path:'settings', component: SettingsComponent, title:'Settings'},
      ], 
      canActivate:[AuthGuard]
   },

   ]},
   {path:'videos', component:PlayVideosVideoplayerComponent, title:'Videos', children:[
      // {path:'video-panel', component:VideoPanelComponent}
   ],  canActivate:[AuthGuard]},
   
   
   
];
