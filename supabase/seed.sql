-- EduCorps Seed Data
-- supabase/seed.sql

-- ============================================================
-- SUBJECTS (5)
-- ============================================================
INSERT INTO public.subjects (id, name, slug, icon, color) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Mathematics',       'maths',     '📐', '#3B82F6'),
  ('11111111-0000-0000-0000-000000000002', 'Physics',           'physics',   '⚛️',  '#8B5CF6'),
  ('11111111-0000-0000-0000-000000000003', 'Chemistry',         'chemistry', '🧪', '#10B981'),
  ('11111111-0000-0000-0000-000000000004', 'Economics',         'economics', '📊', '#F59E0B'),
  ('11111111-0000-0000-0000-000000000005', 'Computer Science',  'cs',        '💻', '#EF4444')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- TOPICS
-- ============================================================

-- Maths Topics
INSERT INTO public.topics (id, subject_id, name, slug, order_index) VALUES
  ('22222222-0001-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Algebra',              'algebra',           1),
  ('22222222-0001-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'Calculus',             'calculus',          2),
  ('22222222-0001-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', 'Statistics',           'statistics',        3),
  ('22222222-0001-0000-0000-000000000004', '11111111-0000-0000-0000-000000000001', 'Trigonometry',         'trigonometry',      4),
  ('22222222-0001-0000-0000-000000000005', '11111111-0000-0000-0000-000000000001', 'Vectors',              'vectors',           5)
ON CONFLICT DO NOTHING;

-- Physics Topics
INSERT INTO public.topics (id, subject_id, name, slug, order_index) VALUES
  ('22222222-0002-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 'Mechanics',            'mechanics',         1),
  ('22222222-0002-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002', 'Electricity',          'electricity',       2),
  ('22222222-0002-0000-0000-000000000003', '11111111-0000-0000-0000-000000000002', 'Waves',                'waves',             3),
  ('22222222-0002-0000-0000-000000000004', '11111111-0000-0000-0000-000000000002', 'Quantum Physics',      'quantum-physics',   4),
  ('22222222-0002-0000-0000-000000000005', '11111111-0000-0000-0000-000000000002', 'Thermal Physics',      'thermal-physics',   5)
ON CONFLICT DO NOTHING;

-- Chemistry Topics
INSERT INTO public.topics (id, subject_id, name, slug, order_index) VALUES
  ('22222222-0003-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003', 'Atomic Structure',     'atomic-structure',  1),
  ('22222222-0003-0000-0000-000000000002', '11111111-0000-0000-0000-000000000003', 'Organic Chemistry',    'organic-chemistry', 2),
  ('22222222-0003-0000-0000-000000000003', '11111111-0000-0000-0000-000000000003', 'Thermodynamics',       'thermodynamics',    3),
  ('22222222-0003-0000-0000-000000000004', '11111111-0000-0000-0000-000000000003', 'Equilibrium',          'equilibrium',       4),
  ('22222222-0003-0000-0000-000000000005', '11111111-0000-0000-0000-000000000003', 'Acids and Bases',      'acids-and-bases',   5)
ON CONFLICT DO NOTHING;

-- Economics Topics
INSERT INTO public.topics (id, subject_id, name, slug, order_index) VALUES
  ('22222222-0004-0000-0000-000000000001', '11111111-0000-0000-0000-000000000004', 'Microeconomics',       'microeconomics',    1),
  ('22222222-0004-0000-0000-000000000002', '11111111-0000-0000-0000-000000000004', 'Macroeconomics',       'macroeconomics',    2),
  ('22222222-0004-0000-0000-000000000003', '11111111-0000-0000-0000-000000000004', 'Market Structures',    'market-structures', 3),
  ('22222222-0004-0000-0000-000000000004', '11111111-0000-0000-0000-000000000004', 'Labour Markets',       'labour-markets',    4),
  ('22222222-0004-0000-0000-000000000005', '11111111-0000-0000-0000-000000000004', 'International Trade',  'international-trade', 5)
ON CONFLICT DO NOTHING;

-- Computer Science Topics
INSERT INTO public.topics (id, subject_id, name, slug, order_index) VALUES
  ('22222222-0005-0000-0000-000000000001', '11111111-0000-0000-0000-000000000005', 'Algorithms',           'algorithms',        1),
  ('22222222-0005-0000-0000-000000000002', '11111111-0000-0000-0000-000000000005', 'Data Structures',      'data-structures',   2),
  ('22222222-0005-0000-0000-000000000003', '11111111-0000-0000-0000-000000000005', 'Networking',           'networking',        3),
  ('22222222-0005-0000-0000-000000000004', '11111111-0000-0000-0000-000000000005', 'Databases',            'databases',         4),
  ('22222222-0005-0000-0000-000000000005', '11111111-0000-0000-0000-000000000005', 'Object-Oriented Programming', 'oop',        5)
ON CONFLICT DO NOTHING;

-- ============================================================
-- NOTES (sample per topic)
-- ============================================================
INSERT INTO public.notes (topic_id, title, content, is_published) VALUES
  ('22222222-0001-0000-0000-000000000001', 'Introduction to Algebra', '## Algebra Fundamentals\n\nAlgebra is the branch of mathematics dealing with symbols and rules for manipulating those symbols.\n\n### Key Concepts\n- **Variables**: symbols that represent unknown values (x, y, z)\n- **Expressions**: combinations of variables and constants\n- **Equations**: statements that two expressions are equal\n\n### Solving Linear Equations\n1. Isolate the variable\n2. Perform inverse operations\n3. Check your answer\n\n**Example**: Solve 2x + 3 = 11\n- 2x = 11 - 3 = 8\n- x = 4', TRUE),
  ('22222222-0001-0000-0000-000000000002', 'Introduction to Calculus', '## Differentiation\n\nDifferentiation is the process of finding the derivative of a function.\n\n### Rules\n- **Power Rule**: d/dx(xⁿ) = nxⁿ⁻¹\n- **Chain Rule**: d/dx[f(g(x))] = f''(g(x)) · g''(x)\n- **Product Rule**: d/dx[f(x)g(x)] = f''(x)g(x) + f(x)g''(x)\n\n### Integration\nThe reverse of differentiation.\n∫xⁿ dx = xⁿ⁺¹/(n+1) + C', TRUE),
  ('22222222-0002-0000-0000-000000000001', 'Newton''s Laws of Motion', '## Newton''s Three Laws\n\n### First Law (Inertia)\nAn object stays at rest or uniform motion unless acted upon by a net external force.\n\n### Second Law (F = ma)\nThe net force on an object equals its mass times acceleration.\n- F = ma\n- Units: Newtons (N) = kg·m/s²\n\n### Third Law (Action-Reaction)\nFor every action, there is an equal and opposite reaction.', TRUE),
  ('22222222-0003-0000-0000-000000000001', 'Atomic Structure', '## The Atom\n\n### Subatomic Particles\n| Particle | Charge | Mass (amu) | Location |\n|---------|--------|------------|----------|\n| Proton   | +1     | 1          | Nucleus  |\n| Neutron  | 0      | 1          | Nucleus  |\n| Electron | -1     | ~0         | Shells   |\n\n### Electron Configuration\nElectrons fill orbitals in order of increasing energy.\nThe aufbau principle: 1s² 2s² 2p⁶ 3s² 3p⁶...', TRUE),
  ('22222222-0004-0000-0000-000000000001', 'Supply and Demand', '## Market Forces\n\n### Demand\nThe quantity of a good consumers are willing and able to buy at each price.\n- **Law of Demand**: As price rises, quantity demanded falls (ceteris paribus)\n\n### Supply\nThe quantity of a good producers are willing and able to sell at each price.\n- **Law of Supply**: As price rises, quantity supplied rises\n\n### Equilibrium\nWhere supply equals demand — market clears at equilibrium price and quantity.', TRUE),
  ('22222222-0005-0000-0000-000000000001', 'Sorting Algorithms', '## Common Sorting Algorithms\n\n### Bubble Sort\n- Compare adjacent elements and swap if out of order\n- Time complexity: O(n²)\n\n### Merge Sort\n- Divide array in half, sort each half, merge\n- Time complexity: O(n log n)\n\n### Quick Sort\n- Choose pivot, partition around it, recurse\n- Average time: O(n log n), worst case O(n²)\n\n### Binary Search\n- Requires sorted array\n- Time complexity: O(log n)', TRUE);

-- ============================================================
-- QUESTIONS (10+ per topic for core subjects)
-- ============================================================

-- MATHS - Algebra Questions
INSERT INTO public.questions (topic_id, subject_id, type, difficulty, question_text, mark_scheme, model_answer, marks_available, exam_board, year) VALUES
  ('22222222-0001-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'calculation', 'easy', 'Solve for x: 3x + 7 = 22', '1. 3x = 22 - 7 = 15 [1 mark]\n2. x = 5 [1 mark]', 'x = 5', 2, 'AQA', 2023),
  ('22222222-0001-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'calculation', 'easy', 'Expand and simplify: (x + 3)(x - 2)', '1. x² - 2x + 3x - 6 [1 mark]\n2. x² + x - 6 [1 mark]', 'x² + x - 6', 2, 'AQA', 2023),
  ('22222222-0001-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'calculation', 'medium', 'Solve the quadratic: x² - 5x + 6 = 0', '1. (x - 2)(x - 3) = 0 [1 mark]\n2. x = 2 or x = 3 [1 mark each]', 'x = 2 or x = 3', 3, 'AQA', 2023),
  ('22222222-0001-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'calculation', 'medium', 'Solve simultaneously: 2x + y = 10 and x - y = 2', '1. Add equations: 3x = 12 [1 mark]\n2. x = 4 [1 mark]\n3. y = 10 - 8 = 2 [1 mark]', 'x = 4, y = 2', 3, 'AQA', 2022),
  ('22222222-0001-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'calculation', 'hard', 'Solve: 2x² + 5x - 3 = 0 using the quadratic formula', '1. a=2, b=5, c=-3 [1 mark]\n2. x = (-5 ± √(25+24))/4 = (-5 ± 7)/4 [2 marks]\n3. x = 0.5 or x = -3 [1 mark]', 'x = 0.5 or x = -3', 4, 'AQA', 2022),
  ('22222222-0001-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'short_answer', 'easy', 'Factorise fully: 6x² + 9x', '1. 3x(2x + 3) [2 marks]', '3x(2x + 3)', 2, 'Edexcel', 2023),
  ('22222222-0001-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'calculation', 'hard', 'Solve the inequality: x² - 4x - 12 > 0', '1. (x-6)(x+2) > 0 [1 mark]\n2. Critical values: x=6, x=-2 [1 mark]\n3. x < -2 or x > 6 [1 mark]', 'x < -2 or x > 6', 3, 'Edexcel', 2022),
  ('22222222-0001-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'calculation', 'medium', 'Find the nth term of the sequence: 5, 9, 13, 17, ...', '1. Difference = 4, so 4n term [1 mark]\n2. 4(1) = 4, need +1, so 4n+1 [1 mark]', '4n + 1', 2, 'AQA', 2021),
  ('22222222-0001-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'calculation', 'medium', 'Simplify: (3x²y³)² × (2x)', '1. 9x⁴y⁶ × 2x [1 mark]\n2. 18x⁵y⁶ [1 mark]', '18x⁵y⁶', 2, 'AQA', 2023),
  ('22222222-0001-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'calculation', 'hard', 'Prove that n² + n is always even for any positive integer n.', '1. n² + n = n(n+1) [1 mark]\n2. n and n+1 are consecutive integers [1 mark]\n3. One of them must be even, so product is even [1 mark]\n4. Therefore n² + n is always even [1 mark]', 'n(n+1) — one of consecutive integers is always even, so the product is always even.', 4, 'AQA', 2022);

-- MATHS - Calculus Questions
INSERT INTO public.questions (topic_id, subject_id, type, difficulty, question_text, mark_scheme, model_answer, marks_available, exam_board, year) VALUES
  ('22222222-0001-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'calculation', 'easy', 'Differentiate: y = 3x⁴ - 2x² + 5', '1. dy/dx = 12x³ - 4x [2 marks]', 'dy/dx = 12x³ - 4x', 2, 'AQA', 2023),
  ('22222222-0001-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'calculation', 'medium', 'Find the gradient of y = x³ - 6x at x = 2', '1. dy/dx = 3x² - 6 [1 mark]\n2. At x=2: 3(4) - 6 = 6 [1 mark]', 'Gradient = 6', 2, 'AQA', 2023),
  ('22222222-0001-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'calculation', 'medium', 'Find ∫(4x³ - 6x + 2)dx', '1. x⁴ - 3x² + 2x + C [3 marks]', 'x⁴ - 3x² + 2x + C', 3, 'AQA', 2022),
  ('22222222-0001-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'calculation', 'hard', 'Find the stationary points of y = 2x³ - 9x² + 12x - 4 and determine their nature.', '1. dy/dx = 6x² - 18x + 12 [1 mark]\n2. 6(x²-3x+2)=0, 6(x-1)(x-2)=0 [1 mark]\n3. x=1 or x=2 [1 mark]\n4. d²y/dx² = 12x - 18 [1 mark]\n5. At x=1: -6 < 0 → maximum; at x=2: 6 > 0 → minimum [2 marks]', 'Maximum at x=1 (y=1), Minimum at x=2 (y=0)', 6, 'AQA', 2022),
  ('22222222-0001-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'calculation', 'medium', 'Evaluate ∫₁³ (2x + 1)dx', '1. [x² + x]₁³ [1 mark]\n2. (9+3) - (1+1) = 12 - 2 = 10 [2 marks]', '10', 3, 'Edexcel', 2023);

-- PHYSICS - Mechanics Questions
INSERT INTO public.questions (topic_id, subject_id, type, difficulty, question_text, mark_scheme, model_answer, marks_available, exam_board, year) VALUES
  ('22222222-0002-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 'calculation', 'easy', 'A car of mass 1200 kg accelerates at 3 m/s². Calculate the resultant force acting on the car.', '1. F = ma [1 mark]\n2. F = 1200 × 3 = 3600 N [1 mark]', 'F = 3600 N', 2, 'AQA', 2023),
  ('22222222-0002-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 'calculation', 'medium', 'A ball is thrown horizontally at 15 m/s from a cliff 20 m high. Calculate the horizontal distance travelled before it hits the ground. (g = 9.81 m/s²)', '1. Vertical: h = ½gt² → 20 = ½(9.81)t² [1 mark]\n2. t² = 4.077, t = 2.019 s [1 mark]\n3. Horizontal: x = 15 × 2.019 = 30.3 m [1 mark]', 'x ≈ 30.3 m', 3, 'AQA', 2023),
  ('22222222-0002-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 'calculation', 'easy', 'Calculate the kinetic energy of a 5 kg object moving at 4 m/s.', '1. KE = ½mv² [1 mark]\n2. KE = ½ × 5 × 16 = 40 J [1 mark]', 'KE = 40 J', 2, 'AQA', 2022),
  ('22222222-0002-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 'short_answer', 'easy', 'State Newton''s second law of motion.', 'F = ma or the net force equals mass times acceleration. [2 marks]', 'The net force acting on an object equals the product of its mass and acceleration (F = ma).', 2, 'AQA', 2023),
  ('22222222-0002-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 'calculation', 'medium', 'A 2 kg block is pushed 5 m along a frictionless surface by a 10 N force. Calculate the work done and the final velocity if starting from rest.', '1. W = Fd = 10 × 5 = 50 J [1 mark]\n2. W = ½mv² → 50 = ½(2)v² [1 mark]\n3. v² = 50, v = 7.07 m/s [1 mark]', 'W = 50 J, v ≈ 7.07 m/s', 3, 'AQA', 2022),
  ('22222222-0002-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 'calculation', 'hard', 'A rocket of initial mass 500 kg ejects gas at 2000 m/s. The thrust is 40,000 N. Calculate the initial acceleration of the rocket (g = 9.81 m/s²).', '1. Net force = Thrust - Weight [1 mark]\n2. Weight = 500 × 9.81 = 4905 N [1 mark]\n3. Net F = 40000 - 4905 = 35095 N [1 mark]\n4. a = F/m = 35095/500 = 70.2 m/s² [1 mark]', 'a ≈ 70.2 m/s²', 4, 'AQA', 2021),
  ('22222222-0002-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 'short_answer', 'medium', 'Explain why seat belts reduce the risk of injury in a collision.', '1. Seat belt increases time of deceleration [1 mark]\n2. Greater time → smaller deceleration [1 mark]\n3. F = ma → smaller force on body [1 mark]', 'Seat belts extend the time over which the body decelerates, reducing the force (F=ma) acting on the occupant.', 3, 'AQA', 2023),
  ('22222222-0002-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 'calculation', 'medium', 'Calculate the momentum of a 0.15 kg cricket ball travelling at 40 m/s.', '1. p = mv [1 mark]\n2. p = 0.15 × 40 = 6 kg m/s [1 mark]', 'p = 6 kg m/s', 2, 'AQA', 2022),
  ('22222222-0002-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 'calculation', 'medium', 'A 60 kg person stands in an elevator accelerating upward at 2 m/s². Calculate the normal reaction force. (g = 9.81 m/s²)', '1. R - mg = ma [1 mark]\n2. R = m(g + a) = 60(9.81 + 2) [1 mark]\n3. R = 60 × 11.81 = 708.6 N [1 mark]', 'R ≈ 708.6 N', 3, 'AQA', 2022),
  ('22222222-0002-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 'long_answer', 'hard', 'Describe an experiment to determine the acceleration due to gravity using a free-fall method. Include the equipment, procedure, measurements, and how you would calculate g.', '1. Equipment: electromagnet, steel ball, trapdoor, timer [1 mark]\n2. Measure height h of fall [1 mark]\n3. Release ball, measure time t [1 mark]\n4. Use h = ½gt² → g = 2h/t² [1 mark]\n5. Repeat and average [1 mark]\n6. Plot h vs t² graph; gradient = g/2 [1 mark]', 'Drop ball from measured heights, time each fall. Use s = ½gt² rearranged to g = 2s/t². Plot s vs t² graph; gradient = g/2.', 6, 'AQA', 2021);

-- PHYSICS - Electricity Questions
INSERT INTO public.questions (topic_id, subject_id, type, difficulty, question_text, mark_scheme, model_answer, marks_available, exam_board, year) VALUES
  ('22222222-0002-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002', 'calculation', 'easy', 'A resistor has a potential difference of 12 V across it and a current of 3 A flows through it. Calculate its resistance.', '1. R = V/I [1 mark]\n2. R = 12/3 = 4 Ω [1 mark]', 'R = 4 Ω', 2, 'AQA', 2023),
  ('22222222-0002-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002', 'calculation', 'medium', 'Two resistors of 6 Ω and 3 Ω are connected in parallel. Calculate the combined resistance.', '1. 1/R = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 [1 mark]\n2. 1/R = 0.5, R = 2 Ω [1 mark]', 'R = 2 Ω', 2, 'AQA', 2022),
  ('22222222-0002-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002', 'calculation', 'easy', 'Calculate the power dissipated in a 10 Ω resistor with 5 A flowing through it.', '1. P = I²R [1 mark]\n2. P = 25 × 10 = 250 W [1 mark]', 'P = 250 W', 2, 'AQA', 2023);

-- CHEMISTRY - Atomic Structure Questions
INSERT INTO public.questions (topic_id, subject_id, type, difficulty, question_text, mark_scheme, model_answer, marks_available, exam_board, year) VALUES
  ('22222222-0003-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003', 'short_answer', 'easy', 'What is the electron configuration of a sodium atom (atomic number 11)?', '1. 1s² 2s² 2p⁶ 3s¹ [2 marks]', '1s² 2s² 2p⁶ 3s¹', 2, 'AQA', 2023),
  ('22222222-0003-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003', 'short_answer', 'easy', 'How many neutrons are in an atom of carbon-14?', '1. Neutrons = mass number - proton number = 14 - 6 = 8 [1 mark]', '8 neutrons', 1, 'AQA', 2023),
  ('22222222-0003-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003', 'short_answer', 'medium', 'Explain what is meant by the term ''isotopes''.', '1. Atoms of the same element [1 mark]\n2. Same number of protons [1 mark]\n3. Different number of neutrons [1 mark]', 'Isotopes are atoms of the same element with the same number of protons but a different number of neutrons.', 3, 'AQA', 2022),
  ('22222222-0003-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003', 'calculation', 'medium', 'Calculate the relative atomic mass of chlorine given: ³⁵Cl (75%) and ³⁷Cl (25%).', '1. Ar = (35 × 75 + 37 × 25) / 100 [1 mark]\n2. = (2625 + 925) / 100 = 3550/100 [1 mark]\n3. Ar = 35.5 [1 mark]', 'Ar = 35.5', 3, 'AQA', 2022),
  ('22222222-0003-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003', 'short_answer', 'medium', 'Describe the Bohr model of the atom and one limitation.', '1. Electrons orbit nucleus in fixed shells/energy levels [1 mark]\n2. Electrons can absorb/emit photons to change levels [1 mark]\n3. Does not account for electron orbitals/shapes [1 mark]', 'In the Bohr model, electrons orbit the nucleus in fixed energy levels. Limitation: does not describe orbital shapes.', 3, 'AQA', 2021),
  ('22222222-0003-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003', 'calculation', 'hard', 'A 4.00 g sample contains equal moles of ²⁰⁸Pb and ²⁰⁶Pb. Calculate the moles of each isotope.', '1. Let moles of each = n [1 mark]\n2. Total mass = 208n + 206n = 414n = 4.00 [1 mark]\n3. n = 4.00/414 = 0.00966 mol [2 marks]', 'n ≈ 0.00966 mol of each isotope', 4, 'AQA', 2021),
  ('22222222-0003-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003', 'short_answer', 'easy', 'Define the term ''first ionisation energy''.', '1. Energy required [1 mark]\n2. To remove one electron [1 mark]\n3. From one mole of gaseous atoms [1 mark]', 'The minimum energy required to remove one electron from each atom in one mole of gaseous atoms.', 3, 'AQA', 2023),
  ('22222222-0003-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003', 'short_answer', 'medium', 'Explain the trend in first ionisation energies across Period 3 (Na to Ar).', '1. Generally increases across the period [1 mark]\n2. Nuclear charge increases [1 mark]\n3. Same shielding, electrons in same shell [1 mark]\n4. Greater attraction between nucleus and outer electron [1 mark]', 'First ionisation energy generally increases across Period 3 due to increasing nuclear charge with similar shielding.', 4, 'AQA', 2022),
  ('22222222-0003-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003', 'short_answer', 'hard', 'Explain why the first ionisation energy of aluminium (Al) is lower than that of magnesium (Mg).', '1. Al has electron in 3p subshell, Mg in 3s [1 mark]\n2. 3p is higher energy than 3s [1 mark]\n3. 3p electron more easily removed [1 mark]\n4. Also 3p electron slightly shielded by 3s electrons [1 mark]', 'Al has its outermost electron in a 3p orbital (higher energy, more shielded) than Mg''s 3s orbital, so less energy is needed.', 4, 'AQA', 2022),
  ('22222222-0003-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003', 'calculation', 'medium', 'How many moles of atoms are in 23 g of sodium? (Ar Na = 23)', '1. Moles = mass / Ar [1 mark]\n2. Moles = 23/23 = 1 mol [1 mark]', '1 mol', 2, 'AQA', 2023);

-- ECONOMICS - Microeconomics Questions
INSERT INTO public.questions (topic_id, subject_id, type, difficulty, question_text, mark_scheme, model_answer, marks_available, exam_board, year) VALUES
  ('22222222-0004-0000-0000-000000000001', '11111111-0000-0000-0000-000000000004', 'short_answer', 'easy', 'Define the term ''price elasticity of demand'' (PED).', '1. Measures responsiveness of quantity demanded [1 mark]\n2. To a change in price [1 mark]', 'PED measures the responsiveness of quantity demanded to a change in price.', 2, 'AQA', 2023),
  ('22222222-0004-0000-0000-000000000001', '11111111-0000-0000-0000-000000000004', 'calculation', 'easy', 'If price rises from £10 to £12 and quantity demanded falls from 100 to 80 units, calculate the PED.', '1. % change in Qd = (80-100)/100 × 100 = -20% [1 mark]\n2. % change in P = (12-10)/10 × 100 = +20% [1 mark]\n3. PED = -20/20 = -1 [1 mark]', 'PED = -1 (unit elastic)', 3, 'AQA', 2023),
  ('22222222-0004-0000-0000-000000000001', '11111111-0000-0000-0000-000000000004', 'short_answer', 'medium', 'Explain two factors that make demand price inelastic.', '1. Few substitutes available — no alternative product [1 mark]\n2. Habitual goods / addictive goods [1 mark]\n3. Necessity — consumers must buy regardless of price [1 mark]\n4. Small proportion of income [1 mark]', 'Few close substitutes (consumers have no alternatives) and necessities (consumers must purchase regardless of price changes).', 4, 'AQA', 2022),
  ('22222222-0004-0000-0000-000000000001', '11111111-0000-0000-0000-000000000004', 'long_answer', 'hard', 'Evaluate the view that a maximum price policy always benefits consumers. (15 marks)', '1. Define maximum price below equilibrium [1 mark]\n2. Short run benefit: lower price [2 marks]\n3. Shortage created (Qd > Qs) [2 marks]\n4. Non-price rationing (queuing) [1 mark]\n5. Black markets may develop [2 marks]\n6. May reduce quality/supply [2 marks]\n7. Conclusion with evaluation [3 marks]', 'Maximum prices keep prices below equilibrium, benefiting consumers in the short run with lower prices, but creating shortages, black markets, and potential quality reductions.', 15, 'AQA', 2022),
  ('22222222-0004-0000-0000-000000000001', '11111111-0000-0000-0000-000000000004', 'short_answer', 'medium', 'Using a diagram, explain the effect of a negative externality on the free market equilibrium.', '1. Diagram with MPB/MSB and MPC/MSC [2 marks]\n2. Social cost > private cost [1 mark]\n3. Market overproduces at Q_market vs Q_optimal [1 mark]\n4. Welfare loss shown on diagram [1 mark]', 'A negative externality causes the MSC to exceed MPC, leading the free market to overproduce beyond the socially optimal output, resulting in deadweight welfare loss.', 5, 'AQA', 2022),
  ('22222222-0004-0000-0000-000000000001', '11111111-0000-0000-0000-000000000004', 'calculation', 'easy', 'If PED = -0.5 and price increases by 10%, calculate the percentage change in quantity demanded.', '1. % ΔQd = PED × % ΔP [1 mark]\n2. % ΔQd = -0.5 × 10 = -5% [1 mark]', 'Quantity demanded falls by 5%', 2, 'AQA', 2023),
  ('22222222-0004-0000-0000-000000000001', '11111111-0000-0000-0000-000000000004', 'short_answer', 'medium', 'Explain the difference between a shift in the demand curve and a movement along it.', '1. Movement: change in quantity demanded due to price change only [1 mark]\n2. Shift: change in demand due to non-price factors [1 mark]\n3. Examples: income, prices of substitutes, tastes [1 mark]', 'A movement along the demand curve is caused solely by a price change; a shift is caused by other factors such as income, substitutes'' prices, or consumer preferences.', 3, 'AQA', 2022),
  ('22222222-0004-0000-0000-000000000001', '11111111-0000-0000-0000-000000000004', 'long_answer', 'hard', 'Assess the effectiveness of a tax on carbon emissions in reducing market failure from climate change. (25 marks)', '1. Market failure: negative externality from carbon [2 marks]\n2. Tax internalises the externality [2 marks]\n3. Raises MPC to approach MSC [2 marks]\n4. Reduces output closer to optimum [2 marks]\n5. Problems: setting correct tax rate [2 marks]\n6. Carbon leakage to other countries [2 marks]\n7. Regressive impact on low income [2 marks]\n8. Alternative policies (cap-and-trade) [3 marks]\n9. Balanced evaluation [6 marks]', 'A carbon tax aims to internalise the negative externality of emissions. Effective in theory, but faces challenges including rate-setting, carbon leakage, regressive impacts, and political feasibility.', 25, 'AQA', 2021),
  ('22222222-0004-0000-0000-000000000001', '11111111-0000-0000-0000-000000000004', 'short_answer', 'easy', 'What is meant by a ''public good''? Give one example.', '1. Non-excludable [1 mark]\n2. Non-rival [1 mark]\n3. Example: national defence, street lighting [1 mark]', 'A public good is non-excludable and non-rival. Example: national defence.', 3, 'AQA', 2023),
  ('22222222-0004-0000-0000-000000000001', '11111111-0000-0000-0000-000000000004', 'short_answer', 'medium', 'Explain why public goods lead to market failure.', '1. Free rider problem [1 mark]\n2. Consumers can benefit without paying [1 mark]\n3. Private firms cannot profit → won''t supply [1 mark]\n4. Government must provide [1 mark]', 'Public goods cause market failure due to the free rider problem — consumers can benefit without paying, so private firms have no incentive to supply.', 4, 'AQA', 2022);

-- CS - Algorithms Questions
INSERT INTO public.questions (topic_id, subject_id, type, difficulty, question_text, mark_scheme, model_answer, marks_available, exam_board, year) VALUES
  ('22222222-0005-0000-0000-000000000001', '11111111-0000-0000-0000-000000000005', 'short_answer', 'easy', 'What is the time complexity of binary search?', '1. O(log n) [1 mark]', 'O(log n)', 1, 'AQA', 2023),
  ('22222222-0005-0000-0000-000000000001', '11111111-0000-0000-0000-000000000005', 'short_answer', 'easy', 'State one advantage of merge sort over bubble sort.', '1. Merge sort is O(n log n) vs O(n²) for bubble sort [1 mark]\n2. More efficient for large datasets [1 mark]', 'Merge sort has O(n log n) time complexity compared to bubble sort''s O(n²), making it more efficient for large datasets.', 2, 'AQA', 2023),
  ('22222222-0005-0000-0000-000000000001', '11111111-0000-0000-0000-000000000005', 'short_answer', 'medium', 'Trace through bubble sort on the list: [5, 2, 8, 1]. Show each pass.', '1. Pass 1: [2, 5, 1, 8] [1 mark]\n2. Pass 2: [2, 1, 5, 8] [1 mark]\n3. Pass 3: [1, 2, 5, 8] [1 mark]', 'Pass 1: [2,5,1,8] → Pass 2: [2,1,5,8] → Pass 3: [1,2,5,8]', 3, 'AQA', 2022),
  ('22222222-0005-0000-0000-000000000001', '11111111-0000-0000-0000-000000000005', 'short_answer', 'medium', 'Write pseudocode for a linear search algorithm that finds a target value in an array.', '1. Loop through each element [1 mark]\n2. Compare each element to target [1 mark]\n3. Return index if found [1 mark]\n4. Return -1 or "not found" if not found [1 mark]', 'FOR i = 0 TO length(array)-1\n  IF array[i] == target THEN\n    RETURN i\n  ENDIF\nENDFOR\nRETURN -1', 4, 'AQA', 2022),
  ('22222222-0005-0000-0000-000000000001', '11111111-0000-0000-0000-000000000005', 'short_answer', 'hard', 'Explain the concept of recursion. Write a recursive pseudocode function to calculate the factorial of n.', '1. Function calls itself [1 mark]\n2. Base case required [1 mark]\n3. FUNCTION factorial(n): [1 mark]\n4. IF n <= 1 THEN RETURN 1 [1 mark]\n5. RETURN n * factorial(n-1) [1 mark]', 'FUNCTION factorial(n)\n  IF n <= 1 THEN RETURN 1\n  RETURN n * factorial(n-1)\nENDFUNCTION', 5, 'AQA', 2022),
  ('22222222-0005-0000-0000-000000000001', '11111111-0000-0000-0000-000000000005', 'short_answer', 'easy', 'What is the worst-case time complexity of bubble sort?', '1. O(n²) [1 mark]', 'O(n²)', 1, 'AQA', 2023),
  ('22222222-0005-0000-0000-000000000001', '11111111-0000-0000-0000-000000000005', 'short_answer', 'medium', 'Describe the divide-and-conquer approach used in merge sort.', '1. Divide: split array into two halves [1 mark]\n2. Conquer: recursively sort each half [1 mark]\n3. Combine: merge two sorted halves [1 mark]', 'Merge sort divides the array in half, recursively sorts each half, then merges the sorted halves together.', 3, 'AQA', 2022),
  ('22222222-0005-0000-0000-000000000001', '11111111-0000-0000-0000-000000000005', 'short_answer', 'hard', 'Explain what Big O notation is and why it is used to analyse algorithm efficiency.', '1. Describes how runtime grows with input size [1 mark]\n2. Worst-case analysis [1 mark]\n3. Ignores constants and lower-order terms [1 mark]\n4. Allows comparison between algorithms [1 mark]\n5. Machine-independent measure [1 mark]', 'Big O notation describes the worst-case growth rate of an algorithm''s runtime as a function of input size, providing a machine-independent way to compare algorithm efficiency.', 5, 'AQA', 2021),
  ('22222222-0005-0000-0000-000000000001', '11111111-0000-0000-0000-000000000005', 'short_answer', 'medium', 'Compare the time complexity of linear search and binary search. When is binary search preferable?', '1. Linear search: O(n) [1 mark]\n2. Binary search: O(log n) [1 mark]\n3. Binary search preferable for large sorted datasets [1 mark]\n4. Binary search requires sorted data [1 mark]', 'Linear search is O(n); binary search is O(log n). Binary search is preferable for large sorted datasets.', 4, 'AQA', 2022),
  ('22222222-0005-0000-0000-000000000001', '11111111-0000-0000-0000-000000000005', 'short_answer', 'hard', 'Explain the concept of dynamic programming and give one example.', '1. Solves complex problems by breaking into subproblems [1 mark]\n2. Stores results of subproblems (memoisation) [1 mark]\n3. Avoids recomputation [1 mark]\n4. Example: Fibonacci sequence, knapsack problem [1 mark]', 'Dynamic programming breaks problems into overlapping subproblems, stores results to avoid recomputation. Example: Fibonacci with memoisation.', 4, 'AQA', 2021);

-- ============================================================
-- PAST PAPERS (5 per subject)
-- ============================================================
INSERT INTO public.past_papers (subject_id, year, session, paper_number, exam_board, total_marks, time_allowed_minutes, has_source_material) VALUES
  -- Maths
  ('11111111-0000-0000-0000-000000000001', 2023, 'May/June', 'Paper 1', 'AQA', 80, 90, FALSE),
  ('11111111-0000-0000-0000-000000000001', 2023, 'May/June', 'Paper 2', 'AQA', 80, 90, FALSE),
  ('11111111-0000-0000-0000-000000000001', 2022, 'May/June', 'Paper 1', 'AQA', 80, 90, FALSE),
  ('11111111-0000-0000-0000-000000000001', 2022, 'May/June', 'Paper 2', 'AQA', 80, 90, FALSE),
  ('11111111-0000-0000-0000-000000000001', 2021, 'May/June', 'Paper 1', 'AQA', 80, 90, FALSE),
  -- Physics
  ('11111111-0000-0000-0000-000000000002', 2023, 'May/June', 'Paper 1', 'AQA', 85, 120, FALSE),
  ('11111111-0000-0000-0000-000000000002', 2023, 'May/June', 'Paper 2', 'AQA', 85, 120, FALSE),
  ('11111111-0000-0000-0000-000000000002', 2022, 'May/June', 'Paper 1', 'AQA', 85, 120, FALSE),
  ('11111111-0000-0000-0000-000000000002', 2022, 'May/June', 'Paper 2', 'AQA', 85, 120, FALSE),
  ('11111111-0000-0000-0000-000000000002', 2021, 'May/June', 'Paper 1', 'AQA', 85, 120, FALSE),
  -- Chemistry
  ('11111111-0000-0000-0000-000000000003', 2023, 'May/June', 'Paper 1', 'AQA', 105, 120, FALSE),
  ('11111111-0000-0000-0000-000000000003', 2023, 'May/June', 'Paper 2', 'AQA', 105, 120, FALSE),
  ('11111111-0000-0000-0000-000000000003', 2022, 'May/June', 'Paper 1', 'AQA', 105, 120, FALSE),
  ('11111111-0000-0000-0000-000000000003', 2022, 'May/June', 'Paper 2', 'AQA', 105, 120, FALSE),
  ('11111111-0000-0000-0000-000000000003', 2021, 'May/June', 'Paper 1', 'AQA', 105, 120, FALSE),
  -- Economics
  ('11111111-0000-0000-0000-000000000004', 2023, 'May/June', 'Paper 1', 'AQA', 80, 120, TRUE),
  ('11111111-0000-0000-0000-000000000004', 2023, 'May/June', 'Paper 2', 'AQA', 80, 120, TRUE),
  ('11111111-0000-0000-0000-000000000004', 2022, 'May/June', 'Paper 1', 'AQA', 80, 120, TRUE),
  ('11111111-0000-0000-0000-000000000004', 2022, 'May/June', 'Paper 2', 'AQA', 80, 120, TRUE),
  ('11111111-0000-0000-0000-000000000004', 2021, 'May/June', 'Paper 1', 'AQA', 80, 120, TRUE),
  -- Computer Science
  ('11111111-0000-0000-0000-000000000005', 2023, 'May/June', 'Paper 1', 'AQA', 75, 150, FALSE),
  ('11111111-0000-0000-0000-000000000005', 2023, 'May/June', 'Paper 2', 'AQA', 75, 150, FALSE),
  ('11111111-0000-0000-0000-000000000005', 2022, 'May/June', 'Paper 1', 'AQA', 75, 150, FALSE),
  ('11111111-0000-0000-0000-000000000005', 2022, 'May/June', 'Paper 2', 'AQA', 75, 150, FALSE),
  ('11111111-0000-0000-0000-000000000005', 2021, 'May/June', 'Paper 1', 'AQA', 75, 150, FALSE);

-- ============================================================
-- FLASHCARDS (system-level, user_id IS NULL)
-- ============================================================
INSERT INTO public.flashcards (user_id, subject_id, topic_id, front_text, back_text, is_custom) VALUES
  -- Maths
  (NULL, '11111111-0000-0000-0000-000000000001', '22222222-0001-0000-0000-000000000001', 'What is the quadratic formula?', 'x = (-b ± √(b² - 4ac)) / 2a', FALSE),
  (NULL, '11111111-0000-0000-0000-000000000001', '22222222-0001-0000-0000-000000000001', 'What is the difference of two squares?', 'a² - b² = (a+b)(a-b)', FALSE),
  (NULL, '11111111-0000-0000-0000-000000000001', '22222222-0001-0000-0000-000000000002', 'What is the power rule for differentiation?', 'd/dx(xⁿ) = nxⁿ⁻¹', FALSE),
  (NULL, '11111111-0000-0000-0000-000000000001', '22222222-0001-0000-0000-000000000002', 'What is the integral of xⁿ?', '∫xⁿ dx = xⁿ⁺¹/(n+1) + C (n ≠ -1)', FALSE),
  -- Physics
  (NULL, '11111111-0000-0000-0000-000000000002', '22222222-0002-0000-0000-000000000001', 'State Newton''s Second Law', 'F = ma (Net force = mass × acceleration)', FALSE),
  (NULL, '11111111-0000-0000-0000-000000000002', '22222222-0002-0000-0000-000000000001', 'Formula for kinetic energy', 'KE = ½mv²', FALSE),
  (NULL, '11111111-0000-0000-0000-000000000002', '22222222-0002-0000-0000-000000000002', 'Ohm''s Law', 'V = IR (Voltage = Current × Resistance)', FALSE),
  (NULL, '11111111-0000-0000-0000-000000000002', '22222222-0002-0000-0000-000000000002', 'Formula for electrical power', 'P = IV = I²R = V²/R', FALSE),
  -- Chemistry
  (NULL, '11111111-0000-0000-0000-000000000003', '22222222-0003-0000-0000-000000000001', 'What is an isotope?', 'Atoms of the same element with the same number of protons but different numbers of neutrons', FALSE),
  (NULL, '11111111-0000-0000-0000-000000000003', '22222222-0003-0000-0000-000000000001', 'What is first ionisation energy?', 'The energy required to remove one electron from each atom in one mole of gaseous atoms', FALSE),
  -- Economics
  (NULL, '11111111-0000-0000-0000-000000000004', '22222222-0004-0000-0000-000000000001', 'Define Price Elasticity of Demand (PED)', 'PED = % change in quantity demanded / % change in price', FALSE),
  (NULL, '11111111-0000-0000-0000-000000000004', '22222222-0004-0000-0000-000000000001', 'What is a public good?', 'A good that is non-excludable and non-rival in consumption', FALSE),
  -- CS
  (NULL, '11111111-0000-0000-0000-000000000005', '22222222-0005-0000-0000-000000000001', 'Time complexity of binary search', 'O(log n)', FALSE),
  (NULL, '11111111-0000-0000-0000-000000000005', '22222222-0005-0000-0000-000000000001', 'Time complexity of merge sort', 'O(n log n) — best, average, and worst case', FALSE);

-- ============================================================
-- GLOSSARY TERMS
-- ============================================================
INSERT INTO public.glossary_terms (subject_id, term, definition, linked_topic_id) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Derivative', 'The rate of change of a function with respect to a variable', '22222222-0001-0000-0000-000000000002'),
  ('11111111-0000-0000-0000-000000000001', 'Integral', 'The reverse of differentiation; area under a curve', '22222222-0001-0000-0000-000000000002'),
  ('11111111-0000-0000-0000-000000000001', 'Quadratic', 'A polynomial expression of degree 2 (containing x²)', '22222222-0001-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000002', 'Acceleration', 'Rate of change of velocity with respect to time (m/s²)', '22222222-0002-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000002', 'Momentum', 'Product of mass and velocity (p = mv), measured in kg m/s', '22222222-0002-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000002', 'Resistance', 'Opposition to current flow in a circuit, measured in Ohms (Ω)', '22222222-0002-0000-0000-000000000002'),
  ('11111111-0000-0000-0000-000000000003', 'Isotope', 'Atoms of the same element with different numbers of neutrons', '22222222-0003-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000003', 'Electronegativity', 'The tendency of an atom to attract bonding electrons', '22222222-0003-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000004', 'Elasticity', 'A measure of the responsiveness of one variable to a change in another', '22222222-0004-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000004', 'Market Failure', 'When the free market fails to allocate resources efficiently', '22222222-0004-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000004', 'Externality', 'A cost or benefit that falls on a third party not involved in the transaction', '22222222-0004-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000005', 'Algorithm', 'A finite set of instructions for solving a problem', '22222222-0005-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000005', 'Big O Notation', 'A mathematical notation describing the limiting behaviour of a function', '22222222-0005-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000005', 'Recursion', 'A function that calls itself to solve a smaller version of the same problem', '22222222-0005-0000-0000-000000000001');
