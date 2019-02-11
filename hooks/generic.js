// Description:
//     Accept incoming Webhooks to write messages to a room/channel

(function () {
  "use strict";

  module.exports = function(robot) {

    robot.router.post('/incoming/'+process.env.WEBHOOK_TOKEN, (req, res) => {
      let data    = req.body.payload != null ? JSON.parse(req.body.payload) : req.body;
      let room    = data.room;
      let message = data.message;

      if (typeof message === 'undefined') {
        res.send(422); return;
      }
      if (typeof room === 'string') {
        if (typeof message === 'string') {
          robot.messageRoom(room, message);
        } else if (message instanceof Array) {
          message.forEach(line => robot.messageRoom(room, line));
        }
      } else if (room instanceof Array) {
        room.forEach(r => {
          if (typeof message === 'string') {
            robot.messageRoom(r, message);
          } else if (message instanceof Array) {
            message.forEach(line => robot.messageRoom(r, line));
          }
        });
      } else {
        res.send(422); return;
      }

      res.send(200);
    });
  };
}());
