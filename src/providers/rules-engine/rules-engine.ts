import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Engine } from 'json-rules-engine';

@Injectable()
export class RulesEngineProvider {

  private engine: Engine;

  private data: any = new Object();
  private facts: any = new Object();

  private item: any;
  private itemObserver: any;

  constructor(private http: HttpClient) {

    this.engine = new Engine();

    this.item = Observable.create(observer => {
      this.itemObserver = observer;
    });

    this.http.get('assets/rules/rules.json').subscribe(data => {
      this.data = data;

      var i;
      for (i = 0; i < data["rules"].length; i++) {
        this.engine.addRule(data["rules"][i]);
      }

      for (i = 0; i < data["question"].length; i++) {

        var factName = Object.getOwnPropertyNames(data["question"][i])[0];

        var myFact = new Object();
        myFact[factName] = "null";
        Object.assign(this.facts, myFact);
      }

      this.engine.on('success', async (event, almanac) => {
        for (var p in this.data[event.type]) {
          var propertyName = Object.getOwnPropertyNames(this.data[event.type][p])[0];

          if (propertyName === event.params.value) {
            var response = new Object;
            response[event.type] = this.data[event.type][p];

            this.itemObserver.next(response);
          }
        }
      });
    });
  }

  public runEngine() {
    console.log(this.facts);
    this.engine.run(this.facts).then((events) => {
      events.map((event) => {
        console.log('terminei aqui');
      });
    });
  }

  public setFact(fact: any) {
    Object.assign(this.facts, fact);
    console.log(this.facts);
    this.runEngine();
  }

  public getFact(property): any {
    return this.facts[property];
  }

  public getFactList(): any {
    return this.facts;
  }

  public getNewEvent(): Observable<any> {
    return this.item;
  }
}
