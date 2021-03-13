class EffectHandler {
    constructor() {
    };
    effects = [];
}

EffectHandler.prototype.addEffect = function (Effect) {
    this.effects.push(Effect);
};

EffectHandler.prototype.removeEffect = function (Effect) {
    this.effects.splice(this.effects.indexOf(Effect));
};

EffectHandler.prototype.getEffect = function (Effect) {
    return this.effects.find(e => e === Effect);
};

EffectHandler.prototype.validateEffect = function (Effect) {
    return true
};

module.export = { EffectHandler };