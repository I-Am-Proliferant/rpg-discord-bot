function random(high, low = 1) {
    return Math.floor(Math.random() * (high - low + 1) + low)
}


module.exports = { random };
