import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { RulesEngineProvider } from '../../providers/rules-engine/rules-engine';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public engine: RulesEngineProvider) {
    console.log(engine);
  }

}
