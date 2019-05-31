// selectors
const boardElement = document.getElementById('board');
const actioncam = document.getElementById('action-cam');

// sounds
const sounds = {
  bg: new Audio('sounds/bg.mp3'),
  loot: new Audio('sounds/loot.mp3'),
  trade: new Audio('sounds/trade.wav'),
  pattack: new Audio('sounds/pattack.wav'),
  mattack: new Audio('sounds/mattack.wav'),
  gold: new Audio('sounds/gold.wav'),
  levelup: new Audio('sounds/levelup.wav'),
  death: new Audio('sounds/death.wav'),
  battle: new Audio('sounds/battle.mp3'),
  win: new Audio('sounds/win.mp3')
};

// game state. Is used in the keyboard event listener to prevent user action if game is over
let GAME_STATE = 'PLAY';

// init board
// Create a board with 20 rows and 25 columns (can play around to test different sizes) and render it
const board = new Board(20, 25);

// init player
// create player at the center of the board with 2 items and render it
const player = new Player('Van', new Position(10, 12), board, 1, [], 90);
player.setImg('player/front.png');
// Keep this, used to display the information on the box on the right of the board
updateActionCam();

const monster = createMonsters()

function createMonsters() {
   for (i = 0; i < 3;i++)
     board.setEntity(new Monster(), new Position(getRandom(3, 15), getRandom(3, 20)));
// Create all the monsters entities and set them on the board at a random position
// Give each monster a random name, random level (1-3), a potion (random rarity 0-3), random gold (0-50)
// Give one monster the key
  
}
// items
// Add code to create a potion and a bomb entity and set them at a random board position
const keyItem = new Key();
let pos = getRandomPosition(board);
board.setEntity(keyItem, pos);

const potion = new Potion(2);
pos = getRandomPosition(board);
board.setEntity(potion, pos);
// gold
// Add code to create a gold entity and place it at a random position on the board
const gold = new Gold(100);
pos = getRandomPosition(board);
board.setEntity(gold, pos);

// dungeons
// Add code for an opened dungeon and a closed dungeon you can loot (random position)
// Add code for a dungeon that is closed and has the princess (random position)
const dungeonO = new Dungeon(true, false, 30, [new Potion(2), new Bomb(2)]);
pos = getRandomPosition(board);
board.setEntity(dungeonO, pos);

 const dungeon1 = new Dungeon(true, true, 30, [new Potion(0)]);
 pos = getRandomPosition(board);
 board.setEntity(dungeon1, pos);

 const dungeon2 = new Dungeon(false, false, 30, [new Bomb(2)]);
 pos = getRandomPosition(board);
 board.setEntity(dungeon2, pos);

const dungeon3 = new Dungeon(true, true, 30, [new Potion(3), new Bomb(1)]);
pos = getRandomPosition(board);
board.setEntity(dungeon3, pos);

// tradesman
// Add code for a tradesman with a potion of each rarity (0 to 3), bomb of each rarity and a key at a random position
const tradesman = new Tradesman([new Potion(getRandom(0, 3)), new Bomb(getRandom(0, 3)), new Key()]);
pos = getRandomPosition(board);
board.setEntity(tradesman, pos);


// event handlers
board.render(boardElement);
let monsterAttack;
// UPDATE this event listener to move the player
// Add code to check if the entity at the new player position (after move) is a monster. If so, call the encounterMonster function
document.addEventListener('keydown', ev => {
  if (ev.code === "ArrowLeft") { 
    if (board.rows[player.position.row][player.position.column - 1].constructor.name == 'Monster')
    {
      encounterMonster(board.rows[player.position.row - 1][player.position.column]);  
    }

    let ent = board.rows[player.position.row][player.position.column - 1];
    ent.position = new Position(player.position.row, player.position.column - 1);
    updateActionCam(ent);

    if (board.rows[player.position.row][player.position.column - 1].constructor.name == 'Grass') {
      // clearEntity(player.position) 
      player.moveLeft()
      player.setImg('player/left.png');
    }
  }

 else if (ev.code === "ArrowRight") { 
    if (board.rows[player.position.row][player.position.column + 1].constructor.name == 'Monster') {
       encounterMonster(board.rows[player.position.row][player.position.column + 1]); 
    }
    
     
    //updateActionCam(board.rows[player.position.row][player.position.column + 1]);
    let ent = board.rows[player.position.row][player.position.column + 1];
    ent.position = new Position(player.position.row, player.position.column + 1);
    updateActionCam(ent);

    if (board.rows[player.position.row][player.position.column + 1].constructor.name == 'Grass') {
      player.moveRight();
      player.setImg('player/right.png');
    }
  } 
  else if (ev.code === "ArrowDown") {
    if (board.rows[player.position.row + 1][player.position.column].constructor.name == 'Monster')
      encounterMonster(board.rows[player.position.row +1][player.position.column]);
   // updateActionCam(board.rows[player.position.row + 1][player.position.column]);
    let ent = board.rows[player.position.row + 1][player.position.column ];
    ent.position = new Position(player.position.row + 1, player.position.column );
    updateActionCam(ent);
    if (board.rows[player.position.row + 1][player.position.column].constructor.name == 'Grass') {

      player.moveDown()
      player.setImg('player/front.png');
    }
  } 
 else if (ev.code === "ArrowUp") {
    if (board.rows[player.position.row - 1][player.position.column].constructor.name == 'Monster')
      encounterMonster(board.rows[player.position.row - 1][player.position.column]);
   // updateActionCam(board.rows[player.position.row - 1][player.position.column]);
    let ent = board.rows[player.position.row - 1][player.position.column];
    ent.position = new Position(player.position.row - 1, player.position.column);
    updateActionCam(ent);
    if (board.rows[player.position.row - 1][player.position.column].constructor.name == 'Grass') {

      player.moveUp()
      player.setImg('player/back.png');
    }
  } 
  if (!ev.key.includes('Arrow') || GAME_STATE === 'GAME_OVER') return;
  if (sounds.bg.paused) playMusic('bg');
  clearInterval(monsterAttack); // stop monster attack when player moves


});

// helper functions

// UPDATE the function to return a random position on the board that is not occupied by an entity (Grass is fine) or the player's initial position (center)
// The parameter is a Board object
function getRandomPosition(board) {
 
  let x = getRandom(1, 19);
  let y = getRandom(1, 24);
 
  if (board.rows[x][y].constructor.name == 'Grass') {
      return new Position(x, y);
    } 
    else {
      return getRandomPosition(board);
    }

 
}

// UPDATE the function passed to setInterval to attack the player and trigger player death if hp is 0 or lower
// The parameter is a Monster object
// Replace the interval time of 1000 by the monster attack speed
// Replace the hp printed to be the player's hp
function encounterMonster(monster) {
  playMusic('battle');
  monsterAttack = setInterval(() => {
    document.getElementById('Player-hp').textContent = `HP: ${player.hp}`;
    if (player.hp == 0)
      playerDeath();
  }, monster.attackSpeed);
}

// Use when the player is dead, no need to change anything
function playerDeath() {
  clearInterval(monsterAttack);
  boardElement.innerHTML = '<h1>GAME OVER</h1>';
  document.getElementById('player-cam').src = 'imgs/player/dead.png';
  document.getElementById('action-menu').style.display = 'none';
  GAME_STATE = 'GAME_OVER';
  playMusic('death');
}

// UPDATE this function to getExp from monster, loot the monster, and clear the entity (monster) at the player position
function defeatMonster(monster) {
  player.exp += monster.hp;
  player.gold += monster.gold;
  player.levelUp(monster);
  clearEntity(monster);
  clearInterval(monsterAttack);
  playMusic('bg');
}

// UPDATE this function to set the board entity at position to a grass entity
// function clearEntity(position) {
//   board.rows[position.row][position.column] = new Grass();
// }
function clearEntity(entity) {
  entity.element.src = `imgs/environment/grass${getRandom(1, 3)}.png`;
  var pos = entity.position;
  entity = new Grass();
  board.rows[pos.row][pos.column] = entity;
  //board.render(boardElement);
}

// DOM manipulation functions

// This function updates the 'action cam' - the box showing the enemy and player info as well as the actions
// It is called after an event happened (e.g. used item) to update the information shown in the action box
// UPDATE the entity variable to be the entity at the player position
function updateActionCam(ent) {
  console.log('in update action cam');
  const entity = null;
  actioncam.innerHTML = '';
  actioncam.appendChild(createActionView(ent));
   actioncam.appendChild(createActionView(player));
  // actioncam.appendChild(createActionMenu(entity));
  
}

// UPDATE this function based on the comments
// Replace the if condition calling createCreatureView to only execute if the entity is a creature
// Replace the if condition creating the h4 value element to only execute if the entity has a value
// Replace the ternary condition setting the img.id to be 'player-cam' if the entity is a Player, 'entity-cam' otherwise
// Replace the ternary condition setting the img.src to be 'imgs/player/attack.png' if the entity is a Player, else use the entity's image src
function createActionView(entity) {
  
  const actionView = document.createElement('div');
  actionView.className = 'action-view';
  const infoWrapper = document.createElement('div');

  const name = document.createElement('h3');
  if (entity)
    name.innerHTML = entity.constructor.name == 'Player' ? 'Alex' : entity.constructor.name;
  else
    name.innerHTML = "Grass";
    
  // Add code here to set the name text to be the entity name or use the constructor name as fallback
  infoWrapper.appendChild(name);
  //(typeof entity === Creature)
  
  if (entity) {
    if (entity.constructor.name == 'Monster') {
      createCreatureView(infoWrapper, entity);
      createMonsterMenu(infoWrapper, entity);
    } 
    else if (entity.constructor.name == 'Gold' || entity.constructor.name == 'Potion' || entity.constructor.name == 'Key')
      createPickupMenu(infoWrapper, entity);
    else if (entity.constructor.name == 'Dungeon')
      createDungeonMenu(infoWrapper, entity);
    else if (entity.constructor.name == 'Tradesman')
      createTradeMenu(infoWrapper, entity);
    else
      createActionMenu(entity);
    
    if (entity.constructor.name == 'Player') {
      const value = document.createElement('h4');
      value.id = 'Player-hp';
      value.innerHTML = '</br>Hp: ' + player.hp ;
      // Add code here to set the value text to the entity's value e.g. "Value: 20"
      const level = document.createElement('h4');
      level.innerHTML = '</br>Level: ' + player.level ;
      const gold = document.createElement('h4');
      gold.innerHTML = '</br>Gold: ' + player.gold;

      infoWrapper.appendChild(value);      
      infoWrapper.appendChild(level);
      infoWrapper.appendChild(gold);
    }

  }

  // Add the entity image
  const img = document.createElement('img');
  img.id = entity && entity.constructor.name == 'Player' ? 'player-cam' : 'entity-cam';
  if (entity && entity.constructor.name == 'Player')
    img.src = 'imgs/player/attack.png';
  else
    img.src = entity && entity.element ? entity.element.src : `imgs/environment/grass${getRandom(1, 3)}.png` ;
  actionView.appendChild(infoWrapper);
  actionView.appendChild(img);

  
  return actionView;
}

// UPDATE this function based on the comments
function createCreatureView(root, creature) {
  const level = document.createElement('h4');
  level.innerHTML = "Level: "+creature.level;
  // Add code here to set the level text to the creature's level e.g. "Level 1"
  const hp = document.createElement('h4');
  hp.id = 'Monster-hp';
  hp.innerHTML = "Hp: " + creature.hp;
  //hp.id = creature.constructor.name + '-hp';

  // Add code here to set the hp text to the creature's hp e.g. "HP: 100"
  const gold = document.createElement('h4');
  gold.innerHTML = "Gold: " + creature.gold;
  // Add code here to set the gold text to the creature's gold e.g. "Gold: 10"
  console.log('hp, level, gold');
  root.appendChild(hp);
  root.appendChild(level);
  root.appendChild(gold);
}

// UPDATE this function to create the appropriate menu based on the entity type. Use the createMenu functions (e.g. createPickupMenu)
function createActionMenu(entity) {
  const actionMenu = document.createElement('div');
  actionMenu.id = 'action-menu';

  return actionMenu;
}

// UPDATE the pickupBtn event listener function to pickup the entity
// Add a call to clearEntity in the listener function to set a Grass entity at the player position
function createPickupMenu(root, entity) {
  const actions = document.createElement('div');
  actions.textContent = 'Actions';
  actions.style.color = 'blue';
  actions.style.textAlign = 'center';
  actions.style.fontFamily = 'Arial, Helvetica, sans-serif';
  actions.style.margin = '5px';
  const div = document.createElement('div');
  const pickupBtn = document.createElement('button');
  pickupBtn.textContent = 'Pickup';
  pickupBtn.addEventListener('click', () => {
    player.pickup(entity);
    
      clearEntity(entity);
      updateActionCam();
  });
  actions.appendChild(div);
  actions.appendChild(pickupBtn);
  root.appendChild(actions);
}

// UPDATE this function to add a call to createItemActions(root, monster) if the player has items
// Update the attackBtn event listener to attack the monster
// Update the if condition to execute only if the monster hp is 0 or lower. When true, call defeatMonster.
// Replace the timeout value (1000) passed to disable the attackBtn to be the player's attack speed
function createMonsterMenu(root, monster) {
  const actions = document.createElement('div');
  actions.textContent = 'Actions';
  actions.style.color = 'red';
  actions.style.textAlign = 'center';
  actions.style.fontFamily = 'Arial, Helvetica, sans-serif';
  actions.style.margin = '5px';

  let attackBtn = document.createElement('button');
  attackBtn.textContent = 'Attack';
  attackBtn.style.display = 'block';
  attackBtn.style.padding = '5px';
  attackBtn.style.margin = '5px';
  // Add code here to reset the player attack timeout to allow the player to attack a monster as soon as one is encountered
  attackBtn.addEventListener('click', () => {
    if (monster.hp <= 0) {
      defeatMonster(monster);
      updateActionCam();
    } else {
      attackBtn.disabled = true;
      monsterAttack = setTimeout(() => (
        attackBtn.disabled = false        
      ), player.attackSpeed);
      player.attack(monster);   
      monster.attack(player);
      
      playSound("mattack");
      // Replace the hp printed to be the monster's hp
      document.getElementById('Monster-hp').textContent = `HP: ${monster.hp}`;
      document.getElementById('Player-hp').textContent = `HP: ${player.hp}`;
      if (player.hp == 0)
        playerDeath();
    }
  });
  actions.appendChild(attackBtn);
  root.appendChild(actions);
}

// UPDATE
// update the forEach call to be on the player's items instead of an empty array
// update the function passed to forEach to return immediately if the item is a Key (the key is not a valid item in a battle)
// update the itemBtn event listener to call useItem on the player for potions, useItem on the monster for Bombs.
// Add a call to defeatMonster if its hp is 0 or lower
function createItemActions(root, monster) {
  const items = document.createElement('div');
  items.textContent = 'Items';
  [].forEach(item => {
    const itemBtn = document.createElement('button');
    // Add code here to set the itemBtn text to the item name
    itemBtn.addEventListener('click', () => {
      updateActionCam();
    });
    items.appendChild(itemBtn);
  });
  root.appendChild(items);
}

// UPDATE
// update the first forEach call to be on the tradesman's items instead of an empty array
// update the second forEach call to be on the player's items instead of an empty array
// Add code to the itemBtn event listener to buy the clicked item
// Add code to the itemBtn event listener to sell the clicked item
function createTradeMenu(root, tradesman) {
  const buyAction = document.createElement('div');
  buyAction.textContent = 'Buy';
  buyAction.style.margin = '10px';
  tradesman.items.forEach(item => {
    const itemBtn = document.createElement('button');
    itemBtn.textContent = item.type + ' - ' + item.value;
    itemBtn.style.display = 'block';
    itemBtn.style.padding = '5px';
    itemBtn.style.margin = '5px';
    itemBtn.id = item.type;
    // Add code here to set the item text to the item's name and value e.g. "Common potion - 10G"
    // Add code here to set itemBtn to disabled if the player does not have enough gold for the item
    if (player.gold < item.value)
      itemBtn.disabled = true;
    
    itemBtn.addEventListener('click', (event) => {
      var itemName = event.currentTarget.id;
      player.buy(itemName, tradesman);
      updateActionCam();
    });
    buyAction.appendChild(itemBtn);
  });
  const sellAction = document.createElement('div');
  sellAction.textContent = 'Sell';
  sellAction.style.margin = '10px';
  player.items.forEach(item => {
    const itemBtn = document.createElement('button');
    itemBtn.textContent = item.type + ' - ' + item.value;
    itemBtn.style.display = 'block';
    itemBtn.style.padding = '5px';
    itemBtn.style.margin = '5px';
    itemBtn.id = item.type;
    // Add code here to set the item text to the item's name and value e.g. "Common potion - 10G"
    itemBtn.addEventListener('click', (event) => {
      if (player.sell(event.currentTarget.id, tradesman)) {
        sounds.bg.pause();
        playSound("trade");
      }
      updateActionCam();
    });
    sellAction.appendChild(itemBtn);
  });
  root.appendChild(buyAction);
  root.appendChild(sellAction);
}

// UPDATE the function based on the comments
// Update the condition to create the openBtn only if the dungeon is not open
// Update the if condition inside the else block to only win the game if the dungeon has the princess
// Update the openBtn event listener to use the key item on the dungeon
// Update the lootBtn event listener to loot the dungeon
function createDungeonMenu(root, dungeon) {
  const actions = document.createElement('div');
  actions.textContent = 'Actions';
  actions.style.color = 'blue';
  actions.style.textAlign = 'center';
  actions.style.fontFamily = 'Arial, Helvetica, sans-serif';
  actions.style.margin = '5px';

  const div = document.createElement('div');

  if (dungeon.isOpen) {
    const openBtn = document.createElement('button');

    // Add code to get the key from the player items
    // If the player does not have a key, set the openBtn to disabled

    openBtn.textContent = 'Open';
    openBtn.disabled = player.items.some((item) =>
      item.type.includes('key')) ? false : true;
      
    openBtn.addEventListener('click', () => {
      let itemFound = player.items.find(function (element, index) {
        if (element.type == 'key') {
          player.items.splice(index, 1);
          return element;
        }
      });
      
      if (dungeon.hasPrincess) {
        boardElement.innerHTML =
          '<h1>You WIN!</h1><img src="imgs/dungeon/princess.png" width=500/>';
        actioncam.style.display = 'none';
        GAME_STATE = 'GAME_OVER';
        playMusic('win');
      }
      updateActionCam();
    });
    actions.appendChild(div);
    actions.appendChild(openBtn);
    root.appendChild(actions);
  } else {
    if (dungeon.hasPrincess) {
      boardElement.innerHTML =
        '<h1>You WIN!</h1><img src="imgs/dungeon/princess.png" width=500/>';
      actioncam.style.display = 'none';
      GAME_STATE = 'GAME_OVER';
      playMusic('win');
    } else {
      const lootBtn = document.createElement('button');
      lootBtn.textContent = 'Loot';
      // Add code here to check if the dungeon has gold or items, if not set the lootBtn to disabled

      lootBtn.disabled = dungeon.gold.value > 0 || dungeon.items.length > 0 ? false : true;

      lootBtn.addEventListener('click', () => {
        player.loot(dungeon);
        updateActionCam();
      });
      actions.appendChild(div);
      actions.appendChild(lootBtn);
      root.appendChild(actions);
    }
  }
}

// utility functions - no need to change them

// Plays a background music while ensuring no other music is playing at the same time
function playMusic(music) {
  sounds.bg.pause();
  sounds.battle.currentTime = 0;
  sounds.battle.pause();
  sounds[music].play();
}

// Play sound from the start
function playSound(sound) {
  sounds[sound].currentTime = 0;
  sounds[sound].play();
}

// Returns a random integer between min and max (max included)
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// removes an element from the array
function remove(arr, element) {
  arr.splice(arr.indexOf(element), 1);
}
