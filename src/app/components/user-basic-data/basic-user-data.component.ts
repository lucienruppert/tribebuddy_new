import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: "app-basic-user-data",
  templateUrl: "./basic-user-data.component.html",
  styleUrls: ["./basic-user-data.component.css"],
})
export class BasicUserDataComponent {
  public name: string = sessionStorage.getItem(environment.NAME_KEY)!;
  public email: string = sessionStorage.getItem(environment.EMAIL_KEY)!;
}
