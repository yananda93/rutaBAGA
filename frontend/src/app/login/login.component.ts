import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../_services/auth.service';
import { UserService} from '../_services/user.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  is_admin = false;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  currentId;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) { }
  
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.loading = true;
    this.authService.login(this.f.username.value, this.f.password.value).subscribe(
      () => {
        this.isLoginFailed = false;
        // this.getUserStatus();
        this.router.navigate(['/intro']);
       
      },
      err => {
        // this.errorMessage = err.error.message;
        this.errorMessage = err;
        this.isLoginFailed = true;
        this.loading = false;
      }
    );
  } 
  // getUserStatus() {
  //   this.userService.getUserStatus().subscribe(
  //     data => {
  //       this.currentId = data.current_id;
  //       if(data.current_id == 0) {
  //         this.currentId = 1;
  //       }
  //       this.router.navigate(['/rating/', this.currentId]);
  //     },
  //     err => {
  //       this.errorMessage = err.error.message;
  //     });
  // } 

}
