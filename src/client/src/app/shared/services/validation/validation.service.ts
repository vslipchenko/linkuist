import {Injectable} from '@angular/core';
import {AbstractControl, ValidationErrors} from "@angular/forms";
import {map} from "rxjs/operators";
import {UserService} from "../../../services/user/user.service";

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private userService: UserService) {
  }

  userEmailValidator(control: AbstractControl): null | ValidationErrors {
    const email = control.value;
    return this.userService.getIdByEmail(email).pipe(map(({data}) => {
      return data.userByEmail?._id ? {isUsed: true} : null;
    }));
  }
}
