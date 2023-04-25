import { ApplicationRef, Component, OnInit } from '@angular/core';
import { PushService } from '../services/push.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  notificaciones:any = [];
  constructor(public pushService:PushService, private applicationRef:ApplicationRef) {}
  userId=this.pushService.userId;
  ngOnInit(): void {
      this.pushService.pushNoti.subscribe(noti=>{
        this.notificaciones.unshift(noti);
        console.log('noti',this.notificaciones);
        this.applicationRef.tick();
      });
      this.pushService.getMensajes().then(mensajes=>{
        this.notificaciones=mensajes;
        console.log('oninit',this.notificaciones);
        this.applicationRef.tick(); //re render
      });
  }
  ionViewWillEnter(){
    this.pushService.getMensajes().then(mensajes=>{
      this.notificaciones=mensajes;
      console.log('Will enter',this.notificaciones);
      this.applicationRef.tick(); //re render
    });
  }
}
