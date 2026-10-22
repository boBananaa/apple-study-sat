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
