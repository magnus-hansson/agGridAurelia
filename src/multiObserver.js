import {inject,ObserverLocator} from 'aurelia-framework';

@inject(ObserverLocator)
export class MultiObserver {  
  constructor(observerLocator) {
    this.observerLocator = observerLocator;
    this.subscriptions = [];
  }
  
  dispose() {
    return () => {
        while(this.subscriptions.length) {
            this.subscriptions.pop()();
        }
    }
  }
  
  watch(object, attributes, callback) {
    var parts = attributes.split(',');
    for (let ii = 0; ii < parts.length; ii++) {
        this.subscriptions.push(
            this.observerLocator
                .getObserver(object, parts[ii])
                .subscribe( (oldValue, newValue) => callback(parts[ii], oldValue, newValue) )
        );
    } 
  }
}