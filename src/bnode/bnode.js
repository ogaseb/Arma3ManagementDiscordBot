import BattleNode from "battle-node";
import "colors";
import { stopServer, regexes, checkIfServerIsOn } from "../helpers/helpers";

class BattleNodeRcon {
  #config;
  #switchServerOffInterval;
  #interval;
  #playerCount;
  #timeout;

  constructor(client) {
    this.#config = {
      ip: process.env.RCON_IP,
      port: process.env.RCON_PORT,
      rconPassword: process.env.RCON_PASSWORD
    };
    this.#interval = null;
    this.#timeout = null;
    this.#switchServerOffInterval = null;
    this.#playerCount = 0;
    this.bnode = null;
    this.client = client;
  }

  get battleEyeRcon() {
    return this.bnode;
  }

  initBattleEye = () => {
    this.battleEyeLogin();
    this.onLogin();
    this.onMessage();
    this.onDisconnect();
  };

  battleEyeLogin = () => {
    this.bnode = new BattleNode(this.#config);
    this.bnode.login();
  };

  clearIntervals = () => {
    if (this.#interval) {
      clearInterval(this.#interval);
      this.#interval = null;
    }
    if (this.#timeout) {
      clearTimeout(this.#timeout);
      this.#timeout = null;
    }
    if (this.#switchServerOffInterval) {
      clearTimeout(this.#switchServerOffInterval);
      this.#switchServerOffInterval = null;
    }
  };

  battleEyePlayerCount = () => {
    this.bnode.sendCommand("players", async players => {
      let split = "";
      const player = players.split("\n");
      split = player[player.length - 1].split(" ")[0].split("(")[1];

      await this.client.user.setActivity(`graczy na serwerze: ${split}`, {
        type: "WATCHING"
      });
      this.#playerCount = split;
      this.stopServerOnEmpty();
    });
  };

  stopServerOnEmpty = () => {
    const timeToSwitchOffServer = 1800000;
    const parsedPlayerCount = parseInt(this.#playerCount);
    if (parsedPlayerCount > 0) {
      console.log("there are players here stop countdown!".red);

      clearTimeout(this.#switchServerOffInterval);
      this.#switchServerOffInterval = null;
    } else if (parsedPlayerCount === 0) {
      console.log("there no players here countdown started".red);
      if (this.#switchServerOffInterval === null) {
        this.#switchServerOffInterval = setTimeout(() => {
          console.log("now stopping server".yellow);
          stopServer();
          let checkServerInterval = setInterval(() => {
            if (!checkIfServerIsOn()) {
              clearInterval(checkServerInterval);
              checkServerInterval = null;
              return this.client.user.setActivity(`Serwer został wyłączony.`, {
                type: "WATCHING"
              });
            }
          }, 1000);
        }, timeToSwitchOffServer);
      }
    }
  };

  onLogin = () => {
    this.bnode.on("login", async (err, success) => {
      if (err) {
        return (this.timeout = setTimeout(async () => {
          if (this.bnode) this.bnode.socket.close();
          this.bnode = null;
          this.initBattleEye();
          return console.log("Creating new battle class".yellow);
        }, 15000));
      }
      if (success === true) {
        this.clearIntervals();
        this.#interval = setInterval(async () => {
          try {
            this.battleEyePlayerCount();
          } catch (e) {
            console.log(e);
          }
        }, 10000);

        console.log("Logged in RCON successfully!".green);
      } else if (success === false) {
        console.log("RCON login failed! (password may be incorrect)".bold.red);
      }
    });
  };

  onMessage = () => {
    this.bnode.on("message", async message => {
      if (this.#timeout) {
        clearTimeout(this.#timeout);
        this.#timeout = null;
      }
      const checkIfAdminLogin = message.split(" ");
      if (
        checkIfAdminLogin[0] === "RCon" &&
        checkIfAdminLogin[1] === "admin" &&
        checkIfAdminLogin[checkIfAdminLogin.length - 2] === "logged" &&
        checkIfAdminLogin[checkIfAdminLogin.length - 1] === "in"
      ) {
        return;
      }
      await this.client.channels.cache
        .get(process.env.BOT_LOGS_ID)
        .send(message.toString().replace(regexes.IPS, "x.x.x.x"));
    });
  };

  onDisconnect = () => {
    this.bnode.on("disconnected", async () => {
      console.log("disconnected");
      this.clearIntervals();

      return (this.#timeout = setTimeout(async () => {
        if (this.bnode) this.bnode.socket.close();
        this.bnode = null;
        this.initBattleEye();
        return console.log("creating new battle class");
      }, 15000));
    });
  };
}

export default BattleNodeRcon;
