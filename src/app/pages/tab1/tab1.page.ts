import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor() {}

  //Ciclos de vida de los componentes en Ionic
  ionViewDidEnter(){
    console.log('viewDidEnter')
  }

  ionViewDidLeave(){
    console.log('viewDidLeave')
  }

  ionViewWillEnter(){
    console.log('viewWillEnter')
  }

  ionViewWillLeave(){
    console.log('viewWillLeave')
  }
}
