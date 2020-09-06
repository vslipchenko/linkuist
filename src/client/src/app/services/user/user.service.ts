import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import {CREATE_USER_MUTATION} from "../../graphql/user/user.mutations";
import {UserSignUpData} from "../../models/entities/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apollo: Apollo) {
  }

  create({email, username, password}: UserSignUpData) {
    return this.apollo.mutate({
      mutation: CREATE_USER_MUTATION,
      variables: {email, username, password}
    });
  }
}
