# SB-Rogue-Like

## Content

- [Devlopement](#development)
  - [Setup](#setup)
  - [Creating Content](#creating-content)
    - [Enemies](#enemies)
- [TO-DO](#to-do)
- [Credits](#credits)

## Development

### Setup

1. Download and install [Node.js](https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi) and [Git](https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe) (Optinal) [VS Code](https://code.visualstudio.com/download)

2. Open a directory and run theese commands
   1. git clone <https://github.com/ozan-tr/SB-Rogue-Like.git>
   2. npm install
   3. npm start

### Creating Content

Creating new characters, passive items and mobs is a simple task. Active items, enemies that don't attack with contact damage and characters/enemies that move in a different way require some scripting.

#### Enemies

<details>
<summary>Click To Expand</summary>

to create a simple enemy that just moves towards the player and deals contact damage you need to create 4 seperate image files and a javascript file.

**Important:** File and folder names can't have spaces. if you need to use a space make the first letter captial. The images have to be in PNG format.

```md
├── assets
|  ├── img
|  |  ├── mobs
|  |  |  ├── YourMobName
|  |  |  |  ├── 0.png
|  |  |  |  ├── 1.png
|  |  |  |  ├── 2.png
|  |  |  |  └── 3.png
|  └── js
|     ├── class
|     |  ├── mobs
|     |  |  ├── YourMobName.js

```

In the default configuration, the images are supposed to be named like this.

| File Name | Description |
|-----------|-------------|
|0.png|Facing right, right leg up|
|1.png|Facing right, left leg up|
|2.png|Facing left, right leg up|
|3.png|Facing left, left leg up|

The script file uses the template bellow

```js
class YourMobName extends MobTemplate {  
  //make sure to change YourMobName to the actual name of your mob.
    constructor(pos){
        super(
            "YourMobName",
            pos,
            {width: 40, height: 60},  //the width and height of your characters png files
            {
                speed:1,
                damage:5,
                maxHealth:20
            },
            1 //the amount of experience dropped
        )
    }
}
```

**Note:** If you want to add custom behaviours to an enemy you can check [MobTemplate.js](https://github.com/ozan-tr/SB-Rogue-Like/blob/master/assets/js/class/templateClasses/MobTemplate.js) and put certain function from there to here in order to override those behaviours for this enemy.

For example:

```js
class YourMobName extends MobTemplate {  
  //make sure to change YourMobName to the actual name of your mob.
    constructor(pos){
        super(
            "YourMobName",
            pos,
            {width: 40, height: 60},  //the width and height of your characters png files
            {
                speed:1,
                damage:5,
                maxHealth:20
            },
            1 //the amount of experience dropped
        )
    }
    applyDamage(damage) {
      damage *= 2 // make this mob take double the amount of damage
        if(new Date()-this.lastDamage > this.invincibiltyFrame){
            new DamageText(this,damage)
            this.health -= damage.damage
            this.lastDamage=new Date()
            if(this.health <= 0) {
                this.kill(true)
            }
        }
    }
}

```

</details>

## TO-DO

- [x] resim isimlerinde aynı formatı kullandır
  
- [ ] base classları daha universal yap
  
- [ ] hit-reg geliştir
- [ ] hit-reg için daha az kasan bi alg bul
  - [ ] hit-reg için kare dışında şekillerde kullanabilme ekle
  - [ ] production orale attack düzelt

- [ ] css düzenle
  - [ ] menüler vb. için bir color palette bul **Z**
  - [ ] css renklerini rootun içinde var olarak yap

- [x] script yüklenme sırasını düzelt

- [ ] assetler **Z**
  - [ ] statlar için ikon yap **Z**
  - [ ] map **Z**
  - [ ] xp **Z**
  - [ ] para **Z**

## Credits

Art design: zeynep
Scripting: ozan
