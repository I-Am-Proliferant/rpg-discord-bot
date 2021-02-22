const { Player } = require("./player.js");
const { random } = require('./random.js');
const items = require('../lists/items.js');

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

    sort = function (a, b) {
        return b.getSpeed() - a.getSpeed()
    };

    getPlayer = function (userName) {
        return (this.players.find(({ name }) => name.toUpperCase().includes(userName.toUpperCase())) || false);
    };

    getEnemyByName = function (userName) {
        if (!this.enemy) return false;
        if (this.enemy.name.toUpperCase().includes(userName.toUpperCase())) return this.enemy;
        return false;
    };

    getAllPlayers = function () {
        return (this.players.filter(({ isPlayer }) => isPlayer === true));
    };

    getPlayerFromCombat = function (userName) {
        return (this.combat.find(({ name }) => name.toUpperCase().includes(userName.toUpperCase())) || false);
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
        if (this.combat.length) {
            this.turn.turn++;
            if (this.turn.turn > this.combat.length) {
                this.turn.turn = 1;
                this.turn.round++;
                if (this.enemy) {
                    this.enemy.enraged();
                }
            }
            const player = this.combat[(this.turn.turn - 1)];
            this.turn.userName = player.name;

            player.aggro -= ( ( random(10) + 1 ) * player.level );
            if (player.aggro < 0) player.aggro = 0;

            player.updateBonuses(this.turn.round);

            return this.turn.userName;
        }
        return;
    };

    getHighestAggroPlayer = function () {
        if (!this.combat.length) {
            return false;
        }
        const targetPlayer = this.combat.reduce(function(prev, current) {
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

        this.combat.sort(function (a, b) {
            return b.getSpeed() - a.getSpeed();
        });

        report.push(this.dropDeadFromCombat());

        if (this.enemy.dead) {
            report.push(this.victory());
        }

        if (this.turn.isCombat) {
            const user = this.nextTurn();
            report.push(`It's ${user}'s turn.`);
            
            const player = this.getPlayerFromCombat(user);

            if (!player) return;

            const regen = player.effects.find(e => e.name.toUpperCase() === 'REGENERATION');
            if (regen) {
                //... This only handles 'static' valueType
                const regenAmount = regen.valueType === 'percent' ? Math.floor(player.totalStats.hpMax * regen.value / 100 ) : regen.value;
                report.push(`${user} regenerates ${regenAmount} hp.`);
                player.heal(regenAmount);
            }
        }


        //... Enemy's turn
        if (this.turn.userName === this.enemy.name) {
            const target = this.getHighestAggroPlayer();
            if (!target) {
                report.push(`${this.enemy.name} can't find it's target.`);
            }
            else {
                report.push(this.enemy.attack(target));
                report.push(this.updateCombat());
            }
        }

        return report.join('\n');
    };

    dropDeadFromCombat = function () {
        if (!this.combat.length || !this.combat[0]) {
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

        if (deadPlayers[0]) {
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

                user.bonus.splice( 0, user.bonus.length);
                user.calcStats();

                report.push(`The reaper has claimed ${user.name}'s soul!`);
                report.push(`${user.name} lost ${lostExp} exp and ${lostGold} gold!`);
                //... Todo
                this.combat.splice (this.combat.indexOf(user), 1);
            })
        }
        const alivePlayers = this.combat.filter(filterByLivingPlayers);

        if (!alivePlayers[0]) {
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
                        player.addToInventory(trophy);
                        // report.push(`${player.name} found [${trophy.type}] ${trophy.name} x1`)
                    }
                }

                player.addToInventory( getItem( 'Token' ) );

                if ( this.enemy.drops[0] ) {
                    this.enemy.drops.forEach( drop => {
                        const randomNumber = random( 100 );
                        if ( drop.chance >= randomNumber ) {
                            player.addToInventory( drop.item );
                            report.push( `${player.name} found [${drop.item.type}] ${drop.item.name} x1` )
                        }
                    });
                }

                player.bonus.splice( 0, player.bonus.length );
                player.calcStats( );

                report.push( player.levelUp( ) );
            }
        });
        report.push(`**Victory:** Surviving heroes made ${this.enemy.exp} exp and ${this.enemy.gold} gold!`);

        this.turn.isCombat = false;
        this.combat.splice(0, this.combat.length);
        this.enemy = false;
        return report.join('\n');
    };

    initStore = function () {
        this.addToStore(getItem('Short Sword'), 1);
        this.addToStore(getItem('Rapier'), 1);
        this.addToStore(getItem('Maul'), 1);
        this.addToStore(getItem('Sword Breaker'), 1);
        this.addToStore(getItem('Chain'), 1);
        this.addToStore(getItem('Buckler'), 1);
        this.addToStore(getItem('Scroll of Healing'), 10);
        this.addToStore(getItem('Scroll of Burning'), 10);
        this.addToStore(getItem('Healing Potion'), 10);
    }
};

Game.prototype.addToStore = function (items, quantity) {
    const report = [];
    if (items[0]){
        items.forEach(item => {
            const storeItem = this.store.find(e => e.name === item.name);
            if (storeItem) {
                storeItem.quantity += quantity;
            }
            else {
                item.quantity = quantity;
                item.price = Math.floor(random(item.value) + (item.value / 2));
                this.store.push(item);
            }
        })
    }
    else if (items){
        const storeItem = this.store.find(e => e.name === items.name);
        if (storeItem) {
            storeItem.quantity += quantity;
        }
        else {
            items.quantity = quantity;
            items.price = Math.floor(random(items.value) + (items.value / 2));
            this.store.push(items);
        }
    }

    return report.join('\n');
}

module.exports = { Game };