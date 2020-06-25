import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  registros: Registro[]=[];

  constructor(private storage: Storage) {
    this.cargarRegistros();
   }

  

  async guardarRegistro(format: string, text: string){
    await this.cargarRegistros();
    const nuevoRegistro = new Registro(format, text);
    this.registros.unshift(nuevoRegistro);
    this.storage.set('registros', this.registros);
    console.log(this.registros)
  }

  async cargarRegistros(){
    this.registros = [];
    const reg = await this.storage.get('registros');
    this.registros = reg || [];
  }
}
