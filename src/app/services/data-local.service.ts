import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Platform } from '@ionic/angular';

const archivo = 'registros.csv';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  registros: Registro[]=[];
  filePath: string;

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private iab: InAppBrowser,
    private file: File,
    private email: EmailComposer,
    public platform: Platform) {
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
    console.log(this.registros)
  }

  abrirRegistro(registro: Registro){
    this.navCtrl.navigateForward('/tabs/tab2');

    switch (registro.type) {
      case 'http':
        const browser = this.iab.create(registro.text, '_system');
        break;
      case 'geo':
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
        break;
      default: 
        console.log('Tipo no encontrado');
        break;
    }
  }

  enviarCorreo(){

    if (this.platform.is('android')) {
      this.filePath = `${this.file.externalDataDirectory}`;  
    } else { // si estamos en ios
      this.filePath = `${this.file.dataDirectory}`;
    }

    const arrayTemp = [];
    const titulos = 'Tipo, Formato, Creado en, Texto\n';
    arrayTemp.push(titulos);

    this.registros.forEach(registro => {
      let linea = `${registro.type}, ${registro.format}, ${registro.created}, ${registro.text.replace(',', ' ')}\n`;
      arrayTemp.push(linea);
    });

    this.crearCsv(arrayTemp.join(' '));

  }

  crearCsv(text: string){
    this.file.checkFile(this.filePath, archivo)
      .then(existe => {
        console.log('Existe archivo? :', existe);
        return this.escribirCsv(text);
      }).catch(err => {
        this.file.createFile(this.filePath, archivo, false)
          .then( creado => {
            this.escribirCsv(text);
          })
          .catch(err2 =>{
            console.log('No se pudo crear el archivo');
          });
      });
  }

  async escribirCsv(text: string){
    await this.file.writeExistingFile(this.filePath, archivo, text);
    console.log('Archivo creado');

    const pathCsv = `${this.filePath}${archivo}`;

    //const filePath = `${this.file.externalDataDirectory}archivo`;  
    console.log(this.file.dataDirectory + `${archivo}`);

    const email = {
      to: '',
      //cc: 'erika@mustermann.de',
      //  bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [pathCsv],
      subject: 'Backup de Scans',
      body: 'Aqui tiene sus backups de sus <strong>Scans</strong>',
      isHtml: true
    }
    
    // Send a text message using default options
    this.email.open(email);
  }
}
