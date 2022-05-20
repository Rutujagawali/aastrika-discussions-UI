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
import { NSDiscussData } from '../../models/discuss.model';
@Component({
  selector: 'lib-discuss-card',
  templateUrl: './discuss-card.component.html',
  styleUrls: ['./discuss-card.component.scss']
})
export class DiscussCardComponent implements OnInit {
  replyFlag = false;
  replycount : number = 0;
  likebtn = false;

  @Input() discussionData: any;
  @Input() cid: any;
  @Output() reply = new EventEmitter();
  @Output() stateChange: EventEmitter<any> = new EventEmitter();
  @Input() slug: string;
  @Input() topicId: any;
  dropdownContent = true;
  showDeleteModel = false
  currentActivePage: any;
  formBuilder: any;
  postAnswerForm: any;
  UpdatePostAnswerForm: any;
  replyForm: any;
  currentFilter: string;
  data: any;
  paginationData: any;
  mainUid: any;
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
  // totalCountOfReply(){
  //   this.replycount++;
  // }
  // likeCounter(){
  //   if(this.likebtn == false){
  //     this.likebtn = true
  //   }
  //   else{
  //     this.likebtn =false
  //   }
  //   this.discussionData.upvotes++;
  //   console.log("increment",this.discussionData.upvotes)
  // }
  deleteVote(discuss: any) {
    this.discussionService.deleteVotePost(discuss.pid).subscribe(data => {
      // toast
      this.refreshPostData(this.currentActivePage);
    },
      (err: any) => {
        // toast
        // this.openSnackbar(err.error.message.split('|')[1] || this.defaultError);
      });
  }

  
  logTelemetry(event, data?) {
    const pid = _.get(data, 'pid') || _.get(data, 'mainPid') ?
      { id: _.get(data, 'pid') || _.get(data, 'mainPid'), type: 'Post' } : {};
    this.telemetryUtils.uppendContext(pid);
    this.telemetryUtils.logInteract(event, NSDiscussData.IPageName.DETAILS);
  }

  initializeFormFiled() {
    this.postAnswerForm = this.formBuilder.group({
      answer: [],
    });
    this.UpdatePostAnswerForm = this.formBuilder.group({
      updatedAnswer: [],
    });
    this.replyForm = this.formBuilder.group({
      reply: []
    });
  }

  async refreshPostData(page?: any) {
    if (this.currentFilter === 'timestamp') {

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

  upvote(discuss: NSDiscussData.IDiscussionData) {
    const req = {
      delta: 1,
    };
    this.processVote(discuss, req);
    console.log("like=",this.upvote)
  }

  downvote(discuss: NSDiscussData.IDiscussionData) {
    const req = {
      delta: -1,
    };
    this.processVote(discuss, req);
  }

  private async processVote(discuss: any, req: any) {
    if (discuss && discuss.uid) {
      this.discussionService.votePost(discuss.pid, req).subscribe(
        () => {
          // toast
          // this.openSnackbar(this.toastSuccess.nativeElement.value);
          this.postAnswerForm.reset();
         
        },
        (err: any) => {
          // toast
          // this.openSnackbar(err.error.message.split('|')[1] || this.defaultError);
        });
    }
  }
  acceptData(discuss) {
    // debugger
    const matchedTopic = _.find(this.telemetryUtils.getContext(), { type: 'Topic' });
    if (matchedTopic) {
      this.telemetryUtils.deleteContext(matchedTopic);
    }

    this.telemetryUtils.uppendContext({
      id: _.get(discuss, 'tid'),
      type: 'Topic'
    });

    const slug = _.trim(_.get(discuss, 'slug'))
    const input = {
      data: { url: `${this.configService.getRouterSlug()}${CONSTANTS.ROUTES.TOPIC}${slug}`, queryParams: {} },
      action: CONSTANTS.CATEGORY_DETAILS };

    this.navigationService.navigate(input);
    this.stateChange.emit({ action: CONSTANTS.CATEGORY_DETAILS, title: discuss.title, tid: discuss.tid });
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
  
}
