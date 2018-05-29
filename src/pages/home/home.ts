import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { RulesEngineProvider } from '../../providers/rules-engine/rules-engine';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  cardContent: String;
  event: any;

  id: any;
  text: any;

  constructor(public navCtrl: NavController, public engine: RulesEngineProvider) {

  }

  private updateCardContent(content) {
    this.cardContent = content;
  }

  ngOnInit() {
    this.engine.getEvent().subscribe(data => {
      if (Object.getOwnPropertyNames(data)[0] === "question") {

        this.id = Object.getOwnPropertyNames(data["question"])[0];
        this.text = data["question"][this.id]["text"];

        this.updateCardContent(this.text);
      }
    });
  }
}
