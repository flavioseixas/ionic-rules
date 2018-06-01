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

  id: any;
  data: any;
  answer: any;
  status: any;

  questions: any;
  uiPossibleAnswers: any;

  history = new Array();
  previousAnswer = null;

  btnSalvarEnable = false;
  btnRetornarEnable = false;

  constructor(public navCtrl: NavController, public engine: RulesEngineProvider) {

  }

  ngOnInit() {

    this.engine.getNewEvent().subscribe(data => {
      this.buildPage(data);
    });
    this.answer = this.engine.getFactList();
    this.status = "initial";
  }
  
  private updateCardContent(header, content) {
    if (header === "decision") {
      header = "Decisão:";
    }
    if (header === "question") {
      header = "Pergunta:";
    }
    this.cardHeader = header;
    this.cardContent = content;
  }

  private buildPage(data) {
    this.status = Object.getOwnPropertyNames(data)[0];
    this.id = Object.getOwnPropertyNames(data[this.status])[0];
    this.data = data;

    this.uiPossibleAnswers = new Array();
    this.updateCardContent(this.status, data[this.status][this.id]["text"]);

    console.log(this.answer);
    this.btnSalvarEnable = false;
    if (this.status === "question") {
      var selected = null;
      for(var p in data["question"][this.id]["valid_values"]) {
        if (data["question"][this.id]["valid_values"][p] === this.previousAnswer) {
          selected = true;
        }
        else {
          selected = false;
        }
        this.uiPossibleAnswers.push(Object.assign({},{"text":data["question"][this.id]["valid_values_text"][p]},{"selected":selected},{"hasAnswered":selected}));
      };
    }
  }

  private isAllFactsNull(facts): boolean {
    for (var q in facts) {
      if (facts[q] != "null") {
        return true;
      }
    }
    return false;
  }

  private setFactsNull() {
    for (var q in this.answer) {
      this.answer[q] = "null"
    }
  }

  public startNow() {
    this.engine.runEngine();
  }

  public selectAnswer(index) {
    this.answer[this.id] = this.data["question"][this.id]["valid_values"][index];
    this.btnSalvarEnable = true;
  }

  public sendAnswer() {
    this.history.push(this.id);
    this.previousAnswer = null;

    this.engine.setFact(this.answer);
    this.btnRetornarEnable = true;
  }

  public undo() {
    this.answer[this.id] = "null";
    var previousId = this.history.pop();
    this.previousAnswer = this.answer[previousId];
    this.answer[previousId] = "null";

    if (this.isAllFactsNull(this.answer)) {
      this.btnRetornarEnable = false;
    }
    this.engine.setFact(this.answer);
  }

  public runAgain() {
    this.btnRetornarEnable = false;
    this.setFactsNull();
    this.previousAnswer = null;
    this.history = new Array();
    this.engine.runEngine();
  }
}
