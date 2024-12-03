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
