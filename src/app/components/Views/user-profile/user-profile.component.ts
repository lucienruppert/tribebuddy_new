import { Component, OnDestroy } from "@angular/core";
import { BasicUserDataComponent } from "../user-basic-data/basic-user-data.component";
import { DetailedUserProfileComponent } from "../user-detailed-profile/detailed-user-profile.component";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { UsersService } from "../../../services/user-data.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
  standalone: true,
  imports: [BasicUserDataComponent, DetailedUserProfileComponent, CommonModule],
})
export class UserProfileComponent {}
