//http://localhost:4000?stomp

title = "STOMP";

description = `
[Tap]  STOMP
`;

const G = {
  WIDTH: 150,
  HEIGHT: 100,
  FLOORHEIGHT: 87,
  CRITTER_SPEED_MIN: 0.5,
	CRITTER_SPEED_MAX: 1.0,
  CRITTER_SPEEDUP: 3,
  STOMP_TICKS: 60,
  CRITTER_TICKS: 300
};

characters = [
`
 llll
lll ll
 llll
  ll
l ll l
llllll
`
, 
`
 rrrr
rrllrr
rrrrrr
r rr r
r rr r
r rr r
`
];

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  isReplayEnabled: true,
  isPlayingBgm: true
};

/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} Critter
 */

/**
 * @type { Critter [] }
 */
let critters;

/**
 * @typedef {{
 * pos: Vector,
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

let playerVel = -2
let playerFallSpeed = .05
let canStomp = false
let stompTicks = G.STOMP_TICKS
let critterTicks = G.CRITTER_TICKS

function update() { 
  // init function
  ////////////////////////////////////////////////////////////////////////////////////
  if (!ticks) {
    // A CrispGameLib function
    // First argument (number): number of times to run the second argument
    // Second argument (function): a function that returns an object. This
    // object is then added to an array. This array will eventually be
    // returned as output of the times() function.
		critters = times(20, () => {
      // Random number generator function
      // rnd( min, max )
      const posX = rnd(0, G.WIDTH);
      const posY = G.FLOORHEIGHT;
      // An object of type Star with appropriate properties
      return {
          // Creates a Vector
          pos: vec(posX, posY),
          // More RNG
          // speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX)
          speed: G.CRITTER_SPEED_MAX
      };
    });

    player = {
      pos: vec(G.WIDTH * 0.25, G.HEIGHT * 0.25)
    };
  }
  ///////////////////////////////////////////////////////////////

  // Update for Star
  critters.forEach((c) => {
    // Move the star downwards
    c.pos.x -= c.speed;
    // Bring the star back to top once it's past the bottom of the screen
    if (c.pos.x < 0) c.pos.x = G.WIDTH;

    // Choose a color to draw
    // color("light_black");
    // Draw the star as a square of size 1
    // box(c.pos, 1);
    char("b", c.pos)

    if (c.speed > G.CRITTER_SPEED_MAX){
      c.speed -= c.speed/50
    }
  });


  // update the players position for rising or falling
  player.pos.y += playerVel;

  // simulate gravity by eventually having the fall speed be negative
  playerVel += playerFallSpeed;

  // The player
  char("a", player.pos);

  // The ground
  rect(0, 90 , 150, 10);

  remove(critters, (c) => {
    // e.pos.y += currentEnemySpeed;
    color("black");
    // Shorthand to check for collision against another specific type
    // Also draw the sprite
    const isCollidingWithPlayer = char("b", c.pos).isColliding.char.a;

    // Check whether to make a small particle explosin at the position
    // Also bounces the player up again
    if (isCollidingWithPlayer) {
        play("explosion");
        color("yellow");
        particle(c.pos);
        // playerVel = -2.5
        addScore(10, c.pos)
        critters.forEach((c) => {
          c.speed += G.CRITTER_SPEEDUP
        })
        playerVel = (c.speed / 2) * -1

    }

    // Removes the object
    return (isCollidingWithPlayer);
  });

  //STOMP
  if (input.isJustPressed && canStomp == true){
    // make the stomp more responsive
    if (player.pos.y < -5){
      player.pos.y = -5
    }
    play("laser");
    playerVel = 7
    canStomp = false;
    stompTicks = G.STOMP_TICKS
  }

  stompTicks--

  if ((stompTicks < 0)&&(canStomp == false)){
    play("select")
    canStomp = true;
  }

  // if (critterTicks < 0){
  //   critters.push()
  // }

  //If you hit the floor game over
  if (char("a", player.pos).isColliding.rect.black){
    play("hit");
    end();
  }

} 
