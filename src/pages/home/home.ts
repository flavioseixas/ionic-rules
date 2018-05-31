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
  uiPossibleAnswers: any;

  btnSalvarEnable = false;
  btnRetornarEnable = false;

  constructor(public navCtrl: NavController, public engine: RulesEngineProvider) {

  }

  private updateCardContent(header, content) {
    this.cardHeader = header;
    this.cardContent = content;
  }

  private buildPage(data) {

    if (Object.getOwnPropertyNames(data)[0] === "question") {

      this.status = "question";

      this.id = Object.getOwnPropertyNames(data["question"])[0];
      this.data = data;
      var text = data["question"][this.id]["text"];

      this.uiPossibleAnswers = new Array();
      var selected = null;
      for(var p in data["question"][this.id]["valid_values"]) {
        if (data["question"][this.id]["valid_values"][p] === this.data["question"][this.id]["answer"]) {
          selected = true;
        }
        else {
          selected = false;
        }

        this.uiPossibleAnswers.push(Object.assign({},{"text":data["question"][this.id]["valid_values_text"][p]},{"selected":selected},{"hasAnswered":selected}));
      };

      if (this.data["question"][this.id]["answer"] === "null") {
        this.btnSalvarEnable = false;
      }

      this.updateCardContent("Pergunta", text);
    }

    if (Object.getOwnPropertyNames(data)[0] === "decision") {
      this.status = "decision";
      
      this.id = Object.getOwnPropertyNames(data["decision"])[0];
      var text = data["decision"][this.id]["text"];

      this.uiPossibleAnswers = new Array();
      this.updateCardContent("Decisão", text);
    }
  }

  ngOnInit() {
    this.questions = new Array();

    this.engine.getNewEvent().subscribe(data => {
      this.questions.push(data);
      
      if (this.questions.length > 1) {
        console.log("passei aqui também");
        this.btnRetornarEnable = true;
      }
      
      this.buildPage(data);
    });
  }

  public selectAnswer(index) {
    this.questions[this.questions.length-1]["question"][this.id]["answer"] = this.data["question"][this.id]["valid_values"][index];
    this.btnSalvarEnable = true;
  }

  public sendAnswer() {
    this.engine.setFact(this.id, this.questions[this.questions.length-1]["question"][this.id]["answer"]);
  }

  public moveBack() {
    this.questions.pop();
    this.id = Object.getOwnPropertyNames(this.questions[this.questions.length-1]["question"])[0];
    console.log(this.id);
    if (this.questions.length <= 1) {
      console.log("passei aqui");
      this.btnRetornarEnable = false;
    }
    
    this.engine.setFact(this.id, "null");

  }
}
