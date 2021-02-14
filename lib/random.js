function random(high, low) {
    return Math.floor((Math.random() * (high - low + 1)) + low)
}
function random(high) {
    return Math.floor(Math.random() * high);
}

module.exports = { random };
