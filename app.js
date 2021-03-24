const getRandomValue = (min, max) => {
	return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
	data() {
		return {
			playerHealth: 100,
			monsterHealth: 100,
			currentRound: 0,
			specialAttackRecharge: 3,
			winner: null,
			logMessages: [],
		};
	},
	computed: {
		monsterBarStyles() {
			return {
				width: this.monsterHealth + '%'
			};
		},
		playerBarStyles() {
			return {
				width: this.playerHealth + '%'
			};
		},
		specialAttackRecharging() {
			return this.specialAttackRecharge < 3;
		}
	},
	watch: {
		playerHealth(value) {
			if (value <= 0 && this.monsterHealth <= 0) {
				this.winner = "draw";
			} else if (value <= 0) {
				this.winner = "monster";
			}
		},
		monsterHealth(value) {
			if (value <= 0 && this.playerHealth <= 0) {
				this.winner = "draw";
			} else if (value <= 0) {
				this.winner = "player";
			}
		},
	},
	methods: {
		startGame() {
			this.playerHealth = 100;
			this.monsterHealth = 100;
			this.currentRound = 0;
			this.specialAttackRecharge = 3;
			this.winner = null;
			this.logMessages = [];
		},
		attackMonster() {
			this.specialAttackRecharge++;
			this.currentRound++;
			const attackValue = getRandomValue(5, 12);
			if (this.monsterHealth - attackValue < 0) {
				this.monsterHealth = 0;
			} else {
				this.monsterHealth -= attackValue;
			}
			this.attackPlayer();
			this.addLogMessage("player", "attack", attackValue);
		},
		attackPlayer() {
			const attackValue = getRandomValue(8, 15);
			if (this.playerHealth - attackValue < 0) {
				this.playerHealth = 0;
			} else {
				this.playerHealth -= attackValue;
			}
			this.addLogMessage("monster", "attack", attackValue);
		},
		specialAttackMonster() {
			this.specialAttackRecharge = 0;
			this.currentRound++;
			const attackValue = getRandomValue(10, 20);
			if (this.monsterHealth - attackValue < 0) {
				this.monsterHealth = 0;
			} else {
				this.monsterHealth -= attackValue;
			}
			this.addLogMessage("player", "special attack", attackValue);
			this.attackPlayer();
		},
		healPlayer() {
			this.specialAttackRecharge++;
			this.currentRound++;
			const healValue = getRandomValue(8, 20);
			if (this.playerHealth + healValue > 100) {
				this.playerHealth = 100;
			} else {
				this.playerHealth += healValue;
			}
			this.addLogMessage("player", "heal", healValue);
			this.attackPlayer();
		},
		surrender() {
			this.winner = 'monster';
		},
		addLogMessage(actor, action, value) {
			this.logMessages.unshift({
				actionRound: this.currentRound,
				actionActor: actor,
				actionType: action,
				actionValue: value,
			})
		}
	}
});

app.mount("#game");