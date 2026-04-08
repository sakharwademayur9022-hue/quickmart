import Runtime "mo:core/Runtime";
import AdminLib "../lib/admin";
import UsersLib "../lib/users";
import CatalogLib "../lib/catalog";
import Common "../types/common";

mixin (
  usersState : UsersLib.State,
  catalogState : CatalogLib.State,
) {
  public shared ({ caller }) func seedProducts() : async () {
    if (not UsersLib.isAdmin(usersState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    AdminLib.seedProducts(catalogState);
  };

  public shared ({ caller }) func setAdminStatus(
    target : Common.UserId,
    adminStatus : Bool,
  ) : async () {
    if (not UsersLib.isAdmin(usersState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    UsersLib.setAdmin(usersState, target, adminStatus);
  };
};
