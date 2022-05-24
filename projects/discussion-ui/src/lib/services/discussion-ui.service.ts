import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscussionUIService {


  showReplay =   new BehaviorSubject("VIEW ALL");
  replayData = new BehaviorSubject(null)

  constructor() { }
 
  setDisplay(data){
    this.showReplay.next(data)
  }

  getDisplay(){
    return this.showReplay.asObservable()
  }

  setReplyData(data){
    this.replayData.next(data);
  }

  getReplyData(){
    return this.replayData.asObservable();
  }

}
