const csomApi = require("csom-node");
const logger = require("./startup/logging");
//const config = require("config");
//const { url, username, password } = config.get("settings");

const settings = {
  username: process.env.USER_NAME,
  password: process.env.PASSWORD
};

module.exports.getChanges = function _getChanges(io, relativeURL, listId) {
  let changeToken = null;
  let news = {};
  const changeTypes = ["No Changes", "Add", "Rename", "Delete", "Update"];

  csomApi.setLoaderOptions({ url: relativeURL });
  const authCtx = new AuthenticationContext(relativeURL);

  authCtx.acquireTokenForUser(
    settings.username,
    settings.password,
    async function(err, data) {
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

      //console.log("web.", web);
      await ctx.executeQueryAsync(
        function() {
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

            news = {
              fileName: changeItem.get_itemId(),
              image: changeType,
              description: changeItem.get_time().toLocaleDateString("en-us")
            };

            //set change token
            changeToken = changeItem.get_changeToken();
          }

          console.log("changeToken ", changeToken);
          console.log("news", news);
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

  // authCtx.acquireTokenForApp(username, password, (err, data) => {
  //   logger.info("Connecting to site: ", relativeURL);
  //   const ctx = new SP.ClientContext(relativeURL); //set root web

  //   authCtx.setAuthenticationCookie(ctx); //authenticate

  //   //retrieve SP.Web client object

  //   const web = ctx.get_web();

  //   const list = web.get_lists().getById(listId);

  //   const cQuery = new SP.ChangeQuery();
  //   cQuery.set_item(true);
  //   cQuery.set_add(true);
  //   cQuery.set_update(true);
  //   cQuery.set_deleteObject(true);
  //   cQuery.set_changeTokenStart(changeToken);

  //   //const changes = list.getChanges(cQuery);

  //   ctx.load(web);
  //   ctx.load(list);
  //   //ctx.load(changes);
  //   ctx.executeQueryAsync(
  //     function() {
  //       console.log("Connected ");
  //       logger.info(
  //         `Connected to site: ${web.get_title()} and found ${changes.get_count()}`
  //       );

  //       const changeEnumerator = changes.getEnumerator();
  //       console.log("changeEnumerator", changeEnumerator);
  //       while (changeEnumerator.moveNext()) {
  //         const changeItem = changeEnumerator.get_current();
  //         console.log("changeItem ");
  //         const changeType = changeTypes[changeItem.get_changeType()];
  //         io.emit("news", {
  //           fileName: changeItem.get_itemId(),
  //           image: changeType,
  //           description: changeItem.get_time().toLocaleDateString("en-us")
  //         });
  //         //set change token
  //         changeToken = changeItem.get_changeToken();
  //       }

  //       (sender, args) => {
  //         logger.error("An error occured: " + args.get_message());
  //       };
  //     },
  //     function(sender, args) {
  //       console.log("An error occured: " + args.get_message());
  //     }
  //   );

  //   console.log("changeToken ", changeToken);
  // });
};

//module.exports = { getChanges: _getChanges };
