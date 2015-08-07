//   *                                                                 
//   (  `                              (    (               )   (  (     
//   )\))(     )         (  (      (   )\ ) )\ )   (     ( /(   )\))(    
//   ((_)()\ ( /( (  (   ))\ )\ )   )\ (()/((()/(  ))\ (  )\()) ((_)()\   
//   (_()((_))(_)))\ )\ /((_|()/(  ((_) /(_))/(_))/((_))\(_))/   (()((_)  
//   |  \/  ((_)_((_|(_|_))  )(_)) | __(_) _(_) _(_)) ((_) |_     | __|   
//   | |\/| / _` (_-<_-< -_)| || | | _| |  _||  _/ -_) _||  _|    |__ \   
//   |_|  |_\__,_/__/__|___| \_, | |___||_|  |_| \___\__| \__|    |___/   
//      *                    |__/                 *                       
//    (  `           )   )   )           (      (  `                      
//    )\))(     ) ( /(( /(( /(   (  (  ( )\     )\))(     ) (  (    (     
//   ((_)()\ ( /( )\())\())\()) ))\ )\))((_|   ((_)()\ ( /( )\))(  ))\(   
//   (_()((_))(_)|_))(_))((_)\ /((_|(_)()\ )\  (_()((_))(_)|(_))\ /((_)\  
//   |  \/  ((_)_| |_| |_| |(_|_)) _(()((_|(_) |  \/  ((_)_ (()(_|_))((_) 
//   | |\/| / _` |  _|  _| ' \/ -_)\ V  V (_-< | |\/| / _` / _` |/ -_|_-< 
//   |_|  |_\__,_|\__|\__|_||_\___| \_/\_//__/ |_|  |_\__,_\__, |\___/__/ 
//                                                         |___/          
//
//   Created By: Corey Massey, Kurt Peterson, Wayne Maree, Matthew Staples
//
//////////////////////////////////////////////////////////////////////////

//////////////////////
// Global Variables //
//////////////////////

//Canvas
var canvas = document.getElementById("canvas");
canvas.width = 800;
canvas.height = 800;
var ctx = canvas.getContext("2d");
var mapHeight;
var mapWidth;

//Game Loop
var lastTime;
var lastFire = Date.now();
var gameTime = 0;
var score = 0;

//Game Objects
var lastKey = '';
var lastDirection = '';
var monstersKilled = 0;
var roomsTraveled = 0;
var currentHealth = 100;
var maxhealth = 100;
var terrainPattern;
var monsters = [];
var dropItems = [];
var weapons = [];
var weaponsAnimations = [];
var jsonTerrain = [];
var bloods = [];
var mapObj = {
    pos: [0, 0]
}
var guy = {
    pos: [canvas.width / 2, canvas.height / 2],
    size: [140, 185],
    sprite: new Sprite('../Content/GameContent/Images/bastion_sprite_sheet1.png', [10, 2], [160, 135], 24, [0], null, false, true)
}
var weapon = {
    pos: [450, 450],
    sprite: new Sprite('../Content/GameContent/Images/sprites.png', [0, 117], [39, 39], 16, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], null, false, true)
}
var levelExit = {
    pos: [1500, 900],
    image: '../Content/GameContent/Images/Red_Portal.png'
}

//Game Constants (Speed in pixels per second)
var playerSpeed = 600;
var playerWidth = 140;
var playerHeight = 185;
var playerCollisionWidth = 10;
var playerCollisionHeight = 10;
var playerAttackSpeed = 300;
var enemySpeed = 100;

////////////////////////
// Asynchronous Calls //
////////////////////////

//loading Room with Monsters and Terrain
function loadRoom() {
    $.getJSON("/Game/GenerateRoom", function (json) {
        jsonRoom = json;

        terrainPattern = jsonRoom.Image;
        mapWidth = jsonRoom.Width;
        mapHeight = jsonRoom.Height;

        for (var m in jsonRoom.monsters) {
            jsonRoom.monsters[m].posX = jsonRoom.monsters[m].StartPosition.X + mapObj.pos[0];
            jsonRoom.monsters[m].posY = jsonRoom.monsters[m].StartPosition.Y + mapObj.pos[1];
            jsonRoom.monsters[m].width = jsonRoom.monsters[m].Width;
            jsonRoom.monsters[m].height = jsonRoom.monsters[m].Height;
            jsonRoom.monsters[m].currentHealth = jsonRoom.monsters[m].MaxHealth;
            monsters.push(jsonRoom.monsters[m]);
        }

        for (var t in jsonRoom.TerrainObjects) {
            jsonRoom.TerrainObjects[t].posX = jsonRoom.TerrainObjects[t].X + mapObj.pos[0];
            jsonRoom.TerrainObjects[t].posY = jsonRoom.TerrainObjects[t].Y + mapObj.pos[1];
            jsonTerrain.push(jsonRoom.TerrainObjects[t]);
        }

        levelExit.pos[0] = 1500 + mapObj.pos[0];
        levelExit.pos[1] = 900 + mapObj.pos[1];
    });
};

// expects to recieve two ints first is monsters killed, then rooms traveled.
function updateKilledAndTraveled(jsonStats) {
    $.ajax({
        type: "POST",
        url: '/Game/UpdateRoomTraveledAndMonstersKilled',
        data: { list: jsonStats },
        cache: false,
        dataType: "json",
        //error: function (x, e, data) {
        //    alert(data);
        //}
    });
    roomsTraveled = 0;
    monstersKilled = 0;
}

// expects to recieve two ints first is attack, then defense.
function updateItemPickedUp(jsonStats) {
    //$.ajax({
    //    type: "POST",
    //    url: '/Game/UpdateUser',
    //    data: { list: jsonStats },
    //    cache: false,
    //    dataType: "json",
    //});
}

function loadUser() {
    $.getJSON("/Game/GetUser", function (json) {
        guy.level = json.Level;
        guy.attack = json.Attack;
        guy.defense = json.Defense;
    });
}

function unLoadRoom() {
    monsters = [];
    jsonTerrain = [];
    levelExit.pos = [];
}

//////////////////////
// Game Functions   //
//////////////////////

//Initial Setup (Loading of assets)
resources.load([
    '../Content/GameContent/Images/sprites.png',
    '../Content/GameContent/Images/blood_sprite6.png',
    '../Content/GameContent/Images/terrain.png',
    '../Content/GameContent/Images/bastion_sprite_sheet1.png',
    '../Content/GameContent/Images/attack_sprite.png',
    '../Content/GameContent/Images/Red_Portal.png',
    '../Content/GameContent/Images/teleporter.gif',
    '../Content/GameContent/Images/powerup.png'
]);
resources.onReady(init);

// A cross-browser requestAnimationFrame
var requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

function init() {
    loadUser();
    loadRoom();
    lastTime = Date.now();
    main();
}

//The main game loop
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    update(dt);
    render();
    lastTime = now;
    requestAnimFrame(main);
};

// Update game objects
function update(dt) {
    gameTime += dt;
    handleInput(dt);
    updateEntities(dt);
    checkCollisions(dt);
    //Update score here
};

//Character Movement
function handleInput(dt) {
    if (input.isDown('UP') || input.isDown('w')) {
        if (lastKey != 'UP') {
            guy.sprite = new Sprite('../Content/GameContent/Images/bastion_sprite_sheet1.png', [10, 142], [160, 135], 24, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40], null, false, false);
        }
        if (mapObj.pos[1] < canvas.height / 2) {
            for (var i = 0; i < monsters.length; i++) {
                monsters[i].posY += playerSpeed * dt;
            }
            for (var i = 0; i < jsonTerrain.length; i++) {
                jsonTerrain[i].posY += playerSpeed * dt;
            }
            mapObj.pos[1] += playerSpeed * dt;
            levelExit.pos[1] += playerSpeed * dt;
        }
        lastKey = 'UP';
        lastDirection = 'UP';
    }
    else if (input.isDown('DOWN') || input.isDown('s')) {
        if (lastKey != 'DOWN') {
            guy.sprite = new Sprite('../Content/GameContent/Images/bastion_sprite_sheet1.png', [10, 426], [160, 135], 24, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40], null, false, false);
        }
        if (mapObj.pos[1] > -mapHeight + playerHeight + (canvas.height / 2)) {
            for (var i = 0; i < monsters.length; i++) {
                monsters[i].posY -= playerSpeed * dt;
            }
            for (var i = 0; i < jsonTerrain.length; i++) {
                jsonTerrain[i].posY -= playerSpeed * dt;
            }
            mapObj.pos[1] -= playerSpeed * dt;
            levelExit.pos[1] -= playerSpeed * dt;
        }
        lastKey = 'DOWN';
        lastDirection = 'DOWN';
    }
    else if (input.isDown('RIGHT') || input.isDown('a')) {
        if (lastKey != 'RIGHT') {
            guy.sprite = new Sprite('../Content/GameContent/Images/bastion_sprite_sheet1.png', [10, 2], [160, 135], 24, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40], null, false, false);
        }
        if (mapObj.pos[0] > -mapWidth + playerWidth + (canvas.width / 2)) {
            for (var i = 0; i < monsters.length; i++) {
                monsters[i].posX -= playerSpeed * dt;
            }
            for (var i = 0; i < jsonTerrain.length; i++) {
                jsonTerrain[i].posX -= playerSpeed * dt;
            }
            mapObj.pos[0] -= playerSpeed * dt;
            levelExit.pos[0] -= playerSpeed * dt;
        }
        lastKey = 'RIGHT';
        lastDirection = 'RIGHT';
    }
    else if (input.isDown('LEFT') || input.isDown('d')) {
        if (lastKey != 'LEFT') {
            guy.sprite = new Sprite('../Content/GameContent/Images/bastion_sprite_sheet1.png', [10, 284], [159, 135], 24, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40], null, false, false);
        }
        if (mapObj.pos[0] < canvas.width / 2) {

            for (var i = 0; i < monsters.length; i++) {
                monsters[i].posX += playerSpeed * dt;
            }
            for (var i = 0; i < jsonTerrain.length; i++) {
                jsonTerrain[i].posX += playerSpeed * dt;
            }
            mapObj.pos[0] += playerSpeed * dt;
            levelExit.pos[0] += playerSpeed * dt;
        }
        lastKey = 'LEFT';
        lastDirection = 'LEFT';
    }
    else {
        if (lastKey == 'RIGHT') {
            guy.sprite = new Sprite('../Content/GameContent/Images/bastion_sprite_sheet1.png', [10, 2], [160, 135], 24, [0], null, false, true);
        } else if (lastKey == 'LEFT') {
            guy.sprite = new Sprite('../Content/GameContent/Images/bastion_sprite_sheet1.png', [10, 284], [160, 135], 24, [0], null, false, true);
        } else if (lastKey == 'UP') {
            guy.sprite = new Sprite('../Content/GameContent/Images/bastion_sprite_sheet1.png', [10, 142], [160, 135], 24, [0], null, false, true);
        } else if (lastKey == "DOWN") {
            guy.sprite = new Sprite('../Content/GameContent/Images/bastion_sprite_sheet1.png', [10, 426], [160, 135], 24, [0], null, false, true);
        }
        lastKey = 'empty';
    }
    if (input.isDown('SPACE') && Date.now() - lastFire > playerAttackSpeed) {
        if (lastDirection == 'RIGHT') {
            weapon.pos[0] = guy.pos[0] + 150;
            weapon.pos[1] = guy.pos[1] + 50;
        } else if (lastDirection == 'LEFT') {
            weapon.pos[0] = guy.pos[0] - guy.size[0] / 2;
            weapon.pos[1] = guy.pos[1] + 50;
        } else if (lastDirection == 'UP') {
            weapon.pos[0] = guy.pos[0] + 50;
            weapon.pos[1] = guy.pos[1] - 50;
        } else if (lastDirection == 'DOWN') {
            weapon.pos[0] = guy.pos[0] + 50;
            weapon.pos[1] = guy.pos[1] + 150;
        }

        weapon.sprite = new Sprite('../Content/GameContent/Images/sprites.png', [0, 117], [39, 39], 16, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], null, true, true);
        weapons.push(weapon);
        weaponsAnimations.push(weapon);

        lastFire = Date.now();
    }
}

function updateEntities(dt) {

    guy.sprite.update(dt);

    //TODO: Change weapons positions so that they stay stationary

    //TODO: Update monsters positions

    updateLocations(dt, bloods, true);
    updateLocations(dt, dropItems, false);

    //update the weapons animations
    for (var i = 0; i < weaponsAnimations.length; i++) {
        weaponsAnimations[i].sprite.update(dt);
        if (weaponsAnimations[i].sprite.done) {
            weaponsAnimations.splice(i, 1);
            i--;
        }
    }

    //update the weapons
    for (var i = 0; i < weapons.length; i++) {
        weapons[i].sprite.update(dt);
        if (weapons[i].sprite.done) {
            weapons.splice(i, 1);
            i--;
        }
    }
}

function updateLocations(dt, entityList, isAnimated) {
    for (var i = 0; i < entityList.length; i++) {
        if (lastKey == 'DOWN') {
            entityList[i].pos[1] -= playerSpeed * dt;
        } else if (lastKey == 'UP') {
            entityList[i].pos[1] += playerSpeed * dt;
        } else if (lastKey == 'RIGHT') {
            entityList[i].pos[0] -= playerSpeed * dt;
        } else if (lastKey == 'LEFT') {
            entityList[i].pos[0] += playerSpeed * dt;
        }

        if (isAnimated) {
            entityList[i].sprite.update(dt);
            if (entityList[i].sprite.done) {
                entityList.splice(i, 1);
                i--;
            }
        }
    }
}

// Collisions
function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 || b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1], pos[0] + size[0], pos[1] + size[1], pos2[0], pos2[1], pos2[0] + size2[0], pos2[1] + size2[1]);
}

function checkCollisions(dt) {

    var entityPos;
    var entitySize;
    var characterPos;
    var characterSize;
    var weaponPos;
    var weaponSize;

    //Check collision (bounding boxes) of terrain objects
    for (var i = 0; i < jsonTerrain.length; i++) {
        entityPos = [jsonTerrain[i].posX, jsonTerrain[i].posY];
        entitySize = [jsonTerrain[i].Width, jsonTerrain[i].Height];

        characterPos = [canvas.width / 2, canvas.height / 2 + 90]; //the +90 moves the collision box closer to the player's feet
        characterSize = [playerCollisionWidth, playerCollisionHeight];

        if (boxCollides(entityPos, entitySize, characterPos, characterSize)) {
            repositionPlayer(dt);
        }
    }

    //Check collision for monsters
    for (var i = 0; i < monsters.length; i++) {
        entityPos = [monsters[i].posX, monsters[i].posY];
        entitySize = [monsters[i].width, monsters[i].height];

        characterPos = [canvas.width / 2, canvas.height / 2 + 90]; //the +90 moves the collision box closer to the player's feet
        characterSize = [playerCollisionWidth, playerCollisionHeight];

        //if player is in the bounding box of the monster, check for collision
        if (boxCollides(entityPos, entitySize, characterPos, characterSize)) {
            checkRealCollisionBox(dt, monsters[i]);
        }
    }

    //for (var i = 0; i < dropItems.length; i++) {
    //    entityPos = [dropItems[i].posX, dropItems[i].posY];
    //    entitySize = [dropItems[i].sprite.size[0], dropItems[i].sprite.size[1]];

    //    characterPos = [canvas.width / 2, canvas.height / 2 + 90]; //the +90 moves the collision box closer to the player's feet
    //    characterSize = [playerCollisionWidth, playerCollisionHeight];

    //    //if player is in the bounding box of the item, pick it up and update his stats
    //    if (boxCollides(entityPos, entitySize, characterPos, characterSize)) {
    //        guy.attack = guy.attack + dropItems[i].Attack * 1;
    //        guy.defense = guy.attack + dropItems[i].Defense * 1;
    //        updateItemPickedUp([dropItems[i].Attack, dropItems[i].Defense]);
    //        dropItems.splice(i, 1);
    //        i--;
    //    }
    //}

    //Check collisions between weapons and monsters
    for (var i = 0; i < monsters.length; i++) {
        entityPos = [monsters[i].posX, monsters[i].posY];
        entitySize = [monsters[i].width, monsters[i].height];

        for (var j = 0; j < weapons.length; j++) {
            weaponPos = weapons[j].pos;
            weaponSize = weapons[j].sprite.size;
            if (boxCollides(entityPos, entitySize, weaponPos, weaponSize)) {
                monsters[i].currentHealth -= guy.attack;
                if (monsters[i].currentHealth <= 0) {

                    monstersKilled++;
                    // Make it rain blood
                    bloods.push({
                        pos: entityPos,
                        sprite: new Sprite('../Content/GameContent/Images/blood_sprite6.png', [0, 0], [249, 240], 24, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], null, true, true)
                    });
                    //If the monster has an item, add it to the array of Items
                    if (monsters[i].DropItem != null) {
                        var powerUp = new Image();
                        powerUp.src = "../Content/GameContent/Images/powerup.png";
                        dropItems.push({
                            //image: powerUp,
                            sprite: new Sprite('../Content/GameContent/Images/powerup.png', [0, 0], [105, 152], 1, [0], null, false, true),
                            attack: monsters[i].DropItem.Attack,
                            defense: monsters[i].DropItem.Defense,
                            pos: [monsters[i].posX, monsters[i].posY]
                        });
                    }

                    monsters.splice(i, 1);
                    i--;
                }
                //Weapon can only damage one monster, so remove it after it collides
                weapons.splice(j, 1);
                break;
            }
        }
        //Check player walking over an item


        // levelExit detection w/ portal
        var pos = [];
        pos.push(levelExit.pos[0] + 150);
        pos.push(levelExit.pos[1] + 200);
        var size = [];
        size.push(50);
        size.push(100);

        var size2 = [50, 50];
        var pos2 = [];
        pos2.push(canvas.width / 2);
        pos2.push(canvas.height / 2);

        if (boxCollides(pos, size, pos2, size2)) {
            roomsTraveled = roomsTraveled + 1;
            unLoadRoom();
            var jsonStats = [monstersKilled, roomsTraveled];
            updateKilledAndTraveled(jsonStats);
            mapObj.pos = [400, 400];
            loadRoom();
        }

        //TODO: Player takes damage if he collides with a monster
    }
}

function checkRealCollisionBox(dt, entity) {
    var entityPos = [entity.posX + entity.CollisionX, entity.posY];
    var entitySize = [entity.CollisionWidth, entity.CollisionHeight];

    var characterSize = [playerCollisionWidth, playerCollisionHeight];
    var characterPos = [canvas.width / 2, canvas.height / 2];

    //if player is in the bounding box of the monster, check for collision
    //TODO: make this deal damage to the player
    if (boxCollides(entityPos, entitySize, characterPos, characterSize)) {
        repositionPlayer(dt);
    }
}

function repositionPlayer(dt) {
    if (lastKey == 'DOWN') {
        mapObj.pos[1] += playerSpeed * dt;
        levelExit.pos[1] += playerSpeed * dt;

        for (var i = 0; i < monsters.length; i++) {
            monsters[i].posY += playerSpeed * dt;
        }
        for (var i = 0; i < jsonTerrain.length; i++) {
            jsonTerrain[i].posY += playerSpeed * dt;
        }
    } else if (lastKey == 'UP') {
        mapObj.pos[1] -= playerSpeed * dt;
        levelExit.pos[1] -= playerSpeed * dt;

        for (var i = 0; i < monsters.length; i++) {
            monsters[i].posY -= playerSpeed * dt;
        }
        for (var i = 0; i < jsonTerrain.length; i++) {
            jsonTerrain[i].posY -= playerSpeed * dt;
        }
    } else if (lastKey == 'RIGHT') {
        mapObj.pos[0] += playerSpeed * dt;
        levelExit.pos[0] += playerSpeed * dt;

        for (var i = 0; i < monsters.length; i++) {
            monsters[i].posX += playerSpeed * dt;
        }
        for (var i = 0; i < jsonTerrain.length; i++) {
            jsonTerrain[i].posX += playerSpeed * dt;
        }
    } else if (lastKey == 'LEFT') {
        mapObj.pos[0] -= playerSpeed * dt;
        levelExit.pos[0] -= playerSpeed * dt;

        for (var i = 0; i < monsters.length; i++) {
            monsters[i].posX -= playerSpeed * dt;
        }
        for (var i = 0; i < jsonTerrain.length; i++) {
            jsonTerrain[i].posX -= playerSpeed * dt;
        }
    }
}

// Draw everything
function render() {
    //Black background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var map = new Image();
    map.src = terrainPattern;

    //Draw the map
    ctx.drawImage(map, mapObj.pos[0], mapObj.pos[1]);

    //Draw dropItems
    renderEntities(dropItems);
    //Draw the monsters' health bars
    for (var i = 0; i < monsters.length; i++) {
        drawHealthBar(monsters[i]);

    }
    //Draw the monsters
    //TODO: Add these to updateEntities and draw them from there
    for (var i = 0; i < monsters.length; i++) {

        var m = new Image();
        m.src = monsters[i].Image;
        ctx.drawImage(m, monsters[i].posX, monsters[i].posY);

    }

    //Draw the terrain objects
    //TODO: Add these to updateEntities and draw them from there
    for (var i = 0; i < jsonTerrain.length; i++) {
        var t = new Image();
        t.src = jsonTerrain[i].Image;
        ctx.drawImage(t, jsonTerrain[i].posX, jsonTerrain[i].posY);
    }

    var levelExitImage = new Image();
    levelExitImage.src = levelExit.image;
    ctx.drawImage(levelExitImage, levelExit.pos[0], levelExit.pos[1]);

    renderEntity(guy);
    PlayerHealthDisplay();
    //renderEntities(weapons);
    renderEntities(weaponsAnimations);
    renderEntities(bloods);
};

function renderEntities(list) {
    for (var i = 0; i < list.length; i++) {
        renderEntity(list[i]);
    }
}

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}

///////////////////////
// Monster Functions //
///////////////////////

function drawHealthBar(monster) {
    //healthbar border
    ctx.fillStyle = "#000000";
    ctx.fillRect(monster.posX - 1, monster.posY + monster.height + 24, monster.width + 2, 10);

    //damage
    ctx.fillStyle = "#b61c1c";
    ctx.fillRect(monster.posX, monster.posY + monster.height + 25, monster.width, 8);

    //remaining life
    ctx.fillStyle = "#455cbf";
    ctx.fillRect(monster.posX, monster.posY + monster.height + 25, getHealthBarSize(monster.width, monster.currentHealth, monster.MaxHealth), 8);
}
function getHealthBarSize(monsterWidth, currentHealth, maxHealth) {
    return monsterWidth * (currentHealth / maxHealth);
}


///////////////////////
// UI Functions      //
///////////////////////

function UIUsername() {

}

function UIUserStats() {

}

function UIUserScore() {

}

function PlayerHealthDisplay() {
    //healthbar border
    ctx.fillStyle = "#000000";
    ctx.fillRect((canvas.width / 2) - 100 - 2, 700 - 2, 200 + 4, 20);

    //damage
    ctx.fillStyle = "#b61c1c";
    ctx.fillRect((canvas.width / 2 - 100), 700, 200, 16);

    //remaining life
    ctx.fillStyle = "#455cbf";
    ctx.fillRect((canvas.width / 2 - 100), 700, (200 * (currentHealth / maxhealth)), 16);
}