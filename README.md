# [Advent of Code 2024](https://adventofcode.com/2024)

Going with javascript (typescript) again this year (last time was 2021), but this time with the
aim of having each solution run in the browser and having the option to using the DOM for
possible visualizatons...?

## Days

#### 1 - Historian Hysteria

Most effort was spent on setting up the general UI and Worker for the rest of the challenge, although I did also go back to tidy both parts afterwards.

Leant on `sort` for part 1 and `reduce` for both parts.

#### 2 - Red-Nosed Reports

I saw tidier ways of checking all the intervals were safe in terms of both magnitude and direction on Reddit, but I think my approach was alright.

I'm surprised I jumped so many places between part 1 and 2 by just nesting a loop to enumerate the modified lists - I realised the edge case of duplicate solutions fairly quickly I guess.

#### 3 - Mull It Over

Nice little regex puzzle. Got really good re-use from part 1 in part 2, with the trick being to do two rounds of `split` with the start and stop commands, discarding all string parts after any stop command.

Didn't get time to start until late evening, so very poor placement today (>80k for part 2).

#### 4 - Ceres Search

Think this went quite well and I enjoyed the twist for part 2. Solution could probably be a bit faster by manually setting the search bounds at the edge of the grid instead of just catching the `TypeError` on out of range rows.

#### 5 - Print Queue

Think I may have over-complicated part 1 here. Ended up making a map of all the rules such that any page could be compared to any other to check if a rule was being broken. Part 2 was nice once I'd checked the Array docs for how to write a sort comparator.

The confusion of having things being before or after other things whilst doing nested looping in different directions hurt my brain. I miss the regex puzzle...

#### 6 - Guard Gallivant

This took me far too long trying to implement an aproach that 'jumped' from obstacle to obstacle in part 1 and then having to write the straightforward stepping logic for part 2 regardless.

Part 2 runs very slowly (~15 seconds), which could be hugely improved by storing the grid state from just before each loop is detected so as not to re-walk the path 5000+ times.

#### 7 - Bridge Repair

While trying to come up with a nice way of gererating the permutations with just loops, I realised that I could just use the binary representation of the count of the permutations. This ended up translating very nicely to part two, just by changing the base to ternary and adding in the new operator. Much nicer after Day 6.
