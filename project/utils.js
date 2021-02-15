const chalk = require("chalk") // for colorful console

function colorify(color, what) {
    return chalk.hex(color)(what)
}

module.exports = {
    colorify
}
