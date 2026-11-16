/**
 * Gutville's editable, versioned learning bank.
 * Keep answer keys on the server until an encounter has been answered.
 * See docs/curriculum.md before changing an assessed item.
 */
export const CONTENT_VERSION = "2026-11-03.1";

export type Domain = "processing" | "ingredients" | "applying";
export type Stage = "baseline" | "practice" | "post";
export type Question = {
  id: string;
  objectiveId: string;
  setId: string;
  stage: Stage;
  title: string;
  prompt: string;
  evidence?: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  sourceIds: string[];
};
export type Objective = {
  id: string;
  domain: Domain;
  title: string;
  description: string;
};
export type QuestionSet = {
  id: string;
  objectiveId: string;
  baseline: Question;
  practice: Question;
  post: Question;
};

export const SOURCES = [
  {
    id: "nhs-processed",
    title: "NHS — Processed foods",
    url: "https://www.nhs.uk/live-well/eat-well/how-to-eat-a-balanced-diet/what-are-processed-foods/",
  },
  {
    id: "fss-processing",
    title: "Food Standards Scotland — Processed and ultra-processed foods",
    url: "https://www.foodstandards.gov.scot/consumer-advice/healthy-eating/balanced-diet/processed-and-ultra-processed-foods",
  },
  {
    id: "fsanz-additives",
    title: "Food Standards Australia New Zealand — What do food additives do?",
    url: "https://www.foodstandards.gov.au/consumer/additives/additiveinfo",
  },
  {
    id: "sacn-2025",
    title: "SACN — Processed foods and health: rapid evidence update (2025)",
    url: "https://www.gov.uk/government/publications/processed-foods-and-health-sacns-rapid-evidence-update/processed-foods-and-health-sacns-rapid-evidence-update-summary",
  },
];

export const OBJECTIVES: Objective[] = [
  {
    id: "everyday-processing",
    domain: "processing",
    title: "Food can change",
    description: "Spot everyday processing and explain useful jobs such as cooking, freezing and pasteurising.",
  },
  {
    id: "processing-categories",
    domain: "processing",
    title: "Sorting with clues",
    description: "Use ingredient and making clues to distinguish clear processing examples, or ask for more evidence.",
  },
  {
    id: "ingredient-clues",
    domain: "ingredients",
    title: "Ingredient detectives",
    description: "Use meaningful ingredient clues instead of ingredient counts or unfamiliar words.",
  },
  {
    id: "ingredient-functions",
    domain: "ingredients",
    title: "Ingredients have jobs",
    description: "Explain simple jobs of emulsifiers, preservatives, colours, flavours and thickeners.",
  },
  {
    id: "packaging-labels",
    domain: "applying",
    title: "Look past the packet",
    description: "Separate advertising, ingredient evidence and nutrition information, and recognise missing evidence.",
  },
  {
    id: "nutritional-context",
    domain: "applying",
    title: "The bigger food picture",
    description: "Understand that a processing group is only part of the picture; variety, fibre and nutrients matter too.",
  },
];

type Draft = {
  title: string;
  prompt: string;
  evidence?: string;
  options: [string, string, string];
  correct: 0 | 1 | 2;
  explanation: string;
  sourceIds?: string[];
};

function makeSet(
  objectiveId: string,
  number: number,
  sourceIds: string[],
  baseline: Draft,
  practice: Draft,
  post: Draft,
): QuestionSet {
  const id = `${objectiveId}-${String(number).padStart(2, "0")}`;
  const question = (stage: Stage, draft: Draft): Question => ({
    id: `${id}-${stage}`,
    objectiveId,
    setId: id,
    stage,
    title: draft.title,
    prompt: draft.prompt,
    ...(draft.evidence ? { evidence: draft.evidence } : {}),
    options: [
      ...draft.options.map((text, i) => ({ id: ["a", "b", "c"][i], text })),
      ...(stage === "practice" ? [] : [{ id: "not-sure", text: "I'm not sure yet" }]),
    ],
    correctOptionId: ["a", "b", "c"][draft.correct],
    explanation: draft.explanation,
    sourceIds: draft.sourceIds ?? sourceIds,
  });
  return { id, objectiveId, baseline: question("baseline", baseline), practice: question("practice", practice), post: question("post", post) };
}

export const QUESTION_SETS: QuestionSet[] = [
  // Everyday processing: four matched examples of useful food changes.
  makeSet("everyday-processing", 1, ["nhs-processed"], {
    title: "The soup pot",
    prompt: "A cook chops and heats tomatoes for soup. Has the food been processed?",
    options: ["Yes — chopping and cooking change food", "No — processing only happens in factories", "Only if it goes into a colourful packet"],
    correct: 0,
    explanation: "Preparing food can be processing. Chopping and cooking are everyday examples, including in a home kitchen.",
  }, {
    title: "Kitchen experiment",
    prompt: "The cook boils an egg. Which note belongs in the food-change notebook?",
    evidence: "Before: a raw egg. After: a cooked egg with a firm white.",
    options: ["Nothing has changed", "Cooking is a way of processing food", "Every cooked food is ultra-processed"],
    correct: 1,
    explanation: "Heat changes the egg. That is processing, but cooking alone does not make a food ultra-processed.",
  }, {
    title: "The potato oven",
    prompt: "A potato is washed and baked at home. Which statement fits?",
    options: ["It cannot count as processing at home", "Baking always makes food ultra-processed", "Baking is processing, but it does not automatically mean ultra-processed"],
    correct: 2,
    explanation: "Processing includes changes made while preparing food. A baked potato shows why processed and ultra-processed are not the same thing.",
  }),
  makeSet("everyday-processing", 2, ["nhs-processed", "fss-processing"], {
    title: "A chilly clue",
    prompt: "Why might a farmer's peas be frozen?",
    options: ["To turn them into sweets", "To help keep them for longer", "To make them ultra-processed automatically"],
    correct: 1,
    explanation: "Freezing is a useful way to preserve food. Plain frozen peas are not automatically ultra-processed.",
  }, {
    title: "Freezer delivery",
    prompt: "Pick the best note for this bag of carrots.",
    evidence: "Ingredients: carrots. Making clues: washed, cut and frozen. No other ingredients added.",
    options: ["Freezing helps the carrots last; it is a simple food change", "A freezer makes every food ultra-processed", "A bag tells us the carrots have no useful nutrients"],
    correct: 0,
    explanation: "The carrots have had simple preparation and freezing. The bag and the freezer do not turn them into an ultra-processed recipe.",
  }, {
    title: "Berry weather",
    prompt: "A bag contains only raspberries that were picked and frozen. What is the freezing doing?",
    options: ["Adding artificial flavours", "Proving the berries cannot be part of a varied diet", "Helping preserve the berries"],
    correct: 2,
    explanation: "Freezing helps preserve berries. A food can be convenient and processed in a simple way.",
  }),
  makeSet("everyday-processing", 3, ["nhs-processed"], {
    title: "Milk mystery",
    prompt: "Milk is heated in a special way called pasteurising. What is one reason for doing this?",
    options: ["To remove harmful germs", "To add lots of sugar", "To make the bottle brighter"],
    correct: 0,
    explanation: "Pasteurising uses controlled heat to remove harmful germs. Processing can have a useful safety job.",
  }, {
    title: "The dairy note",
    prompt: "Choose the best explanation for the dairy's machine.",
    evidence: "The machine heats milk in a controlled way. The milk still needs to be stored as the label says.",
    options: ["It means milk never needs careful storage", "It turns milk into a sweetened drink", "It is pasteurising: heat helps make milk safer"],
    correct: 2,
    explanation: "Pasteurising is a safety process. It does not replace following the storage instructions on the milk.",
  }, {
    title: "Lunch delivery",
    prompt: "The school milk has been pasteurised. Which conclusion makes sense?",
    options: ["The heating proves sugar was added", "The milk has had useful processing to remove harmful germs", "Any safety process makes food ultra-processed"],
    correct: 1,
    explanation: "Milk can be processed to improve safety. Pasteurising by itself does not mean a food is ultra-processed.",
  }),
  makeSet("everyday-processing", 4, ["nhs-processed", "fss-processing"], {
    title: "Cupboard beans",
    prompt: "Beans and water are sealed in a tin and heated. What useful job can this do?",
    options: ["Make every bean into an ultra-processed food", "Mean nobody needs to read storage advice", "Help the unopened food keep for longer"],
    correct: 2,
    explanation: "Canning uses heat and a sealed container to help food keep. A tin alone does not tell you a food is ultra-processed.",
  }, {
    title: "Tomato time capsule",
    prompt: "The shop has a tin of tomatoes for the winter. Why might this be useful?",
    evidence: "Ingredients: tomatoes, tomato juice. The sealed tin was heated during canning.",
    options: ["Canning can help preserve tomatoes until they are needed", "All food in metal containers is ultra-processed", "Heating means the ingredients list must be very long"],
    correct: 0,
    explanation: "Preserving helps food last. How it was made and what was added matter more than whether the container is metal.",
  }, {
    title: "The fish freezer",
    prompt: "A fish fillet is frozen without added ingredients. What is a good reason for this processing?",
    options: ["It gives the fish a sweet flavour", "It helps preserve the fish for later use", "It proves the fish was made from many ingredients"],
    correct: 1,
    explanation: "Freezing helps preserve food. Processing has many different jobs, and some are very simple.",
  }),

  // NOVA is a processing framework, not a health score. Never classify by appearance alone.
  makeSet("processing-categories", 1, ["fss-processing"], {
    title: "Apple basket",
    prompt: "Which example is unprocessed or minimally processed?",
    evidence: "A: a whole washed apple. B: a drink made from water, sugar, apple flavour and colour. C: an apple-flavoured sweet made from sugar syrup and gelling agents.",
    options: ["The apple-flavoured sweet", "The whole washed apple", "The flavoured drink"],
    correct: 1,
    explanation: "Washing a whole apple is a small change. The other examples are recipes made from several processed parts and additives.",
  }, {
    title: "Oat sorter",
    prompt: "Put this example in the best processing group.",
    evidence: "Ingredients: oats. Making clues: oat grains were cleaned, steamed and rolled flat. Nothing else was added.",
    options: ["Ultra-processed", "Processed with added salt, sugar or oil", "Unprocessed or minimally processed"],
    correct: 2,
    explanation: "These plain oats have had simple changes to make them ready to use. They fit the minimally processed group.",
  }, {
    title: "Rice delivery",
    prompt: "A bag contains plain rice grains, cleaned and dried, with nothing added. Which group fits best?",
    options: ["Unprocessed or minimally processed", "Ultra-processed", "A sweetened industrial recipe"],
    correct: 0,
    explanation: "Cleaning and drying are simple changes. Plain rice is different from a recipe assembled from industrial ingredients.",
  }),
  makeSet("processing-categories", 2, ["fss-processing"], {
    title: "The bakery card",
    prompt: "Which processing group best fits this bread?",
    evidence: "Ingredients: flour, water, yeast, salt. Making clues: mixed, left to rise and baked. No other ingredients.",
    options: ["Unprocessed — nothing has changed", "Ultra-processed just because it is bread", "Processed — a simple bread recipe"],
    correct: 2,
    explanation: "A simple bread made from flour, water, yeast and salt fits the processed group in the framework used here. Breads can differ, so check the recipe.",
  }, {
    title: "Chickpea cupboard",
    prompt: "Sort this tin using all the clues.",
    evidence: "Ingredients: chickpeas, water, salt. Making clues: cooked and canned. No flavours, sweeteners or other additives.",
    options: ["Processed — chickpeas preserved with added salt", "Ultra-processed because the tin has a label", "Unprocessed — the chickpeas have never changed"],
    correct: 0,
    explanation: "These chickpeas have been cooked and preserved with salt. This is a clear processed-food example, rather than an ultra-processed formulation.",
  }, {
    title: "Cheese counter",
    prompt: "Which group best fits this plain traditional cheese?",
    evidence: "Ingredients: milk, cultures, salt, rennet. Making clues: milk is turned into curds, pressed and matured. No other additives.",
    options: ["Unprocessed, like a freshly picked apple", "Processed", "Ultra-processed simply because it is sold in a wrapper"],
    correct: 1,
    explanation: "Traditional cheese is a processed example. A wrapper, or a word such as rennet, does not by itself make a food ultra-processed.",
  }),
  makeSet("processing-categories", 3, ["fss-processing"], {
    title: "Colour-pop drink",
    prompt: "Which processing group best fits this drink?",
    evidence: "Ingredients: water, sugar syrup, flavouring, colour, sweetener. Making clues: these ingredients are blended into a bright fizzy drink; it contains no whole fruit.",
    options: ["Ultra-processed", "Unprocessed fruit", "Minimally processed water"],
    correct: 0,
    explanation: "This drink is an industrial formulation with flavour, colour and sweetener. Those clues support the ultra-processed group; the colour of the bottle does not.",
  }, {
    title: "Crunchy shapes",
    prompt: "Use the making card to choose a group.",
    evidence: "Ingredients: maize starch, sugar syrup, protein isolate, flavouring, emulsifier. Making clues: the separated ingredients are mixed and pushed into crunchy shapes in a factory.",
    options: ["Unprocessed maize kernels", "Ultra-processed", "Minimally processed grains with nothing added"],
    correct: 1,
    explanation: "The separated ingredients and additives are made into a new snack. This combination is a clear ultra-processed example.",
  }, {
    title: "Strawberry-style snack",
    prompt: "Where does this snack fit best?",
    evidence: "Ingredients: glucose syrup, starch, fruit flavouring, colour, gelling agent. Making clues: the mixture is formed into fruit-shaped chews, without whole fruit.",
    options: ["Unprocessed strawberries", "Minimally processed fruit", "Ultra-processed"],
    correct: 2,
    explanation: "A fruit shape is not whole fruit. This is a formulated snack made from processed ingredients and additives.",
  }),
  makeSet("processing-categories", 4, ["fss-processing", "sacn-2025"], {
    title: "The bread photograph",
    prompt: "A photograph shows sliced bread. Can you tell its processing group from the photograph alone?",
    options: ["Yes — all sliced bread has the same recipe", "No — I need ingredients and making clues", "Yes — brown bread is always minimally processed"],
    correct: 1,
    explanation: "Similar-looking breads can be made in different ways. Ingredients and making details are stronger evidence than a photograph.",
  }, {
    title: "Mystery frozen pudding",
    prompt: "The ingredient side of this pudding tub is missing. What should a food detective do?",
    evidence: "Visible clues: a blue tub, a pudding picture and the words 'Family Favourite'. There is no ingredient or making information.",
    options: ["Call it ultra-processed because the tub is blue", "Call it minimally processed because it says family", "Ask for the missing ingredients and making information"],
    correct: 2,
    explanation: "It is sensible to say there is not enough evidence. A picture or an advertising phrase cannot tell the whole recipe.",
  }, {
    title: "Yoghurt look-alikes",
    prompt: "Two yoghurt pots look the same, but the ingredient lists are hidden. Which answer is best?",
    options: ["We need more information before sorting them", "The same pot shape proves the same processing", "A picture of fruit proves both contain only fruit"],
    correct: 0,
    explanation: "Different recipes can use similar packaging. Looking for more evidence is part of good science.",
  }),

  makeSet("ingredient-clues", 1, ["fss-processing"], {
    title: "Nine-ingredient soup",
    prompt: "A soup has nine ingredients. Does the number alone prove it is ultra-processed?",
    evidence: "Ingredients: carrots, onion, lentils, water, tomatoes, olive oil, garlic, cumin, coriander. The cook chops and simmers them together.",
    options: ["Yes — more than five always means ultra-processed", "Yes — every spice is an industrial additive", "No — we must look at what the ingredients are and how the soup is made"],
    correct: 2,
    explanation: "There is no reliable five-ingredient rule. This recipe has many familiar foods and spices; ingredient count alone is not a processing test.",
  }, {
    title: "The dip recipe",
    prompt: "Which detective rule works best for this dip?",
    evidence: "The cook blends chickpeas, tahini, lemon juice, water, olive oil, garlic, cumin and salt.",
    options: ["Read the ingredients and making clues, rather than count them", "Eight ingredients always means ultra-processed", "Blending makes every recipe ultra-processed"],
    correct: 0,
    explanation: "A long recipe can use ordinary foods and cooking ingredients. The kinds of ingredients and the process matter more than a magic number.",
  }, {
    title: "A colourful salad",
    prompt: "A cook mixes ten vegetables, herbs and a little oil. Which statement is most sensible?",
    options: ["Ten ingredients proves ultra-processing", "A large ingredient count alone does not prove ultra-processing", "Every herb makes a food ultra-processed"],
    correct: 1,
    explanation: "Counting ingredients is not enough. A recipe can have lots of vegetables and herbs without being an industrial formulation.",
  }),
  makeSet("ingredient-clues", 2, ["fss-processing", "fsanz-additives"], {
    title: "A long word",
    prompt: "A label says 'ascorbic acid'. Can you decide a food is harmful just because that word is unfamiliar?",
    evidence: "Ascorbic acid is another name for vitamin C. It can also have an antioxidant job in food.",
    options: ["No — a word's length does not tell us whether a food is harmful", "Yes — any unfamiliar name means danger", "Yes — all vitamins are harmful additives"],
    correct: 0,
    explanation: "An unfamiliar name is not a danger test. Find out what an ingredient is and what it does, and consider the whole food.",
  }, {
    title: "Decode the salt",
    prompt: "A recipe card calls salt 'sodium chloride'. What should the detective conclude?",
    evidence: "Sodium chloride is the chemical name for ordinary salt.",
    options: ["A scientific name proves ultra-processing", "A scientific name can describe an everyday ingredient", "A scientific name means an ingredient has no purpose"],
    correct: 1,
    explanation: "Everyday substances have scientific names too. Name length tells us little about processing; we need the actual ingredients and making clues.",
  }, {
    title: "Vitamin-name puzzle",
    prompt: "A label uses the name 'tocopherol', a form of vitamin E. What can the name alone tell us?",
    options: ["It proves the food is unsafe", "It proves the food is a complete balanced meal", "It is not enough to judge the whole food or its processing"],
    correct: 2,
    explanation: "One unfamiliar name cannot describe the whole food. Ingredient jobs, the recipe and the way it was made all need attention.",
  }),
  makeSet("ingredient-clues", 3, ["fss-processing"], {
    title: "Find the useful clue",
    prompt: "Which clue gives the strongest evidence of an ultra-processed recipe?",
    options: ["The packet is purple", "It is made from protein isolate and starch with flavouring, colour and emulsifier", "Its name has three words"],
    correct: 1,
    explanation: "A combination of separated food parts and additives used to make a new product is a useful clue. Packet colour and word count are not.",
  }, {
    title: "Two cereal cards",
    prompt: "Which card gives stronger evidence of an ultra-processed formulation?",
    evidence: "Card A: rolled oats; cleaned, steamed and flattened. Card B: maize starch, sugar syrup, protein isolate, flavouring and colour; formed into sweet crunchy rings.",
    options: ["Card A, because the oats are in a bag", "Both, because all cereals are made in exactly the same way", "Card B, because of the ingredients and how they are combined"],
    correct: 2,
    explanation: "Card B describes separated ingredients made into a new snack with flavour and colour. Card A describes simple changes to a whole grain.",
  }, {
    title: "Snack investigator",
    prompt: "A snack is made by mixing starch, protein isolate, flavouring and emulsifier into shaped pieces. Which clue matters most?",
    options: ["The mixture of separated ingredients and additives", "The animal printed on the wrapper", "How shiny the packet looks"],
    correct: 0,
    explanation: "Ingredients and manufacturing evidence help identify the formulation. Wrapper style does not tell us how the food was made.",
  }),
  makeSet("ingredient-clues", 4, ["fss-processing", "fsanz-additives"], {
    title: "The preservative clue",
    prompt: "Does the word 'preservative' by itself prove a food is ultra-processed?",
    options: ["Yes — one additive settles every case", "Yes — useful processing never uses preservatives", "No — look at its purpose, the whole recipe and making clues"],
    correct: 2,
    explanation: "Preservatives help food keep. Some processed foods use them too. One additive word by itself cannot settle every processing classification.",
  }, {
    title: "Factory detective",
    prompt: "Which rule would help you sort foods fairly?",
    evidence: "A large bakery makes bread from only flour, water, yeast and salt. A small workshop makes shaped snacks from protein isolate, syrup, flavouring and emulsifier.",
    options: ["Use the recipe and process; the size of the building is not enough", "Everything from a large building is ultra-processed", "A small workshop can never make ultra-processed food"],
    correct: 0,
    explanation: "A big building can make a simple recipe. A small one can make an industrial-style formulation. The evidence about the food matters.",
  }, {
    title: "Wrapper detective",
    prompt: "Plain dried lentils and a formulated sweet snack both come in packets. What does their packaging prove?",
    options: ["They belong in the same processing group", "Very little about their processing; read ingredients and making clues", "Both must contain sweeteners"],
    correct: 1,
    explanation: "Packaging helps store and sell many different foods. It is not enough to identify a processing group.",
  }),

  makeSet("ingredient-functions", 1, ["fsanz-additives", "fss-processing"], {
    title: "Oil and water",
    prompt: "What job can an emulsifier do in a mixture containing oil and water?",
    options: ["Help the oil and water stay mixed", "Turn all the water into sugar", "Prove the food has no nutrients"],
    correct: 0,
    explanation: "Oil and water often separate into layers. An emulsifier can help them stay mixed.",
  }, {
    title: "Sauce science",
    prompt: "The sauce keeps separating. Which ingredient job could help?",
    evidence: "The recipe contains oil and water. The cook wants a smooth mixture instead of two layers.",
    options: ["A colour to paint the bottle", "An emulsifier to help the oil and water stay mixed", "A sweetener to freeze the sauce"],
    correct: 1,
    explanation: "An emulsifier helps hold oil and water together. Knowing an ingredient's job is more useful than deciding it is scary because of its name.",
  }, {
    title: "The spread problem",
    prompt: "A spread contains water and oil. The spread maker adds an emulsifier. What is the most likely job?",
    options: ["To put air in the wrapper", "To turn it into whole fruit", "To help stop the oil and water separating"],
    correct: 2,
    explanation: "The emulsifier helps maintain the mixture. This describes its job; it is not a complete nutrition or safety judgement about the spread.",
  }),
  makeSet("ingredient-functions", 2, ["fsanz-additives", "fss-processing"], {
    title: "Keep-it-longer clue",
    prompt: "What is one job of a food preservative?",
    options: ["To make every food taste sweet", "To slow spoilage caused by germs", "To replace all the fibre"],
    correct: 1,
    explanation: "Preservatives can slow the growth of germs that spoil food. They do not replace following storage and use-by instructions.",
  }, {
    title: "The bread notebook",
    prompt: "Why might a baker use an approved preservative?",
    evidence: "The baker wants to slow the growth of mould. The loaf still has storage instructions.",
    options: ["To help the bread keep for longer", "To make storage instructions unnecessary", "To turn the bread into a vitamin"],
    correct: 0,
    explanation: "A preservative can slow spoilage. Approved food additives have safety rules; the ingredient's purpose is useful evidence, not a reason for food fear.",
  }, {
    title: "Sauce storage",
    prompt: "A sauce label lists a preservative. What should the detective think?",
    options: ["The sauce can never spoil", "The label no longer needs storage advice", "It may help slow spoilage, but storage advice still matters"],
    correct: 2,
    explanation: "A preservative has a keeping job. Food still needs to be stored and used according to its instructions.",
  }),
  makeSet("ingredient-functions", 3, ["fsanz-additives", "fss-processing"], {
    title: "Colour clue",
    prompt: "A pudding maker adds a food colour to a pudding. What is the colour's job?",
    options: ["To make it a balanced meal", "To prove it contains a whole fruit", "To add or bring back colour"],
    correct: 2,
    explanation: "Food colours change how a food looks. A bright colour is not evidence that the food contains fruit or supplies every nutrient.",
  }, {
    title: "Flavour workshop",
    prompt: "A dessert uses vanilla flavouring. What job does a flavouring do?",
    evidence: "The recipe card says the dessert maker wants a vanilla taste.",
    options: ["Adds or brings back flavour", "Makes the pot larger", "Automatically adds fibre"],
    correct: 0,
    explanation: "Flavourings affect taste and smell. They do not automatically add the nutrients from the food shown in a picture.",
  }, {
    title: "Orange-coloured surprise",
    prompt: "A drink gets its orange colour from a food colour. What can you conclude?",
    options: ["The colour proves there is a whole orange inside", "The colour changes appearance; check other information for ingredients and nutrients", "Orange-coloured drinks all have the same recipe"],
    correct: 1,
    explanation: "Colour tells us about appearance. Read the ingredients and nutrition information to learn more about the drink.",
  }),
  makeSet("ingredient-functions", 4, ["fsanz-additives"], {
    title: "The runny soup",
    prompt: "What job could a thickener do in a soup?",
    options: ["Help make the soup less runny", "Turn the spoon green", "Remove every other ingredient"],
    correct: 0,
    explanation: "A thickener changes how easily a food flows. Different ingredients have different jobs in recipes.",
  }, {
    title: "Powder-flow test",
    prompt: "This seasoning keeps clumping. Which ingredient job could help it pour?",
    evidence: "The seasoning maker wants the tiny powder particles to stick together less. The job is called anti-caking.",
    options: ["A colour to change the lid", "A flavour to make the tub heavier", "An anti-caking agent to help stop clumps"],
    correct: 2,
    explanation: "Anti-caking agents help powders flow by reducing clumping. A technical name can describe a practical job.",
  }, {
    title: "Smooth sauce",
    prompt: "A sauce maker wants a thicker texture. Which job fits?",
    options: ["A colour to change its appearance", "A thickener to make it less runny", "A flavouring to make the label larger"],
    correct: 1,
    explanation: "A thickener changes texture. Colour, flavour and thickness are different ingredient jobs.",
  }),

  makeSet("packaging-labels", 1, ["fss-processing", "nhs-processed"], {
    title: "The natural badge",
    prompt: "A packet says 'Natural Goodness'. Does that phrase tell you its processing group?",
    options: ["Yes — the word natural proves it", "No — I need ingredient and making information", "Yes — green letters mean minimally processed"],
    correct: 1,
    explanation: "An advertising phrase is not a full recipe. Ingredients and making clues provide evidence about processing.",
  }, {
    title: "Hero cereal box",
    prompt: "Which information should the detective use to investigate this cereal?",
    evidence: "The front has a superhero and says 'Start Your Adventure'. The back has ingredients, nutrition information and making details.",
    options: ["The superhero's cape colour", "How loudly the slogan is written", "The ingredients and making details for processing; nutrition information for nutrients"],
    correct: 2,
    explanation: "Packets can attract our attention. Ingredient and making evidence helps with processing, while nutrition information answers different questions.",
  }, {
    title: "Farm-style label",
    prompt: "A snack wrapper shows a farm and says 'Wholesome'. What is the best next step?",
    options: ["Read ingredients and making clues rather than decide from the artwork", "Decide it is minimally processed because of the farm picture", "Assume the slogan lists every ingredient"],
    correct: 0,
    explanation: "Pictures and slogans are chosen to sell a food. They cannot replace information about the food itself.",
  }),
  makeSet("packaging-labels", 2, ["nhs-processed", "fss-processing"], {
    title: "Which label part?",
    prompt: "You want to compare the salt in two similar soups. Which information helps most?",
    options: ["The picture on each tin", "The length of each product name", "Salt in the nutrition information, compared for the same amount"],
    correct: 2,
    explanation: "Nutrition information helps compare nutrients. Use the same amount of each food, such as 100 g, for a fair comparison.",
  }, {
    title: "Fair comparison",
    prompt: "Which soup has less salt when you compare the same amount?",
    evidence: "Soup A: 0.4 g salt per 100 g. Soup B: 0.8 g salt per 100 g. These numbers do not tell us the full recipes.",
    options: ["Soup A", "Soup B", "The tin with the bigger picture"],
    correct: 0,
    explanation: "0.4 g is less than 0.8 g for the same amount. This compares salt; it does not settle every question about processing or the whole diet.",
  }, {
    title: "Breakfast numbers",
    prompt: "Cereal A has 5 g sugars per 100 g. Cereal B has 15 g per 100 g. What do these numbers show?",
    options: ["Exactly how each cereal was made", "A has less sugar per 100 g; processing still needs other evidence", "B must contain more fibre"],
    correct: 1,
    explanation: "The numbers answer a sugar question. An ingredient list and making details are needed for a processing question.",
  }),
  makeSet("packaging-labels", 3, ["fss-processing"], {
    title: "A recipe question",
    prompt: "You want to know whether a snack contains a sweetener. Where should you look?",
    options: ["The ingredient list", "The colour of the wrapper", "The cartoon character's speech bubble"],
    correct: 0,
    explanation: "The ingredient list tells you what was used in the food. Pictures and advertising cannot reliably answer that question.",
  }, {
    title: "Read the evidence",
    prompt: "Which statement is supported by this drink's ingredient list?",
    evidence: "Ingredients: water, flavouring, sweetener. The front shows a bunch of berries. No berries or berry juice appear in the list.",
    options: ["The picture proves the drink contains whole berries", "The list includes a sweetener but does not list berries", "The bottle colour tells us its fibre content"],
    correct: 1,
    explanation: "The list is stronger evidence than the picture. A berry picture does not guarantee that berries are an ingredient.",
  }, {
    title: "The wholegrain claim",
    prompt: "A box says 'With wholegrain'. You want to check what it is made from. What should you use?",
    options: ["Only the size of the word wholegrain", "Only the smiling mascot", "The ingredient list, alongside other useful label information"],
    correct: 2,
    explanation: "A front-of-pack claim may describe one feature. Read the ingredients to learn more about the whole recipe.",
  }),
  makeSet("packaging-labels", 4, ["fss-processing", "sacn-2025"], {
    title: "Missing half a label",
    prompt: "You can see only 'low sugar' on a packet. Can you decide if the food is ultra-processed?",
    options: ["Yes — low sugar always means minimally processed", "No — that claim does not give the full recipe or process", "Yes — all low-sugar foods are made the same way"],
    correct: 1,
    explanation: "A sugar claim concerns one nutrient. We need ingredient and making information to investigate processing.",
  }, {
    title: "The mystery lunch",
    prompt: "What is the most careful conclusion from this card?",
    evidence: "The card says 'lunch bar' and shows a photo. Ingredients, nutrition numbers and making details are missing.",
    options: ["It definitely has lots of fibre", "It definitely belongs in one processing group", "There is not enough information; ask for the missing evidence"],
    correct: 2,
    explanation: "A name and a photo leave important gaps. Saying 'I need more evidence' is a useful detective skill.",
  }, {
    title: "The hidden recipe",
    prompt: "A food has a nutrition table but no ingredient or making information. Can the table alone settle its processing group?",
    options: ["No — nutrients and processing are different kinds of information", "Yes — sugar numbers reveal every factory step", "Yes — the table lists all ingredients in order"],
    correct: 0,
    explanation: "A nutrition table tells you about nutrients. It does not give every ingredient or explain how the food was made.",
  }),

  makeSet("nutritional-context", 1, ["nhs-processed", "sacn-2025"], {
    title: "Wholemeal question",
    prompt: "A wholemeal sliced loaf is classed as ultra-processed. Can it still provide useful fibre?",
    options: ["No — that category means it has no nutrients", "No — only unpackaged foods have fibre", "Yes — processing group alone does not tell us all its nutrients"],
    correct: 2,
    explanation: "Some ultra-processed foods, such as wholemeal sliced bread, can provide fibre and fit into a varied diet. Check the whole picture.",
  }, {
    title: "Fibre finder",
    prompt: "Which note makes sense for the bread shelf?",
    evidence: "A wholemeal loaf has an ultra-processed recipe and provides fibre. A different loaf has a simpler recipe but much less fibre.",
    options: ["Look at processing and nutrients; one category is not the whole story", "The wholemeal loaf cannot contain fibre", "A simpler recipe always supplies more of every nutrient"],
    correct: 0,
    explanation: "Fibre is useful, including from wholegrain foods. Processing and nutrition are related questions, but they are not identical.",
  }, {
    title: "Breakfast shelf",
    prompt: "A higher-fibre wholegrain cereal is ultra-processed. Which statement is most accurate?",
    options: ["Its category proves it has no useful nutrients", "It can provide useful fibre; we should also consider the rest of its nutrition", "The packet makes the fibre disappear"],
    correct: 1,
    explanation: "The NHS includes higher-fibre cereals among foods that can fit in a healthy diet. A processing label does not erase useful nutrients.",
  }),
  makeSet("nutritional-context", 2, ["nhs-processed", "fss-processing"], {
    title: "The picnic picture",
    prompt: "Which gives a better picture of someone's eating?",
    options: ["The range of foods they usually eat over time", "One snack they ate once", "The colour of their lunch box"],
    correct: 0,
    explanation: "A varied pattern of eating matters. One snack cannot describe a person's diet, and food choices are not a reason to judge someone.",
  }, {
    title: "Pack a varied picnic",
    prompt: "Choose the most helpful picnic note.",
    evidence: "The picnic includes sandwiches, fruit, vegetables, water and a shared cake. Families have different foods, needs and budgets.",
    options: ["One slice of cake tells us everything about a person", "Variety across meals matters; nobody needs a good-food or bad-food badge", "Everyone must eat exactly the same picnic"],
    correct: 1,
    explanation: "Different foods can have a place in eating. Learning about food should support curiosity and variety, without judging people or families.",
  }, {
    title: "One-snapshot puzzle",
    prompt: "You see a friend eat a packaged snack once. What can you fairly conclude about their whole diet?",
    options: ["You know everything they usually eat", "You can give them a bad-food badge", "Very little — one snack is only a small snapshot"],
    correct: 2,
    explanation: "We cannot judge a whole eating pattern from one moment. People have different needs, access and preferences.",
  }),
  makeSet("nutritional-context", 3, ["nhs-processed", "fss-processing"], {
    title: "One group, two recipes",
    prompt: "Two foods are in the same processing group. Must they contain the same salt, sugar and fibre?",
    options: ["Yes — the group is a complete nutrition table", "No — their recipes and nutrients can differ", "Yes — every packet in a group is identical"],
    correct: 1,
    explanation: "Processing groups describe how food is made. Foods within one group can have different amounts of nutrients.",
  }, {
    title: "Compare the whole picture",
    prompt: "What is the most useful conclusion from these two food cards?",
    evidence: "Both foods are ultra-processed. A has more fibre and less salt than B for the same amount. The recipes and ingredients also differ.",
    options: ["The processing group makes the nutrition numbers identical", "Fibre is not a nutrient if the food is packaged", "The foods share a processing group but differ nutritionally"],
    correct: 2,
    explanation: "A group does not make every member the same. Use nutrition information as well as ingredient and processing evidence.",
  }, {
    title: "Same shelf, different labels",
    prompt: "Two ultra-processed soups have different salt amounts per 100 g. Which statement is right?",
    options: ["Their nutrition can differ even though their processing group matches", "The labels must be wrong because their group matches", "Their group tells us the exact salt amount"],
    correct: 0,
    explanation: "Foods in the same processing category can still have different recipes and nutrient amounts. Compare the labels for the question you are asking.",
  }),
  makeSet("nutritional-context", 4, ["sacn-2025", "fss-processing"], {
    title: "A careful scientist",
    prompt: "Scientists find a link between eating lots of UPFs and poorer health. Does a link alone prove that processing is the cause?",
    options: ["Yes — a link proves the exact cause", "Yes — it tells us what will happen after one snack", "No — nutrients and other differences also need studying"],
    correct: 2,
    explanation: "Scientists take these links seriously, but a link alone does not prove the reason. Ingredients, nutrients and other differences are still being studied.",
  }, {
    title: "Research notebook",
    prompt: "Which headline best matches what the scientists know?",
    evidence: "A study finds a link between people's usual diets and health. People also differ in many other ways. The study cannot separate every possible reason.",
    options: ["There is a link worth studying; more work is needed to understand why", "One snack decides everyone's future", "Every food in one group affects everyone in exactly the same way"],
    correct: 0,
    explanation: "Good science explains both findings and limits. A concerning link can guide more research without proving that one feature explains everything.",
  }, {
    title: "What can a study tell us?",
    prompt: "A new study reports a link between a diet pattern and health. What is the careful response?",
    options: ["Use it to predict a child's health from one meal", "Look at the evidence and its limits; a link is not the same as proving a cause", "Assume every food in that pattern is identical"],
    correct: 1,
    explanation: "A study can help build understanding, but it has limits. Gutville teaches careful questions rather than promises about what one food will do.",
  }),
];
