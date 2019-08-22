const csomApi = require("csom-node");
const logger = require("./startup/logging");
const settings = require("config");
const authCtx = new AuthenticationContext(
  "https://thinkitltd712.sharepoint.com/sites/dev-sc-classic"
);
const changeToken = null;
const changeTypes = ["No Changes", "Add", "Rename", "Delete", "Update"];

csomApi.setLoaderOptions({ url: settings.url });

module.exports = function _getChanges(io, relativeURL, listId) {
  authCtx.acquireTokenForApp(
    settings.clientId,
    settings.clientSecret,
    (err, data) => {
      logger.info("Connecting to site: ", relativeURL);
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

      const changes = list.getChanges(cQuery);

      ctx.load(web);
      ctx.load(list);
      ctx.load(changes);
      ctx.executeQueryAsync(() => {
        logger.info(
          `Connected to site: ${web.get_title()} and found ${changes.get_count()}`
        );
        const changeEnumerator = changes.getEnumerator();

        while (changeEnumerator.moveNext()) {
          const changeItem = changeEnumerator.get_current();
          const changeType = changeTypes[changeItem.get_changeType()];
          io.emit("news", {
            fileName: changeItem.get_itemId(),
            image: changeType,
            description: changeItem.get_time().toLocaleDateString("en-us")
          });
          //set change token
          changeToken = changeItem.get_changeToken();
        }

        // (sender, args) => {
        //   logger.error("An error occured: " + args.get_message());
        // };
      });
    }
  );
};
