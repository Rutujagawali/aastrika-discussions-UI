import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryCardComponent } from './category-card/category-card.component';
import { DiscussCardComponent } from './discuss-card/discuss-card.component';
import { AvatarPhotoComponent } from './avatar-photo/avatar-photo.component';
import { AppLoaderComponent } from './app-loader/app-loader.component';
import { RelatedDiscussionComponent } from './related-discussion/related-discussion.component';
import { PipesModule } from './../pipes/pipes.module';

import { PostReplyComponent } from './post-reply/post-reply.component';
import { SlidersComponent } from './sliders/sliders.component';
import { DiscussionDeleteComponent } from '../components/discussion-delete/discussion-delete.component';

@NgModule({
  declarations: [
    PostReplyComponent,
    CategoryCardComponent,
    DiscussCardComponent,
    AvatarPhotoComponent,
    AppLoaderComponent,
    RelatedDiscussionComponent,
    SlidersComponent,
    DiscussionDeleteComponent
  ],
  imports: [
    CommonModule, PipesModule,
     FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CategoryCardComponent,
    DiscussCardComponent,
    AvatarPhotoComponent,
    AppLoaderComponent, 
    RelatedDiscussionComponent,
    AppLoaderComponent,
    PostReplyComponent,
    SlidersComponent,
    DiscussionDeleteComponent
  ]
})
export class ElementsModule { }
