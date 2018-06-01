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
  previousId: any;
  data: any;
  answerInit: any;
  answer: any;
  status: any;

  questions: any;
  uiPossibleAnswers: any;

  btnSalvarEnable = false;
  btnRetornarEnable = false;

  constructor(public navCtrl: NavController, public engine: RulesEngineProvider) {

  }

  ngOnInit() {

    this.engine.getNewEvent().subscribe(data => {
      this.buildPage(data);
    });
    this.answerInit = this.engine.getFactList();
    this.answer = this.engine.getFactList();
    this.status = "initial";
    this.engine.setFact(null);
  }
  
  private updateCardContent(header, content) {
    this.cardHeader = header;
    this.cardContent = content;
  }

  private buildPage(data) {

    this.status = Object.getOwnPropertyNames(data)[0];
    this.id = Object.getOwnPropertyNames(data[this.status])[0];
    this.data = data;

    this.uiPossibleAnswers = new Array();
    this.updateCardContent(this.status, data[this.status][this.id]["text"]);
    
    if (this.status === "question") {
      var answer = this.answer[this.id];
      var selected = null;
      for(var p in data["question"][this.id]["valid_values"]) {
        if (data["question"][this.id]["valid_values"][p] === answer) {
          selected = true;
        }
        else {
          selected = false;
        }
        this.uiPossibleAnswers.push(Object.assign({},{"text":data["question"][this.id]["valid_values_text"][p]},{"selected":selected},{"hasAnswered":selected}));
      };

      if (answer === "null") {
        this.btnSalvarEnable = false;
      }
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
    this.previousId = this.id;
    this.engine.setFact(this.answer);
    this.btnRetornarEnable = true;
  }

  public undo() {
    this.answer[this.id] = "null";
    var facts = this.answer;
    facts[this.previousId] = "null";
    this.engine.setFact(facts);

    if (this.answer === this.answerInit) {
      this.btnRetornarEnable = false;
    }
  }

  public runAgain() {
    this.answer = this.answerInit;
    console.log(this.answer);
    this.engine.runEngine();
  }
}
