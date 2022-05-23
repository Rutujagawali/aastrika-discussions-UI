import { Component, OnInit, Input, Renderer2, Output, EventEmitter} from '@angular/core';
import { DiscussionDeleteComponent } from '../../components/discussion-delete/discussion-delete.component';
import { DiscussionService } from '../../services/discussion.service';
// import { EventEmitter } from 'events';
import { TelemetryUtilsService } from '../../telemetry-utils.service';
import { ConfigService } from '../../services/config.service';
import { NavigationServiceService } from '../../navigation-service.service';
import * as CONSTANTS from './../../common/constants.json';
/* tslint:disable */
import _ from 'lodash';
import { DiscussionUIService } from '../../services/discussion-ui.service';
import { NSDiscussData } from './../../models/discuss.model';
@Component({
  selector: 'lib-discuss-card',
  templateUrl: './discuss-card.component.html',
  styleUrls: ['./discuss-card.component.scss']
})
export class DiscussCardComponent implements OnInit {
  replyFlag = false;
  @Input() discussionData: any;
  @Input() cid: any;
  @Input() slug?: string;
  @Output() reply = new EventEmitter();
  @Output() stateChange: EventEmitter<any> = new EventEmitter();
  dropdownContent = true;
  showDeleteModel = false
  @Input() topicId:number
  like = true 
  currentActivePage = 1;
  currentFilter = 'timestamp'; 
  data: any;
  paginationData!: any;
  mainUid: number;
  categoryId: any;
  // cIds: any
  // showReplyFlag = false
  constructor(
    private renderer: Renderer2,
    private discussionService: DiscussionService,
    private telemetryUtils: TelemetryUtilsService,
    private configService: ConfigService,
    private navigationService: NavigationServiceService,
    private discussionUIService: DiscussionUIService
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      // tslint:disable-next-line:no-string-literal
      if (e.target['id'] !== 'group-actions') {
        this.dropdownContent = true;
      }
    });
    
  }

  ngOnInit() {
    // this.showReplyFlag = false
    console.log('discussionData', this.discussionData);
      //this.cIds = this.configService.getCategories().result
     
  }
  public getBgColor(tagTitle: any) {
    const bgColor = this.stringToColor(tagTitle.toLowerCase());
    const color = this.getContrast();
    return { color, 'background-color': bgColor };
  }

  stringToColor(title) {
    let hash = 0;

    for (let i = 0; i < title.length; i++) {
      // tslint:disable-next-line: no-bitwise
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    // tslint:disable-next-line: prefer-template
    const colour = 'hsl(' + hue + ',100%,30%)';
    return colour;
  }

  getContrast() {
    return 'rgba(255, 255, 255, 80%)';
  }

  IsSingleComent(postCount) {
    if (postCount && (postCount - 1) == 1) {
      return true;
    } else {
      return false;
    }
  }

  onMenuClick() {
    this.dropdownContent = !this.dropdownContent;
  }

  editTopic() {
    console.log("edit");
  }

  deleteTopic(event, topicData) {
    console.log(event, topicData)
    this.topicId = topicData
    this.showDeleteModel = true
  }

  showReply() {
    console.log("reply=", this.replyFlag)
    if (this.replyFlag == false) {
      this.replyFlag = true

    }
    else {
      this.replyFlag = false
    }
  }

  closeDeleteModel(event){
    this.showDeleteModel = false
  }

  deleteTopicHandler(){
    this.discussionService.deleteTopic(this.topicId).subscribe(data => {
      //this.location.back();
      console.log(data)
    }, error => {
      console.log('error while deleting', error);
    });
    this.showDeleteModel = false
  }

  replyHandler(data){
    // this.showReplyFlag = true
    this.discussionUIService.setDisplay(true)
    this.discussionUIService.setReplyData(this.discussionData)
    console.log("reply data", data)
    //this.reply.emit(data);
  }

  /* to handle like and dislike */ 
  upvote(discuss: NSDiscussData.IDiscussionData) {
    const req = {
      delta: 1,
    };
    this.processVote(discuss, req);
  }

  downvote(discuss: NSDiscussData.IDiscussionData) {
    const req = {
      delta: -1,
    };
    this.processVote(discuss, req);
  }
  private async processVote(discuss: any, req: any) {
    if (discuss && discuss.uid) {
      this.discussionService.votePost(discuss.tid, req).subscribe(
        () => {
          // toast
          // this.openSnackbar(this.toastSuccess.nativeElement.value);
          this.like = false
          this.refreshPostData(this.currentActivePage);
        },
        (err: any) => {
          // toast
          // this.openSnackbar(err.error.message.split('|')[1] || this.defaultError);
        });
    }
  }
  async refreshPostData(page?: any) {
    if (this.currentFilter === 'timestamp') {
      console.log(this.topicId)
      this.discussionService.fetchTopicById(this.topicId, this.slug, page).subscribe(
        (data: NSDiscussData.IDiscussionData) => {
          this.appendResponse(data)
        },
        (err: any) => {
          console.log('Error in fetching topics')
          // toast message
          // this.openSnackbar(err.error.message.split('|')[1] || this.defaultError);
        });
    } else {
      this.discussionService.fetchTopicByIdSort(this.topicId, 'voted', page).subscribe(
        (data: NSDiscussData.IDiscussionData) => {
          this.appendResponse(data)
        },
        (err: any) => {
          console.log('Error in fetching topics')
        });
    }
  }

  appendResponse(data) {
    this.data = data;
    this.paginationData = _.get(data, 'pagination');
    this.mainUid = _.get(data, 'loggedInUser.uid');
    this.categoryId = _.get(data, 'cid');
    this.topicId = _.get(data, 'tid');
  }
}
