// Original teaching notes and examples inspired by the credited video chapters.
// These are tutorial examples, not official SAT questions or a video transcript.
// Mathematical limits and current testing rules override broad claims in the video.
export const VIDEO = {
  id: 'jCT0jTVzKy0',
  title: "The only SAT Math Desmos Guide you'll ever need",
  creator: 'LearnSATMath',
  url: 'https://www.youtube.com/watch?v=jCT0jTVzKy0',
  durationSeconds: 2017,
  reviewedOn: '2026-10-22',
  transcript: 'auto-generated'
};

export const CHAPTERS = [
  {id:'functions-regressions',title:'Functions & regressions',seconds:60},
  {id:'systems',title:'Systems of equations',seconds:212},
  {id:'single-variable',title:'Single-variable equations',seconds:368},
  {id:'inequalities',title:'Inequalities',seconds:639},
  {id:'equivalent-expressions',title:'Equivalent expressions',seconds:751},
  {id:'in-terms-of',title:'In terms of',seconds:1385},
  {id:'element-lists',title:'Element lists',seconds:1496},
  {id:'mean-median',title:'Mean & median',seconds:1651},
  {id:'geometry',title:'Geometry',seconds:1723},
  {id:'limitations',title:'Limits and choosing a method',seconds:1858}
];

const D = {
  functions:'https://help.desmos.com/hc/en-us/articles/4405177116941-Functions',
  graphs:'https://help.desmos.com/hc/en-us/articles/4406040715149-Getting-Started-Desmos-Graphing-Calculator',
  settings:'https://help.desmos.com/hc/en-us/articles/4405296853517-Graph-Settings',
  tables:'https://help.desmos.com/hc/en-us/articles/4405489674381-Tables',
  regression:'https://help.desmos.com/hc/en-us/articles/4406972958733-Regressions',
  nonlinear:'https://help.desmos.com/hc/en-us/articles/360042428612-Nonlinear-Regressions',
  inequalities:'https://help.desmos.com/hc/en-us/articles/4407885334285-Inequalities-and-Restrictions',
  lists:'https://help.desmos.com/hc/en-us/articles/4407889068557-Lists',
  stats:'https://help.desmos.com/hc/en-us/articles/4405633253389-Statistics',
  supported:'https://help.desmos.com/hc/en-us/articles/212235786-Supported-Functions',
  assessment:'https://help.desmos.com/hc/en-us/articles/30913914831757-Assessment-Resources-FAQ',
  configuration:'https://www.desmos.com/assessment-pdfs/CollegeBoard_Desmos_Calculator.pdf',
  directions:'https://satsuite.collegeboard.org/media/pdf/english-sat-test-directions-bb.pdf',
  policy:'https://satsuite.collegeboard.org/in-school-assessments/calculator-policy'
};

export const DESMOS_TIPS = [
  {
    id:'function-value',title:'Evaluate a defined function',chapterId:'functions-regressions',seconds:60,
    skills:['Linear Functions','Nonlinear Functions'],patterns:['\\bf\\s*\\([^)]*\\)','value of (?:the )?function','evaluate'],
    steps:['Define the function exactly as given.', 'Enter the requested input in function notation.', 'Check whether the question wants the output or an expression involving it.'],
    example:{lines:['f(x)=2x^2-3','f(4)'],result:'f(4) = 29; the requested output is 29.'},
    caution:'f(4) asks for an output; f(x)=4 asks for inputs. These are different tasks. Preserve the function’s domain.',
    recognition:'A named function and a specified input usually call for direct substitution.',docs:[D.functions],searchTerms:['function notation','evaluate','substitute','output']
  },
  {
    id:'function-translations',title:'Check horizontal and vertical shifts',chapterId:'functions-regressions',seconds:70,
    skills:['Linear Functions','Nonlinear Functions'],patterns:['translat','shift','f\\s*\\(\\s*x\\s*[+-]'],
    steps:['Define the original function.', 'Graph the proposed shifted function using f(x).', 'Track a known point to confirm the shift’s direction.'],
    example:{lines:['f(x)=x^2','g(x)=f(x-3)+2'],result:'The vertex moves from (0,0) to (3,2): right 3 and up 2.'},
    caution:'An inside change reverses the horizontal direction: f(x-3) shifts right. A graph is a check, not a substitute for reading the requested change.',
    recognition:'Inside changes move inputs; outside additions move outputs.',docs:[D.functions,D.graphs],searchTerms:['translation','shift','vertex','transformation']
  },
  {
    id:'intercepts-and-answer-format',title:'Read an intercept and enter the right quantity',chapterId:'functions-regressions',seconds:73,
    skills:['Linear Functions','Linear Equations in One Variable','Nonlinear Functions'],patterns:['intercept','where.*cross','student.produced','decimal','fraction'],
    steps:['Graph the equation and select the required axis crossing.', 'Read x for a horizontal intercept or y for a vertical intercept.', 'Use an exact fraction when practical and follow Bluebook’s response directions.'],
    example:{lines:['y=3x-8','8/3'],result:'The x-intercept is (8/3,0). If asked for its x-coordinate, enter 8/3, not 0.'},
    caution:'A calculator label may be rounded. Bluebook permits 5 characters for positive answers and 6 including a minus sign; use improper fractions or permitted decimals, without units, %, commas, or $. Follow the question’s rounding. Official directions allow truncation or rounding at the fourth digit when a decimal is too long; they do not guarantee credit for any shortened display.',
    recognition:'Set the other coordinate to zero, then report the requested coordinate with its correct sign.',docs:[D.graphs,D.directions],searchTerms:['x intercept','y intercept','SPR','rounding','fraction','decimal entry']
  },
  {
    id:'linear-table-fit',title:'Fit a line to paired data',chapterId:'functions-regressions',seconds:107,
    skills:['Linear Functions','Two-Variable Data'],patterns:['table','two points','line.*through','line of best fit','linear model'],
    steps:['Enter corresponding x and y values in a table or equal-length lists.', 'Fit y_1 ~ m x_1 + b.', 'Read the requested slope, intercept, or predicted output and check its units.'],
    example:{lines:['x_1=[1,3]','y_1=[5,11]','y_1 ~ m x_1+b'],result:'The fitted line is y = 3x + 2, so its slope is 3.'},
    caution:'Two distinct x-values determine a line; a larger noisy data set gives a best fit rather than an exact rule. Extrapolation beyond observed data needs care.',
    recognition:'Paired points plus an assumed linear form can determine slope and intercept.',docs:[D.tables,D.regression],searchTerms:['table','linear regression','slope','intercept','best fit','residual']
  },
  {
    id:'quadratic-table-fit',title:'Determine quadratic coefficients from points',chapterId:'functions-regressions',seconds:175,
    skills:['Nonlinear Functions','Two-Variable Data'],patterns:['quadratic.*table','three points','quadratic function','ax.?2.*bx'],
    steps:['Enter at least three given points with distinct x-values.', 'Use the quadratic form y_1 ~ a x_1^2 + b x_1 + c.', 'Use the fitted coefficients only after checking the stated model and points.'],
    example:{lines:['x_1=[0,1,2]','y_1=[1,4,9]','y_1 ~ a x_1^2+b x_1+c'],result:'a=1, b=2, c=1, giving f(x)=x²+2x+1.'},
    caution:'Three points determine a polynomial of degree at most 2, but do not prove an arbitrary real-world process is quadratic. With noisy data the fit need not pass through each point.',
    recognition:'A specified quadratic form has three coefficients to determine from independent conditions.',docs:[D.regression,D.nonlinear],searchTerms:['quadratic regression','coefficients','three points','parabola']
  },
  {
    id:'system-intersection',title:'Solve a system by its common points',chapterId:'systems',seconds:264,
    skills:['Systems of Linear Equations','Nonlinear Equations and Systems','Linear Equations in Two Variables'],patterns:['system','simultaneous','intersection','both equations'],
    steps:['Enter both equations using x and y for the unknowns.', 'Select every relevant intersection in a suitable viewing window.', 'Translate its coordinates back to the original variables and requested quantity.'],
    example:{lines:['y=2x+1','y=-x+10'],result:'The intersection is (3,7), so x=3 and y=7. Their sum, if requested, is 10.'},
    caution:'An absent visible crossing does not establish no solutions. Check the window, domain, and algebra; nonlinear systems may have several intersections.',
    recognition:'A solution of a system must satisfy every equation at once.',docs:[D.graphs,D.settings],searchTerms:['system','intersection','two equations','coordinate']
  },
  {
    id:'slider-tangency',title:'Explore a parameter, then certify tangency',chapterId:'systems',seconds:297,
    skills:['Nonlinear Equations and Systems','Nonlinear Functions'],patterns:['exactly one','tangent','one real solution','value of.*constant','parameter'],
    steps:['Graph both expressions and create a slider for the parameter.', 'Observe where two intersections merge into one.', 'Verify the exact parameter using a vertex or a discriminant.'],
    example:{lines:['y=x^2','y=4x+c','c=-4'],result:'At c=−4, (x−2)²=0, giving one intersection at (2,4).'},
    caution:'Dragging close to tangency is not an exact proof. For this example, x²−4x−c=0 has discriminant 16+4c; setting it to zero certifies c=−4.',
    recognition:'A line touching a parabola once often corresponds to a repeated quadratic root.',docs:[D.graphs,D.nonlinear],searchTerms:['slider','tangency','discriminant','one solution','constant']
  },
  {
    id:'left-right-roots',title:'Turn a one-variable equation into two graphs',chapterId:'single-variable',seconds:368,
    skills:['Linear Equations in One Variable','Nonlinear Equations and Systems'],patterns:['solve for','solution','root','absolute value','radical equation'],
    steps:['Enter y equal to the original left side.', 'Enter y equal to the original right side.', 'Read intersection x-values and substitute candidates into the original equation.'],
    example:{lines:['y=abs(x-2)','y=5'],result:'The intersections give x=−3 and x=7. The positive solution is 7.'},
    caution:'A square or absolute value can yield zero, one, or two real solutions; other equations can yield more. Domain restrictions and the requested positive/negative solution still matter.',
    recognition:'Equal outputs occur at intersections; the equation’s solutions are their inputs.',docs:[D.graphs,D.settings],searchTerms:['left hand side','right hand side','LHS RHS','absolute value','all roots']
  },
  {
    id:'parameter-root-choices',title:'Test a root written in terms of a parameter',chapterId:'single-variable',seconds:459,
    skills:['Nonlinear Equations and Systems','Equivalent Expressions'],patterns:['in terms of','positive solution','constant k','parameter'],
    steps:['Keep the parameter as a slider and graph the original equation’s two sides.', 'For a legal parameter value, compare each candidate with the required root.', 'Use counterexamples to eliminate choices, then verify the remaining expression algebraically.'],
    example:{lines:['k=7','y=x^2','y=k+9','sqrt(k+9)'],result:'At k=7 the positive root is 4. In general it is √(k+9) when k>−9.'},
    caution:'A match at one slider value does not prove a formula. Choose allowed inputs and preserve branch conditions; k=−9 has root 0 rather than a positive root.',
    recognition:'For a parameter answer, test values to find failures and use algebra to confirm what holds for all allowed values.',docs:[D.functions,D.graphs],searchTerms:['parameter','in terms of k','positive root','candidate expression']
  },
  {
    id:'parameter-point-trace',title:'Check points defined by a free parameter',chapterId:'single-variable',seconds:557,
    skills:['Linear Equations in Two Variables','Systems of Linear Equations'],patterns:['each real','every real','ordered pair','point.*terms','lies on.*equation'],
    steps:['Graph the original equation or common line.', 'Plot the candidate ordered pair using a slider for its parameter.', 'Substitute its coordinate expressions into every equation to verify the identity.'],
    example:{lines:['y=2x+1','r=0','(r,2r+1)'],result:'For every real r, (r,2r+1) satisfies y=2x+1 because 2r+1=2r+1.'},
    caution:'Tracing several positions is only a visual check. Test every choice: the creator corrected the video’s 9:17 example to note that both B and D work.',
    recognition:'“For every real parameter” asks for an identity after substituting both coordinates.',docs:[D.functions,D.graphs],searchTerms:['parameter point','ordered pair','point tracing','every real number','coincident']
  },
  {
    id:'inequality-feasibility',title:'Test the overlap of inequality regions',chapterId:'inequalities',seconds:639,
    skills:['Linear Inequalities','Linear Equations in Two Variables'],patterns:['inequal','satisfies both','at least','at most','feasible'],
    steps:['Enter every inequality with its correct comparison sign.', 'Find the overlap of all shaded regions.', 'Test a proposed point in every inequality, including boundary and context restrictions.'],
    example:{lines:['y<=-x+8','y<=x+2','x>=0','y>=0','(2,3)'],result:'(2,3) satisfies all four inequalities, so it is feasible.'},
    caution:'Strict inequalities exclude their dashed boundaries. Integer or nonnegative restrictions from a word problem are additional conditions, not automatic properties of a shaded region.',
    recognition:'A feasible point belongs to every required region, not just one.',docs:[D.inequalities],searchTerms:['inequality','overlap','feasible region','boundary','candidate point']
  },
  {
    id:'inequality-extrema',title:'Find a maximum or minimum over the allowed region',chapterId:'inequalities',seconds:706,
    skills:['Linear Inequalities'],patterns:['maximum','minimum','greatest','least','largest','smallest'],
    steps:['Graph all constraints and identify the entire feasible region.', 'Track the requested coordinate or objective toward its extreme.', 'Check relevant boundaries and vertices, and whether an extreme is actually attained.'],
    example:{lines:['y<=-x+8','y<=x+2','x>=0','y>=0'],result:'The greatest y is 5 at (3,5); the greatest x is 8 at (8,0). The requested coordinate determines which point matters.'},
    caution:'The crossing of two lines is not always the requested extreme. An open or unbounded region can lack a maximum or minimum; round integer answers only toward feasible values.',
    recognition:'Optimization asks which allowed point gives the best requested value, not merely where two lines meet.',docs:[D.inequalities,D.graphs],searchTerms:['maximum','minimum','optimization','vertex','feasible region']
  },
  {
    id:'graphical-equivalence',title:'Compare expressions without losing their domains',chapterId:'equivalent-expressions',seconds:751,
    skills:['Equivalent Expressions','Nonlinear Functions'],patterns:['equivalent','rewrit','same expression','identical'],
    steps:['Rename the expression’s input consistently to x, keeping other letters as parameters; graph it as y=f(x).', 'Graph a candidate or evaluate the difference at legal inputs.', 'Use algebra to confirm the form and preserve any excluded inputs.'],
    example:{lines:['y=(x^2-1)/(x-1)','y=x+1'],result:'The expressions agree for x≠1, but the original quotient is undefined at x=1.'},
    caution:'Overlapping plots can hide a hole or a small difference outside the visible window. A finite set of agreeing inputs is not a general identity proof.',
    recognition:'Equivalent forms must preserve value on the original expression’s allowed inputs.',docs:[D.functions,D.inequalities],searchTerms:['equivalent expressions','graph overlap','domain','rational simplification']
  },
  {
    id:'custom-rational-fit',title:'Fit a specified rational model',chapterId:'equivalent-expressions',seconds:878,
    skills:['Nonlinear Functions','Two-Variable Data'],patterns:['rational','asymptote','a\\s*/','function.*table'],
    steps:['Enter the given paired data.', 'Use ~ with the rational form supplied by the problem.', 'Check each fitted value and exclude denominator zeros.'],
    example:{lines:['x_1=[0,3,6]','y_1=[-4,8,2]','y_1 ~ a/(x_1-b)'],result:'The model is f(x)=8/(x−2), so a=8 and b=2; x=2 is excluded.'},
    caution:'A nonlinear fit may have nonunique or poor parameter estimates. A low error does not establish a universal identity; verify the specified form and all constraints.',
    recognition:'If the needed model is absent from a preset menu, write its custom regression form with ~.',docs:[D.regression,D.nonlinear],searchTerms:['custom regression','rational function','denominator','table','asymptote']
  },
  {
    id:'polynomial-from-zeros',title:'Use known zeros as data points',chapterId:'equivalent-expressions',seconds:925,
    skills:['Nonlinear Functions','Equivalent Expressions','Nonlinear Equations and Systems'],patterns:['zeros','roots.*polynomial','monic','x.intercepts'],
    steps:['Translate each zero r into the point (r,0).', 'Fit the specified polynomial form using those points.', 'Use a known leading coefficient or another point to fix the scale.'],
    example:{lines:['x_1=[-2,1,4]','y_1=[0,0,0]','y_1 ~ x_1^3+b x_1^2+c x_1+d'],result:'The monic cubic is x³−3x²−6x+8; b=−3, c=−6, d=8.'},
    caution:'Zeros alone do not determine a polynomial’s scale or necessarily its degree. This example explicitly fixes the leading coefficient to 1 and uses degree 3.',
    recognition:'A zero is a point with output 0; a leading coefficient or extra condition fixes the scale.',docs:[D.regression,D.nonlinear],searchTerms:['polynomial','zeros','factored form','monic','leading coefficient']
  },
  {
    id:'coefficient-list-identity',title:'Recover coefficients from an equivalent form',chapterId:'equivalent-expressions',seconds:1000,
    skills:['Equivalent Expressions','Nonlinear Functions'],patterns:['a.*b.*c','standard form','factored form','coefficient','equivalent.*form'],
    steps:['Choose distinct legal inputs and store them as x_1.', 'Fit the given expression to the requested coefficient form.', 'Check the result by expanding or comparing coefficients exactly.'],
    example:{lines:['x_1=[-2,-1,0,1,2]','2(x_1+1)(x_1-3) ~ a x_1^2+b x_1+c','a+b+c'],result:'a=2, b=−4, c=−6; the requested sum a+b+c is −8.'},
    caution:'List fitting is numerical. Exact polynomial identities require justified degree bounds and exact agreement or algebraic verification; arbitrary sampled functions need not agree elsewhere.',
    recognition:'A whole expression can generate data, but its algebraic structure still determines what a fit can prove.',docs:[D.lists,D.regression,D.nonlinear],searchTerms:['coefficient identity','x_1 list','standard form','expand','sum of coefficients']
  },
  {
    id:'radicals-and-exponent-fit',title:'Translate radicals and check an unknown exponent',chapterId:'equivalent-expressions',seconds:1077,
    skills:['Equivalent Expressions','Nonlinear Equations and Systems'],patterns:['radical','root','exponent','power','sqrt','cbrt'],
    steps:['Enter radicals with sqrt, cbrt, or the nthroot template; check the root’s index.', 'Use only allowed positive base values when fitting a common unknown exponent.', 'Verify the exponent with exponent rules and preserve the original real domain.'],
    example:{lines:['sqrt(81)','cbrt(27)','32^(1/5)','y_1=[2,3,4,5]','sqrt(y_1^3) ~ y_1^p'],result:'The root examples give 9, 3, and 2. For positive bases, the fitted identity has p=3/2.'},
    caution:'Radical identities can change on negative inputs; √(x²)=|x|, not always x. A numerical exponent fit is a check, and a single input such as 1 cannot identify the exponent.',
    recognition:'Keep the base’s domain and the root index visible before converting a radical to a power.',docs:[D.supported,D.nonlinear],searchTerms:['radical','square root','cube root','nth root','exponent regression','fractional exponent']
  },
  {
    id:'vertex-constraints-counterexample',title:'Respect all quadratic constraints',chapterId:'equivalent-expressions',seconds:1135,
    skills:['Nonlinear Functions','Equivalent Expressions'],patterns:['vertex','opens upward','must be true','f.*equals.*f','constant.*negative'],
    steps:['Use equal outputs at distinct inputs to locate the quadratic’s symmetry axis.', 'Encode the coefficient, opening direction, and vertex restrictions together.', 'Test a proposed “must” claim with a fully valid counterexample, then confirm the algebra.'],
    example:{lines:['x_1=[-2,-1,0,1,2]','k=-1','a(x_1-2)^2+k ~ a x_1^2-8x_1+c'],result:'For a quadratic symmetric about x=2 with linear coefficient −8, a=2 and c=8+k. The valid choice k=−1 gives c=7, disproving “c must be negative.”'},
    caution:'Changing one slider while ignoring another condition can create an invalid counterexample. One fit does not establish what must hold for every admissible quadratic.',
    recognition:'For “must be true,” a counterexample must satisfy every condition; examples that work cannot prove universality.',docs:[D.nonlinear,D.regression],searchTerms:['vertex','symmetry','constraints','counterexample','must be true','coefficient']
  },
  {
    id:'regression-nonuniqueness',title:'Do not confuse one fitted solution with all solutions',chapterId:'equivalent-expressions',seconds:1250,
    skills:['Nonlinear Equations and Systems','Equivalent Expressions'],patterns:['all solutions','integer constants','must.*integer','positive solution','negative solution'],
    steps:['Ask whether the parameter equation can have more than one solution.', 'Treat a fitted parameter as one candidate, not a complete root list.', 'Graph or solve algebraically to identify every relevant branch.'],
    example:{lines:['a^2 ~ 25','y=x^2','y=25'],result:'a²=25 permits a=5 and a=−5. A regression may report just one; the graphs intersect at x=5 and x=−5.'},
    caution:'Neither regression nor the presence of a square guarantees two roots. For example, x²=0 has one real root, and x²=−1 has none.',
    recognition:'A solver output is a candidate; an “all,” “positive,” or “must” request needs a completeness check.',docs:[D.nonlinear,D.graphs],searchTerms:['nonunique','all roots','multiple solutions','regression limitations','integer constants']
  },
  {
    id:'literal-in-terms',title:'Check a literal equation with legal parameter values',chapterId:'in-terms-of',seconds:1385,
    skills:['Linear Equations in Two Variables','Equivalent Expressions'],patterns:['in terms of','solve.*for.*[a-z]','literal equation','reciprocal'],
    steps:['Choose a permitted value for the known parameter.', 'Solve numerically for the requested variable, using a graph or one regression.', 'Test candidate formulas at additional legal values and verify by rearranging the original equation.'],
    example:{lines:['a=3','5b+2a ~ 21','(21-2a)/5','p=3','q=6','1/p+1/q ~ 1/r','p*q/(p+q)'],result:'At a=3, b=3; generally b=(21−2a)/5. For the separate reciprocal equation, p=3 and q=6 give r=2; generally r=pq/(p+q) on the original allowed domain.'},
    caution:'Choose values that distinguish choices and avoid forbidden denominators. One numerical match does not prove a formula; nonlinear literal equations may have multiple branches.',
    recognition:'“In terms of” asks for a relationship valid throughout the allowed parameter domain.',docs:[D.regression,D.nonlinear,D.functions],searchTerms:['literal equation','in terms of','parameter substitution','rearrange','formula']
  },
  {
    id:'combined-list-regression',title:'Fit shared unknowns in one list equation',chapterId:'element-lists',seconds:1496,
    skills:['Systems of Linear Equations','Nonlinear Equations and Systems'],patterns:['system','sum.*product','product.*sum','simultaneous','element list'],
    steps:['Put each equation’s left side in the same list.', 'Put the corresponding right sides in a matching-order list.', 'Use one ~ expression, then verify every equation and any alternate solutions.'],
    example:{lines:['[a+b,a*b] ~ [11,30]'],result:'The valid pairs are (a,b)=(5,6) and (6,5). A single fitted result may show only one pair.'},
    caution:'Separate regressions can use separate local fitted parameters. A combined fit shares them, but numerical fitting can still fail or return one of several solutions.',
    recognition:'When unknowns must satisfy several conditions together, keep all residuals in one shared fit.',docs:[D.lists,D.regression,D.nonlinear],searchTerms:['element list','combined regression','shared parameters','simultaneous constraints']
  },
  {
    id:'three-constraint-quadratic',title:'Combine point values with a vertex condition',chapterId:'element-lists',seconds:1551,
    skills:['Nonlinear Functions','Nonlinear Equations and Systems'],patterns:['vertex','f\\s*\\(','three.*condition','quadratic'],
    steps:['Define a quadratic with unknown coefficients.', 'Convert each given function value and vertex location into a matching equation.', 'Fit all constraints together and evaluate the requested output.'],
    example:{lines:['f(x)=a x^2+b x+c','[f(0),f(1),-b/(2a)] ~ [3,2,1]','f(4)'],result:'The constraints give a=1, b=−2, c=3, so the requested output f(4) is 11.'},
    caution:'Three stated constraints can still be dependent: equal outputs at x=0 and x=2 already imply symmetry about x=1 for a quadratic. Check independence; a≠0 is required for the vertex formula.',
    recognition:'Count independent conditions, not just the number of equations written.',docs:[D.regression,D.nonlinear,D.lists],searchTerms:['three equations','vertex formula','function values','quadratic coefficients','independent conditions']
  },
  {
    id:'percentage-chains',title:'Model chained percent relationships',chapterId:'element-lists',seconds:1598,
    skills:['Percentages','Ratios, Rates, Proportions, and Units','Systems of Linear Equations'],patterns:['percent','percentage','%','discount','greater than','less than'],
    steps:['Identify the base amount for each percentage statement.', 'Convert percent greater/less into multipliers and write every relationship.', 'Calculate directly or combine the relationships in one list fit; report the requested amount.'],
    example:{lines:['[d,c] ~ [80(1-0.25),1.5d]','200(1-0.20)(1-0.10)'],result:'If d is 25% less than 80 and c is 50% greater than d, d=60 and c=90. Separately, successive 20% and 10% discounts on $200 leave $144.'},
    caution:'50% greater means 1.5 times, not 0.5 times. Successive discounts multiply factors because the base changes; $56 savings and $144 final price answer different questions.',
    recognition:'Write “new = base × multiplier” separately for each percentage change.',docs:[D.lists,D.regression,D.supported],searchTerms:['percent chain','successive discounts','percent greater','percent less','changing base']
  },
  {
    id:'list-descriptive-statistics',title:'Calculate center, count, and range from a list',chapterId:'mean-median',seconds:1651,
    skills:['One-Variable Data'],patterns:['mean','median','range','data set','frequency'],
    steps:['Enter every observation, preserving repeats.', 'Use mean(L), median(L), or another requested summary.', 'For range, subtract min(L) from max(L) rather than averaging endpoints.'],
    example:{lines:['L=[2,4,4,10]','mean(L)','median(L)','max(L)-min(L)'],result:'The mean is 5, the median is 4, and the range is 8.'},
    caution:'A frequency table describes repeated observations. The unweighted mean of distinct labels ignores frequencies and generally gives the wrong result.',
    recognition:'Choose the requested measure first, then enter the data with the correct multiplicities.',docs:[D.lists,D.stats,D.supported],searchTerms:['mean','median','range','list','frequency','count','total']
  },
  {
    id:'missing-mean-value',title:'Find a missing value from a target mean',chapterId:'mean-median',seconds:1681,
    skills:['One-Variable Data','Linear Equations in One Variable'],patterns:['average','mean','missing value','fourth','unknown value'],
    steps:['Use count × target mean to determine the required total.', 'Subtract the known values or fit the list’s mean with one unknown.', 'Check the completed list and any bounds on the missing value.'],
    example:{lines:['mean([70,82,88,q]) ~ 82','4*82-(70+82+88)'],result:'The missing score is q=88 because the required total is 328 and the known total is 240.'},
    caution:'The target mean is not generally the missing value. If a score has a stated maximum, verify that the needed result is attainable.',
    recognition:'A missing-mean problem is a missing-total problem: n × mean − known total.',docs:[D.stats,D.regression],searchTerms:['missing mean','target average','required total','unknown observation']
  },
  {
    id:'standard-deviation-transformations',title:'Compare spread and check the correct deviation function',chapterId:'mean-median',seconds:1665,
    skills:['One-Variable Data'],patterns:['standard deviation','spread','variance','stdev'],
    steps:['Identify whether values shift by a constant or scale by a factor.', 'Use stdev for a sample or stdevp for the full listed population when calculation is appropriate.', 'Interpret the result as spread rather than center.'],
    example:{lines:['L=[1,3,5]','stdevp(L)','stdevp(L+10)','stdevp(2L)'],result:'Adding 10 preserves the population standard deviation, about 1.633. Doubling values doubles it to about 3.266.'},
    caution:'Do not assume every SAT spread question requires calculation or that none ever do. Sample and population functions use different denominators.',
    recognition:'Adding a constant changes location, not spread; multiplying by c scales standard deviation by |c|.',docs:[D.stats,D.supported],searchTerms:['standard deviation','stdev','stdevp','shift','scale','spread']
  },
  {
    id:'trig-angle-mode',title:'Match trigonometry to the stated angle unit',chapterId:'geometry',seconds:1736,
    skills:['Right Triangles and Trigonometry'],patterns:['sine','cosine','tangent','sin\\(','cos\\(','tan\\(','degrees','radians'],
    steps:['Identify whether the question uses degrees or radians.', 'Explicitly select the matching angle mode.', 'Enter the trig expression and interpret it using the labeled sides or requested ratio.'],
    example:{lines:['sin(30)','cos(60)'],result:'In degree mode, both expressions equal 0.5.'},
    caution:'Do not assume the current calculator mode from the public site’s default. In a right triangle, opposite and adjacent depend on the chosen angle; inverse trig is different from a reciprocal.',
    recognition:'Check the angle unit before pressing sin, cos, or tan.',docs:[D.settings,D.supported,D.configuration],searchTerms:['trigonometry','degrees','radians','sine','cosine','tangent','angle mode']
  },
  {
    id:'circle-center-radius-extrema',title:'Separate circle extrema from axis crossings',chapterId:'geometry',seconds:1754,
    skills:['Circles'],patterns:['circle','radius','diameter','center','centre'],
    steps:['Graph the circle and identify or algebraically derive its center.', 'Use the circle’s radius or verified opposite extrema, not an arbitrary chord.', 'Read and report the requested radius, diameter, or center coordinate.'],
    example:{lines:['(x-3)^2+(y-2)^2=25','sqrt(25)'],result:'Center (3,2), radius 5, diameter 10. Vertical extrema are (3,7) and (3,−3); horizontal extrema are (−2,2) and (8,2).'},
    caution:'An axis crossing is not necessarily an extreme point or endpoint of a diameter. Gray-dot availability is not guaranteed. Complete the square or verify coordinates rather than estimating from pixels.',
    recognition:'For (x−h)²+(y−k)²=r², the center is (h,k) and the radius is √(r²).',docs:[D.graphs,D.supported],searchTerms:['circle center','circle radius','diameter','extrema','complete square','intercept trap']
  },
  {
    id:'coordinate-distance-midpoint',title:'Use verified coordinates for distances and midpoints',chapterId:'geometry',seconds:1774,
    skills:['Circles','Lines, Angles, and Triangles','Right Triangles and Trigonometry'],patterns:['midpoint','distance','diameter','coordinate','length of'],
    steps:['Enter the actual endpoints as named points.', 'Use distance(A,B) or midpoint(A,B) only if available in the actual test build; otherwise use coordinate arithmetic.', 'Interpret whether the distance is a full diameter, a radius, or another segment.'],
    example:{lines:['A=(3,7)','B=(3,-3)','distance(A,B)','midpoint(A,B)'],result:'The distance is 10 and the midpoint is (3,2). If A and B are opposite circle extrema, the radius is 5.'},
    caution:'Two circle points need not form a diameter; verify opposition through the center. Testing builds can differ from public tools. Fallback: distance=√((x₂−x₁)²+(y₂−y₁)²); midpoint=((x₁+x₂)/2,(y₁+y₂)/2).',
    recognition:'A midpoint needs endpoints; a circle center needs opposite diameter endpoints, not any two boundary points.',docs:[D.supported,D.configuration],searchTerms:['distance','midpoint','diameter endpoints','coordinate geometry']
  },
  {
    id:'word-model-then-calculate',title:'Build the model before using the calculator',chapterId:'limitations',seconds:1892,
    skills:['Linear Equations in One Variable','Linear Equations in Two Variables','Linear Functions','Ratios, Rates, Proportions, and Units','Area and Volume'],patterns:['cost','fee','per hour','per item','mixture','liters','volume','how many'],
    steps:['Define the variable and its units; name the quantity requested.', 'Translate fixed amounts, rates, totals, or geometry formulas into an equation.', 'Use Desmos for the calculation only after checking the model and final units.'],
    example:{lines:['y=35+18x','y=125'],result:'The fixed fee is $35 and the hourly rate is $18. A $125 bill corresponds to x=5 hours, not 125/18 hours.'},
    caution:'A calculator cannot infer which quantity a word problem means. A wrong model can produce a precise wrong answer. If the equation itself is requested, solving for a numerical value may be unnecessary.',
    recognition:'Fixed amount + rate × quantity = total; units and the requested quantity decide how the result is used.',docs:[D.functions,D.graphs,D.assessment],searchTerms:['word problems','fixed variable cost','modeling','units','requested quantity','mixture setup','geometry formula']
  },
  {
    id:'statistics-interpretation-limits',title:'Keep statistical conclusions separate from arithmetic',chapterId:'limitations',seconds:1886,
    skills:['Evaluating Statistical Claims','Sample Statistics and Margin of Error','Probability','Two-Variable Data'],patterns:['random','sample','margin of error','cause','causal','probability','survey','association'],
    steps:['Identify the population, sampling method, and any treatment assignment.', 'Choose the appropriate denominator or model before calculating.', 'Limit the conclusion to what the study design and evidence support.'],
    example:{lines:['0.70*120'],result:'70% of 120 volunteers is 84 volunteers. That arithmetic alone does not justify a claim about every resident or show a cause.'},
    caution:'Desmos can summarize or fit data, but a calculation cannot repair selection bias, prove causation from association, or decide which population a study represents.',
    recognition:'Arithmetic answers “how much”; sampling and study design decide what the number can support.',docs:[D.stats,D.regression,D.assessment],searchTerms:['statistical claims','causation','random sampling','margin of error','conditional denominator','interpretation']
  },
  {
    id:'solution-count-algebra',title:'Certify no, one, or infinitely many solutions',chapterId:'limitations',seconds:1923,
    skills:['Systems of Linear Equations','Linear Equations in One Variable','Nonlinear Equations and Systems'],patterns:['no real','no solution','infinitely many','exactly one','number of solutions','discriminant','parallel'],
    steps:['Simplify or rearrange equations to identify their structure.', 'For lines, compare slopes and intercepts; for a genuine quadratic, inspect b²−4ac.', 'Use a graph as a check, with domain and parameter conditions preserved.'],
    example:{lines:['y=2x+1','y=2x+4','y=x^2+1','y=0'],result:'The parallel lines have no common point. The equation x²+1=0 has no real roots because its discriminant is −4.'},
    caution:'An empty viewing window is not proof of no roots. Equal line slopes give no solutions only when intercepts differ; identical equations give infinitely many. The quadratic discriminant rule requires a≠0. Fitting equal sampled outputs solves a different task from requiring no intersection.',
    recognition:'Certify a solution count using structure; a graph or a single fitted parameter is not a completeness proof.',docs:[D.graphs,D.nonlinear,D.settings],searchTerms:['no real solutions','parallel','coincident','discriminant','infinite solutions','solution count']
  }
];
