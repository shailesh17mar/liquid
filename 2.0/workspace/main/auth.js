class Auth {
  static _userSignedIn = false;
  static _user = undefined;
  static _token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJpc3MiOiJMaXF1aWQiLCJwaWN0dXJlIjoiaHR0cHM6Ly9hdmF0YXJzLmRpY2ViZWFyLmNvbS9hcGkvaW5pdGlhbHMvc2hhaWxlc2guc3ZnIn0.-M-hAa0gUOr45DI0vaDlQFXeKWqGnrTOFc81Lch2lzo";

  static get userSignedIn() {
    return this._userSignedIn;
  }

  static set userSignedIn(isSignedIn) {
    this._userSignedIn = isSignedIn;
  }

  static get token() {
    return this._token;
  }

  static set newToken(newToken) {
    this._token = newToken;
  }

  static authenticate(sendResponse) {
    Auth.newToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJpc3MiOiJMaXF1aWQiLCJwaWN0dXJlIjoiaHR0cHM6Ly9hdmF0YXJzLmRpY2ViZWFyLmNvbS9hcGkvaW5pdGlhbHMvc2hhaWxlc2guc3ZnIn0.-M-hAa0gUOr45DI0vaDlQFXeKWqGnrTOFc81Lch2lzo";
    Auth.userSignedIn = true;
    sendResponse("success");
    //auth function
  }

  static getUser() {
    if (Auth._user) return Auth._user;
    Auth._user = Auth.token;
    return Auth._user;
  }
}

module.exports = { Auth };
