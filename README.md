# TL2
I am writing a game.  I have been chewing on this game idea for years, and it has gone through many revisions.  
I am a web developer, so I am writing this in a method that will be cross platform.
Currently this is raw html, css, and js.  I have plans to eventually make this based on PHP.

Intent is to have Catan-style resources in hexagons.  Depending on how those are arranged in your village, different units will be in your army.  Every unit is at an intersection of 3 hexes, you cannot make a unit with only 2 hexagons.

There are 6 hexagon "resources" that condense to 3 "types" with a rock-paper-scissor relation.  Hard (iron, stone) beats Fast (forest, pasture) beats Magic (tar, flax) beats Hard.
That means, we can have 56 different possible combinations but really only 10 combat types:

- Elemental/Pure: 3 0 0  - all one type
- Advantage: 2 1 0 - in the ratio of 2 hard 1 fast (hard beats fast)
- Auxiliary: 1 2 0 - in the ratio of 1 hard 2 fast (fast beats magic)
- Normal: 1 1 1 - a few pictures for this, but it is the generic type

Damage is calculated based on ratios of the 3 types in the two units fighting.

