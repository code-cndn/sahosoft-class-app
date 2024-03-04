import { Component, OnInit } from '@angular/core';
import { VideoPlayerComponent } from '../../user-panel/components/video-player/video-player.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-video-panel',
  standalone: true,
  imports: [VideoPlayerComponent],
  templateUrl: './video-panel.component.html',
  styleUrl: './video-panel.component.scss'
})
export class VideoPanelComponent implements OnInit {
  vidParams:any;
  constructor(private route: ActivatedRoute){
    
    
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['myObject']) {
        this.vidParams = JSON.parse(params['myObject']);
        
      }
    });
  }
}
