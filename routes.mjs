import db from "./models/index.mjs";

// import the controller
import initUserController from "./controllers/users.mjs";
import initGameController from "./controllers/game.mjs";

export default function bindRoutes(app) {
  // pass in the db for all items callbacks
  const userController = initUserController(db);
  const gameController = initGameController(db);

  app.get("/login", userController.login);
  app.post("/login", userController.loggedIn);
  app.post("/signup", userController.signUp);
  app.get("/", gameController.index);
  app.get("/create", gameController.create);
  app.post("/invite", gameController.inviteUsers);
  app.get("/invites", gameController.getInvites);
  app.post("/init", gameController.initGame);
  app.get("/cards", gameController.getCards);
  app.get("/refresh", gameController.refresh);
  app.post("/playRound", gameController.playRound);
  app.get("/skip", gameController.skipRound);
}
