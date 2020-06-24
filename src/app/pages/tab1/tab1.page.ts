import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  slideOpts ={
    allowSlidePrev: false,
    allowSlideNext: false
  }
  constructor(private barcodeScanner: BarcodeScanner, private dataLocalService: DataLocalService) {}

  //Ciclos de vida de los componentes en Ionic
  ionViewDidEnter(){
    console.log('viewDidEnter')
  }

  ionViewDidLeave(){
    console.log('viewDidLeave')
  }

  ionViewWillEnter(){
    console.log('viewWillEnter')
    this.scan();
  }

  ionViewWillLeave(){
    console.log('viewWillLeave')
  }

  scan(){
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);

      if(!barcodeData.cancelled){
        this.dataLocalService.guardarRegistro(barcodeData.format, barcodeData.text);
      }
     }).catch(err => {
         console.log('Error', err);

         this.dataLocalService.guardarRegistro('QRScann', 'http://fernando-herrera.com');
     });
  }
}
