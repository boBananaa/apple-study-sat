// Original tutorial examples, not official SAT question-bank material.
// These short lessons supplement practice; checks are not scaled-score estimates.
const math = 'Math';
const rw = 'Reading and Writing';

export const LESSONS = [
  {
    id: 'area-volume', section: math, skill: 'Area and Volume',
    title: 'Separate length, area, and volume', minutes: 7,
    intro: 'Name the requested measurement before choosing a formula. Length uses units, area uses square units, and volume uses cubic units.',
    steps: ['List the given dimensions and their units.', 'Choose a formula for the requested shape and measurement.', 'Substitute, then label the answer with the correct power of the unit.'],
    worked: {prompt: 'A rectangular tank has a base 8 cm long and 5 cm wide. Its volume is 120 cubic centimeters. What is its height in centimeters?', setup: 'V = lwh, so 120 = 8 × 5 × h.', solution: 'The base area is 40 square centimeters. Divide 120 by 40 to get h = 3 cm.', trap: 'The base area, 40, is an intermediate result. The question asks for height.'},
    rule: 'Draw the shape, write the requested quantity beside it, and check the units at the end.',
    check: {prompt: 'A rectangular prism has length 6, width 4, and volume 72. What is its height?', answer: '3', explanation: '72 = 6 × 4 × h, so h = 72/24 = 3.'}, prerequisites: []
  },
  {
    id: 'circles', section: math, skill: 'Circles',
    title: 'Read the center and radius', minutes: 7,
    intro: 'A circle equation encodes its center and the square of its radius: (x − h)² + (y − k)² = r².',
    steps: ['Match the equation to standard form.', 'Reverse the signs inside the parentheses to locate the center.', 'Take the positive square root of the right side for the radius.'],
    worked: {prompt: 'What is the radius of the circle (x − 3)² + (y + 2)² = 49?', setup: 'r² = 49, while the center is (3, −2).', solution: 'The radius is √49 = 7.', trap: '49 is the radius squared. The center coordinates do not give the radius.'},
    rule: 'Inside the parentheses: opposite signs for the center. Outside: square root for the radius.',
    desmos: 'Graph the equation and check that the distance from the center to an edge matches the radius.',
    check: {prompt: 'The circle (x + 4)² + (y − 1)² = 36 has what radius?', answer: '6', explanation: 'The right side is r², so r = √36 = 6.'}, prerequisites: ['nonlinear-equations']
  },
  {
    id: 'equivalent-expressions', section: math, skill: 'Equivalent Expressions',
    title: 'Preserve value when rewriting', minutes: 6,
    intro: 'Equivalent expressions have the same value for every allowed input. Distribution and factoring change their form while preserving their value.',
    steps: ['Identify an outside factor or a shared inside factor.', 'Apply the operation to every term, keeping each sign.', 'Check the rewritten form with a convenient input.'],
    worked: {prompt: 'Rewrite 3(2x − 5) + 4x in the form ax + b. What is b?', setup: '3(2x − 5) + 4x = 6x − 15 + 4x.', solution: 'Combine like terms to get 10x − 15. Therefore b = −15.', trap: 'Multiplying only 2x by 3 misses the constant. The requested value is b, not a.'},
    rule: 'An outside multiplier reaches every term; combine only terms with the same variable part.',
    desmos: 'Graph both expressions as functions. Identical graphs support equivalence, but check any domain restrictions separately.',
    check: {prompt: 'Rewrite 4(3x − 2) − 5x as ax + b. What is a?', answer: '7', explanation: '12x − 8 − 5x = 7x − 8, so a = 7.'}, prerequisites: []
  },
  {
    id: 'statistical-claims', section: math, skill: 'Evaluating Statistical Claims',
    title: 'Match the claim to the study design', minutes: 6,
    intro: 'Random sampling supports generalizing to a population. Random assignment supports comparing treatments for a possible causal effect. They solve different problems.',
    steps: ['Identify how participants entered the sample.', 'Identify whether researchers randomly assigned treatments.', 'Limit the conclusion to what those choices support.'],
    worked: {prompt: 'Researchers randomly sample 200 students from a school and record sleep and grades. How many students were randomly assigned a sleep treatment?', setup: 'The study describes random selection, but no assigned treatment.', solution: '0 students were assigned a treatment. The data may show an association; this design alone does not establish that more sleep caused higher grades.', trap: 'Random sampling is not random assignment. A correlation does not by itself establish causation.'},
    rule: 'Ask two separate questions: who was sampled, and who assigned the treatment?',
    check: {prompt: 'A survey randomly selects 120 residents and asks about exercise. No treatment is assigned. How many residents were randomly assigned to a treatment?', answer: '0', explanation: 'Selection was random, but treatment assignment never occurred.'}, prerequisites: []
  },
  {
    id: 'one-variable-equations', section: math, skill: 'Linear Equations in One Variable',
    title: 'Turn a cost story into one equation', minutes: 7,
    intro: 'Define a variable with units, separate the fixed amount from the changing amount, and connect the total to both.',
    steps: ['State what the variable measures.', 'Translate the fixed amount and the per-unit amount separately.', 'Solve and answer the quantity named in the question.'],
    worked: {prompt: 'A repair service charges $35 plus $18 per hour. A bill is $125. How many hours were charged?', setup: 'Let h be the hours. Total cost: 35 + 18h = 125.', solution: 'Subtract 35 to get 18h = 90. Divide by 18 to get h = 5 hours.', trap: 'Dividing 125 by 18 includes the fixed fee in the hourly portion.'},
    rule: 'Fixed fee + (rate × quantity) = total. Write units for the variable before solving.',
    desmos: 'Graph y = 35 + 18x and y = 125. The intersection’s x-coordinate gives hours.',
    check: {prompt: 'A club charges a $24 fee plus $6 per visit. A member pays $66. How many visits did the member make?', answer: '7', explanation: '24 + 6v = 66, so 6v = 42 and v = 7.'}, prerequisites: ['equivalent-expressions']
  },
  {
    id: 'two-variable-equations', section: math, skill: 'Linear Equations in Two Variables',
    title: 'Keep each variable attached to its meaning', minutes: 6,
    intro: 'In a two-variable model, each coefficient belongs to a quantity. Units help you keep the terms in the right places.',
    steps: ['Define both variables and their units.', 'Multiply each quantity by its matching rate.', 'Substitute only the information that the question supplies.'],
    worked: {prompt: 'A store sells notebooks for $4 and pens for $2. A customer spends $30 on n notebooks and p pens. If n = 5, what is p?', setup: '4n + 2p = 30. Substitute n = 5: 20 + 2p = 30.', solution: '2p = 10, so p = 5 pens.', trap: 'n + p = 30 mixes an item count with a dollar total.'},
    rule: 'Every term in an equation must represent the same kind of quantity.',
    check: {prompt: 'Tickets cost $8 for adults and $5 for students. If 8a + 5s = 49 and a = 3, how many student tickets were sold?', answer: '5', explanation: '24 + 5s = 49 gives 5s = 25 and s = 5.'}, prerequisites: ['one-variable-equations']
  },
  {
    id: 'linear-functions', section: math, skill: 'Linear Functions',
    title: 'Read rates and intercepts in context', minutes: 8,
    intro: 'For y = mx + b, m is the change in y per unit of x, and b is the value of y when x = 0. An x-intercept answers a different question: when does y reach zero?',
    steps: ['Define the input x and output y.', 'Label m as the rate and b as the initial value.', 'Set the other coordinate to zero when finding an intercept.'],
    worked: {prompt: 'A tank contains L(t) = 84 − 7t liters after t minutes. After how many minutes is the tank empty?', setup: 'Empty means L(t) = 0, so 84 − 7t = 0.', solution: '7t = 84, so t = 12 minutes. This is the horizontal intercept (12, 0).', trap: '84 is the initial amount, the vertical intercept. −7 is the rate, not the time to empty.'},
    rule: 'Initial value: input zero. Zero output: solve for the horizontal intercept.',
    desmos: 'Graph y = 84 − 7x and select the x-intercept; translate its x-coordinate back into minutes.',
    check: {prompt: 'A machine costs C(h) = 45 + 12h dollars to rent for h hours. What is the fixed fee in dollars?', answer: '45', explanation: 'At h = 0, C(0) = 45. The 12 is the hourly charge.'}, prerequisites: ['one-variable-equations']
  },
  {
    id: 'linear-inequalities', section: math, skill: 'Linear Inequalities',
    title: 'Translate a limit before solving', minutes: 6,
    intro: 'At most means ≤. At least means ≥. If a quantity must be a whole number, interpret the boundary in context.',
    steps: ['Choose the inequality symbol from the words.', 'Solve; reverse the inequality when multiplying or dividing by a negative number.', 'Apply whole-number and nonnegative restrictions if the story requires them.'],
    worked: {prompt: 'A student has $50. Shipping costs $8 and each poster costs $7. What is the greatest number of posters the student can buy?', setup: '8 + 7p ≤ 50, with p a nonnegative whole number.', solution: '7p ≤ 42, so p ≤ 6. The greatest possible number is 6.', trap: 'An “at most” budget gives an upper bound. A fractional item count would need to be rounded down.'},
    rule: 'Translate the limit first; round toward a value that still satisfies it.',
    check: {prompt: 'A $35 budget must cover a $5 fee and $6 per item. What is the greatest whole number of items affordable?', answer: '5', explanation: '5 + 6n ≤ 35 gives n ≤ 5.'}, prerequisites: ['one-variable-equations']
  },
  {
    id: 'angles-triangles', section: math, skill: 'Lines, Angles, and Triangles',
    title: 'Label angle relationships', minutes: 6,
    intro: 'A triangle’s interior angles total 180°. Angles on a straight line also total 180°. Similar triangles have matching angles and proportional side lengths.',
    steps: ['Mark the given angles and any parallel-line relationships.', 'Write the relevant sum or equal-angle equation.', 'Check whether the question asks for an interior or exterior angle.'],
    worked: {prompt: 'A triangle has interior angles 48° and 67°. What is the exterior angle adjacent to the third angle?', setup: 'The third interior angle is 180 − 48 − 67 = 65°.', solution: 'The adjacent exterior angle is 180 − 65 = 115°. Equivalently, add the two remote interior angles: 48 + 67.', trap: '65° is the missing interior angle; the question asks for its exterior neighbor.'},
    rule: 'An exterior triangle angle equals the sum of the two remote interior angles.',
    check: {prompt: 'Two interior angles of a triangle are 35° and 85°. What is the third interior angle, in degrees?', answer: '60', explanation: '180 − 35 − 85 = 60.'}, prerequisites: []
  },
  {
    id: 'nonlinear-equations', section: math, skill: 'Nonlinear Equations and Systems',
    title: 'Keep every candidate, then verify', minutes: 8,
    intro: 'Quadratics, absolute values, and radical equations can produce multiple solutions. Some algebra steps also produce candidates that fail in the original equation.',
    steps: ['Choose factoring, square roots, or case splitting to create candidates.', 'Keep both signs when solving a square equation unless the context excludes one.', 'Substitute candidates into the original equation, especially after squaring.'],
    worked: {prompt: 'What is the sum of all solutions to |x − 4| = 7?', setup: 'x − 4 = 7 or x − 4 = −7.', solution: 'The solutions are 11 and −3. Their sum is 8.', trap: 'Keeping only the positive case misses a solution. Giving 11 alone also misses the requested sum.'},
    rule: 'Absolute value describes distance: split into two cases, then answer the requested combination.',
    desmos: 'Graph y = |x − 4| and y = 7. Both intersection x-values are solutions.',
    check: {prompt: 'What is the sum of the two solutions of x² − 5x + 6 = 0?', answer: '5', explanation: '(x − 2)(x − 3) = 0 gives 2 and 3, whose sum is 5.'}, prerequisites: ['equivalent-expressions', 'one-variable-equations']
  },
  {
    id: 'nonlinear-functions', section: math, skill: 'Nonlinear Functions',
    title: 'Distinguish additive and multiplicative change', minutes: 7,
    intro: 'A linear model adds a constant amount over equal intervals. An exponential model multiplies by a constant factor. Quadratic vertex form identifies a turning point.',
    steps: ['Check whether the change is a fixed amount or fixed percent.', 'For exponential change, write initial amount × factor raised to time.', 'Read the requested value, factor, or turning point from the model.'],
    worked: {prompt: 'A culture begins with 150 cells and doubles every hour. How many cells does the model predict after 3 hours?', setup: 'N(t) = 150 × 2^t, so N(3) = 150 × 2³.', solution: 'Three doubling steps give 150 → 300 → 600 → 1,200 cells.', trap: '150 + 2t models adding two cells per hour, not doubling.'},
    rule: 'Equal additions suggest linear growth; equal multipliers suggest exponential growth.',
    desmos: 'Use a table for y = 150·2^x at x = 0, 1, 2, and 3 to inspect the repeated factor.',
    check: {prompt: 'The height model is h(t) = −2(t − 3)² + 20. What is its maximum height?', answer: '20', explanation: 'The squared term is nonnegative, so −2(t − 3)² ≤ 0. The maximum is 20 at t = 3.'}, prerequisites: ['nonlinear-equations']
  },
  {
    id: 'one-variable-data', section: math, skill: 'One-Variable Data',
    title: 'Choose mean, median, or spread', minutes: 6,
    intro: 'The mean uses every value; the median is the middle of the ordered values. A large outlier can move the mean considerably while leaving the median unchanged.',
    steps: ['Sort values before finding a median.', 'For a mean, divide the sum by the number of values.', 'Decide which measure the question actually requests.'],
    worked: {prompt: 'The values are 4, 5, 5, 6, and 30. What is the median?', setup: 'The values are already ordered; there are five values.', solution: 'The third value is the middle value, so the median is 5. The mean would be 50/5 = 10.', trap: 'Averaging gives the mean, even when the question requests the median.'},
    rule: 'Median: order and find the middle. Mean: sum and divide.',
    check: {prompt: 'What is the mean of 6, 8, 10, and 12?', answer: '9', explanation: '(6 + 8 + 10 + 12)/4 = 36/4 = 9.'}, prerequisites: []
  },
  {
    id: 'percentages', section: math, skill: 'Percentages',
    title: 'Apply each percentage to its own base', minutes: 8,
    intro: 'A p% decrease keeps 1 − p/100 of the current value. Successive changes multiply their factors because the second change uses the new amount.',
    steps: ['Identify the base amount for each percentage.', 'Convert each increase or decrease into a multiplier.', 'Multiply in sequence, then distinguish final price from total savings.'],
    worked: {prompt: 'A $200 item is discounted 20%, then discounted another 10% from its new price. What is the final price?', setup: 'Final price = 200(0.80)(0.90).', solution: 'After the first discount the price is $160. The next price is 160 × 0.90 = $144.', trap: 'Adding 20% and 10% incorrectly treats both discounts as percentages of the original price. $56 is the savings, not the final price.'},
    rule: 'Successive percent changes multiply. A decrease keeps the complement of the percent.',
    check: {prompt: 'A $500 item receives a 10% discount and then a 20% discount from its new price. What is the final price in dollars?', answer: '360', explanation: '500 × 0.90 × 0.80 = 360. The combined reduction is 28%, not 30%.'}, prerequisites: ['rates-units']
  },
  {
    id: 'probability', section: math, skill: 'Probability',
    title: 'Choose the correct denominator', minutes: 6,
    intro: 'Probability is favorable outcomes divided by all eligible outcomes. A condition changes which outcomes are eligible.',
    steps: ['Identify the event and any given condition.', 'Restrict the denominator to the group allowed by that condition.', 'Count favorable outcomes within the same group.'],
    worked: {prompt: 'Of 20 club members, 12 are seniors. Of those seniors, 9 bike to school. A senior is selected at random. What is the probability that the selected student bikes to school?', setup: 'The eligible group is the 12 seniors, of whom 9 bike.', solution: 'The probability is 9/12 = 3/4 = 0.75.', trap: '9/20 answers a different question because the selection is restricted to seniors.'},
    rule: '“Given” or “among” narrows the denominator before you count the numerator.',
    check: {prompt: 'A bag contains 3 red, 5 blue, and 2 green tokens. What is the probability of selecting a blue token at random? Enter a decimal.', answer: '0.5', explanation: 'There are 10 tokens total and 5 blue tokens, so 5/10 = 0.5.'}, prerequisites: ['rates-units']
  },
  {
    id: 'rates-units', section: math, skill: 'Ratios, Rates, Proportions, and Units',
    title: 'Let the units guide the equation', minutes: 7,
    intro: 'A rate compares quantities with different units. Write the units beside each number so they show whether to multiply or divide.',
    steps: ['Write the requested unit before calculating.', 'Build a product or quotient whose units simplify to that unit.', 'Convert units once, and check whether the result is reasonable.'],
    worked: {prompt: 'A pump moves 18 liters in 3 minutes. At a constant rate, how many liters does it move in 8 minutes?', setup: 'Rate = 18 liters / 3 minutes = 6 liters per minute.', solution: '(6 liters/minute)(8 minutes) = 48 liters.', trap: '18/8 combines the amount from one interval with the duration of another.'},
    rule: 'Quantity = rate × time. Units should cancel until only the requested unit remains.',
    check: {prompt: 'A car travels 150 miles in 3 hours at constant speed. How many miles does it travel in 2 hours?', answer: '100', explanation: '150/3 = 50 miles per hour; 50 × 2 = 100 miles.'}, prerequisites: []
  },
  {
    id: 'right-triangles', section: math, skill: 'Right Triangles and Trigonometry',
    title: 'Label sides from the chosen angle', minutes: 7,
    intro: 'The hypotenuse is opposite the right angle. Opposite and adjacent depend on which acute angle you choose.',
    steps: ['Mark the right angle and hypotenuse.', 'Label opposite and adjacent relative to the angle in the question.', 'Choose sine, cosine, tangent, or the Pythagorean theorem to connect the given sides.'],
    worked: {prompt: 'A right triangle has legs 9 and 12. What is its hypotenuse?', setup: 'c² = 9² + 12² = 81 + 144.', solution: 'c² = 225, so c = 15. Length is positive.', trap: 'The Pythagorean theorem adds squares of the legs, not the lengths themselves.'},
    rule: 'SOH-CAH-TOA works only after you choose the angle and label its sides.',
    desmos: 'For angles stated in degrees, switch Desmos to degree mode before using trigonometric functions.',
    check: {prompt: 'A right triangle has hypotenuse 13 and one leg 5. What is the other leg?', answer: '12', explanation: 'b² = 13² − 5² = 169 − 25 = 144, so b = 12.'}, prerequisites: ['angles-triangles', 'nonlinear-equations']
  },
  {
    id: 'sampling-margin', section: math, skill: 'Sample Statistics and Margin of Error',
    title: 'Interpret an estimate with uncertainty', minutes: 6,
    intro: 'A margin of error gives an interval around a sample estimate. It describes sampling uncertainty under the study’s assumptions, not a guarantee about every individual.',
    steps: ['Identify the estimated population quantity.', 'Subtract and add the margin of error using the same units.', 'Remember that larger random samples generally reduce sampling uncertainty.'],
    worked: {prompt: 'A random survey estimates support at 54%, with a margin of error of 4 percentage points. What is the lower end of the reported interval, as a percent?', setup: 'Lower end = 54% − 4 percentage points.', solution: 'The reported interval is 50% to 58%; its lower end is 50%.', trap: 'A margin of 4 percentage points is not 4% of 54. The interval also does not claim that 54% of every sample must agree.'},
    rule: 'Estimate ± margin gives the interval. Keep percent and percentage points distinct.',
    check: {prompt: 'An estimate is 62%, with a margin of error of 3 percentage points. What is the upper endpoint, as a percent? Enter the number only.', answer: '65', explanation: '62 + 3 = 65%.'}, prerequisites: ['statistical-claims', 'percentages']
  },
  {
    id: 'linear-systems', section: math, skill: 'Systems of Linear Equations',
    title: 'Use a total equation and a content equation', minutes: 9,
    intro: 'Mixture problems often track two totals: the total amount of mixture and the amount of a particular ingredient. Each equation must use consistent units.',
    steps: ['Define a variable for each amount being mixed.', 'Write one equation for total volume and one for ingredient amount.', 'Solve, then check both the amount and the requested variable.'],
    worked: {prompt: 'A lab mixes a 10% salt solution and a 30% salt solution to make 20 liters of a 25% solution. How many liters of the 30% solution are needed?', setup: 'Let x be liters of 10% solution and y liters of 30% solution. x + y = 20 and 0.10x + 0.30y = 0.25(20).', solution: 'Substitute x = 20 − y: 2 − 0.10y + 0.30y = 5. Then 0.20y = 3, so y = 15 liters. The other amount is 5 liters.', trap: 'Averaging 10% and 30% assumes equal amounts. Reporting 5 liters gives the other solution’s amount.'},
    rule: 'For a mixture, conserve total amount and total ingredient separately.',
    desmos: 'Graph x + y = 20 and 0.10x + 0.30y = 5. Read the y-coordinate for the 30% solution.',
    check: {prompt: 'A 10-liter mixture uses 20% and 50% solutions to make a 38% solution. How many liters of the 50% solution are used?', answer: '6', explanation: 'Let y be the 50% amount. 0.20(10 − y) + 0.50y = 3.8, so 0.30y = 1.8 and y = 6.'}, prerequisites: ['two-variable-equations', 'percentages']
  },
  {
    id: 'two-variable-data', section: math, skill: 'Two-Variable Data',
    title: 'Read a fitted line as a prediction', minutes: 6,
    intro: 'A line of best fit describes a trend, so its output is a prediction. A residual compares an actual observation with the predicted value.',
    steps: ['Identify the explanatory input and the predicted output.', 'Substitute the given input into the fitted model.', 'For a residual, calculate actual minus predicted.'],
    worked: {prompt: 'A fitted model predicts a plant’s height in centimeters as h = 2d + 7 after d days. At day 4 the measured height is 17 cm. What is the residual?', setup: 'Predicted height at d = 4 is 2(4) + 7 = 15.', solution: 'Residual = actual − predicted = 17 − 15 = 2 cm.', trap: 'Predicted minus actual reverses the sign. A model prediction need not equal every observed value.'},
    rule: 'Residual = actual − predicted. A point above the fitted line has a positive residual.',
    desmos: 'Enter paired data in a table and use y₁ ~ mx₁ + b for a linear regression. Use the fitted line to calculate predictions.',
    check: {prompt: 'A model predicts y = 3x + 2. At x = 5 the actual value is 14. What is the residual?', answer: '-3', explanation: 'The prediction is 17. Actual minus predicted is 14 − 17 = −3.'}, prerequisites: ['linear-functions']
  },
  {
    id: 'boundaries', section: rw, skill: 'Boundaries',
    title: 'Find complete clauses before choosing punctuation', minutes: 7,
    intro: 'A complete clause has a subject, a finite verb, and a complete thought. Two complete clauses need a valid boundary rather than a comma alone.',
    steps: ['Find the subject and main verb on each side of the boundary.', 'Decide whether each side can stand as a sentence.', 'Use a period, semicolon, or comma plus coordinating conjunction when joining two complete clauses.'],
    worked: {prompt: 'Choose “comma” or “semicolon”: The sensor detected movement __ the camera began recording.', setup: '“The sensor detected movement” and “the camera began recording” are both complete clauses.', solution: 'Use a semicolon: The sensor detected movement; the camera began recording.', trap: 'A comma alone between two complete clauses creates a comma splice.'},
    rule: 'Two complete clauses can meet at a semicolon. A comma needs additional grammatical support.',
    check: {prompt: 'Choose “comma” or “semicolon”: The storm ended __ the crew resumed work.', answer: 'semicolon', explanation: 'Both sides can stand alone. A semicolon joins them; a comma alone cannot.'}, prerequisites: []
  },
  {
    id: 'central-ideas', section: rw, skill: 'Central Ideas and Details',
    title: 'Separate the main point from its example', minutes: 6,
    intro: 'A main idea covers the passage’s central claim. Supporting details explain or illustrate that claim without becoming the whole point.',
    steps: ['Summarize each sentence’s job in a few words.', 'State the idea supported by the passage as a whole.', 'Reject an answer that is narrower, broader, or stronger than the passage.'],
    worked: {prompt: 'Passage: “Researchers tracked urban foxes near parks and busy roads. Foxes crossed roads mainly at night, when traffic was lighter. The finding suggests that the animals adjust their activity to human routines.” Which is the main point: “traffic counts” or “behavioral adjustment”?', setup: 'The crossing-time detail supports the final claim about adjusting activity.', solution: 'Behavioral adjustment is the main point. Traffic levels provide the context for that behavior.', trap: 'A memorable detail about roads does not cover the passage’s central claim.'},
    rule: 'A main idea should explain why the important details appear together.',
    check: {prompt: 'Passage: “A library extended its evening hours. Visits after work rose, suggesting that scheduling had limited access.” Which is the central focus: “scheduling” or “architecture”?', answer: 'scheduling', explanation: 'The detail about visits supports a conclusion about when the library is open.'}, prerequisites: []
  },
  {
    id: 'command-evidence', section: rw, skill: 'Command of Evidence',
    title: 'Match evidence to the exact claim', minutes: 7,
    intro: 'Useful evidence directly supports or challenges the stated claim. A related fact may still fail to address what the claim actually says.',
    steps: ['Underline the claim’s subject, comparison, and direction.', 'Predict what result would support or weaken it.', 'Check that the evidence uses the relevant groups and measurement.'],
    worked: {prompt: 'Claim: A new filter removes more particles than the old filter under the same conditions. Which directly supports it: “the new filter is lighter” or “the new filter removes 90% and the old one 60%”?', setup: 'The claim compares particle removal, not size or weight.', solution: 'The removal rates of 90% versus 60% directly support the comparison when conditions match.', trap: 'A favorable fact about the new filter is not necessarily evidence for better particle removal.'},
    rule: 'Copy the claim’s comparison into a blank: “If this is true, I should observe ____.”',
    check: {prompt: 'Claim: shaded soil retains more water than exposed soil. Which measure tests this claim: “moisture” or “color”?', answer: 'moisture', explanation: 'Water retention concerns moisture. Soil color alone does not measure retained water.'}, prerequisites: ['central-ideas']
  },
  {
    id: 'cross-text', section: rw, skill: 'Cross-Text Connections',
    title: 'Compare positions on one shared issue', minutes: 7,
    intro: 'Two texts may share a topic while disagreeing about its explanation, importance, or implications. Identify each author’s actual position before comparing them.',
    steps: ['Summarize Text 1’s claim in one sentence.', 'Summarize Text 2’s claim on the same issue.', 'Identify agreement, disagreement, or a qualification using both texts.'],
    worked: {prompt: 'Text 1 says a city’s new bike lanes caused cycling to increase. Text 2 says cycling rose, but cheaper bicycles may also have contributed. Does Text 2 “qualify” or “fully reject” Text 1’s causal claim?', setup: 'Both acknowledge an increase. Text 2 adds another possible cause.', solution: 'Text 2 qualifies the causal claim. It does not deny the increase or establish that lanes had no effect.', trap: 'Adding a competing explanation is not the same as denying every part of the first text.'},
    rule: 'Compare claims on the same question; preserve any limits in each author’s wording.',
    check: {prompt: 'Text 1 calls a method useful but expensive. Text 2 calls the same method useful and affordable. On which point do they disagree: “usefulness” or “cost”?', answer: 'cost', explanation: 'They agree that the method is useful and disagree about its cost.'}, prerequisites: ['central-ideas']
  },
  {
    id: 'form-structure-sense', section: rw, skill: 'Form, Structure, and Sense',
    title: 'Find the subject behind the distractors', minutes: 7,
    intro: 'Verb agreement depends on the grammatical subject, not the closest noun. Modifiers, verb tense, and pronoun references must also match the sentence’s intended meaning.',
    steps: ['Identify the sentence’s main subject and verb.', 'Set aside interrupting phrases and modifiers.', 'Check number, tense, and reference against the full sentence.'],
    worked: {prompt: 'Choose “is” or “are”: The collection of rare maps __ stored in a climate-controlled room.', setup: 'The subject is singular “collection.” “Of rare maps” describes the collection.', solution: 'Use “is”: The collection of rare maps is stored in a climate-controlled room.', trap: 'The nearby plural noun “maps” is inside a prepositional phrase and does not control the verb.'},
    rule: 'Find what is doing or being something. Match the verb to that subject after removing interruptions.',
    check: {prompt: 'Choose “has” or “have”: Each of the instruments __ a serial number.', answer: 'has', explanation: '“Each” is the singular subject, so the verb is “has.”'}, prerequisites: []
  },
  {
    id: 'inferences', section: rw, skill: 'Inferences',
    title: 'Make the smallest supported step', minutes: 7,
    intro: 'An inference follows from the given evidence without requiring a new story. Wording such as “may” or “suggests” often preserves the limits of a small study.',
    steps: ['List what the passage explicitly establishes.', 'Connect those facts without adding a new cause or universal claim.', 'Choose the conclusion with the fewest unsupported assumptions.'],
    worked: {prompt: 'Passage: “Seeds stored in cool, dry conditions sprouted more often than seeds stored in a warm, damp room. All seeds came from the same batch.” Which conclusion is supported: “storage conditions may affect sprouting” or “warmth always destroys seeds”?', setup: 'The evidence compares two sets of storage conditions within one seed batch.', solution: 'Storage conditions may affect sprouting. The evidence does not isolate warmth from moisture or justify “always.”', trap: 'A limited comparison does not support a universal statement or identify which combined factor caused the difference.'},
    rule: 'Prefer a modest conclusion that every relevant fact supports over a stronger claim that needs new evidence.',
    check: {prompt: 'A report finds that one tested coating reduced rust in a six-month trial. Which claim is supported: “promising” or “permanent”?', answer: 'promising', explanation: 'A six-month result suggests promise. It does not establish permanent protection.'}, prerequisites: ['central-ideas', 'command-evidence']
  },
  {
    id: 'rhetorical-synthesis', section: rw, skill: 'Rhetorical Synthesis',
    title: 'Let the writing goal choose the facts', minutes: 6,
    intro: 'Notes contain more information than an answer needs. The task may ask for a comparison, an introduction, a shared feature, or a contrast.',
    steps: ['Read the writer’s goal before selecting notes.', 'Choose only the facts needed for that goal.', 'Check that the sentence makes the requested relationship explicit.'],
    worked: {prompt: 'Notes: Tower A is 80 m tall and made of steel. Tower B is 65 m tall and made of stone. Goal: emphasize a difference in height. Which is relevant: “materials” or “dimensions”?', setup: 'The goal is a height comparison, so use 80 m and 65 m.', solution: 'Use dimensions: Tower A is 15 m taller than Tower B.', trap: 'A true sentence about building materials does not meet a goal about height.'},
    rule: 'Treat the goal as a filter: each selected fact should help achieve it.',
    check: {prompt: 'Notes say two birds migrate in autumn, but eat different foods. To emphasize a similarity, choose “migration” or “diet”.', answer: 'migration', explanation: 'Both migrate in autumn. Their diets provide a difference, not the requested similarity.'}, prerequisites: ['central-ideas']
  },
  {
    id: 'text-structure', section: rw, skill: 'Text Structure and Purpose',
    title: 'Describe what a sentence does', minutes: 6,
    intro: 'Structure questions ask how a passage works. A sentence can introduce a problem, offer an example, challenge an explanation, or state a conclusion.',
    steps: ['Summarize the passage’s main point.', 'Read the sentence together with the sentences around it.', 'Describe its role with an action verb rather than repeating its topic.'],
    worked: {prompt: 'Passage: “Some desert plants store water. The barrel cactus, for example, expands after rainfall. This reserve helps the plant survive dry periods.” Does the second sentence provide an “example” or a “counterargument”?', setup: 'The second sentence names a specific plant that illustrates water storage.', solution: 'It provides an example supporting the general statement in the first sentence.', trap: 'Repeating “it discusses a cactus” identifies a topic, not its function.'},
    rule: 'Finish this sentence: “The author includes this line to ____ the surrounding claim.”',
    check: {prompt: 'A paragraph states a claim and then presents a measurement that supports it. Does the measurement function as “evidence” or a “definition”?', answer: 'evidence', explanation: 'The measurement supports the claim; it does not define a term.'}, prerequisites: ['central-ideas']
  },
  {
    id: 'transitions', section: rw, skill: 'Transitions',
    title: 'Name the logical relationship first', minutes: 6,
    intro: 'A transition labels a relationship between ideas. Decide whether the next sentence adds, contrasts, illustrates, or concludes before considering a particular word.',
    steps: ['Summarize the ideas on both sides of the blank.', 'Name their relationship in plain language.', 'Select a transition that signals that relationship without adding a new claim.'],
    worked: {prompt: 'Choose “However” or “Therefore”: The prototype was inexpensive to build. __, it required frequent repairs.', setup: 'The second sentence introduces a drawback after an advantage.', solution: '“However” signals the contrast between low initial cost and ongoing repair needs.', trap: '“Therefore” would claim that low cost caused the repairs, which the sentences do not establish.'},
    rule: 'Choose the relationship before the transition: contrast, addition, example, or result.',
    check: {prompt: 'Choose “For example” or “Nevertheless”: Many animals use tools. __, sea otters use stones to open shellfish.', answer: 'for example', explanation: 'The sea otter is a specific example of the general claim about tool use.'}, prerequisites: ['text-structure']
  },
  {
    id: 'words-context', section: rw, skill: 'Words in Context',
    title: 'Predict the meaning before reading choices', minutes: 7,
    intro: 'Context determines which meaning of a word fits. A familiar dictionary meaning can be wrong if it misses the sentence’s direction or tone.',
    steps: ['Cover the target word or blank and read the surrounding sentence.', 'Predict a simple replacement using clues such as contrast or cause.', 'Test the candidate in the complete sentence.'],
    worked: {prompt: 'Sentence: “The evidence was sparse: only two observations were available.” Does “sparse” mean “limited” or “convincing”?', setup: 'The phrase after the colon explains the small amount of evidence.', solution: '“Limited” matches the idea of only two observations. The sentence does not say whether those observations were convincing.', trap: 'Choose the meaning supported by the context, not a judgment the sentence never makes.'},
    rule: 'Predict a plain synonym, then check that the whole sentence keeps the same meaning.',
    check: {prompt: 'Sentence: “Unlike her verbose first draft, the revision was concise.” Does “concise” mean “brief” or “uncertain”?', answer: 'brief', explanation: 'The contrast with “verbose” points to a shorter, more economical style.'}, prerequisites: []
  }
];

export const VOCAB = [
  {id:'v-abate',word:'abate',part:'verb',definition:'To become less intense or widespread.',example:'The noise began to abate after the machines shut down.'},
  {id:'v-ambiguous',word:'ambiguous',part:'adjective',definition:'Open to more than one reasonable interpretation.',example:'The ambiguous label did not specify whether the measurement was in inches or centimeters.'},
  {id:'v-analogous',word:'analogous',part:'adjective',definition:'Similar in a way that supports comparison.',example:'The engineer used an analogous water-flow model to explain the electrical circuit.'},
  {id:'v-anomaly',word:'anomaly',part:'noun',definition:'A result or feature that differs from the expected pattern.',example:'One unusually high reading was an anomaly in an otherwise steady series.'},
  {id:'v-assert',word:'assert',part:'verb',definition:'To state a claim firmly.',example:'The essay asserts that public spaces influence how neighbors interact.'},
  {id:'v-attenuate',word:'attenuate',part:'verb',definition:'To reduce the strength or intensity of something.',example:'The foam lining attenuated the sound reaching the room.'},
  {id:'v-augment',word:'augment',part:'verb',definition:'To increase or add to something.',example:'The library augmented its collection with donated maps.'},
  {id:'v-bolster',word:'bolster',part:'verb',definition:'To strengthen or support.',example:'A second successful trial bolstered the researchers’ confidence in the method.'},
  {id:'v-candid',word:'candid',part:'adjective',definition:'Honest and direct in expression.',example:'The report offered a candid account of the project’s delays.'},
  {id:'v-coherent',word:'coherent',part:'adjective',definition:'Logically connected and understandable as a whole.',example:'A clear timeline made the historical account more coherent.',root:'co-'},
  {id:'v-concede',word:'concede',part:'verb',definition:'To acknowledge a point, often while maintaining a larger disagreement.',example:'The critic conceded that the film’s photography was impressive.'},
  {id:'v-conspicuous',word:'conspicuous',part:'adjective',definition:'Easy to notice.',example:'The bright stripe made the otherwise gray bird conspicuous.'},
  {id:'v-constraint',word:'constraint',part:'noun',definition:'A limit or restriction.',example:'A limited battery life was a constraint on the device’s design.'},
  {id:'v-contend',word:'contend',part:'verb',definition:'To argue that a claim is true; also, to struggle with a difficulty.',example:'The author contends that the policy changed travel habits.'},
  {id:'v-corroborate',word:'corroborate',part:'verb',definition:'To support a claim with additional evidence.',example:'The later excavation corroborated the earlier account of the settlement.'},
  {id:'v-credible',word:'credible',part:'adjective',definition:'Reasonable to believe or trust.',example:'Careful measurements and transparent methods made the estimate credible.',root:'cred'},
  {id:'v-deference',word:'deference',part:'noun',definition:'Respectful consideration of another person’s judgment.',example:'The apprentice changed the design in deference to the experienced builder.'},
  {id:'v-delineate',word:'delineate',part:'verb',definition:'To describe or mark the boundaries of something clearly.',example:'The diagram delineates the steps in the manufacturing process.'},
  {id:'v-discrepancy',word:'discrepancy',part:'noun',definition:'A difference between things that are expected to agree.',example:'The team investigated a discrepancy between the two sensors’ readings.'},
  {id:'v-disparate',word:'disparate',part:'adjective',definition:'Substantially different in kind or character.',example:'The exhibit brought together artists working in disparate materials.'},
  {id:'v-empirical',word:'empirical',part:'adjective',definition:'Based on observation or experiment.',example:'The proposed explanation still needed empirical support.'},
  {id:'v-equivocal',word:'equivocal',part:'adjective',definition:'Unclear or insufficient to settle an interpretation.',example:'The equivocal results did not clearly favor either hypothesis.'},
  {id:'v-exacerbate',word:'exacerbate',part:'verb',definition:'To make a problem worse.',example:'Damaged drainage pipes exacerbated the flooding.'},
  {id:'v-expedient',word:'expedient',part:'adjective',definition:'Convenient for an immediate purpose, sometimes despite other drawbacks.',example:'Using the spare part was expedient, although it was not a lasting repair.'},
  {id:'v-feasible',word:'feasible',part:'adjective',definition:'Possible to carry out under the available conditions.',example:'The smaller design made the project feasible within the budget.'},
  {id:'v-fortuitous',word:'fortuitous',part:'adjective',definition:'Happening by chance rather than by design.',example:'A fortuitous encounter at the archive led to a useful collaboration.'},
  {id:'v-heterogeneous',word:'heterogeneous',part:'adjective',definition:'Made up of different kinds of parts or members.',example:'The heterogeneous sample included materials from several rock types.',root:'hetero-'},
  {id:'v-hypothesis',word:'hypothesis',part:'noun',definition:'A proposed explanation that can be investigated.',example:'The scientists tested the hypothesis that shade would slow evaporation.',root:'hypo-'},
  {id:'v-impartial',word:'impartial',part:'adjective',definition:'Not favoring one side unfairly.',example:'An impartial reviewer judged each submission using the same criteria.'},
  {id:'v-implicit',word:'implicit',part:'adjective',definition:'Suggested by context rather than stated directly.',example:'The narrator’s disappointment is implicit in the description of the empty room.'},
  {id:'v-inadvertent',word:'inadvertent',part:'adjective',definition:'Unintentional.',example:'An inadvertent change to the settings altered the next measurement.'},
  {id:'v-incongruous',word:'incongruous',part:'adjective',definition:'Out of place or inconsistent with surrounding things.',example:'The modern sign looked incongruous on the centuries-old gate.'},
  {id:'v-infer',word:'infer',part:'verb',definition:'To draw a conclusion from evidence.',example:'From the tracks, the researchers inferred that the animal had returned overnight.'},
  {id:'v-innovative',word:'innovative',part:'adjective',definition:'Introducing a new method or idea.',example:'An innovative hinge allowed the panel to fold into a smaller space.',root:'nov'},
  {id:'v-mitigate',word:'mitigate',part:'verb',definition:'To lessen the severity of a problem.',example:'Trees along the street helped mitigate the summer heat.'},
  {id:'v-nuance',word:'nuance',part:'noun',definition:'A subtle difference in meaning, feeling, or expression.',example:'The translation preserved an important nuance in the speaker’s tone.'},
  {id:'v-obsolete',word:'obsolete',part:'adjective',definition:'No longer in use or suited to current needs.',example:'The new connector made the older adapter obsolete.'},
  {id:'v-pervasive',word:'pervasive',part:'adjective',definition:'Present throughout many parts of a place or situation.',example:'The pervasive smell of smoke reached every floor.'},
  {id:'v-plausible',word:'plausible',part:'adjective',definition:'Reasonable or apparently possible, though not necessarily proven.',example:'The proposed explanation was plausible but required more testing.'},
  {id:'v-pragmatic',word:'pragmatic',part:'adjective',definition:'Focused on practical conditions and results.',example:'A pragmatic approach favored the repair that could be completed before winter.'},
  {id:'v-preclude',word:'preclude',part:'verb',definition:'To prevent something or make it impossible.',example:'Heavy ice precluded travel along the narrow road.',root:'pre-'},
  {id:'v-profound',word:'profound',part:'adjective',definition:'Deep or far-reaching in thought, feeling, or effect.',example:'The discovery had a profound effect on the field’s research methods.'},
  {id:'v-reconcile',word:'reconcile',part:'verb',definition:'To make apparently conflicting things consistent with one another.',example:'The updated model helped reconcile the two sets of measurements.'},
  {id:'v-refute',word:'refute',part:'verb',definition:'To show that a claim is false through evidence or reasoning.',example:'The newly dated documents refuted the proposed timeline.'},
  {id:'v-salient',word:'salient',part:'adjective',definition:'Especially noticeable or relevant.',example:'The summary highlighted the most salient differences between the designs.'},
  {id:'v-skeptical',word:'skeptical',part:'adjective',definition:'Inclined to question a claim rather than accept it immediately.',example:'The reviewer remained skeptical until the result was independently reproduced.'},
  {id:'v-sparse',word:'sparse',part:'adjective',definition:'Few in number or spread thinly.',example:'Vegetation was sparse on the exposed hillside.'},
  {id:'v-substantiate',word:'substantiate',part:'verb',definition:'To support a claim with evidence.',example:'The author used shipping records to substantiate the trade estimate.'},
  {id:'v-succinct',word:'succinct',part:'adjective',definition:'Brief while expressing the necessary meaning.',example:'The guide gave a succinct explanation of the procedure.'},
  {id:'v-tentative',word:'tentative',part:'adjective',definition:'Not yet final or certain.',example:'The team offered a tentative conclusion while awaiting further measurements.'},
  {id:'v-undermine',word:'undermine',part:'verb',definition:'To weaken support for something.',example:'The missing records undermined the claim that the survey was complete.'},
  {id:'v-unprecedented',word:'unprecedented',part:'adjective',definition:'Without a known earlier instance.',example:'The archive recorded an unprecedented number of visitors that month.',root:'pre-'},
  {id:'v-viable',word:'viable',part:'adjective',definition:'Capable of working or continuing successfully.',example:'The lower-cost material proved to be a viable option.'},
  {id:'v-vindicate',word:'vindicate',part:'verb',definition:'To provide evidence that a disputed judgment or action was justified.',example:'The successful repair vindicated the technician’s diagnosis.'},
  {id:'v-transient',word:'transient',part:'adjective',definition:'Lasting only a short time.',example:'The instrument recorded a transient spike before returning to normal.',root:'trans-'},
  {id:'v-durable',word:'durable',part:'adjective',definition:'Able to withstand use or damage over time.',example:'The durable coating remained intact after repeated washing.'},
  {id:'v-elucidate',word:'elucidate',part:'verb',definition:'To make an idea clearer.',example:'The worked diagram helped elucidate the mechanism.'},
  {id:'v-qualify',word:'qualify',part:'verb',definition:'To limit or modify a claim rather than accept it without reservation.',example:'The researcher qualified the conclusion by noting the small sample.'},
  {id:'v-provisional',word:'provisional',part:'adjective',definition:'Accepted temporarily while further information is gathered.',example:'The laboratory released a provisional estimate before checking the final samples.'},
  {id:'v-repudiate',word:'repudiate',part:'verb',definition:'To reject a claim, position, or association.',example:'The organization repudiated the inaccurate statement attributed to it.'}
];

// Roots are recognition clues, not reliable substitutes for reading a word in context.
export const ROOTS = [
  {id:'root-bio',root:'bio-',meaning:'life',examples:['biology','biography','biodegradable']},
  {id:'root-chron',root:'chron',meaning:'time',examples:['chronology','chronicle','synchronize']},
  {id:'root-cred',root:'cred',meaning:'believe or trust',examples:['credible','credibility','credulous']},
  {id:'root-dict',root:'dict',meaning:'say or speak',examples:['dictate','predict','contradict']},
  {id:'root-graph',root:'graph',meaning:'write or record',examples:['autograph','biography','seismograph']},
  {id:'root-hetero',root:'hetero-',meaning:'different',examples:['heterogeneous','heterozygous','heterodox']},
  {id:'root-homo',root:'homo-',meaning:'same',examples:['homogeneous','homophone','homologous']},
  {id:'root-hypo',root:'hypo-',meaning:'under or below; in hypothesis, an underlying supposition',examples:['hypodermic','hypothermia','hypothesis']},
  {id:'root-inter',root:'inter-',meaning:'between or among',examples:['interact','interdependent','intermediate']},
  {id:'root-micro',root:'micro-',meaning:'small',examples:['microscope','microorganism','microcosm']},
  {id:'root-nov',root:'nov',meaning:'new',examples:['novelty','innovate','renovate']},
  {id:'root-port',root:'port',meaning:'carry',examples:['portable','transport','import']},
  {id:'root-pre',root:'pre-',meaning:'before',examples:['preview','precede','precondition']},
  {id:'root-spect',root:'spect',meaning:'look or see',examples:['inspect','spectator','retrospect']},
  {id:'root-struct',root:'struct',meaning:'build',examples:['construct','structure','reconstruct']},
  {id:'root-sub',root:'sub-',meaning:'under or below',examples:['submarine','subterranean','subordinate']},
  {id:'root-trans',root:'trans-',meaning:'across or through',examples:['transport','transcontinental','transmit']},
  {id:'root-co',root:'co-',meaning:'together or jointly',examples:['cooperate','coexist','coauthor']}
];

export const CHALLENGE = [
  {day:1,title:'Read a horizontal intercept',skill:'Linear Functions',instruction:'Graph the line. Select the point where it crosses the x-axis. Report the x-coordinate, then verify it by setting y to zero.',expression:'y = 3x − 18',expected:'The horizontal intercept is (6, 0), so x = 6.'},
  {day:2,title:'Compare a fixed fee and an hourly cost',skill:'Systems of Linear Equations',instruction:'Graph both cost models. Find the number of rental hours at which their total costs agree, and read the common cost.',expression:'y = 18 + 6x; y = 42 + 3x',expected:'The lines meet at (8, 66): 8 hours and a common cost of $66.'},
  {day:3,title:'Find both quadratic roots',skill:'Nonlinear Equations and Systems',instruction:'Graph the quadratic and select both x-intercepts. Verify them by factoring the expression.',expression:'y = x^2 − 7x + 12',expected:'The roots are x = 3 and x = 4 because (x − 3)(x − 4) = 0.'},
  {day:4,title:'Read a turning point',skill:'Nonlinear Functions',instruction:'Graph the parabola and find its vertex. State the minimum output and the input where it occurs.',expression:'y = (x − 2)^2 + 5',expected:'The vertex is (2, 5). The minimum output is 5 at x = 2.'},
  {day:5,title:'Model successive discounts',skill:'Percentages',instruction:'Enter the expression in the calculator. Compare the result with subtracting 25% of the original price. Explain why they differ.',expression:'240(1 − 0.15)(1 − 0.10)',expected:'The final price is $183.60, which is 76.5% of $240. Adding the discounts would incorrectly give $180.'},
  {day:6,title:'Solve a mixture with an intersection',skill:'Systems of Linear Equations',instruction:'Let x be liters of 20% solution and y liters of 60% solution. Graph the total-volume and ingredient equations for 12 liters of a 40% mixture.',expression:'x + y = 12; 0.2x + 0.6y = 4.8',expected:'The intersection is (6, 6): mix 6 liters of each solution.'},
  {day:7,title:'Solve an absolute-value equation',skill:'Nonlinear Equations and Systems',instruction:'Graph both expressions. Find both intersection x-values. Explain their equal distance from x = 1.',expression:'y = |x − 1|; y = 4',expected:'The solutions are x = −3 and x = 5. Both are 4 units from 1.'}
];

// Focused follow-up lessons are original teaching material. Existing IDs above are stable.
// A lesson check is a short retrieval prompt, not an official SAT item or mastery certificate.
export const CURRICULUM_REFERENCES = {
  checkedOn: '2026-10-23',
  description: 'Original lessons organized around College Board SAT skills. Khan Academy provides Official SAT Prep developed in partnership with College Board; this independent app is not affiliated with or endorsed by either organization.',
  collegeBoardMath: 'https://satsuite.collegeboard.org/sat/whats-on-the-test/math/types',
  collegeBoardReadingWriting: 'https://satsuite.collegeboard.org/sat/whats-on-the-test/reading-writing',
  framework: 'https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf',
  partnership: 'https://satsuite.collegeboard.org/practice/khan-academy',
  khanMath: 'https://www.khanacademy.org/sat-math',
  khanReadingWriting: 'https://www.khanacademy.org/sat-reading-and-writing',
};

LESSONS.push(
  {
    id: 'equations-multi-step', section: math, skill: 'Linear Equations in One Variable',
    title: 'Solve equations with fractions and both sides', minutes: 7,
    intro: 'Clear denominators by multiplying every term by the same nonzero number. Then collect variable terms on one side and constants on the other.',
    steps: ['Find a common multiple of all denominators.', 'Multiply every term, including terms outside fractions.', 'Solve the simpler equation and substitute into the original.'],
    worked: {prompt: 'Solve (x − 2)/3 + 1 = x/2.', setup: 'Multiply every term by 6: 2(x − 2) + 6 = 3x.', solution: '2x − 4 + 6 = 3x, so x = 2. Check: 0/3 + 1 = 2/2.', trap: 'Multiplying just the fractions but leaving the 1 unchanged changes the equation.'},
    rule: 'A denominator-clearing multiplier reaches every term on both sides.',
    check: {prompt: 'Solve (x + 4)/3 = (x − 2)/2.', answer: '14', explanation: '2(x + 4) = 3(x − 2), so 2x + 8 = 3x − 6 and x = 14.'}, prerequisites: ['one-variable-equations']
  },
  {
    id: 'equations-solution-count', section: math, skill: 'Linear Equations in One Variable',
    title: 'Recognize one, no, or infinitely many solutions', minutes: 6,
    intro: 'After simplifying a linear equation, a nonzero coefficient of x gives one solution. A false constant statement gives none; an identity gives every real number.',
    steps: ['Distribute and combine like terms on each side.', 'Move variable terms together.', 'Read the remaining statement before trying to divide.'],
    worked: {prompt: 'How many solutions does 4(x + 2) = 4x + 11 have?', setup: 'Expand and subtract 4x from both sides: 8 = 11.', solution: 'No solutions: 8 = 11 is false for every x.', trap: 'The disappearance of x does not always mean infinitely many solutions. The remaining constants must agree.'},
    rule: '0x = nonzero: none. 0x = 0: infinitely many. Nonzero coefficient: one.',
    check: {prompt: 'How many solutions does 3(x − 2) = 3x − 6 have? Enter “one”, “none”, or “infinitely many”.', answer: 'infinitely many', explanation: 'Both sides simplify to 3x − 6. The equality holds for every real x.'}, prerequisites: ['equations-multi-step']
  },
  {
    id: 'equations-parameters', section: math, skill: 'Linear Equations in One Variable',
    title: 'Solve for a constant or rearrange a formula', minutes: 7,
    intro: 'A letter can represent an unknown constant instead of the changing input. Substitute any known solution first; isolate a requested variable with inverse operations.',
    steps: ['Identify which letter the question asks you to find.', 'Substitute a given solution before simplifying.', 'When rearranging a formula, preserve parentheses and nonzero-denominator restrictions.'],
    worked: {prompt: 'If x = 5 solves 3x + k = 28, what is k?', setup: 'Substitute x = 5: 15 + k = 28.', solution: 'k = 13. More generally, k = 28 − 3x.', trap: 'Solving for x again does not answer the question about k.'},
    rule: 'Use a known solution as an input; solve for the letter that is still unknown.',
    check: {prompt: 'If y = 3 solves 4y + a = 29, what is a?', answer: '17', explanation: '4(3) + a = 29 gives a = 17.'}, prerequisites: ['one-variable-equations']
  },
  {
    id: 'lines-standard-form', section: math, skill: 'Linear Equations in Two Variables',
    title: 'Move between line equations and intercepts', minutes: 7,
    intro: 'The same line can appear as Ax + By = C, y = mx + b, or point-slope form. Isolate y to expose slope, or set one coordinate to zero for an intercept.',
    steps: ['Choose a form suited to the requested quantity.', 'Isolate y to identify its coefficient of x.', 'Set x = 0 or y = 0 to check the intercepts.'],
    worked: {prompt: 'What is the slope of the line 3x + 2y = 12?', setup: '2y = −3x + 12, so y = (−3/2)x + 6.', solution: 'The slope is −3/2. Its intercepts are (0, 6) and (4, 0).', trap: 'The coefficient 3 in standard form is not the slope; isolate y first.'},
    rule: 'For Ax + By = C with B ≠ 0, slope = −A/B.',
    check: {prompt: 'What is the x-intercept coordinate of 4x + 3y = 20? Enter x only.', answer: '5', explanation: 'At the x-intercept y = 0, so 4x = 20 and x = 5.'}, prerequisites: ['two-variable-equations']
  },
  {
    id: 'lines-parallel-perpendicular', section: math, skill: 'Linear Equations in Two Variables',
    title: 'Use slopes for parallel and perpendicular lines', minutes: 7,
    intro: 'Distinct parallel nonvertical lines have equal slopes. Perpendicular nonvertical lines have slopes whose product is −1. A vertical line is perpendicular to a horizontal line.',
    steps: ['Find each line’s slope in the same form.', 'Use equal slopes or negative reciprocals as required.', 'Use a known point to determine the remaining intercept.'],
    worked: {prompt: 'A line perpendicular to y = 2x + 1 passes through (4, 3). What is its y-intercept?', setup: 'Its slope is −1/2. Substitute the point into y = (−1/2)x + b.', solution: '3 = −2 + b, so b = 5.', trap: 'Changing only the sign gives −2, not the negative reciprocal −1/2.'},
    rule: 'Perpendicular slopes multiply to −1; parallel slopes match.',
    check: {prompt: 'A line parallel to y = 3x − 8 passes through (2, 11). What is its y-intercept?', answer: '5', explanation: 'Use slope 3: 11 = 3(2) + b, so b = 5.'}, prerequisites: ['lines-standard-form']
  },
  {
    id: 'functions-tables-notation', section: math, skill: 'Linear Functions',
    title: 'Build a linear function from a table or two points', minutes: 7,
    intro: 'f(x) names the output at input x. For a linear function, slope is the change in output divided by the matching change in input, even when input steps are not one.',
    steps: ['Calculate Δoutput/Δinput from two points.', 'Substitute one point into f(x) = mx + b.', 'Evaluate at the input requested and keep its units.'],
    worked: {prompt: 'A linear function has f(2) = 9 and f(6) = 21. What is f(10)?', setup: 'm = (21 − 9)/(6 − 2) = 3. Then 9 = 3(2) + b.', solution: 'b = 3, so f(10) = 3(10) + 3 = 33.', trap: 'The output rises by 12 over four input units. The per-unit change is 3.'},
    rule: 'A table gives points (input, output); divide both changes before finding b.',
    check: {prompt: 'A linear function has f(1) = 5 and f(4) = 17. What is f(6)?', answer: '25', explanation: 'Slope = 12/3 = 4 and b = 1, so f(6) = 25.'}, prerequisites: ['linear-functions']
  },
  {
    id: 'inequalities-negative', section: math, skill: 'Linear Inequalities',
    title: 'Reverse a bound when dividing by a negative', minutes: 6,
    intro: 'Adding or subtracting preserves an inequality’s direction. Multiplying or dividing by a negative reverses it because negative scaling reverses order.',
    steps: ['Isolate the variable term.', 'Reverse the sign if the final divisor is negative.', 'Test a value on the allowed side and check whether the endpoint is included.'],
    worked: {prompt: 'Solve 9 − 2x < 3.', setup: 'Subtract 9: −2x < −6. Divide by −2.', solution: 'x > 3. For example, x = 4 gives 1 < 3, while x = 3 makes equality and is excluded.', trap: 'Leaving the sign as < after dividing by −2 selects the wrong side.'},
    rule: 'Negative multiplication or division flips < to > and ≤ to ≥.',
    check: {prompt: 'What is the least integer satisfying 7 − 3x < 1?', answer: '3', explanation: '−3x < −6 gives x > 2. The least integer greater than 2 is 3.'}, prerequisites: ['linear-inequalities']
  },
  {
    id: 'inequalities-plane', section: math, skill: 'Linear Inequalities',
    title: 'Test points in a system of inequalities', minutes: 7,
    intro: 'A two-variable inequality describes a region. A solution to a system must satisfy every inequality; a strict inequality excludes its boundary line.',
    steps: ['Draw each boundary line with its correct solid or dashed style.', 'Test a point to select the satisfying side of each line.', 'Use only the overlap, checking every condition for a candidate point.'],
    worked: {prompt: 'The point (2, k) satisfies y ≥ x + 1 and y < 6. What is the greatest possible integer k?', setup: 'At x = 2, the conditions become k ≥ 3 and k < 6.', solution: 'The allowed integers are 3, 4, and 5, so the greatest is 5.', trap: '6 lies on an excluded boundary. A point satisfying only one inequality is insufficient.'},
    rule: 'A system uses “and”: every inequality must hold at the same point.',
    check: {prompt: 'For x = 1, what is the smallest integer y satisfying y > 2x and y ≤ 5?', answer: '3', explanation: 'The conditions become y > 2 and y ≤ 5. The smallest allowed integer is 3.'}, prerequisites: ['inequalities-negative', 'lines-standard-form']
  },
  {
    id: 'systems-elimination', section: math, skill: 'Systems of Linear Equations',
    title: 'Choose elimination or substitution deliberately', minutes: 7,
    intro: 'Elimination combines equations to remove a variable. Substitution replaces a variable with an equal expression. Sometimes combining equations gives the requested expression directly.',
    steps: ['Inspect coefficients for an easy cancellation.', 'Multiply a whole equation if necessary, then add or subtract.', 'Find the requested variable or expression and verify both equations.'],
    worked: {prompt: 'If 2x + y = 13 and 2x − y = 3, what is x?', setup: 'Add the equations: 4x = 16.', solution: 'x = 4. Then y = 5, and 2(4) − 5 = 3 verifies the second equation.', trap: 'When adding equations, add both sides, including their constants.'},
    rule: 'Opposite coefficients cancel on addition; equal coefficients cancel on subtraction.',
    check: {prompt: 'If 3x + 2y = 22 and 3x − 2y = 8, what is x?', answer: '5', explanation: 'Adding gives 6x = 30, so x = 5.'}, prerequisites: ['two-variable-equations']
  },
  {
    id: 'systems-solution-count', section: math, skill: 'Systems of Linear Equations',
    title: 'Count intersections without solving for coordinates', minutes: 7,
    intro: 'Two nonparallel lines meet once. Distinct parallel lines never meet. Equations that describe the same line have infinitely many shared points.',
    steps: ['Rewrite in slope-intercept form or compare proportional coefficients.', 'Check both slope and intercept when slopes agree.', 'Interpret a contradiction or identity after elimination.'],
    worked: {prompt: 'How many solutions do x + 2y = 7 and 2x + 4y = 18 have?', setup: 'Double the first equation: 2x + 4y = 14.', solution: 'The second equation requires the same expression to equal 18. The lines are distinct and parallel, so there are no solutions.', trap: 'Proportional variable coefficients alone do not make the equations identical; constants must scale too.'},
    rule: 'Compare the whole equation, including the constant, before deciding lines coincide.',
    check: {prompt: 'How many solutions do x − y = 4 and 3x − 3y = 12 have? Enter “one”, “none”, or “infinitely many”.', answer: 'infinitely many', explanation: 'The second equation is exactly three times the first, so they describe one line.'}, prerequisites: ['systems-elimination', 'lines-parallel-perpendicular']
  },
  {
    id: 'systems-parameters', section: math, skill: 'Systems of Linear Equations',
    title: 'Find a constant that changes the solution count', minutes: 8,
    intro: 'An unknown coefficient can determine whether two lines intersect, coincide, or are parallel. Match the coefficient ratio required by the condition, then inspect constants.',
    steps: ['Write the condition for equal slopes or proportional coefficients.', 'Solve that condition for the parameter.', 'Check the constants to distinguish no solutions from infinitely many.'],
    worked: {prompt: 'For what k does x + 3y = 5 and 2x + ky = 13 have no solution?', setup: 'The x coefficient doubles. Parallel lines require the y coefficient to double too: k = 6.', solution: 'At k = 6, doubling the first equation gives 2x + 6y = 10, while the second has 13. They are distinct parallel lines, so k = 6.', trap: 'If the second constant were 10, the same coefficient choice would give infinitely many solutions.'},
    rule: 'Equal coefficient ratios control slope; the constant ratio decides whether the lines coincide.',
    check: {prompt: 'For what k do 2x + y = 9 and 6x + ky = 27 have infinitely many solutions?', answer: '3', explanation: 'Every part of the first equation must be multiplied by 3, so k = 3.'}, prerequisites: ['systems-solution-count', 'equations-parameters']
  },
  {
    id: 'expressions-exponents', section: math, skill: 'Equivalent Expressions',
    title: 'Apply integer exponent rules', minutes: 7,
    intro: 'Multiplying like bases adds exponents; dividing subtracts them. Raising a power to another power multiplies exponents. Negative exponents indicate reciprocals.',
    steps: ['Confirm which factors share a base.', 'Apply one rule at a time, including coefficients.', 'Keep zero excluded whenever the original expression has a variable denominator.'],
    worked: {prompt: 'For x ≠ 0, simplify (x³)²/x⁴ as x raised to a power. What is that power?', setup: '(x³)² = x⁶, then x⁶/x⁴ = x^(6 − 4).', solution: 'The power is 2. The expression equals x² for x ≠ 0.', trap: 'A power of a power multiplies exponents; it does not add 3 and 2.'},
    rule: 'Product: add. Quotient: subtract. Power of a power: multiply.',
    check: {prompt: 'For x ≠ 0, x⁵/x⁸ = 1/x^k. What is k?', answer: '3', explanation: 'x^(5 − 8) = x^(−3) = 1/x³, so k = 3.'}, prerequisites: ['equivalent-expressions']
  },
  {
    id: 'expressions-radicals', section: math, skill: 'Equivalent Expressions',
    title: 'Connect radicals and rational exponents', minutes: 7,
    intro: 'For positive a, a^(m/n) = (the nth root of a)^m. Extract perfect-square factors when simplifying square roots. The principal square root is nonnegative.',
    steps: ['Read the denominator of a rational exponent as a root.', 'Read the numerator as a power.', 'Check sign and domain restrictions; √(x²) = |x| for real x.'],
    worked: {prompt: 'What is 27^(2/3)?', setup: 'Take the cube root first: 27^(1/3) = 3.', solution: 'Square that result: 3² = 9.', trap: '2/3 is an exponent, not a multiplier of 27. Also, √(x²) is not always x when x is negative.'},
    rule: 'For positive bases, root first or power first gives the same rational power.',
    check: {prompt: 'What is 16^(3/4)?', answer: '8', explanation: 'The fourth root of 16 is 2, and 2³ = 8.'}, prerequisites: ['expressions-exponents']
  },
  {
    id: 'expressions-polynomials', section: math, skill: 'Equivalent Expressions',
    title: 'Multiply polynomials and track coefficients', minutes: 7,
    intro: 'Each term in one factor multiplies every term in the other. Combine equal powers only after all products are present.',
    steps: ['Distribute every term across the entire other factor.', 'Keep negative signs attached to their terms.', 'Group like powers and identify the requested coefficient.'],
    worked: {prompt: 'In (x + 4)(x − 3) = x² + bx + c, what is b?', setup: 'x² − 3x + 4x − 12 = x² + x − 12.', solution: 'b = 1. The constant c is −12.', trap: 'The middle coefficient comes from two cross-products, not just one.'},
    rule: 'Write all products before combining them; coefficient questions may not need a full solution.',
    check: {prompt: 'What is the coefficient of x in (x − 5)(x + 2)?', answer: '-3', explanation: 'The x terms are 2x − 5x = −3x.'}, prerequisites: ['equivalent-expressions']
  },
  {
    id: 'expressions-factoring', section: math, skill: 'Equivalent Expressions',
    title: 'Factor common factors and special products', minutes: 7,
    intro: 'Factoring reverses distribution. First remove any greatest common factor. Then look for a difference of squares, a perfect-square trinomial, or a quadratic factor pair.',
    steps: ['Check for a factor shared by every term.', 'For x² + bx + c, seek numbers with sum b and product c.', 'Multiply your factors to verify the original expression.'],
    worked: {prompt: 'Write x² − 9x + 20 = (x − a)(x − b), with a < b. What is a?', setup: 'Seek positive numbers whose sum is 9 and product is 20: 4 and 5.', solution: 'x² − 9x + 20 = (x − 4)(x − 5), so a = 4. Also recognize x² − 25 = (x − 5)(x + 5) as a difference of squares.', trap: 'The factor constants must satisfy both the sum and product conditions.'},
    rule: 'Factoring is verified by multiplication; never discard a greatest common factor.',
    check: {prompt: 'In x² − 16 = (x − 4)(x + k), what is k?', answer: '4', explanation: 'A² − B² = (A − B)(A + B). Here B = 4.'}, prerequisites: ['expressions-polynomials']
  },
  {
    id: 'expressions-rational', section: math, skill: 'Equivalent Expressions',
    title: 'Simplify rational expressions without losing restrictions', minutes: 7,
    intro: 'Only common factors cancel in a quotient. A canceled factor can still exclude an input from the original expression. To add fractions, use a common denominator.',
    steps: ['List excluded inputs from the original denominator.', 'Factor numerator and denominator completely.', 'Cancel common factors and carry the restrictions forward.'],
    worked: {prompt: 'For x ≠ 3, simplify (x² − 9)/(x − 3). What is its value at x = 5?', setup: '(x² − 9)/(x − 3) = ((x − 3)(x + 3))/(x − 3) = x + 3 for x ≠ 3.', solution: 'At x = 5 the value is 8. The original expression remains undefined at x = 3.', trap: 'You may cancel a whole factor x − 3, not individual terms inside a sum.'},
    rule: 'Factor before canceling, and preserve exclusions from the original expression.',
    check: {prompt: 'For x ≠ 0, (2/x) + (3/x) = k/x. What is k?', answer: '5', explanation: 'With a shared denominator, add the numerators: (2 + 3)/x = 5/x.'}, prerequisites: ['expressions-factoring']
  },
  {
    id: 'quadratic-formula', section: math, skill: 'Nonlinear Equations and Systems',
    title: 'Solve quadratics by factoring or the quadratic formula', minutes: 8,
    intro: 'Put a quadratic in ax² + bx + c = 0 form. Factoring works when a useful factor pair is apparent; the quadratic formula works for every real-coefficient quadratic with a ≠ 0.',
    steps: ['Move every term to one side.', 'Try factoring or identify a, b, and c for the formula.', 'Keep both branches of ± and answer the requested root or combination.'],
    worked: {prompt: 'What is the greater solution of x² − 4x − 1 = 0?', setup: 'x = (4 ± √(16 + 4))/2 = (4 ± √20)/2.', solution: 'The two roots are 2 ± √5. The greater root is 2 + √5.', trap: 'The denominator 2a divides the entire numerator, including the square root.'},
    rule: 'x = (−b ± √(b² − 4ac))/(2a). Roots have sum −b/a and product c/a.',
    check: {prompt: 'What is the product of the roots of 2x² − 7x + 3 = 0?', answer: '1.5', explanation: 'The product is c/a = 3/2 = 1.5. Factoring gives roots 3 and 1/2.'}, prerequisites: ['nonlinear-equations', 'expressions-factoring', 'expressions-radicals']
  },
  {
    id: 'quadratic-discriminant', section: math, skill: 'Nonlinear Equations and Systems',
    title: 'Use the discriminant to count real roots', minutes: 7,
    intro: 'For ax² + bx + c = 0 with a ≠ 0, b² − 4ac determines the number of distinct real roots: positive gives two, zero gives one, and negative gives none.',
    steps: ['Write the equation with zero on one side.', 'Calculate b² − 4ac with signed coefficients.', 'Translate a requested root count into an equation or inequality for the constant.'],
    worked: {prompt: 'For what k does x² − 6x + k = 0 have exactly one real solution?', setup: 'One distinct real root requires (−6)² − 4(1)k = 0.', solution: '36 − 4k = 0, so k = 9. The equation becomes (x − 3)² = 0.', trap: 'A repeated root counts as one distinct real solution, even though the quadratic formula has two identical branches.'},
    rule: 'Discriminant > 0: two. = 0: one. < 0: no real roots.',
    check: {prompt: 'For what k does x² + 8x + k = 0 have exactly one real solution?', answer: '16', explanation: '64 − 4k = 0 gives k = 16.'}, prerequisites: ['quadratic-formula', 'equations-parameters']
  },
  {
    id: 'radical-equations', section: math, skill: 'Nonlinear Equations and Systems',
    title: 'Check candidates after squaring', minutes: 8,
    intro: 'Squaring can turn an invalid candidate into an apparent solution by erasing a sign difference. A square-root expression must be real and nonnegative before it can equal the other side.',
    steps: ['Isolate the radical and note its sign restriction.', 'Square both sides and solve the resulting equation.', 'Substitute every candidate into the original equation.'],
    worked: {prompt: 'Solve √(x + 6) = x.', setup: 'The right side requires x ≥ 0. Squaring gives x + 6 = x², or (x − 3)(x + 2) = 0.', solution: 'Candidates are 3 and −2. Only 3 works: √9 = 3. For −2, √4 = 2 ≠ −2.', trap: 'Both candidates solve the squared equation, but only one solves the original.'},
    rule: 'A candidate from squaring is a solution only after substitution into the original.',
    check: {prompt: 'What is the valid solution of √(x + 2) = x?', answer: '2', explanation: 'Squaring gives (x − 2)(x + 1) = 0. Reject −1 because the square root is nonnegative; x = 2 works.'}, prerequisites: ['quadratic-formula']
  },
  {
    id: 'rational-equations', section: math, skill: 'Nonlinear Equations and Systems',
    title: 'Solve rational equations on their allowed domain', minutes: 7,
    intro: 'A denominator cannot be zero. Multiplying by a variable expression is useful only while retaining those excluded inputs.',
    steps: ['Record values that make any denominator zero.', 'Multiply by a common denominator and solve.', 'Reject excluded values and verify the remaining candidates.'],
    worked: {prompt: 'Solve 6/(x − 1) = 3.', setup: 'x ≠ 1. Multiply by x − 1: 6 = 3(x − 1).', solution: '6 = 3x − 3 gives x = 3. Check: 6/(3 − 1) = 3.', trap: 'A denominator restriction is part of the problem even if it vanishes during algebra.'},
    rule: 'State the exclusions first; solving a cleared equation cannot restore an excluded input.',
    check: {prompt: 'Solve 8/(x + 2) = 2.', answer: '2', explanation: 'x ≠ −2. Clearing the denominator gives 8 = 2x + 4, so x = 2.'}, prerequisites: ['expressions-rational', 'equations-multi-step']
  },
  {
    id: 'nonlinear-intersections', section: math, skill: 'Nonlinear Equations and Systems',
    title: 'Find intersections of a line and a curve', minutes: 8,
    intro: 'At an intersection, both equations give the same output for the same input. Set the output expressions equal, then recover both coordinates.',
    steps: ['Substitute one equation into the other or equate their outputs.', 'Solve the resulting nonlinear equation for all allowed inputs.', 'Find the corresponding outputs and answer the requested coordinate or count.'],
    worked: {prompt: 'The graphs y = x² and y = x + 6 intersect twice. What is the sum of the x-coordinates?', setup: 'x² = x + 6, so x² − x − 6 = (x − 3)(x + 2) = 0.', solution: 'The x-coordinates are 3 and −2, whose sum is 1. The intersection points are (3, 9) and (−2, 4).', trap: 'The output values 9 and 4 are not the requested x-coordinates.'},
    rule: 'Intersections solve both equations at once; equal outputs give a one-variable equation.',
    desmos: 'Graph both equations and inspect every intersection, then verify coordinates algebraically.',
    check: {prompt: 'How many distinct points satisfy y = x² and y = 4?', answer: '2', explanation: 'x² = 4 has x = −2 and x = 2, giving two intersections.'}, prerequisites: ['quadratic-formula', 'systems-elimination']
  },
  {
    id: 'quadratic-features', section: math, skill: 'Nonlinear Functions',
    title: 'Choose quadratic forms for roots and extrema', minutes: 8,
    intro: 'Factored form exposes zeros. Vertex form a(x − h)² + k exposes the vertex and a maximum or minimum. Complete the square to move from standard to vertex form.',
    steps: ['Decide whether the question asks for a zero or an extreme value.', 'Use factors for zeros; complete the square for the vertex.', 'Read the correct coordinate and check whether the graph opens upward or downward.'],
    worked: {prompt: 'What is the minimum value of f(x) = x² − 8x + 23?', setup: 'x² − 8x + 23 = (x − 4)² + 7.', solution: 'A square is at least zero, so the minimum output is 7, attained at x = 4.', trap: '4 is where the minimum occurs; 7 is the minimum value.'},
    rule: 'In a(x − h)² + k, the vertex is (h, k); the sign of a determines minimum or maximum.',
    check: {prompt: 'What is the minimum value of x² − 10x + 29?', answer: '4', explanation: 'x² − 10x + 29 = (x − 5)² + 4, so its minimum is 4.'}, prerequisites: ['nonlinear-functions', 'expressions-factoring']
  },
  {
    id: 'function-transformations', section: math, skill: 'Nonlinear Functions',
    title: 'Read shifts and evaluate transformed functions', minutes: 7,
    intro: 'In g(x) = af(x − h) + k, the inside change shifts the graph horizontally by h; the outside changes scale or reflect outputs and shift them vertically by k.',
    steps: ['Separate operations inside the function from operations on its output.', 'For evaluation, calculate the inside input first.', 'For graph features, move an original point (u, v) to (u + h, av + k).'],
    worked: {prompt: 'If f(2) = 7 and g(x) = f(x − 3) + 4, what is g(5)?', setup: 'At x = 5, the inside input is 5 − 3 = 2.', solution: 'g(5) = f(2) + 4 = 7 + 4 = 11.', trap: 'f(x − 3) shifts the graph right by 3. For evaluation, substitute before interpreting the shift.'},
    rule: 'Inside operations act on inputs; outside operations act on outputs.',
    check: {prompt: 'If f(4) = 9 and g(x) = 2f(x + 1) − 3, what is g(3)?', answer: '15', explanation: 'g(3) = 2f(4) − 3 = 18 − 3 = 15.'}, prerequisites: ['functions-tables-notation', 'nonlinear-functions']
  },
  {
    id: 'exponential-intervals', section: math, skill: 'Nonlinear Functions',
    title: 'Match exponential factors to the time interval', minutes: 8,
    intro: 'In A·b^(t/k), the factor b applies once every k time units. A percent increase uses b > 1; a percent decrease uses 0 < b < 1.',
    steps: ['Identify the initial amount, factor, and interval.', 'Convert elapsed time into the number of intervals.', 'Raise the factor to that interval count, then multiply by the initial amount.'],
    worked: {prompt: 'A population starts at 400 and increases 25% every 2 years. What does the model predict after 4 years?', setup: 'P(t) = 400(1.25)^(t/2). Four years is two growth intervals.', solution: 'P(4) = 400(1.25)² = 625.', trap: 'Using exponent 4 treats the 25% factor as an annual change instead of a two-year change.'},
    rule: 'Exponent = elapsed time divided by the time represented by one multiplier.',
    check: {prompt: 'A 640-gram sample halves every 3 hours. How many grams remain after 6 hours?', answer: '160', explanation: 'Six hours gives two half-life intervals: 640(1/2)² = 160.'}, prerequisites: ['nonlinear-functions', 'percentages', 'expressions-exponents']
  },
  {
    id: 'exponential-equations', section: math, skill: 'Nonlinear Equations and Systems',
    title: 'Solve exponential equations with common bases', minutes: 7,
    intro: 'Rewrite both sides using the same positive base other than 1. Equal powers of that base have equal exponents.',
    steps: ['Express each side as a power of the same base.', 'Use exponent rules to simplify nested powers.', 'Set the exponents equal and solve the resulting equation.'],
    worked: {prompt: 'Solve 4^(x + 1) = 64.', setup: '4^(x + 1) = (2²)^(x + 1) = 2^(2x + 2), while 64 = 2⁶.', solution: '2x + 2 = 6 gives x = 2. Check: 4³ = 64.', trap: 'The exponent 2 must multiply the whole expression x + 1.'},
    rule: 'With a shared base a > 0 and a ≠ 1, a^u = a^v implies u = v.',
    check: {prompt: 'Solve 3^(2x − 1) = 27.', answer: '2', explanation: '27 = 3³, so 2x − 1 = 3 and x = 2.'}, prerequisites: ['expressions-exponents', 'equations-multi-step']
  },
  {
    id: 'ratios-part-whole', section: math, skill: 'Ratios, Rates, Proportions, and Units',
    title: 'Distinguish part-to-part ratios from fractions of a whole', minutes: 6,
    intro: 'A ratio a:b compares two parts. If those are the only parts, the first occupies a/(a + b) of the total.',
    steps: ['Name what each part of the ratio represents.', 'Add ratio units when a total is given.', 'Find one ratio unit and multiply by the requested part.'],
    worked: {prompt: 'A blend contains red and blue beads in a 3:5 ratio. There are 64 beads total. How many are red?', setup: 'The whole has 3 + 5 = 8 ratio units. Each unit represents 64/8 = 8 beads.', solution: 'Red beads = 3(8) = 24.', trap: '3/5 compares red to blue; 3/8 is red’s fraction of the total.'},
    rule: 'For part-to-part a:b, use a + b to connect the ratio to the total.',
    check: {prompt: 'Two ingredients are mixed in a 2:7 ratio with total mass 45 grams. How many grams are the first ingredient?', answer: '10', explanation: 'There are 9 ratio units. Each is 5 grams, so the first ingredient is 2(5) = 10 grams.'}, prerequisites: ['rates-units']
  },
  {
    id: 'unit-conversions', section: math, skill: 'Ratios, Rates, Proportions, and Units',
    title: 'Convert compound and squared units', minutes: 7,
    intro: 'Use conversion fractions equal to 1 so unwanted units cancel. Area and volume conversions must square or cube the length conversion.',
    steps: ['Write the starting quantity with its units.', 'Multiply by conversion factors oriented to cancel old units.', 'Apply exponents to the entire conversion factor for area or volume.'],
    worked: {prompt: 'A surface has area 3 square feet. Using 1 foot = 12 inches, what is its area in square inches?', setup: '3 ft² × (12 in / 1 ft)² = 3 × 144 in².', solution: 'The area is 432 square inches.', trap: 'Multiplying by 12 converts a length. Each square foot has 12 × 12 square inches.'},
    rule: 'Conversion factors must carry the same power as the units they replace.',
    check: {prompt: 'A vehicle travels 90 kilometers per hour. How many meters per second is that? Use 1 km = 1,000 m and 1 hour = 3,600 s.', answer: '25', explanation: '90 × 1,000/3,600 = 25 meters per second.'}, prerequisites: ['rates-units']
  },
  {
    id: 'density-rates', section: math, skill: 'Ratios, Rates, Proportions, and Units',
    title: 'Use density as a rate per area or volume', minutes: 6,
    intro: 'Density compares an amount with the space containing it: mass/volume or population/area. Multiply density by the matching size to recover an amount.',
    steps: ['Identify the numerator and denominator units in the density.', 'Use amount = density × size or rearrange it.', 'Convert units before combining mismatched measurements.'],
    worked: {prompt: 'A material has density 2.7 grams per cubic centimeter and volume 20 cubic centimeters. What is its mass?', setup: '(2.7 g/cm³)(20 cm³) = 54 g.', solution: 'Its mass is 54 grams.', trap: 'Dividing volume by density does not leave mass units.'},
    rule: 'Density × volume = mass; population density × area = population.',
    check: {prompt: 'A district contains 1,200 people in 8 square kilometers. What is its population density per square kilometer?', answer: '150', explanation: '1,200 people / 8 km² = 150 people per km².'}, prerequisites: ['rates-units', 'unit-conversions']
  },
  {
    id: 'reverse-percent', section: math, skill: 'Percentages',
    title: 'Recover the original amount after a percent change', minutes: 7,
    intro: 'A final amount equals the original amount times a percent-change multiplier. To recover the original, divide the final amount by that multiplier.',
    steps: ['Decide whether the change increases or decreases the original.', 'Write final = original × (1 ± rate).', 'Divide by the multiplier and check by applying the change again.'],
    worked: {prompt: 'After a 20% discount, a jacket costs $72. What was its original price?', setup: '72 = 0.80p.', solution: 'p = 72/0.80 = 90 dollars. A 20% discount on $90 removes $18 and leaves $72.', trap: 'Adding 20% of $72 uses the discounted amount as the base and will not undo the discount.'},
    rule: 'Undo a percent change by dividing by its multiplier.',
    check: {prompt: 'After a 25% increase, a price is $150. What was the original price in dollars?', answer: '120', explanation: '1.25p = 150, so p = 120.'}, prerequisites: ['percentages']
  },
  {
    id: 'percent-comparison', section: math, skill: 'Percentages',
    title: 'Choose the reference amount in a percent comparison', minutes: 7,
    intro: '“A is p% greater than B” uses B as the base. Reversing the comparison changes the denominator and usually changes the percentage.',
    steps: ['Identify the reference amount after “than” or “of”.', 'Compute difference divided by reference amount.', 'Multiply by 100 and distinguish a percentage from percentage points.'],
    worked: {prompt: 'A quantity rises from 40 to 50. What is the percent increase?', setup: 'Increase = 10 and original reference amount = 40.', solution: '(10/40) × 100 = 25%. Falling from 50 back to 40 would be a 20% decrease because its base is 50.', trap: 'The same difference can represent different percentages when the reference changes.'},
    rule: 'Percent change = (new − original)/original × 100%.',
    check: {prompt: 'A quantity falls from 80 to 60. What is the percent decrease? Enter the positive number only.', answer: '25', explanation: 'The decrease is 20 out of the original 80, so 20/80 × 100 = 25%.'}, prerequisites: ['percentages']
  },
  {
    id: 'weighted-mean', section: math, skill: 'One-Variable Data',
    title: 'Find a mean from frequencies or combined groups', minutes: 7,
    intro: 'A mean is total value divided by total count. Multiply each value or group mean by its frequency before combining groups of different sizes.',
    steps: ['Calculate each group’s total using mean × count.', 'Add totals and counts separately.', 'Divide the combined total by the combined count.'],
    worked: {prompt: 'Four measurements have mean 6, and six other measurements have mean 11. What is the mean of all ten?', setup: 'The combined total is 4(6) + 6(11) = 24 + 66 = 90.', solution: 'The combined mean is 90/10 = 9.', trap: '(6 + 11)/2 assumes equal group sizes, which this problem does not have.'},
    rule: 'Weight by counts, then divide once by the total count.',
    check: {prompt: 'A data set contains two 3s and three 8s. What is its mean?', answer: '6', explanation: 'Total = 2(3) + 3(8) = 30; count = 5; mean = 6.'}, prerequisites: ['one-variable-data']
  },
  {
    id: 'data-spread-transformations', section: math, skill: 'One-Variable Data',
    title: 'Track center and spread when data change', minutes: 7,
    intro: 'Adding the same constant shifts mean and median but preserves distances and spread. Multiplying every value by a scales mean and median by a and standard deviation by |a|.',
    steps: ['Decide whether values are being shifted, scaled, or changed individually.', 'Apply the operation to measures of center.', 'Track distances separately for range, IQR, and standard deviation.'],
    worked: {prompt: 'A data set has mean 12 and standard deviation 3. Each value becomes 2x + 5. What is the new standard deviation?', setup: 'Multiplying by 2 doubles every distance from the mean; adding 5 shifts all values together.', solution: 'The standard deviation becomes 6. The new mean would be 2(12) + 5 = 29.', trap: 'Adding 5 does not add 5 to the standard deviation because spread depends on distances.'},
    rule: 'A shift changes location; a scale changes spread by its absolute value.',
    check: {prompt: 'A data set has standard deviation 4. Every value is increased by 9. What is its new standard deviation?', answer: '4', explanation: 'Adding the same constant preserves all distances from the mean, so standard deviation stays 4.'}, prerequisites: ['one-variable-data']
  },
  {
    id: 'data-distributions', section: math, skill: 'One-Variable Data',
    title: 'Read histograms, box plots, and resistant summaries', minutes: 7,
    intro: 'Histogram bars count values in intervals; a box plot marks quartiles and the median. Median and IQR resist extreme values more than mean and standard deviation do.',
    steps: ['Read the axis and decide whether marks represent counts, values, or quartiles.', 'For IQR, subtract the first quartile from the third.', 'Compare the requested feature without inferring exact values from broad intervals.'],
    worked: {prompt: 'A box plot has minimum 2, first quartile 5, median 8, third quartile 13, and maximum 20. What is the interquartile range?', setup: 'The middle half spans Q1 = 5 to Q3 = 13.', solution: 'IQR = 13 − 5 = 8. The overall range is 20 − 2 = 18.', trap: 'A box plot does not show every individual value or the mean.'},
    rule: 'IQR = Q3 − Q1. A frequency display counts observations; it does not list them individually.',
    check: {prompt: 'A histogram has 3 values in [0, 10), 7 in [10, 20), and 5 in [20, 30). How many values are below 20?', answer: '10', explanation: 'Add the first two interval counts: 3 + 7 = 10.'}, prerequisites: ['one-variable-data']
  },
  {
    id: 'scatterplot-models', section: math, skill: 'Two-Variable Data',
    title: 'Compare trends, model types, and prediction limits', minutes: 7,
    intro: 'A scatterplot can show direction, shape, and strength of an association. Equal additive changes suggest a linear model; equal multiplicative changes suggest an exponential model.',
    steps: ['Describe direction and shape before choosing a model.', 'Check whether equal input steps produce similar differences or ratios.', 'Use the model within a sensible domain and separate association from causation.'],
    worked: {prompt: 'For inputs 0, 1, 2, and 3, outputs are 5, 10, 20, and 40. Is a linear or exponential model appropriate?', setup: 'Output differences are 5, 10, 20; successive ratios are all 2.', solution: 'An exponential model y = 5·2^x matches the constant ratio.', trap: 'An increasing trend alone does not establish a linear relationship. Predicting far beyond observed inputs can be unreliable.'},
    rule: 'Constant difference suggests linear; constant ratio suggests exponential.',
    check: {prompt: 'For inputs 0, 1, 2, outputs are 7, 11, 15. Which model type fits: “linear” or “exponential”?', answer: 'linear', explanation: 'Outputs add 4 for each one-unit increase, so y = 7 + 4x is linear.'}, prerequisites: ['two-variable-data', 'nonlinear-functions']
  },
  {
    id: 'probability-two-way-tables', section: math, skill: 'Probability',
    title: 'Read joint, conditional, and complementary probabilities', minutes: 7,
    intro: 'A joint probability uses the full sample total. A conditional probability uses only a specified row or column. The probability of an event not occurring is 1 minus its probability.',
    steps: ['Locate the event’s cell or cells.', 'Identify the selection group to choose the denominator.', 'For a complement, subtract from 1 after using the same selection group.'],
    worked: {prompt: 'A class has 10 seniors and 15 juniors. Six seniors and nine juniors take art. Given that a student takes art, what is the probability the student is a senior?', setup: 'There are 6 + 9 = 15 art students, of whom 6 are seniors.', solution: 'The conditional probability is 6/15 = 0.4.', trap: '6/25 is the joint probability of being a senior and taking art. The given condition changes the denominator.'},
    rule: 'Condition first, then count. For a complement within that group, use 1 − p.',
    check: {prompt: 'A randomly selected member has probability 0.35 of arriving by bus. What is the probability the member does not arrive by bus?', answer: '0.65', explanation: 'The complement has probability 1 − 0.35 = 0.65.'}, prerequisites: ['probability']
  },
  {
    id: 'sample-population-estimates', section: math, skill: 'Sample Statistics and Margin of Error',
    title: 'Scale a random sample estimate to a population', minutes: 7,
    intro: 'A representative random sample can estimate a population proportion. Multiply the sample proportion by the population size for an estimated count; larger comparable random samples generally have smaller margins of error.',
    steps: ['Calculate favorable sample count divided by sample size.', 'Apply that proportion to the population of interest.', 'Describe the result as an estimate and retain sampling uncertainty.'],
    worked: {prompt: 'A random sample of 80 students contains 28 who walk to school. About how many of a school’s 1,200 students would this estimate as walkers?', setup: 'Sample proportion = 28/80 = 0.35.', solution: 'Estimated population count = 0.35(1,200) = 420 students.', trap: '420 is an estimate from a sample, not a guaranteed census count. A large biased sample can still mislead.'},
    rule: 'Estimated count = sample proportion × population size.',
    check: {prompt: 'In a random sample of 50 residents, 18 use a service. For a population of 2,000, what is the estimated number using it?', answer: '720', explanation: '18/50 = 0.36; 0.36 × 2,000 = 720.'}, prerequisites: ['sampling-margin', 'ratios-part-whole']
  },
  {
    id: 'sampling-bias', section: math, skill: 'Evaluating Statistical Claims',
    title: 'Identify a sample’s population and selection bias', minutes: 7,
    intro: 'A sample can support conclusions about the population it represents. Convenience samples, voluntary responses, and nonresponse can systematically miss some views; increasing size alone does not remove that bias.',
    steps: ['Name the population the claim concerns.', 'Compare that population with who had a chance to be selected.', 'Check whether selection or response is linked to the measured opinion or behavior.'],
    worked: {prompt: 'To estimate all city residents’ support for a park, a researcher surveys only visitors at that park. Which is the main concern: “selection bias” or “unit conversion”?', setup: 'Park visitors may differ from residents who never visit.', solution: 'Selection bias. The sample does not represent all residents merely because it contains many visitors.', trap: 'A large number of responses cannot fix a selection method that excludes relevant groups.'},
    rule: 'Generalization follows the sampling method and population, not simply the sample’s size.',
    check: {prompt: 'A school randomly samples only seniors. Can the design directly represent “seniors” or “all grades”?', answer: 'seniors', explanation: 'Only seniors could be selected, so the supported population is the school’s seniors.'}, prerequisites: ['statistical-claims']
  },
  {
    id: 'experiment-inference', section: math, skill: 'Evaluating Statistical Claims',
    title: 'Separate causal evidence from population generalization', minutes: 7,
    intro: 'Random assignment helps balance confounding factors between treatment groups and supports causal comparisons. Random sampling addresses whether a finding can be generalized to a population.',
    steps: ['Look for assignment of an intervention, not just observation.', 'Determine whether assignment was random.', 'Separately examine recruitment before generalizing beyond the participants.'],
    worked: {prompt: 'Volunteers are randomly assigned to a new tutoring method or a comparison method. Which feature supports a causal comparison: “random assignment” or “volunteering”?', setup: 'Random assignment determines which method each participant receives.', solution: 'Random assignment supports a causal comparison under the experiment’s conditions. Volunteering can limit generalization to all students.', trap: 'An experiment can support a treatment comparison without automatically representing every student.'},
    rule: 'Random assignment supports causation; representative random sampling supports generalization.',
    check: {prompt: 'Researchers only observe existing study habits and grades. Does this alone establish “association” or “causation”?', answer: 'association', explanation: 'Without random assignment, other factors may explain the relationship. Observation alone does not establish causation.'}, prerequisites: ['statistical-claims', 'sampling-bias']
  },
  {
    id: 'composite-area', section: math, skill: 'Area and Volume',
    title: 'Add or subtract areas in composite figures', minutes: 7,
    intro: 'Break a complicated region into familiar shapes. An unshaded hole is subtracted; adjoining nonoverlapping regions are added. A triangle’s height is perpendicular to its chosen base.',
    steps: ['Sketch the regions and label perpendicular dimensions.', 'Calculate each component with its own area formula.', 'Add or subtract to match the requested region and attach square units.'],
    worked: {prompt: 'A 12-by-8 rectangle contains a triangular hole with base 6 and perpendicular height 4. What is the remaining area?', setup: 'Rectangle area = 12(8) = 96. Triangle area = (1/2)(6)(4) = 12.', solution: 'Remaining area = 96 − 12 = 84 square units.', trap: 'A slanted side is not necessarily a triangle’s height, and a hole must be subtracted.'},
    rule: 'Area is additive across nonoverlapping pieces; subtract removed regions.',
    check: {prompt: 'A trapezoid has parallel bases 5 and 9 and perpendicular height 4. What is its area?', answer: '28', explanation: 'A = (1/2)(5 + 9)(4) = 28 square units.'}, prerequisites: ['area-volume']
  },
  {
    id: 'solid-volume', section: math, skill: 'Area and Volume',
    title: 'Use cylinder, cone, pyramid, and sphere formulas', minutes: 8,
    intro: 'Volume formulas combine a base area with a perpendicular height, or use a sphere’s radius. A cone or pyramid has one-third the volume of the matching cylinder or prism.',
    steps: ['Identify the solid and distinguish radius from diameter.', 'Use V = Bh for prisms/cylinders, V = Bh/3 for pyramids/cones, or V = 4πr³/3 for spheres.', 'Solve for the requested measurement and keep cubic units for volume.'],
    worked: {prompt: 'A cone has radius 3 and height 8. Its volume is kπ. What is k?', setup: 'V = (1/3)πr²h = (1/3)π(3²)(8).', solution: 'V = 24π, so k = 24. A cylinder with the same radius and height would have volume 72π.', trap: 'Using Bh without the one-third factor gives a cylinder’s volume.'},
    rule: 'Choose the formula by the solid; perpendicular height and slant height are different measurements.',
    check: {prompt: 'A sphere has radius 3. Its volume is kπ. What is k?', answer: '36', explanation: 'V = (4/3)π(3³) = 36π, so k = 36.'}, prerequisites: ['area-volume', 'expressions-exponents']
  },
  {
    id: 'geometry-scale-factors', section: math, skill: 'Area and Volume',
    title: 'Scale lengths, areas, and volumes with different powers', minutes: 7,
    intro: 'If similar figures have a length scale factor k, corresponding areas scale by k² and volumes by k³. Work backward with a square root or cube root when given the area or volume ratio.',
    steps: ['Identify whether the given ratio compares lengths, areas, or volumes.', 'Recover the length factor if needed.', 'Raise it to the power matching the requested measurement.'],
    worked: {prompt: 'Two similar solids have corresponding lengths in the ratio 2:3. What is larger volume divided by smaller volume?', setup: 'The larger length factor is 3/2.', solution: 'The volume factor is (3/2)³ = 27/8 = 3.375.', trap: 'The volume ratio is not the length ratio. Three independent dimensions change.'},
    rule: 'Length uses k, area k², and volume k³.',
    check: {prompt: 'A square’s side length is multiplied by 3. By what factor does its area increase?', answer: '9', explanation: 'Area scales by the square of the length factor: 3² = 9.'}, prerequisites: ['area-volume', 'expressions-exponents']
  },
  {
    id: 'parallel-line-angles', section: math, skill: 'Lines, Angles, and Triangles',
    title: 'Connect angles made by a transversal', minutes: 6,
    intro: 'Vertical angles are equal. For parallel lines cut by a transversal, corresponding and alternate interior angles are equal, while same-side interior angles sum to 180°.',
    steps: ['Use only lines marked or stated as parallel.', 'Mark equal-angle pairs and supplementary pairs.', 'Write one angle equation and answer the named angle.'],
    worked: {prompt: 'Two parallel lines are cut by a transversal. A same-side interior angle pair measures 3x + 10 degrees and 2x + 20 degrees. What is x?', setup: '(3x + 10) + (2x + 20) = 180.', solution: '5x + 30 = 180 gives x = 30. The angles are 100° and 80°.', trap: 'Same-side interior angles are supplementary, not generally equal.'},
    rule: 'Parallel-line markings justify equal or supplementary angle relationships; appearance alone does not.',
    check: {prompt: 'Two vertical angles measure 4x + 5 degrees and 65 degrees. What is x?', answer: '15', explanation: 'Vertical angles are equal: 4x + 5 = 65 gives x = 15.'}, prerequisites: ['angles-triangles', 'one-variable-equations']
  },
  {
    id: 'similar-triangles', section: math, skill: 'Lines, Angles, and Triangles',
    title: 'Match corresponding sides of similar triangles', minutes: 7,
    intro: 'Two equal angle pairs establish triangle similarity. Similar triangles have proportional corresponding sides; congruent triangles additionally have a length scale factor of 1.',
    steps: ['Use angle information to match vertices in order.', 'Write a ratio with matching sides in matching positions.', 'Solve the proportion and check the same scale factor against another pair.'],
    worked: {prompt: 'Triangles ABC and DEF are similar with A ↔ D, B ↔ E, C ↔ F. AB = 6, DE = 9, and BC = 8. What is EF?', setup: 'The scale from ABC to DEF is DE/AB = 9/6 = 1.5.', solution: 'EF corresponds to BC, so EF = 8(1.5) = 12.', trap: 'Mixing the order of corresponding sides creates a false proportion.'},
    rule: 'Match vertices before sides, and keep a consistent direction in every ratio.',
    check: {prompt: 'A triangle is enlarged by scale factor 2.5. A corresponding original side is 4. What is the enlarged side?', answer: '10', explanation: 'Corresponding lengths multiply by the same factor: 4 × 2.5 = 10.'}, prerequisites: ['angles-triangles', 'ratios-part-whole']
  },
  {
    id: 'special-right-triangles', section: math, skill: 'Right Triangles and Trigonometry',
    title: 'Use 45–45–90 and 30–60–90 ratios', minutes: 7,
    intro: 'A 45–45–90 triangle has side ratio 1:1:√2. A 30–60–90 triangle has ratio 1:√3:2 opposite 30°, 60°, and 90° respectively.',
    steps: ['Identify the special angle pattern.', 'Match the known side to its position in the ratio.', 'Scale every side by the same factor and identify the requested side.'],
    worked: {prompt: 'A 30–60–90 triangle has hypotenuse 14. What is its shorter leg?', setup: 'The hypotenuse is twice the shorter leg.', solution: 'The shorter leg is 14/2 = 7. The longer leg is 7√3.', trap: 'The side opposite 60° is the longer leg; neither leg equals the hypotenuse.'},
    rule: 'Write the angle-to-opposite-side match before scaling a special triangle.',
    check: {prompt: 'A 45–45–90 triangle has a leg of length 5. Its hypotenuse is 5√k. What is k?', answer: '2', explanation: 'Equal legs have hypotenuse leg × √2, so k = 2.'}, prerequisites: ['right-triangles', 'expressions-radicals']
  },
  {
    id: 'trigonometric-ratios', section: math, skill: 'Right Triangles and Trigonometry',
    title: 'Use sine, cosine, tangent, and complementary angles', minutes: 7,
    intro: 'For an acute angle in a right triangle, sine = opposite/hypotenuse, cosine = adjacent/hypotenuse, and tangent = opposite/adjacent. Complementary acute angles swap opposite and adjacent.',
    steps: ['Choose the reference angle and label its sides.', 'Use the ratio containing the known and requested quantities.', 'For complementary angles, use sin θ = cos(90° − θ).'],
    worked: {prompt: 'Relative to acute angle θ, a right triangle has opposite side 8 and hypotenuse 17. What is cos θ?', setup: 'The adjacent leg is √(17² − 8²) = √225 = 15.', solution: 'cos θ = adjacent/hypotenuse = 15/17.', trap: '8/17 is sin θ, not cos θ. The reference angle determines the side names.'},
    rule: 'SOH-CAH-TOA; complementary angles exchange sine and cosine.',
    check: {prompt: 'If sin 28° = cos k°, where k is acute, what is k?', answer: '62', explanation: 'Complementary angles total 90°, so k = 90 − 28 = 62.'}, prerequisites: ['right-triangles']
  },
  {
    id: 'circle-arcs-sectors', section: math, skill: 'Circles',
    title: 'Use a central angle as a fraction of a circle', minutes: 7,
    intro: 'An angle of θ degrees cuts out θ/360 of a circle’s circumference or area. Arc length is a length; sector area uses square units.',
    steps: ['Identify radius and central angle.', 'Multiply 2πr by θ/360 for arc length, or πr² by θ/360 for sector area.', 'Keep π exact unless a decimal is requested.'],
    worked: {prompt: 'A circle has radius 6. A 120° central angle intercepts an arc of length kπ. What is k?', setup: 'Arc length = (120/360)(2π·6).', solution: 'The arc is one-third of the circumference, so its length is 4π and k = 4.', trap: 'Using πr² gives a sector’s area rather than the requested arc length.'},
    rule: 'Angle fraction × whole circumference or whole area gives the matching part.',
    check: {prompt: 'A circle has radius 4. A 90° sector has area kπ. What is k?', answer: '4', explanation: '(90/360)π(4²) = 4π, so k = 4.'}, prerequisites: ['circles', 'area-volume']
  },
  {
    id: 'circle-radians', section: math, skill: 'Circles',
    title: 'Convert degrees and radians', minutes: 7,
    intro: 'A full turn is 360° = 2π radians. In radian measure, arc length s = rθ; this formula requires θ in radians.',
    steps: ['Convert degrees to radians by multiplying by π/180.', 'Use s = rθ only after confirming radian units.', 'For radian sector area, use A = r²θ/2.'],
    worked: {prompt: 'A circle has radius 10 and a central angle of 3π/5 radians. Its intercepted arc length is kπ. What is k?', setup: 's = rθ = 10(3π/5).', solution: 's = 6π, so k = 6. The angle is also 108°.', trap: 'Do not place a degree measure directly into s = rθ.'},
    rule: '180° = π radians; radians connect angle directly with arc length divided by radius.',
    check: {prompt: 'Write 150° as kπ radians. What is k? Enter a fraction.', answer: '5/6', explanation: '150(π/180) = 5π/6, so k = 5/6.'}, prerequisites: ['circle-arcs-sectors']
  },
  {
    id: 'circle-completing-square', section: math, skill: 'Circles',
    title: 'Recover a circle’s center from expanded form', minutes: 8,
    intro: 'Complete the square separately for x and y to rewrite an expanded circle equation in (x − h)² + (y − k)² = r² form.',
    steps: ['Group x terms and y terms, and move the constant.', 'Add the square of half each linear coefficient to both sides.', 'Read the center and take a positive square root for the radius.'],
    worked: {prompt: 'What is the radius of x² + y² − 6x + 4y = 12?', setup: '(x² − 6x + 9) + (y² + 4y + 4) = 12 + 9 + 4.', solution: '(x − 3)² + (y + 2)² = 25. The center is (3, −2) and radius is 5.', trap: 'Completing a square on the left also requires adding the same amount on the right.'},
    rule: 'For x² + bx, add (b/2)² to make (x + b/2)².',
    check: {prompt: 'What is the radius of x² + y² − 4x − 8y = 16?', answer: '6', explanation: 'Add 4 and 16: (x − 2)² + (y − 4)² = 36, so r = 6.'}, prerequisites: ['circles', 'quadratic-features']
  },
  {
    id: 'circle-angles-tangents', section: math, skill: 'Circles',
    title: 'Relate inscribed angles, arcs, and tangents', minutes: 7,
    intro: 'An inscribed angle equals half the measure of its intercepted arc. A radius to a point of tangency is perpendicular to the tangent line; the resulting right triangle can connect distances.',
    steps: ['Identify whether the angle’s vertex is at the center or on the circle.', 'Match the angle to the arc it intercepts.', 'At a tangent point, mark the radius-tangent right angle before using a triangle relationship.'],
    worked: {prompt: 'An inscribed angle intercepts an arc measuring 100°. What is the angle’s measure?', setup: 'An inscribed angle is half its intercepted arc.', solution: 'The angle is 50°. A central angle intercepting the same arc would measure 100°.', trap: 'Central and inscribed angles use different multipliers for the same arc.'},
    rule: 'Inscribed angle = half its arc. Radius ⟂ tangent at the contact point.',
    check: {prompt: 'A radius is drawn to the point where a tangent line touches a circle. What angle, in degrees, does the radius make with the tangent?', answer: '90', explanation: 'The radius and tangent are perpendicular at the point of tangency.'}, prerequisites: ['circles', 'angles-triangles', 'right-triangles']
  },
  {
    id: 'central-ideas-scope', section: rw, skill: 'Central Ideas and Details',
    title: 'Keep a summary within the passage’s scope', minutes: 7,
    intro: 'A central idea must account for the passage’s important details without claiming more than they establish. Watch group size, time limits, and words such as all, only, or always.',
    steps: ['Identify the subject and the author’s main statement about it.', 'Mark qualifications and limits.', 'Compare each proposed summary with the full passage, including its ending.'],
    worked: {prompt: 'Passage: “Three coastal towns restored dunes. During one storm, erosion was lower behind those dunes than on nearby unprotected beaches. The observation suggests that dune restoration can reduce local erosion.” Which summary fits: “possible local protection” or “complete coastal protection”?', setup: 'The finding concerns three towns and one storm and uses “can reduce.”', solution: 'Possible local protection preserves the passage’s limited claim.', trap: 'A strong-sounding summary can become wrong by replacing a qualified claim with a universal one.'},
    rule: 'A summary should preserve the author’s certainty, comparison, and boundaries.',
    check: {prompt: 'A passage reports a benefit in one tested species. Which scope fits: “that species” or “every species”?', answer: 'that species', explanation: 'A finding in one species does not by itself establish a result in all species.'}, prerequisites: ['central-ideas']
  },
  {
    id: 'literary-details', section: rw, skill: 'Central Ideas and Details',
    title: 'Read character actions and poetic details closely', minutes: 7,
    intro: 'Literary passages can reveal a character’s feelings indirectly through action, imagery, or a shift in attention. Use the details on the page before adding a motive or biography.',
    steps: ['Identify who is speaking or acting.', 'Describe the literal action or image first.', 'Connect repeated or contrasting details to the character’s immediate situation.'],
    worked: {prompt: 'Original passage: “Mira unfolded the letter, smoothed it twice, and placed it beside the untouched pen. She rehearsed an opening sentence, then crossed the room to close the window.” Which detail most directly shows hesitation about writing: “rehearsing without writing” or “the window’s location”?', setup: 'The untouched pen and rehearsed sentence delay the act of writing.', solution: 'Rehearsing without writing directly reveals hesitation. The passage does not establish why Mira hesitates.', trap: 'An inference about a specific hidden conflict would require evidence that the passage does not supply.'},
    rule: 'Tie an interpretation to an observable detail; distinguish the speaker from the author.',
    check: {prompt: 'Original lines: “I wait beside the gate; each passing footstep makes me turn.” Which feeling is supported: “anticipation” or “indifference”?', answer: 'anticipation', explanation: 'Waiting and turning toward footsteps suggest expectation of someone’s arrival.'}, prerequisites: ['central-ideas']
  },
  {
    id: 'evidence-textual', section: rw, skill: 'Command of Evidence',
    title: 'Choose a quotation that supports the whole claim', minutes: 7,
    intro: 'Evidence must address the claim’s precise action or relationship. A quotation mentioning the same person or topic can still fail to support what is being claimed.',
    steps: ['Restate the claim using its key relationship.', 'Predict the kind of detail that would demonstrate it.', 'Reject evidence that addresses only a related topic or a different point.'],
    worked: {prompt: 'Claim: A character values a friend’s judgment. Which original detail supports it: “she kept her friend’s address” or “she asked her friend to review each decision before acting”?', setup: 'Valuing judgment concerns relying on someone’s opinions.', solution: 'Asking the friend to review decisions directly supports the claim. Keeping an address establishes contact, not trust in judgment.', trap: 'A shared name or topic is not enough; the evidence must show the claimed relationship.'},
    rule: 'Match evidence to the entire claim, including what it says about its subject.',
    check: {prompt: 'Claim: A narrator notices small changes. Which evidence fits: “detects a newly missing tile” or “owns a large house”?', answer: 'detects a newly missing tile', explanation: 'Detecting a small change demonstrates attention to detail; home ownership does not.'}, prerequisites: ['command-evidence', 'literary-details']
  },
  {
    id: 'evidence-strengthen-weaken', section: rw, skill: 'Command of Evidence',
    title: 'Test the missing link in an explanation', minutes: 8,
    intro: 'A support or weaken question often turns on a specific predicted result. A competing cause can weaken an explanation without disproving every observation.',
    steps: ['Separate the observed result from the proposed cause.', 'Predict what evidence would be more likely if the explanation were correct.', 'Check whether a result supports that link or supplies an alternative.'],
    worked: {prompt: 'A scientist proposes that a coating slows evaporation because it blocks sunlight. Which result weakens that mechanism: “the coating also works in total darkness” or “the coating is inexpensive”?', setup: 'The proposed mechanism specifically depends on sunlight.', solution: 'A similar effect in total darkness weakens the sunlight-blocking explanation by showing that an effect occurs without sunlight.', trap: 'Weakening a mechanism does not necessarily show that the coating has no effect.'},
    rule: 'Target the explanation’s causal link rather than an unrelated favorable or unfavorable fact.',
    check: {prompt: 'Claim: Color alone attracts insects to a trap. Would equal catches from different colors “weaken” or “strengthen” the claim, with other conditions held constant?', answer: 'weaken', explanation: 'If color alone drives attraction, differing colors should produce differing attraction. Equal catches challenge that claim.'}, prerequisites: ['command-evidence', 'inferences']
  },
  {
    id: 'evidence-quantitative', section: rw, skill: 'Command of Evidence',
    title: 'Support a claim using a table or graph', minutes: 8,
    intro: 'Quantitative evidence requires matching the claim to the graphic’s actual groups, time intervals, measures, and units. Use a comparison that directly completes the passage’s reasoning.',
    steps: ['Read the title, axis labels, legend, and units.', 'Translate the claim into a specific comparison.', 'Find the values needed for that comparison and check its direction.'],
    worked: {prompt: 'A table gives seed germination: species A, 70% in light and 40% in darkness; species B, 45% in light and 45% in darkness. Which species supports the claim that light improves germination?', setup: 'Compare light against darkness within each species.', solution: 'Species A supports the claim: 70% is greater than 40%. Species B shows no difference in these measurements.', trap: 'Comparing A in light with B in darkness mixes species and does not isolate the stated within-species comparison.'},
    rule: 'Read the graphic before evaluating the claim; compare the same measure within the relevant groups.',
    check: {prompt: 'A table reports output before/after a change: method A, 12/18; method B, 15/14. Which method increased? Enter “A” or “B”.', answer: 'A', explanation: 'A rose from 12 to 18; B fell from 15 to 14.'}, prerequisites: ['command-evidence']
  },
  {
    id: 'evidence-graphic-limits', section: rw, skill: 'Command of Evidence',
    title: 'Avoid unsupported claims about a graphic', minutes: 7,
    intro: 'A graph establishes what it measures, at the displayed scale. Higher totals do not necessarily mean higher rates; a correlation in the graphic does not establish a cause.',
    steps: ['Check whether the display shows counts, percentages, or rates.', 'Compare the requested groups using the same denominator.', 'Reject claims about unmeasured causes or periods outside the display.'],
    worked: {prompt: 'A table reports 30 riders out of 60 residents in town A and 40 riders out of 200 residents in town B. Which town has the larger proportion of riders?', setup: 'Town A: 30/60 = 50%. Town B: 40/200 = 20%.', solution: 'Town A has the larger proportion, even though town B has more riders in total.', trap: 'A count and a proportion answer different questions.'},
    rule: 'Match count with count and rate with rate; state only relationships the display supports.',
    check: {prompt: 'A bar graph shows test scores for two groups but no information about teaching methods. Does it directly establish a difference in “scores” or “causes”?', answer: 'scores', explanation: 'The graph measures scores. It does not identify what caused any difference.'}, prerequisites: ['evidence-quantitative']
  },
  {
    id: 'inferences-scientific', section: rw, skill: 'Inferences',
    title: 'Complete a scientific argument cautiously', minutes: 8,
    intro: 'Scientific inferences connect results to a hypothesis while respecting study conditions. When two factors vary together, the passage may not identify which factor explains the result.',
    steps: ['Identify the hypothesis and the actual comparison.', 'Separate measured observations from proposed explanations.', 'Choose a conclusion whose certainty matches the evidence.'],
    worked: {prompt: 'Plants given both extra water and extra light grew taller than untreated plants. Which inference follows: “the combined treatment may promote growth” or “light alone caused the increase”?', setup: 'The experiment changed water and light together.', solution: 'The combined treatment may promote growth. The comparison does not isolate the effect of light alone.', trap: 'A conclusion about one component requires evidence distinguishing that component from the others.'},
    rule: 'Infer at the level the comparison supports; do not isolate an unisolated cause.',
    check: {prompt: 'A material passed tests only at room temperature. Is performance at freezing temperatures “established” or “unresolved”?', answer: 'unresolved', explanation: 'The tests do not cover freezing temperatures, so performance there remains unresolved.'}, prerequisites: ['inferences', 'evidence-strengthen-weaken']
  },
  {
    id: 'inferences-literary', section: rw, skill: 'Inferences',
    title: 'Infer an attitude from contrasting details', minutes: 7,
    intro: 'A narrator’s words and actions can point in different directions. An inference should reconcile those details without adding an unsupported event or motive.',
    steps: ['List what the narrator says and what the narrator does.', 'Notice tensions, repetitions, and changes.', 'Select the attitude supported by several details together.'],
    worked: {prompt: 'Original passage: “Jon called the old workshop useless, yet he returned every Saturday to polish its tools and mend its shelves.” Which inference fits: “he retains an attachment” or “he plans to demolish it tomorrow”?', setup: 'His dismissive words contrast with repeated care for the workshop.', solution: 'He retains an attachment. The repeated care supports that inference despite his stated dismissal.', trap: 'An inference about tomorrow’s demolition invents an event absent from the text.'},
    rule: 'Use the pattern across details; keep a narrator’s possible attitude separate from an invented plot.',
    check: {prompt: 'A speaker says she is unconcerned but checks the arrival board repeatedly. Which inference fits: “she is watchful” or “she has forgotten the arrival”?', answer: 'she is watchful', explanation: 'Repeated checking supports attention and watchfulness, even if the speaker claims unconcern.'}, prerequisites: ['inferences', 'literary-details']
  },
  {
    id: 'text-purpose', section: rw, skill: 'Text Structure and Purpose',
    title: 'Identify the whole passage’s purpose', minutes: 7,
    intro: 'A purpose answer describes what the author accomplishes, such as explaining a finding or challenging a belief. A topic label alone does not explain why the passage was written.',
    steps: ['Summarize the passage’s beginning, middle, and ending.', 'Find the action tying those parts together.', 'Check whether the proposed purpose covers the entire passage without overstating its argument.'],
    worked: {prompt: 'A passage introduces an old dating method, describes a new measurement technique, and explains why the new technique revises earlier estimates. Is its purpose to “explain a revision” or “list laboratory equipment”?', setup: 'The method comparison leads to changed estimates.', solution: 'Its purpose is to explain a revision. Equipment may appear as a detail but does not organize the passage.', trap: 'A detail’s topic can be true while missing the author’s overall purpose.'},
    rule: 'Describe the author’s action, then check the ending to confirm the purpose.',
    check: {prompt: 'A passage states a common belief, presents contrary data, and offers a revised account. Does it “challenge a belief” or “give travel directions”?', answer: 'challenge a belief', explanation: 'The progression from belief to contrary evidence to revision challenges the original belief.'}, prerequisites: ['text-structure', 'central-ideas-scope']
  },
  {
    id: 'text-structure-shifts', section: rw, skill: 'Text Structure and Purpose',
    title: 'Track a concession, example, or shift in an argument', minutes: 7,
    intro: 'A sentence’s function depends on its relationship to surrounding ideas. A concession acknowledges a point; an objection challenges one; an example illustrates one.',
    steps: ['State the claim immediately before the target sentence.', 'Describe whether the target supports, limits, illustrates, or opposes it.', 'Check the next sentence to see how the author uses that move.'],
    worked: {prompt: 'Original passage: “The new bridge reduced travel times. Its construction, however, disrupted nearby businesses for a year. Planners therefore recommend more support for merchants during future projects.” What does the second sentence do?', setup: 'It acknowledges a cost before the passage proposes a response.', solution: 'It qualifies the favorable account by identifying a drawback.', trap: 'Mentioning a drawback does not reject the travel-time benefit described in the first sentence.'},
    rule: 'Label the relationship between sentences instead of repeating the target sentence’s subject.',
    check: {prompt: 'A sentence says “Admittedly, the sample was small” after a finding. Does it offer a “qualification” or “definition”?', answer: 'qualification', explanation: 'It limits confidence in the finding rather than defining a term.'}, prerequisites: ['text-structure']
  },
  {
    id: 'cross-text-response', section: rw, skill: 'Cross-Text Connections',
    title: 'Predict one author’s response using stated evidence', minutes: 8,
    intro: 'A response question asks how one text’s reasoning bears on a precise claim in the other. Preserve partial agreement and avoid attributing a position that neither text states.',
    steps: ['Identify the particular claim being answered.', 'Find the second author’s relevant evidence or principle.', 'Form a response that uses that evidence without extending the author’s view.'],
    worked: {prompt: 'Text 1: “No seeds survive years in seawater.” Text 2: “Several seeds germinated after six years submerged in saltwater tanks.” Would Text 2 “challenge the absolute claim” or “prove all seeds survive”?', setup: 'Text 2 supplies some counterexamples to the claim that none survive.', solution: 'It challenges the absolute claim. Several surviving seeds do not establish that every seed survives.', trap: 'Disproving “none” requires a counterexample; it does not prove “all.”'},
    rule: 'Respond to the exact claim, keeping each author’s quantifiers and limits.',
    check: {prompt: 'Text 1 says a tool is always reliable. Text 2 documents one failure. Does Text 2 “challenge always” or “prove never”?', answer: 'challenge always', explanation: 'One failure refutes an exceptionless claim, but it does not show the tool never works.'}, prerequisites: ['cross-text', 'inferences']
  },
  {
    id: 'cross-text-agreement', section: rw, skill: 'Cross-Text Connections',
    title: 'Find the narrow point two authors share', minutes: 7,
    intro: 'Texts can agree on an observation while disagreeing on its cause or importance. A shared conclusion must be supported independently by both texts.',
    steps: ['List each author’s observation and explanation separately.', 'Identify the overlap in their actual claims.', 'Reject agreements that one text merely leaves open or never addresses.'],
    worked: {prompt: 'Text 1 says evening attendance rose because the museum lowered prices. Text 2 says attendance rose because evening buses became more frequent. Do they agree on the “attendance increase” or “cause”?', setup: 'Both affirm higher attendance but propose different causes.', solution: 'They agree on the attendance increase. Agreement on the observation does not establish agreement on its cause.', trap: 'A common topic is weaker than a common claim; identify exactly what both affirm.'},
    rule: 'Test an agreement against each text separately.',
    check: {prompt: 'Both texts call a poem influential, but only Text 1 calls it optimistic. Which is shared: “influence” or “optimism”?', answer: 'influence', explanation: 'Both affirm influence. Only one explicitly affirms optimism.'}, prerequisites: ['cross-text']
  },
  {
    id: 'words-multiple-meanings', section: rw, skill: 'Words in Context',
    title: 'Choose a familiar word’s contextual meaning', minutes: 7,
    intro: 'Common words can have specialized or figurative meanings. Replace the word in its particular sentence rather than choosing the first definition you remember.',
    steps: ['Read the complete sentence and the surrounding explanation.', 'Predict the action or quality the target word expresses.', 'Substitute a candidate and check both grammar and meaning.'],
    worked: {prompt: 'In “The committee entertained the proposal for an hour before rejecting it,” does “entertained” mean “amused” or “considered”?', setup: 'A proposal is being discussed and evaluated.', solution: 'Considered fits the committee’s action. The sentence does not describe amusing the proposal.', trap: 'A familiar meaning can be grammatically possible in other contexts yet wrong here.'},
    rule: 'Use the sentence to select a sense of the word, not merely a dictionary association.',
    check: {prompt: 'In “The evidence bears on the question of timing,” does “bears on” mean “is relevant to” or “carries physically”?', answer: 'is relevant to', explanation: 'The phrase describes how evidence relates to an issue.'}, prerequisites: ['words-context']
  },
  {
    id: 'words-precision', section: rw, skill: 'Words in Context',
    title: 'Choose a precise word from a logical clue', minutes: 7,
    intro: 'For a blank, predict both the meaning and its direction. Contrast markers, explanations, and degree words can distinguish near-synonyms.',
    steps: ['Find the sentence’s contrast, cause, or explanation.', 'Predict a plain-language meaning before choosing a word.', 'Check whether the candidate is too strong, too weak, or opposite in direction.'],
    worked: {prompt: 'Choose “tentative” or “definitive”: “Because the sample was small and replication is pending, the conclusion remains ____.”', setup: 'The small sample and pending replication limit certainty.', solution: 'Tentative expresses a provisional conclusion; definitive would conflict with the caution.', trap: 'A positive-sounding word may reverse the passage’s intended level of certainty.'},
    rule: 'Match meaning, direction, and degree; a root clue alone does not settle the answer.',
    check: {prompt: 'Choose “corroborate” or “contradict”: “The independent measurements matched the earlier result and thus ____ it.”', answer: 'corroborate', explanation: 'Matching independent measurements support, or corroborate, the earlier result.'}, prerequisites: ['words-context']
  },
  {
    id: 'boundaries-dependent-clauses', section: rw, skill: 'Boundaries',
    title: 'Attach dependent clauses to complete sentences', minutes: 7,
    intro: 'Words such as although, because, and when can make a clause dependent. A dependent clause cannot stand alone as a sentence, even when it has a subject and verb.',
    steps: ['Locate the subject and finite verb in each clause.', 'Check for a subordinating word that leaves a thought incomplete.', 'Join an introductory dependent clause to a main clause with appropriate punctuation.'],
    worked: {prompt: 'Choose “comma” or “period”: “Although the trail was muddy __ the hikers continued.”', setup: '“Although the trail was muddy” is dependent; “the hikers continued” is independent.', solution: 'Use a comma: “Although the trail was muddy, the hikers continued.”', trap: 'A period would leave an introductory dependent clause as a fragment.'},
    rule: 'A subject and verb do not guarantee independence; read the clause’s opening word.',
    check: {prompt: 'Is “Because the sample was damaged.” a “fragment” or “complete sentence”?', answer: 'fragment', explanation: 'Because makes the clause dependent; it needs an independent clause to complete the thought.'}, prerequisites: ['boundaries']
  },
  {
    id: 'boundaries-nonessential', section: rw, skill: 'Boundaries',
    title: 'Set off nonessential phrases on both sides', minutes: 7,
    intro: 'An inserted nonessential element can be enclosed by paired commas, dashes, or parentheses. A necessary identifying element is not automatically separated from the noun it identifies.',
    steps: ['Read the sentence with the inserted element removed.', 'Decide whether the element is supplemental or essential to identification.', 'Use a matched pair of punctuation marks if the sentence resumes afterward.'],
    worked: {prompt: 'Choose “comma” or “no punctuation”: “The workshop, a former train depot __ now houses a ceramics studio.”', setup: '“A former train depot” is a supplemental description opened with a comma.', solution: 'Use a comma to close it: “The workshop, a former train depot, now houses a ceramics studio.”', trap: 'One comma leaves the interruption unclosed and can separate the subject from its main verb incorrectly.'},
    rule: 'An interruption inside a continuing sentence needs a beginning and an end.',
    check: {prompt: 'Choose “comma” or “semicolon”: “The instrument, invented in 1910 __ remains in use.”', answer: 'comma', explanation: 'The comma closes the supplemental phrase begun after “instrument.”'}, prerequisites: ['boundaries']
  },
  {
    id: 'boundaries-colons-dashes', section: rw, skill: 'Boundaries',
    title: 'Introduce an explanation with a complete lead-in', minutes: 7,
    intro: 'A colon can follow a complete clause to introduce an explanation, example, or list. A single dash can also introduce a final explanation. Do not split a verb from its required object.',
    steps: ['Read the words before the proposed colon as a sentence.', 'Check whether the following material explains or illustrates that complete thought.', 'Avoid a colon immediately after an incomplete phrase such as “including” or “consists of.”'],
    worked: {prompt: 'Choose “colon” or “no punctuation”: “The kit contains __ a lens, a clamp, and a cable.”', setup: '“The kit contains” still requires its object and is not a complete thought.', solution: 'Use no punctuation: “The kit contains a lens, a clamp, and a cable.” A valid colon version is “The kit contains three items: a lens, a clamp, and a cable.”', trap: 'The presence of a list does not by itself justify a colon.'},
    rule: 'A colon needs a complete clause before it; what follows may be a phrase or list.',
    check: {prompt: 'Choose “colon” or “comma”: “One obstacle remained __ the missing permit.”', answer: 'colon', explanation: '“One obstacle remained” is a complete clause, and the following phrase identifies that obstacle.'}, prerequisites: ['boundaries', 'boundaries-dependent-clauses']
  },
  {
    id: 'boundaries-coordination', section: rw, skill: 'Boundaries',
    title: 'Distinguish clauses from shared-subject verbs', minutes: 7,
    intro: 'A comma plus a coordinating conjunction can join independent clauses. When one subject shares two verbs, no clause boundary is usually needed between those verbs.',
    steps: ['Find a subject for each finite verb.', 'Check whether the words after the conjunction form an independent clause.', 'Avoid placing punctuation between a subject and its verb or between a verb and its object.'],
    worked: {prompt: 'Choose “comma” or “no comma”: “The researcher labeled the samples __ and stored them in a freezer.”', setup: 'Both “labeled” and “stored” share the subject “the researcher.”', solution: 'Use no comma. “And stored them in a freezer” has no separate subject and is not an independent clause.', trap: 'Seeing “and” is not enough to require a comma; examine the clause structure.'},
    rule: 'Comma + and/but/so can join two independent clauses; check both subjects.',
    check: {prompt: 'Choose “comma” or “no comma”: “The crew finished the repair __ and the bridge reopened.”', answer: 'comma', explanation: '“The crew finished the repair” and “the bridge reopened” are independent clauses joined by and.'}, prerequisites: ['boundaries']
  },
  {
    id: 'grammar-verb-forms', section: rw, skill: 'Form, Structure, and Sense',
    title: 'Find the finite verb a sentence needs', minutes: 7,
    intro: 'A main clause needs a finite verb. An -ing form or infinitive can describe or complement another element without supplying that main verb.',
    steps: ['Find the subject and ask what finite verb completes its clause.', 'Separate descriptive participles and infinitives from main verbs.', 'Check whether the blank must finish an existing verb phrase or supply a new one.'],
    worked: {prompt: 'Choose “reveals” or “revealing”: “The image, captured with a new telescope, ____ an unusually faint ring.”', setup: '“Captured with a new telescope” describes the image. The main subject still needs a finite verb.', solution: 'Reveals completes the clause: “The image ... reveals an unusually faint ring.”', trap: 'Revealing alone would leave the sentence without a finite main verb.'},
    rule: 'Do not mistake a descriptive -ing or -ed phrase for the sentence’s main verb.',
    check: {prompt: 'Choose “measures” or “measuring”: “The sensor ____ changes in pressure.”', answer: 'measures', explanation: 'The clause needs the finite verb “measures”; “measuring” alone would form a fragment.'}, prerequisites: ['form-structure-sense', 'boundaries-dependent-clauses']
  },
  {
    id: 'grammar-tense-aspect', section: rw, skill: 'Form, Structure, and Sense',
    title: 'Place actions on the sentence’s timeline', minutes: 7,
    intro: 'Verb tense and aspect show when events occur and how they relate. Choose a form from the passage’s time markers rather than forcing every verb into the same tense.',
    steps: ['Identify explicit dates and words such as before, since, and by the time.', 'Place each event on a timeline.', 'Use a form consistent with the intended timing and ongoing or completed state.'],
    worked: {prompt: 'Choose “had ended” or “will end”: “By the time the team arrived yesterday, the presentation ____.”', setup: 'Arrival occurred in the past; the presentation ended earlier than that past arrival.', solution: 'Had ended marks the earlier completed past action.', trap: 'Will end refers to a future event and conflicts with the established past timeline.'},
    rule: 'Past perfect can mark an event completed before another past event; context determines whether it is needed.',
    check: {prompt: 'Choose “has operated” or “will operate”: “The observatory opened in 2018 and ____ continuously since then.”', answer: 'has operated', explanation: 'Since then connects a past starting point with continuing operation through the present.'}, prerequisites: ['grammar-verb-forms']
  },
  {
    id: 'grammar-modifiers', section: rw, skill: 'Form, Structure, and Sense',
    title: 'Put the intended doer beside an opening modifier', minutes: 7,
    intro: 'An introductory participial phrase usually describes the subject of the clause that follows. The grammatical subject must be the person or thing that performs the introductory action.',
    steps: ['Identify who performs the action in the opening phrase.', 'Make that doer the subject immediately after the phrase.', 'Read the completed sentence literally to check for an unintended meaning.'],
    worked: {prompt: 'Choose “the engineer noticed a crack” or “a crack caught the engineer’s attention”: “Inspecting the frame, ____.”', setup: 'The engineer, not the crack, is inspecting the frame.', solution: '“The engineer noticed a crack” places the intended doer as the next clause’s subject.', trap: 'A sentence can sound natural while assigning the opening action to an impossible subject.'},
    rule: 'After an opening action phrase, name the thing performing that action.',
    check: {prompt: 'Choose “the biologist photographed the nest” or “the nest was photographed”: “Walking along the shore, ____.”', answer: 'the biologist photographed the nest', explanation: 'The biologist is walking. The nest is not the doer of the opening action.'}, prerequisites: ['form-structure-sense']
  },
  {
    id: 'grammar-pronouns', section: rw, skill: 'Form, Structure, and Sense',
    title: 'Match pronouns to a clear antecedent', minutes: 7,
    intro: 'A pronoun must agree with its intended antecedent in number and refer clearly to it. Determine the antecedent from the sentence’s structure and meaning.',
    steps: ['Identify the noun the pronoun is intended to replace.', 'Check singular or plural agreement.', 'Read the surrounding sentence to confirm an unambiguous reference.'],
    worked: {prompt: 'Choose “its” or “their”: “The two telescopes adjusted ____ mirrors automatically.”', setup: 'The antecedent is the plural “two telescopes.”', solution: 'Their agrees with the plural antecedent: “The two telescopes adjusted their mirrors automatically.”', trap: 'A nearby singular noun does not override the intended plural antecedent.'},
    rule: 'Trace the pronoun back to its actual antecedent before choosing its form.',
    check: {prompt: 'Choose “its” or “their”: “The museum revised ____ schedule.”', answer: 'its', explanation: 'The museum is a singular institution, so “its schedule” agrees.'}, prerequisites: ['form-structure-sense']
  },
  {
    id: 'grammar-possessives', section: rw, skill: 'Form, Structure, and Sense',
    title: 'Distinguish plurals, possessives, and contractions', minutes: 7,
    intro: 'A plural names more than one; a possessive shows ownership or relationship. Its is possessive, while it’s means it is or it has. Regular plural possessives place the apostrophe after s.',
    steps: ['Decide whether the sentence needs a count or a possessive relationship.', 'Determine whether the possessor is singular or plural.', 'Expand a possible contraction to test whether it fits.'],
    worked: {prompt: 'Three artists share one studio. Choose “artist’s” or “artists’”: “The ____ studio opens at noon.”', setup: 'The possessor is the plural noun artists.', solution: 'Artists’ shows possession by multiple artists: “The artists’ studio opens at noon.”', trap: 'Artist’s would indicate one artist. Artists without an apostrophe would be a plain plural.'},
    rule: 'Count first, then mark possession. Test it’s by substituting it is or it has.',
    check: {prompt: 'Choose “its” or “it’s”: “The device stores data in ____ internal memory.”', answer: 'its', explanation: 'The sentence needs the possessive determiner its. “It is internal memory” does not fit.'}, prerequisites: ['grammar-pronouns']
  },
  {
    id: 'transitions-concession-result', section: rw, skill: 'Transitions',
    title: 'Separate a result from a concession', minutes: 7,
    intro: 'Therefore signals a supported result; nevertheless signals that a statement holds despite an obstacle. Read the logic without the transition before choosing one.',
    steps: ['State the expectation created by the first idea.', 'Decide whether the next idea fulfills or defies that expectation.', 'Choose a transition whose relationship the passage actually supports.'],
    worked: {prompt: 'Choose “Nevertheless” or “Consequently”: “The soil was unusually dry. ____, the drought-tolerant plants survived.”', setup: 'Dry soil creates a potential obstacle to survival.', solution: 'Nevertheless signals survival despite that obstacle. Consequently would frame survival as a result of dry soil.', trap: 'A transition can be grammatically valid while claiming the wrong logical relationship.'},
    rule: 'Result: because of that. Concession: despite that.',
    check: {prompt: 'Choose “Therefore” or “Nevertheless”: “The sample exceeded the instrument’s capacity. ____, the team used a larger instrument.”', answer: 'therefore', explanation: 'The larger instrument is a response resulting from the capacity limit.'}, prerequisites: ['transitions']
  },
  {
    id: 'transitions-addition-clarification', section: rw, skill: 'Transitions',
    title: 'Distinguish another point from a restatement', minutes: 7,
    intro: 'Moreover adds a further supporting point. In other words restates the same point more clearly. For example introduces a specific instance of a general statement.',
    steps: ['Compare what information each sentence contributes.', 'Decide whether the second adds, restates, or exemplifies.', 'Test the transition against that exact relationship.'],
    worked: {prompt: 'Choose “In other words” or “Moreover”: “The reaction is reversible. ____, it can proceed in either direction.”', setup: 'The second sentence explains what reversible means.', solution: 'In other words marks a restatement or clarification rather than a separate additional fact.', trap: 'Two compatible statements do not always call for an addition transition.'},
    rule: 'Ask whether the second sentence gives more information, the same idea again, or one example.',
    check: {prompt: 'Choose “For instance” or “In other words”: “Some insects navigate by the sun. ____, certain ants use its position to orient themselves.”', answer: 'for instance', explanation: 'The ants provide a specific example of the general statement.'}, prerequisites: ['transitions']
  },
  {
    id: 'synthesis-audience-goal', section: rw, skill: 'Rhetorical Synthesis',
    title: 'Adapt a synthesis to its audience and goal', minutes: 7,
    intro: 'A writing goal can ask you to introduce unfamiliar material, emphasize a contribution, or explain a result. Choose the notes needed for that particular reader and purpose.',
    steps: ['Identify what the audience already knows.', 'Select the facts needed to achieve the requested purpose.', 'Check accuracy, relevance, and whether a relationship is made explicit.'],
    worked: {prompt: 'Notes: Luma is a fictional lunar probe. It maps craters. Its camera weighs 8 kg. Goal: introduce Luma to readers unfamiliar with it. Which fact is most necessary: “probe and mission” or “camera mass”?', setup: 'An introduction needs to identify what Luma is and what it does.', solution: 'Probe and mission provide the essential introduction. Camera mass alone leaves readers without basic context.', trap: 'A specific factual detail is not automatically the most relevant fact for the stated audience.'},
    rule: 'Let audience and purpose determine the essential context.',
    check: {prompt: 'To explain an invention’s significance, choose notes about its “impact” or its “storage location”.', answer: 'impact', explanation: 'Impact explains why the invention matters; storage location alone does not.'}, prerequisites: ['rhetorical-synthesis']
  },
  {
    id: 'synthesis-comparisons', section: rw, skill: 'Rhetorical Synthesis',
    title: 'Make a requested comparison explicit', minutes: 7,
    intro: 'A comparison should state the shared feature or difference the task requests. Two true facts placed together may fail to express the intended relationship.',
    steps: ['Identify whether the goal asks for a similarity, difference, or relative amount.', 'Select comparable facts about both subjects.', 'Use an explicit relationship without adding unsupported evaluation.'],
    worked: {prompt: 'Notes: Method A uses 12 mL of solvent per test; method B uses 8 mL. Goal: emphasize B’s lower solvent use. Which fits: “B uses 4 mL less per test” or “B is superior in every way”?', setup: 'The notes support a specific difference: 12 − 8 = 4 mL.', solution: 'B uses 4 mL less per test. This directly expresses the requested difference.', trap: 'A measured advantage in one feature does not establish universal superiority.'},
    rule: 'Compare the same feature and express only the relationship the notes establish.',
    check: {prompt: 'Both artists work with clay, but only one uses a kiln. To emphasize a similarity, choose “material” or “firing method”.', answer: 'material', explanation: 'Clay is the shared material. The firing method is a difference.'}, prerequisites: ['rhetorical-synthesis']
  }
);

LESSONS.push(
  {
    id: 'polynomial-roots', section: math, skill: 'Nonlinear Equations and Systems',
    title: 'Read all roots from a factored polynomial', minutes: 7,
    intro: 'A product is zero exactly when at least one factor is zero. Repeated factors repeat a root’s multiplicity, not its distinct numerical value.',
    steps: ['Set each nonconstant factor equal to zero.', 'List the distinct solutions and note any repeated factors.', 'Answer the requested root, sum, product, or count rather than the factor constants.'],
    worked: {prompt: 'How many distinct real solutions does (x − 2)²(x + 5) = 0 have?', setup: 'The factors vanish at x = 2 and x = −5.', solution: 'There are two distinct real solutions. The repeated factor makes 2 a double root, not two different numbers.', trap: 'A polynomial’s degree does not automatically equal its number of distinct real roots.'},
    rule: 'For a zero product, solve each factor; count distinct numerical roots only once.',
    check: {prompt: 'What is the sum of the distinct roots of (x − 1)(x + 3)(x − 4) = 0?', answer: '2', explanation: 'The roots are 1, −3, and 4. Their sum is 2.'}, prerequisites: ['expressions-factoring', 'nonlinear-equations']
  },
  {
    id: 'nonlinear-domains', section: math, skill: 'Nonlinear Functions',
    title: 'Check a nonlinear function’s domain and output', minutes: 7,
    intro: 'A real square root requires a nonnegative radicand; a rational function excludes zeros of its denominator. An absolute-value function measures distance and is nonnegative before outside changes.',
    steps: ['Find operations that restrict allowed inputs.', 'Apply square-root and denominator conditions before substituting.', 'Evaluate the function in order, then distinguish allowed inputs from possible outputs.'],
    worked: {prompt: 'What is the least real input allowed for f(x) = √(x − 7)?', setup: 'The radicand must satisfy x − 7 ≥ 0.', solution: 'The domain is x ≥ 7, so its least input is 7. f(7) = 0.', trap: '7 is an input boundary, while 0 is an output. For 1/(x − 7), x = 7 would instead be excluded.'},
    rule: 'Square-root radicand ≥ 0; denominator ≠ 0; |u| is the distance of u from zero.',
    check: {prompt: 'For f(x) = |x − 4| + 2, what is f(1)?', answer: '5', explanation: 'f(1) = |1 − 4| + 2 = 3 + 2 = 5.'}, prerequisites: ['nonlinear-functions', 'expressions-rational']
  },
  {
    id: 'formulas-rearrangement', section: math, skill: 'Nonlinear Equations and Systems',
    title: 'Isolate one variable in a formula', minutes: 7,
    intro: 'Treat every letter except the requested variable as a parameter. Reverse the operations around that variable and state restrictions when dividing or taking roots.',
    steps: ['Identify the variable to isolate.', 'Use inverse operations on both sides, preserving grouped factors.', 'Choose the allowed sign when the variable represents a positive length or amount.'],
    worked: {prompt: 'A circle has area A = πr². For A > 0 and r > 0, which expression gives r: “√(A/π)” or “A/π²”?', setup: 'Divide by π to get r² = A/π, then take the positive square root.', solution: 'r = √(A/π). Positivity of a radius selects the positive root.', trap: 'The square root must apply to the entire quotient A/π.'},
    rule: 'Isolate a powered variable before taking its root; a context can restrict the sign.',
    check: {prompt: 'For V = πr²h, r = 3, and V = 45π, what is h?', answer: '5', explanation: 'h = V/(πr²) = 45π/(9π) = 5.'}, prerequisites: ['equations-parameters', 'expressions-radicals', 'area-volume']
  },
  {
    id: 'perimeter-surface-area', section: math, skill: 'Area and Volume',
    title: 'Distinguish perimeter, surface area, and volume', minutes: 7,
    intro: 'Perimeter totals a boundary’s lengths. Surface area totals the areas of exposed faces, while volume measures enclosed space. Count only the faces or edges the problem includes.',
    steps: ['Name the requested measurement and its units.', 'Sketch and count the relevant edges or faces.', 'Use lengths for perimeter, face areas for surface area, and cubic units for volume.'],
    worked: {prompt: 'A closed rectangular box has length 5, width 4, and height 3. What is its surface area?', setup: 'Opposite faces match: SA = 2(lw + lh + wh).', solution: 'SA = 2(20 + 15 + 12) = 94 square units. Its volume would be 60 cubic units.', trap: 'An open box would exclude a face. A closed box includes all six faces.'},
    rule: 'Perimeter sums lengths; surface area sums exposed face areas; volume fills space.',
    check: {prompt: 'A rectangle has length 7 and width 3. What is its perimeter?', answer: '20', explanation: 'P = 2(7 + 3) = 20 units.'}, prerequisites: ['area-volume', 'composite-area']
  },
  {
    id: 'triangle-congruence', section: math, skill: 'Lines, Angles, and Triangles',
    title: 'Identify information that proves a triangle relationship', minutes: 7,
    intro: 'Congruence requires enough information to fix a triangle’s size and shape, such as SSS, SAS, ASA, AAS, or right-triangle hypotenuse-leg. AA proves similarity but does not fix size.',
    steps: ['List the known matching angles and sides.', 'Check whether a stated angle is between the known sides when using SAS.', 'Distinguish a similarity conclusion from a congruence conclusion.'],
    worked: {prompt: 'Two triangles have two pairs of equal corresponding angles but no side lengths are known. Is “similarity” or “congruence” guaranteed?', setup: 'Equal corresponding angles establish AA similarity.', solution: 'Similarity is guaranteed. One triangle could be a larger scaled copy, so congruence is not guaranteed.', trap: 'AAA fixes shape but allows different sizes. SSA is also not a general congruence rule.'},
    rule: 'AA fixes shape; a suitable matching side condition is needed to fix size.',
    check: {prompt: 'Two triangles have all three pairs of corresponding sides equal. Which rule proves congruence: “SSS” or “AA”?', answer: 'SSS', explanation: 'Three matching side pairs satisfy the side-side-side congruence rule.'}, prerequisites: ['similar-triangles']
  },
  {
    id: 'boundaries-conjunctive-adverbs', section: rw, skill: 'Boundaries',
    title: 'Punctuate however between complete clauses', minutes: 7,
    intro: 'However and therefore label a logical relationship but do not act like coordinating conjunctions. Between two independent clauses, use an appropriate sentence boundary before them.',
    steps: ['Check whether both sides are independent clauses.', 'Use a semicolon or period for the boundary when a conjunctive adverb follows.', 'Use a comma after a sentence-opening however or therefore when it serves as a transition.'],
    worked: {prompt: 'Choose “comma” or “semicolon”: “The route was shorter __ however, it was steeper.”', setup: '“The route was shorter” and “it was steeper” are independent clauses.', solution: 'Use a semicolon: “The route was shorter; however, it was steeper.”', trap: 'However does not make a comma splice correct. A comma plus however is different from a comma plus but.'},
    rule: 'Two independent clauses need a real boundary even when however or therefore signals their relationship.',
    check: {prompt: 'Choose “comma” or “semicolon”: “The permit arrived __ therefore, work could begin.”', answer: 'semicolon', explanation: 'Both clauses are complete. Therefore supplies the logical relationship, while the semicolon supplies the boundary.'}, prerequisites: ['boundaries', 'transitions']
  }
);
