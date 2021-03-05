const { random } = require('./random.js');
const { getItem } = require('../lists/items.js');

class Game {
    constructor() {
        this.startCombat();
        this.turn.isCombat = false;
        this.enemy = false;
        this.initStore();
    };

    combat = [];
    players = [];
    summons = [];
    store = [];
    enemy;
    turn = {
        isCombat: Boolean,
        round: Number,
        turn: Number,
        user: String
    }
    messageChannel;
    countDownDate;
    combatMessage;



    sort = function (a, b) {
        return b.getSpeed() - a.getSpeed()
    };

    getPlayer = function (userName) {
        const exactPlayer = this.players.find(({ name }) => name.toLowerCase() === userName.toLowerCase());
        const fuzzyPlayer = this.players.find(({ name }) => name.toLowerCase().includes(userName.toLowerCase()));
        return exactPlayer || fuzzyPlayer;
    };

    getEnemyByName = function (userName) {
        if (!this.enemy) return false;
        if (this.enemy.name.toLowerCase().includes(userName.toLowerCase())) return this.enemy;
        return false;
    };

    getAllPlayers = function () {
        return (this.players.filter(({ isPlayer }) => isPlayer === true));
    };

    getPlayerFromCombat = function (userName) {
        const exactPlayer = this.combat.find(({ name }) => name.toLowerCase() === userName.toLowerCase());
        const fuzzyPlayer = this.combat.find(({ name }) => name.toLowerCase().includes(userName.toLowerCase()));
        return exactPlayer || fuzzyPlayer;
    };

    addToCombat = function (player) {
        if ( !this.turn.isCombat ) {
            return;
        }

        let playerInCombat = false;
        if (player && player.name) {
            const exactPlayerMatch = this.combat.find(({ name }) => name.toLowerCase() === player.name.toLowerCase());
            if (exactPlayerMatch) {
                playerInCombat = true;
            }
        }

        if (!playerInCombat) {
            this.combat.push(player)
            player.actionAvailable = true;
        }
    };

    startCombat = function () {
        this.turn.round = 1;
        this.turn.isCombat = true;
        this.turn.turn = 0;
        this.turn.userName = 'Placeholder';
    };

    endCombat = function () {
        this.turn.round = 1;
        this.turn.isCombat = false;
        this.turn.turn = 0;
        this.turn.userName = 'Placeholder';
        this.combat.splice(0, this.combat.length);
        this.enemy = false;
    };

    nextTurn = function () {
        const report = [];
        if (this.combat.length) {
            this.turn.round++;
            if (this.enemy && this.turn.round % 2 === 0) {
                this.enemy.enraged();
            }

            this.combat.forEach(player => {

                player.aggro -= ((random(10) + 1) * player.level);
                if (player.aggro < 0) player.aggro = 0;

                player.actionAvailable = true;

                const regen = player.effects.find(effect => effect.name.toLowerCase() === 'regeneration');
                if (regen) {
                    //... This only handles 'static' valueType
                    const regenAmount = regen.valueType === 'percent' ? Math.floor(player.totalStats.hpMax * regen.value / 100) : regen.value;
                    report.push(`${player.name} regenerates ${regenAmount} hp.`);
                    player.heal(regenAmount);
                }
    
                player.updateBonuses(this.turn.round);
            });
            if (this.summons.length > 0) {
                this.summons.forEach(summon => {
    
                    summon.aggro -= ((random(10) + 1) * summon.level);
                    if (summon.aggro < 0) summon.aggro = 0;
    
                    summon.actionAvailable = true;
    
                    const regen = summon.effects.find(effect => effect.name.toLowerCase() === 'regeneration');
                    if (regen) {
                        //... This only handles 'static' valueType
                        const regenAmount = regen.valueType === 'percent' ? Math.floor(summon.totalStats.hpMax * regen.value / 100) : regen.value;
                        report.push(`${summon.name} regenerates ${regenAmount} hp.`);
                        summon.heal(regenAmount);
                    }
        
                    summon.updateBonuses(this.turn.round);

                    report.push('Summons Attack!');
                    report.push(summon.attack(this.enemy));
                    
                });
            }

            //... Update enemy round based effects
            const enemyRegen = this.enemy.effects.find(effect => effect.name.toLowerCase() === 'regeneration');
            if (enemyRegen) {
                //... This only handles 'static' valueType
                const regenAmount = enemyRegen.valueType === 'percent' ? Math.floor(this.enemy.totalStats.hpMax * enemyRegen.value / 100) : enemyRegen.value;
                report.push(`${this.enemy.name} regenerates ${regenAmount} hp.`);
                this.enemy.heal(regenAmount);
            }
    
            this.enemy.updateBonuses(this.turn.round);
        }
        return report.join('\n');
    };

    getHighestAggroPlayer = function () {
        if (!this.combat.length) {
            return false;
        }

        const combatList = [];

        combatList.push.apply(combatList, this.combat);
        combatList.push.apply(combatList, this.summons);
        combatList.forEach(e => console.log(e));

        const targetPlayer = combatList.reduce(function (prev, current) {
            if (prev.isPlayer && current.isPlayer) {
                return (prev.aggro > current.aggro) ? prev : current
            }
            return (prev.isPlayer) ? prev : current
        })
        return targetPlayer;
    };

    updateCombat = function () {
        const report = [];
        if (!this.combat.length || !this.enemy || !this.turn.isCombat) {
            return;
        }

        report.push(this.dropDeadFromCombat());
        if (this.enemy.dead) {
            report.push(this.victory());
        }
        else {
            report.push(this.enemyTurnCounter());
        }

        return report.join('\n');
    };

    enemyTurnCounter = function () {
        const report = [];
        const timerAmount = 10;
        const self = this;

        // Update the count down every 1 second
        const x = setInterval(function () {

            if (!self.countDownDate && self.enemy) {
                if(self.combatMessage) self.combatMessage.delete();
                self.messageChannel.send(`***[Next ${self.enemy.name} attack in ${timerAmount} seconds.]***`).then(message => self.combatMessage = message);
                self.countDownDate = new Date();
                self.countDownDate.setSeconds(self.countDownDate.getSeconds() + timerAmount);
            }

            // Get today's date and time
            const now = new Date().getTime();

            // Find the distance between now and the count down date
            const distance = self.countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            if (self.combatMessage) {
                self.combatMessage.edit(`***[Next ${self.enemy.name} attack in ${seconds} seconds.]***`);
            }
            // self.messageChannel.send(`${seconds} seconds left.`);
            report.push(`${seconds} seconds left.`);
            console.log(`${seconds} seconds left.`);
            
            // If the count down is finished, write some text
            if (!self.enemy || !self.turn.isCombat) {
                clearInterval(this);
                self.countDownDate = false;
            }
            if (seconds <= 1) {
                clearInterval(this);
                self.countDownDate = false;
                report.push(self.enemiesTurn());
                report.push(self.nextTurn());
                
                if (self.combatMessage) {
                    self.combatMessage.delete();
                    self.combatMessage = false;
                }
            }
            if (this.messageChannel) {
                this.messageChannel.send(report.join('\n'));
            }
        }, 1000);
    }

    enemiesTurn = function () {
        const report = [];
        const target = this.getHighestAggroPlayer();
        if (!target) {
            return;
        }
        else {
            report.push(this.enemy.attack(target));
            report.push(this.updateCombat());
        }
        if (report && report.length > 0) {
            this.messageChannel.send(report.join('\n'));
        }
    }

    dropDeadFromCombat = function () {
        if (!this.combat.length || !this.combat.length > 0) {
            return false;
        }

        function filterByDeadPlayers(item) {
            if (item.dead === true && item.isPlayer === true) {
                return true
            }
            return false;
        };
        function filterByLivingPlayers(item) {
            if (item.dead === false && item.isPlayer === true) {
                return true
            }
            return false;
        };

        const report = [];
        const deadPlayers = this.combat.filter(filterByDeadPlayers);

        if (deadPlayers.length > 0) {
            deadPlayers.forEach(user => {
                //... player.die()
                const lostExp = random(this.enemy.exp);
                const lostGold = random(this.enemy.gold);
                user.exp -= lostExp;
                if (user.exp <= 0) {
                    user.exp = 0;
                }
                user.gold -= lostGold;
                if (user.gold <= 0) {
                    user.gold = 0;
                }

                user.bonus.splice(0, user.bonus.length);
                user.calcStats();

                report.push(`Ankou has claimed ${user.name}'s soul!`);
                report.push(`${user.name} lost ${lostExp} exp and ${lostGold} gold!`);
                //... Todo
                this.combat.splice(this.combat.indexOf(user), 1);
            })
        }
        const alivePlayers = this.combat.filter(filterByLivingPlayers);

        if (!alivePlayers || alivePlayers.length <= 0) {
            this.turn.isCombat = false;
            this.combat.splice(0, this.combat.length);
            this.enemy = false;
            report.push(`**Defeat:** All heroes have fallen. The monsters have won.`);
        }
        return report.join('\n');
    };

    victory = function () {
        if (!this.combat.length || !this.enemy) {
            return;
        }
        const report = [];

        this.combat.forEach(player => {
            if (player.isPlayer) {
                player.exp += this.enemy.exp
                player.gold += this.enemy.gold
                player.aggro = 0;

                if (this.enemy.trophyType) {
                    let trophy = getItem('Trophy');
                    if (trophy && trophy.name) {
                        trophy.name = this.enemy.trophyType;
                        //... Need a separate array for trophies. Don't want to clog the inventory.
                        player.addToInventory(trophy, 1);
                        // report.push(`${player.name} found [${trophy.type}] ${trophy.name} x1`)
                    }
                }

                player.addToInventory(getItem('Token'));

                if (this.enemy.drops.length > 0) {
                    this.enemy.drops.forEach(drop => {
                        const randomNumber = random(100);
                        if (drop.chance >= randomNumber) {
                            player.addToInventory(drop.item);
                            report.push(`${player.name} found [${drop.item.type}] ${drop.item.name} x1`)
                        }
                    });
                }

                player.bonus.splice(0, player.bonus.length);
                player.calcStats();

                report.push(player.levelUp());
            }
        });
        report.push(`**Victory:**: ${this.enemy.name} has been slain!`);
        report.push(`Surviving heroes made ${this.enemy.exp} exp and ${this.enemy.gold} gold!`);

        this.turn.isCombat = false;
        this.combat.splice(0, this.combat.length);
        this.enemy = false;
        return report.join('\n');
    };

    initStore = function () {
        this.addToStore(getItem('Short Sword'), 1);
        this.addToStore(getItem('Rapier'), 1);
        this.addToStore(getItem('Big Club'), 1);
        this.addToStore(getItem('Maul'), 1);
        this.addToStore(getItem('Leather'), 3);
        this.addToStore(getItem('Chain'), 1);
        this.addToStore(getItem('Silk'), 1);
        this.addToStore(getItem('Buckler'), 1);
        this.addToStore(getItem('Sword Breaker'), 1);
        this.addToStore(getItem('Ring of Quickness'), 1);
        this.addToStore(getItem('Scroll of Healing'), 10);
        this.addToStore(getItem('Scroll of Burning'), 10);
        this.addToStore(getItem('Healing Potion'), 10);
        this.addToStore(getItem('Magic Clay'), 100);
    }
};

    Game.prototype.addToStore = function (item, amount = 1) {
    const report =[];
    if (item)  {
    const storeItem = this.store.find(e => e.item.name.toLowerCase() === item.name.toLowerCase());
    if (storeItem) {
    storeItem.item.quantity += quantity;
}
else {
    let newItem = item;
    newItem.price = Math.floor(random(item.value) + (item.value / 2));
    this.store.push({
     item: newItem, quantity: amount
 });
}
}

    return report.join('\n');
}

module.exports = { Game };