import Common "common";

module {
  public type Address = {
    tag : Text;
    line1 : Text;
    line2 : Text;
    city : Text;
    pincode : Text;
  };

  public type User = {
    id : Common.UserId;
    var name : Text;
    var email : Text;
    var phone : Text;
    var savedAddresses : [Address];
    createdAt : Common.Timestamp;
    var isAdmin : Bool;
  };

  public type UserProfile = {
    id : Common.UserId;
    name : Text;
    email : Text;
    phone : Text;
    savedAddresses : [Address];
    createdAt : Common.Timestamp;
    isAdmin : Bool;
  };

  public type UpdateProfileRequest = {
    name : Text;
    email : Text;
    phone : Text;
    savedAddresses : [Address];
  };
};
