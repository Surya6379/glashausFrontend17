import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registrationForm !: FormGroup;

  constructor(private fb: FormBuilder, private service: BackendService, private snackBar: MatSnackBar, private router:Router) { }

  ngOnInit(): void {

    this.registrationForm = this.fb.group({
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobNo: ['', [Validators.maxLength(10)]],
      userType: ['', [Validators.required]]
    });

  }

  submit() {
    let req = {
      "userName": this.registrationForm.get('userName')?.value,
      "emailId": this.registrationForm.get('email')?.value,
      "mobileNo": this.registrationForm.get('mobNo')?.value,
      "userType": this.registrationForm.get('userType')?.value,
      "password": this.registrationForm.get('password')?.value
    };
    this.service.registerUser(req).subscribe({
      next: (response: any) => {
        if (response.successFlag) {
          this.router.navigate(['/login']);
          this.openSnackBar(response.message, "Close");         
        }else{
          this.openSnackBar(response.message, "Retry")
        }
      },
      error: (error: any) => {
        this.openSnackBar(error.error.message, "Retry")
      }
    })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action,{duration: 3000});
  }

}
