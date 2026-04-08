import UsersLib "../lib/users";
import UsersTypes "../types/users";

mixin (usersState : UsersLib.State) {
  public shared ({ caller }) func getProfile() : async ?UsersTypes.UserProfile {
    UsersLib.getUser(usersState, caller);
  };

  public shared ({ caller }) func updateProfile(
    req : UsersTypes.UpdateProfileRequest
  ) : async UsersTypes.UserProfile {
    UsersLib.updateProfile(usersState, caller, req);
  };

  public query ({ caller }) func isAdmin() : async Bool {
    UsersLib.isAdmin(usersState, caller);
  };
};
