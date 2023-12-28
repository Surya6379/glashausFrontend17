import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';
  loginFlag: boolean = false;
  hidePassword: boolean = true;

  constructor(private service: BackendService, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
  }


  login() {
    let userCreds = {
      userName: this.username,
      password: this.password
    }
    this.service.loginIser(userCreds).subscribe({
      next: (response: any) => {
        if (response.successFlag) {
          this.service.loggedIn = true;
          this.service.loggedInUser = response.data;
          this.openSnackBar(response.message, "Close");
          this.router.navigate(['/dashboard'])
        } else {
          this.service.loggedIn = false;
          this.openSnackBar(response.message, "Retry");
        }
      },
      error: (error: any) => {
        this.service.loggedIn = false;
        this.openSnackBar(error.error.message, "Retry");
      }
    })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 3000 });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

}
