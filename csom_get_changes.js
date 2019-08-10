const csomApi = require("csom-node");
const settings = require("config");
const authCtx = new AuthenticationContext(settings.url);
const changeToken = null;
const changeTypes = ["No Changes", "Add", "Rename", "Delete", "Update"];

csomApi.setLoaderOptions({ url: settings.url });

function _getChanges(io, relativeURL, listId) {
  authCtx.acquireTokenForApp(
    settings.clientId,
    settings.clientSecret,
    (err, data) => {
      console.log("Connecting to site: ", relativeURL);
      const ctx = new SP.ClientContext(relativeURL); //set root web
      authCtx.setAuthenticationCookie(ctx); //authenticate

      //retrieve SP.Web client object

      const web = ctx.get_web();
      const list = web.get_lists().getById(listId);
      const cQuery = new SP.ChangeQuery();
      cQuery.set_item(true);
      cQuery.set_add(true);
      cQuery.set_update(true);
      cQuery.set_deleteObject(true);
      cQuery.set_changeTokenStart(changeToken);

      const cnanges = list.getChanges(cQuery);

      ctx.load(web);
      ctx.load(list);
      ctx.executeQueryAsync(
        () => {
          console.log(web.get_title());
        },
        function(sender, args) {
          console.log("An error occured: " + args.get_message());
        }
      );
    }
  );
}
