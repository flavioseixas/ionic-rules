import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { RulesEngineProvider } from '../../providers/rules-engine/rules-engine';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  cardContent: String;
  cardHeader: String;
  status: any;

  id: any;
  data: any;

  questions: any;
  possibleAnswers: any;
  selectedItem: any;
  selectedItemIdx: any;

  btnSalvarEnable = false;

  constructor(public navCtrl: NavController, public engine: RulesEngineProvider) {

  }

  private updateCardContent(header, content) {
    this.cardHeader = header;
    this.cardContent = content;
  }

  private buildPage(data, selectedItemIdx) {

    if (Object.getOwnPropertyNames(data)[0] === "question") {

      this.status = "question";

      this.id = Object.getOwnPropertyNames(data["question"])[0];
      this.data = data;
      var text = data["question"][this.id]["text"];

      this.possibleAnswers = new Array();
      var selected = null;
      for(var p in data["question"][this.id]["valid_values"]) {
        if (p === this.selectedItemIdx) {
          selected = true;
        }
        else {
          selected = false;
        }

        console.log(Object.assign({},{"text":data["question"][this.id]["valid_values_text"][p]},{"selected":selected},{"hasAnswered":selected}));
        this.possibleAnswers.push(Object.assign({},{"text":data["question"][this.id]["valid_values_text"][p]},{"selected":selected},{"hasAnswered":selected}));
      };

      if (selectedItemIdx === null) {
        this.btnSalvarEnable = false;
      }

      this.updateCardContent("Pergunta", text);
    }

    if (Object.getOwnPropertyNames(data)[0] === "decision") {
      this.status = "decision";
      
      this.id = Object.getOwnPropertyNames(data["decision"])[0];
      var text = data["decision"][this.id]["text"];

      this.possibleAnswers = new Array();
      this.updateCardContent("Decisão", text);
    }
  }

  ngOnInit() {
    this.questions = new Array();

    this.engine.getNewEvent().subscribe(data => {
      this.questions.push(data);
      this.buildPage(data, null);
    });
  }

  public selectAnswer(index) {
    this.selectedItem = this.data["question"][this.id]["valid_values"][index];
    this.selectedItemIdx = index;
    this.btnSalvarEnable = true;
  }

  public sendAnswer() {
    console.log(this.id);
    console.log(this.selectedItem);
    this.engine.setFact(this.id, this.selectedItem);
  }
}
