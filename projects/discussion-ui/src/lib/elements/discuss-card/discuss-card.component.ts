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
@Component({
  selector: 'lib-discuss-card',
  templateUrl: './discuss-card.component.html',
  styleUrls: ['./discuss-card.component.scss']
})
export class DiscussCardComponent implements OnInit {
  replyFlag = false;
  @Input() discussionData: any;
  @Input() cid: any;
  @Output() reply = new EventEmitter();
  @Output() stateChange: EventEmitter<any> = new EventEmitter();
  dropdownContent = true;
  showDeleteModel = false
  topicId
  // cIds: any
  state =  'discussall'
  slug: any;
  constructor(
    private renderer: Renderer2,
    private discussionService: DiscussionService,
    private telemetryUtils: TelemetryUtilsService,
    private configService: ConfigService,
    private navigationService: NavigationServiceService
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      // tslint:disable-next-line:no-string-literal
      if (e.target['id'] !== 'group-actions') {
        this.dropdownContent = true;
      }
    });
  }

  ngOnInit() {
    console.log('discussionData', this.discussionData);
      //this.cIds = this.configService.getCategories().result
      this.topicId = _.get(this.discussionData, 'tid')
      this.slug =  _.trim(_.get(this.discussionData, 'slug'));
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
    this.state = 'detailsPage'
    console.log("reply data", data)
    //this.reply.emit(data);

    const matchedTopic = _.find(this.telemetryUtils.getContext(), { type: 'Topic' });
    if (matchedTopic) {
      this.telemetryUtils.deleteContext(matchedTopic);
    }

    this.telemetryUtils.uppendContext({
      id: _.get(this.discussionData, 'tid'),
      type: 'Topic'
    });

    const slug = _.trim(_.get(this.discussionData, 'slug'));
    // tslint:disable-next-line: max-line-length
    const input = { data: { url: `${this.configService.getRouterSlug()}${CONSTANTS.ROUTES.TOPIC}${slug}`, queryParams: {} }, action: CONSTANTS.CATEGORY_DETAILS, }
    // console.log("input", input)
    this.navigationService.navigate(input);
    this.stateChange.emit({ action: CONSTANTS.CATEGORY_DETAILS, title: this.discussionData.title, tid: this.discussionData.tid, cId: this.cid });
  }
  
}
