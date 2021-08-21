import {Injectable} from '@angular/core';
import {ResolvedUser} from '~app/types/user/user.interfaces';
import {UserRole} from '~app/types/user/user.enums';

@Injectable({
  providedIn: 'root',
})
export class ResolvedUserService {
  public user: ResolvedUser = {
    urlUsername: '',
    role: UserRole.GUEST,
  };
}
