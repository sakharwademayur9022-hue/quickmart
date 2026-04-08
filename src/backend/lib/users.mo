import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import UsersTypes "../types/users";
import Common "../types/common";

module {
  public type State = {
    users : Map.Map<Common.UserId, UsersTypes.User>;
  };

  public func newState() : State {
    { users = Map.empty<Common.UserId, UsersTypes.User>() };
  };

  public func getOrCreateUser(
    state : State,
    caller : Common.UserId,
  ) : UsersTypes.User {
    switch (state.users.get(caller)) {
      case (?user) { user };
      case null {
        let user : UsersTypes.User = {
          id = caller;
          var name = "";
          var email = "";
          var phone = "";
          var savedAddresses = [];
          createdAt = Time.now();
          var isAdmin = false;
        };
        state.users.add(caller, user);
        user;
      };
    };
  };

  public func getUser(state : State, caller : Common.UserId) : ?UsersTypes.UserProfile {
    switch (state.users.get(caller)) {
      case (?user) { ?toProfile(user) };
      case null { null };
    };
  };

  public func updateProfile(
    state : State,
    caller : Common.UserId,
    req : UsersTypes.UpdateProfileRequest,
  ) : UsersTypes.UserProfile {
    let user = getOrCreateUser(state, caller);
    user.name := req.name;
    user.email := req.email;
    user.phone := req.phone;
    user.savedAddresses := req.savedAddresses;
    toProfile(user);
  };

  public func isAdmin(state : State, caller : Common.UserId) : Bool {
    switch (state.users.get(caller)) {
      case (?user) { user.isAdmin };
      case null { false };
    };
  };

  public func setAdmin(
    state : State,
    target : Common.UserId,
    adminStatus : Bool,
  ) {
    let user = getOrCreateUser(state, target);
    user.isAdmin := adminStatus;
  };

  public func toProfile(user : UsersTypes.User) : UsersTypes.UserProfile {
    {
      id = user.id;
      name = user.name;
      email = user.email;
      phone = user.phone;
      savedAddresses = user.savedAddresses;
      createdAt = user.createdAt;
      isAdmin = user.isAdmin;
    };
  };
};
