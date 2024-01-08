const { createLogger, transports, format, config } = require("winston");

const logger = createLogger({
  levels: config.syslog.levels,
  format: format.json(),
  //logger method...
  transports: [
    //new transports:
    new transports.File({
      filename: "logs/example.log",
    }),
    new transports.Console(),
  ],
  //...
});

module.exports = logger;