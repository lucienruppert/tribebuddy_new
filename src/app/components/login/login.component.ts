import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AuthenticationService } from "../../services/authentication.service";
import { DialogRef } from "@angular/cdk/dialog";

@Component({
  selector: "app-login",
  standalone: true,
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  imports: [FormsModule, MatProgressSpinnerModule, NgIf],
})
export class LoginComponent implements OnInit {
  public email = "";
  public password = "";
  public errorMessage = "";
  public showSpinner = false;
  public isDialogReady = false;

  constructor(
    private authentication: AuthenticationService,
    public dialogRef: DialogRef
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.isDialogReady = true;
    }, 200);
  }

  public async submitForm(): Promise<void> {
    this.errorMessage = ''; // Clear any previous error messages
    this.showSpinner = true;
    try {
      await this.authentication.login(this.email, this.password);
      this.dialogRef.close();
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage = 'An unknown error occurred.';
      }
    } finally {
      this.showSpinner = false;
    }
  }
}
