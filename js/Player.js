//Create the Player class
class Player {

  constructor(name, position, board, level, items, gold) {
  
    this.position = position;
    this.name = name;
    this.board = board;
    this.level = level > 1 ? level : 1;
    this.items = items;
    this.gold = gold;
    this.exp = 0;
    this.attackSpeed = 2000 / level;
    this.hp = 250;
  }
 
  update() {
    Board.setEntity(entity, position);
  }
  setImg(src) {
    this.board.rows[player.position.row][player.position.column].element.src = 'imgs/' + src;
  }
  moveRight() {
    if (this.board.rows[player.position.row][player.position.column] &&
      player.position.row > 0 &&
      player.position.column + 2 < this.board.rows[0].length &&
      player.position.row != this.board.rows.length
    ) {
      this.board.rows[player.position.row][player.position.column].element.src = `imgs/environment/grass${getRandom(1, 3)}.png`;

      player.position.column = player.position.column + 1;
    }

  }
  moveLeft() {
    if (this.board.rows[player.position.row][player.position.column]
      && player.position.row > 0 && player.position.row != this.board.rows.length
      && player.position.column > 1) {
      this.board.rows[player.position.row][player.position.column].element.src = `imgs/environment/grass${getRandom(1, 3)}.png`;

      player.position.column = player.position.column - 1;

    }
  }
  moveUp() {
    if (this.board.rows[player.position.row][player.position.column] && player.position.row > 1) {
      
      this.board.rows[player.position.row][player.position.column].element.src = `imgs/environment/grass${getRandom(1, 3)}.png`;

      player.position.row = player.position.row - 1;

    }
  }
  moveDown() {
    if (this.board.rows[player.position.row][player.position.column] &&
      player.position.row > 0 && player.position.row + 1 < this.board.rows.length - 1

    ) {
      this.board.rows[player.position.row][player.position.column].element.src = `imgs/environment/grass${getRandom(1, 3)}.png`;

      player.position.row = player.position.row + 1;

    }
  }
  getExpToLevel() {
    this.level = this.level * 10;
  }
  levelUp(monster) {
   
    this.hp = this.level * 100;
    this.attackSpeed = 3000 / this.level;
    this.level++;
  }
  attack(entity) {
    entity.attack(entity)
    sounds.bg.pause();
    playSound("pattack");
  }
  getMaxHp() {
    return this.level * 100;
  }
  hit(val) {
    this.hp = Math.max(this.hp - val, 0);
  }

  loot(entity) {
    this.gold += entity.gold.value;
    entity.gold.value = 0;
    entity.items.forEach(function (e) {
      player.items.push(e);
    })
    entity.items = [];
    sounds.bg.pause();
    playSound("loot");
  }
  buy(item, tradesman) {
    let itemFound = tradesman.items.find(function (element, index) {
      if (element.type == item) {
        tradesman.items.splice(index, 1);
        return element;
      }
        
    });

    player.gold = player.gold - itemFound.value;
    player.items.push(itemFound);

    sounds.bg.pause();
    playSound("trade");
  }
  sell(item, tradesman) {
    let indexValue;
    let itemFound = player.items.find(function (element, index) {
      if (element.type == item) {
        indexValue = index;
        return element;
      }
    });
  
    if (tradesman.gold >= itemFound.value) {
      player.items.splice(indexValue, 1);
      player.gold += itemFound.value;
      tradesman.gold = tradesman.gold - itemFound.value;
      tradesman.items.push(itemFound);

      return true;
    }
    else return false;

  }
  pickup(item) {
    if (item.constructor.name == 'Gold') {
      player.gold += item.value;
      sounds.bg.pause();
      playSound("gold");
    }
    else
    {
      player.items.push(item);
      sounds.bg.pause();
      playSound("loot");
    }  
  }
  
}
