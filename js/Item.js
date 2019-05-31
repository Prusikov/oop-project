//Create the Item, Potion, Bomb and Key class

/*
Item class definition. Item is an Entity
- constructor
  - parameters: value (number), rarity (number), type (string)
  - Creates an item with the correct image (depends on type).
  - Sets the name based on the rarity (with ITEM_RARITIES) and the type.
- name (string)
- value (number)
- rarity (number)
- sound (Audio object - type is used for the sound file path)
Example use: not used by itself.
*/

class Item {
  constructor(value, rarity, type) {
    this.value = value;
    this.rarity = rarity;
    this.type = type;
    this.element = document.createElement('img');    
  }
  setImg(src) {
    this.element.src = 'imgs/' + src;
  }
}

/*
Potion class definition. Potion is an Item
- constructor
  - parameters: rarity (number)
  - Creates a potion with type 'potion' and a value based on rarity: (rarity + 1) * 10
- potency (number): (rarity + 1) * 10
- use (function)
 - parameters: target (Creature)
 - Restores hp of target by potency value. HP of target can't go past its max HP.
 - Plays the item sound
Example use:
new Potion(0) // potion rarity 0
*/

class Potion extends Item {
  constructor(rarity) {
    super(5, rarity, 'potion');
    this.setImg('items/potion.png');
  }
}
/*
- use (function)
 - parameters: target (Creature)
 - Damages hp of target by damage value. HP of target can't be lower than 0.
 - Plays the item sound

*/

class Bomb extends Item{
  constructor(rarity) {
    super(100, rarity, 'bomb');
    this.setImg('items/bomb.png');
 
  }
  damage(number) {
    retrn (this.rarity + 1)* 30;
  }
  use(target) {
    sounds.bg.pause();
    playSound('bomb');
  }
}
/*
- use (function)
 - parameters: target (Dungeon)
 - opens the dungeon and plays the item sound if the dungeon does not have the princess
*/
class Key extends Item{ 
  constructor() { 
    super(150, 3, 'key');
    this.setImg('items/key.png');
  }
  use() {
    sounds.bg.pause();
    playSound('key');
  }
}








