const { Player } = require("./player.js");
const { Equipment } = require('./equipment.js');
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
        return (this.players.find(({ name }) => name === userName) || false);
    };
    getPlayerFromCombat = function (userName) {
        return (this.combat.find(({ name }) => name === userName) || false);
    };
    startCombat = function () {
        this.turn.round = 0;
        this.turn.isCombat = true;
        this.turn.turn = 0;
        this.turn.userName = 'Placeholder';
    };
    endCombat = function () {
        this.turn.round = 0;
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
            }
            this.turn.userName = this.combat[(this.turn.turn - 1)].name;
            this.turn.round++;
            return this.turn.userName;
        }
        return;
    };
    getRandomPlayer = function () {
        if (!this.combat.length) {
            return false;
        }
        let count = 0;
        let targetPlayer = new Player('none', false);
        while (!targetPlayer.isPlayer || count <= 20) {
            const random = Math.floor(Math.random() * this.combat.length);
            targetPlayer = this.combat[random];
            count++;
        }
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
        }

        //... Enemy's turn
        if (this.turn.userName === this.enemy.name) {
            const target = this.getRandomPlayer();
            if (!target) {
                report.push(`Target returned false.`);
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
            if (player.name !== this.enemy.name) {
                player.exp += this.enemy.exp
                player.gold += this.enemy.gold
                if (this.enemy.drops[0]) {
                    this.enemy.drops.forEach(drop => {
                        const randomNumber = random(100);
                        if (drop.chance >= randomNumber) {
                            player.addToInventory(drop.item);
                            report.push(`${player.name} found [${drop.item.type}] ${drop.item.name} x1`)
                        }
                    });
                }
                report.push(player.levelUp());
            }
        });
        report.push(`**Victory:** Surviving heroes made ${this.enemy.exp} exp and ${this.enemy.gold} gold!`);

        this.turn.isCombat = false;
        this.combat.splice(0, this.combat.length);
        this.enemy = false;
        return report.join('\n');
    };
    initStore = function () {
        this.addToStore(getItem('sword'), 1);
        this.addToStore(getItem('buckler'), 1);
        this.addToStore(getItem('healing'), 10);
        this.addToStore(getItem('burn'), 10);
    }

};

Game.prototype.addToStore = function (items, quantity = 1) {
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