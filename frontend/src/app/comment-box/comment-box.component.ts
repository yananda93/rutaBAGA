import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.scss']
})
export class CommentBoxComponent implements OnInit {
  @Input() userName:string = "";
  @Output() usercomment = new EventEmitter();


  commentControl: FormControl = new FormControl('');
  commentForm: FormGroup = new FormGroup({
    commentControl: this.commentControl
  });
  commentInfo = {};
  submitted: Boolean = false;
  public id = 0;

  isCommentButtonVisible = false;

  
  constructor() { }

  ngOnInit(): void {
  }

  onFocus(){
    this.isCommentButtonVisible = true;
    // console.log("comment focused");
  }

  submitComment() {
    this.submitted = true;
    this.commentInfo = {
      // id: this.id++,
      username: this.userName,
      content: this.commentControl.value,
      postTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
     
    };
    this.commentForm.reset();
    this.isCommentButtonVisible = false;
    this.usercomment.emit(this.commentInfo);
  }

  cancelComment() {
    this.isCommentButtonVisible = false;
    this.commentForm.reset();
  }


}
