import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  registros: Registro[]=[];

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private iab: InAppBrowser) {
    this.cargarRegistros();
   }

  

  async guardarRegistro(format: string, text: string){
    await this.cargarRegistros();
    const nuevoRegistro = new Registro(format, text);
    this.registros.unshift(nuevoRegistro);
    this.storage.set('registros', this.registros);
    this.abrirRegistro(nuevoRegistro);
    console.log(this.registros)
  }

  async cargarRegistros(){
    this.registros = [];
    const reg = await this.storage.get('registros');
    this.registros = reg || [];
  }

  abrirRegistro(registro: Registro){
    this.navCtrl.navigateForward('/tabs/tab2');

    switch (registro.type) {
      case 'http':
        const browser = this.iab.create(registro.text, '_system');
        break;
      case 'geo':
        //abrir el mapa
        break;
      default: 
        console.log('Tipo no encontrado');
        break;
    }
  }
}
