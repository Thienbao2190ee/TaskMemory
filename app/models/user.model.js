const User = function (user) {
      (this.name = user.name),
      (this.fullname = user.fullname),
      (this.salt = user.salt),
      (this.email = user.email),
      (this.phone = user.phone),
      (this.password = user.password),
      (this.refresh_token = user.refresh_token),
      (this.active = user.active),
      (this.created_at = user.created_at),
      (this.updated_at = user.updated_at);
  };
  
  module.exports = User;