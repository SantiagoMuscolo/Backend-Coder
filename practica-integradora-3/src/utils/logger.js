const winston = require('winston');
const config = require('../config/config');

const customLevelsDevOptions = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5,
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        debug: 'white',
        http: 'green',
    },
};

const customLevelsProdOptions = {
    levels: {
        info: 0,
        warning: 1,
        error: 2,
        fatal: 3,
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
    },
};

const devLogger = winston.createLogger({
    // Declare levels:
    levels: customLevelsDevOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'fatal', 
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsDevOptions.colors }),
                winston.format.simple()
            ),
        }),
    ],
});

const prodLogger = winston.createLogger({
    levels: customLevelsProdOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'fatal', 
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsProdOptions.colors }),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'fatal', 
            format: winston.format.simple(),
        }),
    ],
});

const addLogger = (req, res, next) => {
    if (config.environment === 'production') {
        req.logger = prodLogger;
    } else {
        req.logger = devLogger;
    }
    req.logger.info(
        `${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
    );
    next();
};

module.exports = addLogger;
