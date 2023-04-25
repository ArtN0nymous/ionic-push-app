import { EventEmitter, Injectable } from '@angular/core';
import { OneSignalPlugin } from 'onesignal-cordova-plugin';
import { Storage } from '@ionic/storage-angular';
@Injectable({
  providedIn: 'root'
})
export class PushService {
  mensajes:any[]=[];
  userId:string='';
  private _storage: Storage | null = null;
  pushNoti = new EventEmitter<any>();
  constructor(private OneSignal: OneSignalPlugin,private storage:Storage){
    this.init();
  }
  configuracionInicial(){
    this.OneSignal.setAppId("5a55d10f-1341-4ba7-8bcc-31096aab95b8");
    this.OneSignal.setNotificationWillShowInForegroundHandler((jsonData)=>{
      console.log('Notificacion Recivida',jsonData);
      this.guardarNotificacion(jsonData.getNotification());
    });
    this.OneSignal.setNotificationOpenedHandler(async (jsonData)=>{
        console.log('notificationOpenedCallback: ',jsonData);
        await this.cargarMensajes();
        await this.guardarNotificacion(jsonData.notification);
    });

    this.OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
        console.log("User accepted notifications: " + accepted);
    });
    this.OneSignal.getDeviceState((res)=>{
      this.userId=res.userId;
      console.log(this.userId);
    });
  }
  async guardarNotificacion(noti:any){
    const payload = noti;
    const existsPush=this.mensajes.find(mensaje=>mensaje.notificationId===payload.notificationId);
    if(existsPush){
      return;
    }
    this.mensajes.unshift(payload);
    console.log(this.mensajes);
    this.pushNoti.emit(payload);
    await this.gudararMensajes();
  }
  async gudararMensajes(){
   await this.storage.set('mensajes',this.mensajes);
  }
  async cargarMensajes(){
    this.mensajes=await this.storage.get('mensajes')||[];
    return this.mensajes;
  }
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    this.cargarMensajes();
  }
  async getMensajes(){
    await this.cargarMensajes();
    return [...this.mensajes];
  }
}
