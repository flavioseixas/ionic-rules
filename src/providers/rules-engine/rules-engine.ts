import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Engine } from 'json-rules-engine';

@Injectable()
export class RulesEngineProvider {

  private engine: Engine;
  
  private data: any = new Object();
  private facts: any = new Object();
  private response: any;

  private currentQuestion: any;
  private currentDecision: any;
  
  constructor(private http: HttpClient) {

    this.engine = new Engine();

    this.http.get('assets/rules/rules.json').subscribe(data => {
      this.data = data;
      
      var i;
      for (i = 0; i < data["rules"].length; i++) {
        this.engine.addRule(data["rules"][i]);
      }

      for (i = 0; i < data["question"].length; i++) {

        var factName = Object.getOwnPropertyNames(data["question"][i])[0];
        var factValue = data["question"][i][factName]["answer"];
       
        var myFact = new Object();
        myFact[factName] = factValue;

        Object.assign(this.facts, myFact);
      }      
 
      this.engine.on('success', async (event, almanac) => {
        this.response = new Object();
        for (var p in this.data[event.type]) {
          var propertyName = Object.getOwnPropertyNames(this.data[event.type][p])[0];
          if (propertyName === event.params.value) {
            this.response[event.type] = this.data[event.type][p];
            
          }
        }
        console.log(this.response);
      });
  
      this.engine.run(this.facts).then((events) => {
        events.map((event) => {
          console.log('terminei aqui');
        });
      });
    });
  }

  public setFact(property, value) {

  }

  public getEvent(): any {

    return this.response;
  }
}
