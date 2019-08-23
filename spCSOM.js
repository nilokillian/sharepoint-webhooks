const csomApi = require("csom-node");

var settings = {
  url: "https://thinkitltd712.sharepoint.com/sites/dev-sc-classic",
  username: "alex@business-refinery.com",
  password: "Fog20332034"
};

csomApi.setLoaderOptions({ url: settings.url });

var authCtx = new AuthenticationContext(settings.url);

authCtx.acquireTokenForUser(
  settings.username,
  settings.password,
  async function(err, data) {
    var ctx = new SP.ClientContext(settings.url); //set root web
    authCtx.setAuthenticationCookie(ctx); //authenticate

    //retrieve SP.Web client object
    var web = ctx.get_web();
    ctx.load(web);
    //console.log("web.", web);
    await ctx.executeQueryAsync(
      function() {
        console.log("web.", web);
        console.log(web.get_title());
      },
      function(sender, args) {
        // console.log("An error occured: " + args.get_message());
      }
    );
  },
  function(sender, args) {
    console.log("An error occured: ");
  }
);

// _getChanges(
//   "https://thinkitltd712.sharepoint.com/sites/dev-sc-classic",
//   "C67D1E9C-AC18-4BCA-A2E4-190180F6161B"
// );
