
class Effect {
    constructor(effect) {
        this.type = effect.type;
        this.damageType = effect.damageType;
        this.targets = effect.targets;
        this.durationType = effect.durationType;
        this.duration = effect.duration;
        this.buff = effect.buff;
        this.amountType = effect.amountType;
        this.range = effect.range;
    };

}

Effect.prototype.buildDescription = function () {

};

module.export = { Effect };

const template = {
    type: 'damage',
    damageType: 'fire',
    targets:['enemy'],
    description: 'This is a description of [[type]] that does [[min]]-[[max]] damage.',
    buff: 'str',
    duration: {
        type: 'immediate',
        amount: 0,
    },
    stats: [],
    range: {
        type:'static',
        min: 3,
        max: 7
    }
}

// const burn = {
//     type: 'damage',
//     damageType: 'fire',
//     targets:['enemy'],
//     description: 'This is a description of [[type]] that does [[min]]-[[max]] damage.',
//     buff: 'str',
//     amountType: 'static',
//     durationtype: 'immediate',
//     duration: 0,
//     range: {
//         min: 3,
//         max: 7
//     }
// }

// const strength = {
//     type: 'buff',
//     targets:['self', 'players'],
//     description: 'This is a description of [[type]] that does [[min]]-[[max]] damage.',
//     durationtype: 'immediate',
//     duration: 0,
//     buff: 'str',
//     amountType: 'static',
//     range: {
//         min: 3,
//         max: 7
//     }
// }
// const strength = {
//     type: 'buff',
//     targets:['self', 'players'],
//     description: 'This is a description of [[type]] that does [[min]]-[[max]] damage.',
    // duration: {
    //     type: 'passive',
    //     amount: 0
    // }
//     buff: 'str',
//     range: {
//         type: 'static',
//         min: 3,
//         max: 7
//     }
// }

// const Wisdom = {
//     type: 'buff',
//     targets:['self', 'players'],
//     description: 'This is a description of [[type]] that does [[min]]-[[max]] damage.',
//     durationtype: 'End of Combat',
//     duration: 99,
//     buff: 'exp',
//     amountType: 'percent',
//     range: {
//         min: 3,
//         max: 7
//     }
// }

// const weaken = {
//     type: 'curse',
//     targets:['enemy'],
//     description: 'This is a description of [[type]] that does [[min]]-[[max]] damage.',
//     durationtype: 'rounds',
//     duration: 3,
//     buff: 'str',
//     amountType: 'static',
//     range: {
//         min: 3,
//         max: 7
//     }
// }

// const regen = {
//     type: 'heal',
//     damageType: '',
//     targets:['self', 'players'],
//     description: 'This is a description of [[type]] that does [[min]]-[[max]] damage.',
//     durationtype: 'rounds',
//     duration: 3,
//     stats: [],
//     amountType: 'static',
//     range: {
//         min: 3,
//         max: 7
//     }
// }
// const heal = {
//     type: 'heal',
//     damageType: '',
//     targets:['self', 'players'],
//     description: 'This is a description of [[type]] that does [[min]]-[[max]] damage.',
//     durationtype: 'immediate',
//     duration: 0,
//     stats: [],
//     amountType: 'static',
//     range: {
//         min: 3,
//         max: 7
//     }
// }

// const healAll = {
//     type: 'heal',
//     damageType: '',
//     targets:['all players'],
//     description: 'This is a description of [[type]] that does [[min]]-[[max]] damage.',
//     durationtype: 'immediate',
//     duration: 0,
//     stats: [],
//     amountType: 'static',
//     range: {
//         min: 3,
//         max: 7
//     }
// }
