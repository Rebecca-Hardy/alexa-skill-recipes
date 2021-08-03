'use strict';
const Alexa = require('ask-sdk-v1adapter');
const APP_ID = undefined;

/***********
Data: Customize the data below as you please.
***********/

const SKILL_NAME = "Pancake Plaisir";
const STOP_MESSAGE = "Alright, have a good day!";
const CANCEL_MESSAGE = "Okay. See you next time.";

const HELP_START = "I can help you find recipes by meal type or ingredient and save them. I can also inspire you with a surprise recipe and help you rate a recipe. Would you like to search for a recipe, access your saved recipes, hear a surprise recipe or rate a recipe?";
const HELP_START_REPROMPT = "Do you want to find a recipe like breakfast, access your saved recipes, hear a surprise recipe or rate a recipe?";
const HELP_RECIPE = "";
const HELP_RECIPE_REPROMPT = "";
const HELP_INSTRUCTIONS = "You can ask me to repeat the instructions or say 'next' to hear the next line of instructions.";
const HELP_INSTRUCTIONS_REPROMPT = "You can ask me to repeat the instructions or say 'next' to hear the next line of instructions.";

const CHOOSE_TYPE_MESSAGE = `Hey, welcome to ${SKILL_NAME}! I'm here to help you cook delicious, nutricious and indulgent pancake meals! To start simply ask for a meal like {breakfast}, give me an ingredient like {cheese} or ask for a surprise recipe`;
const REPROMPT_TYPE = "I can help you make tastey pancake meals by meal type, ingredient or ask for a surprise. What would you like?";
const MEALTYPE_NOT_IN_LIST = chosenType => `Oh no, it doesn't look like we have any recipes for that, would you like a breakfast, lunch, dinner, dessert or snack recipe?`;

const RECIPE_ADJECTIVES = [
  "lovely",
  "super simple",
  "fun",
  "tasty",
  "easy"
];
const SUGGEST_TWO_RECIPES = (mealType, recipeName1, recipeName2) => `So I've found 2 recipes for ${mealType}: a ${recipeName1} or a ${recipeName2}, you can say 1 or 2 or next for another recipe`;
const RANDOM_RECIPE_SUGGESTERS = [
  (recipeName1, recipeName2) => `How exciting! How about ${recipeName1} or ${recipeName2}?`,
  (recipeName1, recipeName2) => `So I've 2 suggestions for you: a ${recipeName1} or a ${recipeName2}, you can say 1 or 2 or next for another recipe`,
  (recipeName1, recipeName2) => `After some quick thinking, I'd recommend a ${recipeName1} or a ${recipeName2}, which would you prefer?`,
  (recipeName1, recipeName2) => `Alright I'd recommend either ${recipeName1} or a ${recipeName2}. Would you prefer the first or second option?`,
];
const MISUNDERSTOOD_RECIPE_ANSWER = (recipeName1, recipeName2) => `Sorry, I didn't catch that, you can choose between ${recipeName1} or a ${recipeName2} otherwise ask for another suggestion`;
const NO_REMAINING_RECIPE = [
  "It looks like there are no more recipes that match what you want. I'm sorry about that. I suggest starting a new search so I can help you.",
  "That's a shame, I've not be able to find any recipes that suit you. I'd suggest trying a new search, stating the meal type.",
  "I'm sorry, there are no recipes matching what you want. Try a new search using the type of meal you want to cook.",
];
const MISUNDERSTOOD_NO_REMAINING_RECIPE_ANSWER = "Sorry, I didn't catch that. Would you like to look for a new recipe?";
const MORE_RECIPES = (recipeName1, recipeName2) => `Sure let's take a look for a new recipe, how about: ${recipeName1} or ${recipeName2}?`;
const WHAT_NEXT = recipeName => `${recipeName} sounds good. You can start the recipe, save the recipe or send the recipe details to your phone`;
const RECIPE_SAVED = "No worries mate, I've saved the recipe for later";
const SENT_TO_PHONE = "Sure, I've sent the recipe details to your phone";
const INGREDIENTS_INTRO = "{Discourse Marker}, for this recipe you'll need {ingredient list}", ; // Here follows a list of ingredients
const INGREDIENTS_ENDING = "what would you like to do now?"; // Will be said after the list of ingredients

const INGREDIENTS_REMINDER_INTRO = "The ingredients for this step are"; //the ingredients will follows
const INGREDIENTS_REMINDER_NONE = "You've already got the ingredients measured out"; //for if there are no measurements for ingredients

const FIRST_TIME_INSTRUCTIONS = "Super, let me know if you need a step repeated or if you're ready for the next step. Let's start cooking. ";
const REPROMPT_INSTRUCTIONS = "Say 'next' to go to the next line of instructions. Say 'repeat' if you didn't understand me or want to hear the last line of instructions again.";
const MISUNDERSTOOD_INSTRUCTIONS_ANSWER = "Sorry, I didn't understand you there.";
const CLOSING_MESSAGE = "";

const recipes = {
  breakfast: [
    {
      name: "Dumpling Pancake",
      instructions: [
        "Cook the dumplings as per the manufactor's instructions.",
        "Meanwhile prepare the pancake mix by mixing together flour, sugar and salt",
        "In another bowl whisk together eggs, milk, and fizzy drink ",
        "Slowly add in the the egg mix into the flour and combine till smooth.",
        "Chill this mixture in the fridge for as you warm up the frying pan with some oil and wait for the dumplings to finish cooking.",
        "When the dumplings are cooked and the pan is hot enough, take the mixture from fridge and stir, .",
        "Place the dumplings in the hot pan and pour in the egg mixture over the top, cook till egg golden brown on the bottom",
        "Turn the pancake out onto a plate and enjoy. Remember to share it with me too - I love a good dumpling pancake"
      ],
      ingredients: [
        "Premade dumplings",
        "2 cups plain flour",
        "2 cups milk",
        "1 and a half cups of sparkling water",
        "4 whole eggs"
      ]
    },

    {
      name: "Bacon Pancake",
      instructions: [
        "Grill the bacon",
        "Meanwhile prepare the pancake mix by mixing together flour, sugar and salt",
        "In another bowl whisk together eggs, milk, and fizzy drink ",
        "Slowly add in the the egg mix into the flour and combine till smooth.",
        "Pour egg mixture into pan and cook",
        "Turn the pancake out onto a plate and add the bacon - Enjoy!"
      ],
      ingredients: [
        "4 rashes of bacon",
        "2 cups plain flour",
        "2 cups milk",
        "1 and a half cups of sparkling water",
        "4 whole eggs"
      ]
    },

    {
      name: "Banana Pancake",
      instructions: [
        "Sprinkle the bananas with sugar and grill till golden",
        "Meanwhile prepare the pancake mix by mixing together flour, sugar and salt",
        "In another bowl whisk together eggs, milk, and fizzy drink ",
        "Slowly add in the the egg mix into the flour and combine till smooth.",
        "Pour egg mixture into pan and cook",
        "Turn the pancake out onto a plate and add the bacon - Enjoy!"
      ],
      ingredients: [
        "2 bananas",
        "sprinkle of brown sugar",
        "2 cups plain flour",
        "2 cups milk",
        "1 and a half cups of sparkling water",
        "4 whole eggs"
      ]
    },

    {
      name: "Spiced Pancake",
      instructions: [
        "Combine the spices and gentle cook them off in a pan",
        "Meanwhile prepare the pancake mix by mixing together flour, sugar and salt",
        "In another bowl whisk together eggs, milk, and fizzy drink ",
        "Slowly add in the the egg mix into the flour and combine till smooth.",
        "Pour egg mixture into pan with the spices and cook",
        "Turn the pancake out onto a plate and add the bacon - Enjoy!"
      ],
      ingredients: [
        "spices you like",
        "2 cups plain flour",
        "2 cups milk",
        "1 and a half cups of sparkling water",
        "4 whole eggs"
      ]
    },

  ],
  lunch: [
    {
      name: "Kimchi Pancake",
      instructions: [
        "Finely chop up the kimchii .",
        "Cut the onions in the same manner, cutting into small cubes is preferable",
        "Make the pancake batter by whisking the eggs and milk together, then add in flour",
        "Add in the kimchii and onion and combine.",
        "Add a generous amount of oil on a non-stick pan or skillet and wait until it reaches medium-high heat.",
        "Ladle the batter to fry in either one large pancake or several smaller ones, cook for about 5 minutes or until slightly golden brown.",
        "Transfer to a serving plate and add the cheese so it melt slightly. Enjoy while hot and add more cheese if you want some more cheese - I know I would"
      ],
      ingredients: [
        "2 cups kimchi",
        "half a cup of milk",
        "quarter of an onion",
        "60 grams cheese",
        "4 eggs",
        "half a cup of flour"
      ]
    },

    {
      name: "Baked Beans Pancake",
      instructions: [
        "Cook the beans",
        "Make the pancake batter by whisking the eggs and milk together, then add in flour",
        "Add a generous amount of oil on a non-stick pan or skillet and wait until it reaches medium-high heat.",
        "Ladle the batter to fry in either one large pancake or several smaller ones, cook for about 5 minutes or until slightly golden brown.",
        "Transfer to a serving plate and add the cheese so it melt slightly. Enjoy while hot and add more cheese if you want some more cheese - I know I would"
      ],
      ingredients: [
        "1 tin of baked beans",
        "half a cup of milk",
        "quarter of an onion",
        "60 grams cheese",
        "4 eggs",
        "half a cup of flour"
      ]
    },

    {
      name: "Tuna Mayo Pancake",
      instructions: [
        "Make the pancake batter by whisking the eggs and milk together, then add in flour",
        "Add a generous amount of oil on a non-stick pan or skillet and wait until it reaches medium-high heat.",
        "Ladle the batter to fry in either one large pancake or several smaller ones, cook for about 5 minutes or until slightly golden brown.",
        "Transfer to a serving plate and add the cheese so it melt slightly.",
        "Open tin of tuna and add the mayo to the pancake",
        "Enjoy while hot and add more cheese if you want some more cheese - I know I would"
      ],
      ingredients: [
        "1 tin of tuna",
        "As much mayo needed for tuna mayo"
        "half a cup of milk",
        "quarter of an onion",
        "60 grams cheese",
        "4 eggs",
        "half a cup of flour"
      ]
    },

  {
    name: "Lemon Sardines wholewheat pancakes",
    instructions: [
      "Preheat oven to 425 degrees.",
      "Place eggs, milk, flour and salt into a blender.",
      "Whirl it around until it's well-mixed, about 1 minute.",
      "Melt butter in skillet over medium-low heat.",
      "Pour pancake mix into skillet and pop it into the oven. Bake for 12-15 minutes, until the edges are golden brown and pulling away from the sides.",
      "Remove from oven and use a large circular spatula to scoop it from the skillet onto a plate.",
      "Squeeze the juice from half a lemon all over the pancake.",
      "Add the lemon sardines on top and cut in half - enjoy the lemon goodness"

    {
      ingredients: [
        "1 tin of lemon sardines",
        "half a cup of milk",
        "juice of a lemon",
        "1 tablespoon butter",
        "4 eggs",
        "half a cup of wholewheat flour"
      ]

    ],

      },
    ],

  ],
  dinner: [
    {
      name: "Mackeral pancake",
      instructions: [
        "Preheat oven to 400 degrees.",
        "Whisk the eggs in a bowl with the herbs.",
        "Melt the butter in a small frying pan, and pour in the eggs. When set, flip over.",
        "Heat a little oil on a griddle pan, and add the spring onions. Grill all sides.",
        "Dredge the fish in some flour, dip in the beaten egg and coat with couscous.",
        "Grill in the same pan, and transfer to the oven for 5-10 minutes.",
        "Serve on the pancake with the spring onions - and enjoy!"
      ],
      ingredients: [
        "3 whole eggs",
        "2 tablespoons chopped parsley",
        "4 spring onions",
        "tinned mackeral",
        "1 whole beaten egg",
        "50 grams couscous",
        "1 knob of butter"
      ]
    },

  {
    name: "Potato pancake",
    instructions: [
      "Peel and grate potatoes.",
      "Remove excess liquid by squeezing the grated potatoes in a tea towel. The drier the better.",
      "Finely chop onion.",
      "Beat eggs till mixed together.",
      "In a separate bowl place grated potato, onion, and salt and pepper.",
      "Then add in the egg mixture and mix together.",
      "Add the chorizo to the mixture",
      "Heat half of vegetable oil in a frying pan",
      "Spoon mixture into hot oil to make 3-4 inch rounds. Fry in batches until golden brown on each side and place on paper to drain excess oil."
      "Serve hot with any sauce you like - personally I'd recommend some good ketchup!"
    ],


    ingredients: [
      "4 large potatoes",
      "1 onion",
      "3 large eggs",
      "100 grams of chorizo"
      "one and a half teaspoons salt",
      "quarter teaspoon pepper",
    ]

    {
      name: "Cabbage, Leek and Carrot Pancake",
      instructions: [
        "Cook the frozen peas in some boiling water for 4 minutes and drain once cooked.",
        "Meanwhile chop the cabbage, carrots and leeks into shreds",
        "In a bowl mix together cabbage, leek, carrot and cooked peas",
        "Add the flour and toss until everything is lightly coated with flour.",
        "In separate bowl beat eggs gently until mixed, then pour the egg mixture over the veg, coating the veg.",
        "Heat a large pan over medium heat and add 1 tablespoon of oil.",
        "In the hot pan place all of the cabbage mixture and use a spatula to flatten it out into a large pancake. Cook it for 4-5 minutes, until the bottom begins to brown. ",
        "Turn the pancake out onto a plate and add some more oil the pan, then cook the other side of the pancake for another 4 minutes.",
        "Once cooked on both sides, rest for 1-2 minutes on the plate as you mix together the soy sauce, rice wine vinegar and ginger in a small bowl.",
        "Cut the pancake into slices and serve with the sauce. A delicious nutricious veg-packed pancake awaits you now - enjoy your meal"
    ],

    ingredients: [
      "600 grams cabbage",
      "1 leek",
      "340 grams carrots",
      "100 grams of frozen peas"
      "one and a half teaspoons salt",
      "160 grams rice flour",
      "3 eggs",
      "2 tablespoons olive oil",
      "2 tablespoons soy sauce",
      "2 tablespoons rice wine vinegar",
      "1 teaspoon ginger paste"


      {
        name: "Spiced Dahl Pancake",
        instructions: [
          "Combine the spices and gentle cook them off in a pan",
          "Meanwhile prepare the pancake mix by mixing together flour, sugar and salt",
          "In another bowl whisk together eggs, milk, and fizzy drink ",
          "Slowly add in the the egg mix into the flour and combine till smooth.",
          "Pour egg mixture into pan with the spices and cook",
          "Now cook the dalh as per packet instructions"
          "Turn the pancake out onto a plate and add the dahl - Enjoy the spicy aromas!"
        ],
        ingredients: [
          "spices you like",
          "1 packet dahl"
          "2 cups plain flour",
          "2 cups milk",
          "1 and a half cups of sparkling water",
          "4 whole eggs"
        ]
      },


  ],
  snack: [
    {
      name: "Spiced Pudla Pancakes",
      instructions: [
        "Boil some water and cook the frozen peas for 4 minutes.",
        "Then blanch them in cold water for 2 minutes and drain.",
        "In a large bowl, whisk together the chickpea flour, bicarbonate of soda, salt, pepper, turmeric, and garam masala. ",
        "Whisk in the water until the batter is smooth.",
        "Stir in the lime juice (the mixture will froth briefly).",
        "Then fold in the tomato, coriander, and peas.",
        "Heat 1 teaspoon of the oil in a pan over medium-low heat",
        "Ladle in one-quarter of the batter and cook for about 3 minutes, until bubbles form on the upper surface and the bottom is starting to brown",
        "Flip the pancake and cook the other side for 2 to 3 minutes. Remove to plate once both sides are cooked.",
        "Repeat three more times with the remaining batter.",
        "Once all the pancakes have been cooked, either eat whole or cut into slices and take in the beautiful aroma - yum!"
      ],
      ingredients: [
        "210 grams froen peas",
        "240 grams chickpea flour",
        "1 teaspoon bicarbonate of soda",
        "half tablespoon of salt",
        "pinch of black pepper",
        "half teaspoon of turmeric",
        "1 teaspoon garam marsala",
        "1 tablespoon lime juice",
        "a diced tomato",
        "30 grams of coriander",
        "4 teaspoons of oil"


      ]
    },

{
    name: "Chocolate Dorayaki",
    instructions: [
      "Whisk the eggs and sugar until light and fluffy.",
      "Mix the baking soda and water in a separate bowl before adding to the egg mixture.",
      "Sift in your flour to the egg mixture.",
      "Then whisk in your vanilla essence.",
      "Heat up a non-stick pan (no oil) and put enough batter to make a small pancake.",
      "When bubbles start appearing, flip your pancake. When the pancake is done, leave to cool and cover with a damp tea towel so they don’t dry out.",
      "Make another pancake and continue till all the mix has been used"
      "With all the pancakes cooked, put in a dollop of nutella in the centre of the pancake and cover with another to make like a sandwich. Repeat this process",
      "When all pancakes are paired up with their chocolate centre, prepare to eat these delicious panckaes!"
    ],

    ingredients: [
      "2 eggs",
      "quarter cup of sugar",
      "half teaspoon bicarbonate of soda",
      "3 tablespoons of water",
      "half a teaspoon of bicarbonate of soda",
      "1 cup of self raising flour",
      "half teaspoon of vanilla essence",
      "as much nutella as you want"
    ],

    name: "Jam Dorayaki",
    instructions: [
      "Whisk the eggs and sugar until light and fluffy.",
      "Mix the baking soda and water in a separate bowl before adding to the egg mixture.",
      "Sift in your flour to the egg mixture.",
      "Then whisk in your vanilla essence.",
      "Heat up a non-stick pan (no oil) and put enough batter to make a small pancake.",
      "When bubbles start appearing, flip your pancake. When the pancake is done, leave to cool and cover with a damp tea towel so they don’t dry out.",
      "Make another pancake and continue till all the mix has been used"
      "With all the pancakes cooked, put in a dollop of nutella in the centre of the pancake and cover with another to make like a sandwich. Repeat this process",
      "When all pancakes are paired up with their chocolate centre, prepare to eat these delicious panckaes!"
    ],

    ingredients: [
      "2 eggs",
      "quarter cup of sugar",
      "half teaspoon bicarbonate of soda",
      "3 tablespoons of water",
      "half a teaspoon of bicarbonate of soda",
      "1 cup of self raising flour",
      "half teaspoon of vanilla essence",
      "as much jam as you want"
    ],

  },

{
  name: "pesto Dorayaki",
  instructions: [
    "Whisk the eggs and sugar until light and fluffy.",
    "Mix the baking soda and water in a separate bowl before adding to the egg mixture.",
    "Sift in your flour to the egg mixture.",
    "Then whisk in your vanilla essence.",
    "Heat up a non-stick pan (no oil) and put enough batter to make a small pancake.",
    "When bubbles start appearing, flip your pancake. When the pancake is done, leave to cool and cover with a damp tea towel so they don’t dry out.",
    "Make another pancake and continue till all the mix has been used"
    "With all the pancakes cooked, put in a dollop of nutella in the centre of the pancake and cover with another to make like a sandwich. Repeat this process",
    "When all pancakes are paired up with their chocolate centre, prepare to eat these delicious panckaes!"
  ],

  ingredients: [
    "2 eggs",
    "quarter cup of sugar",
    "half teaspoon bicarbonate of soda",
    "3 tablespoons of water",
    "half a teaspoon of bicarbonate of soda",
    "1 cup of self raising flour",
    "as much pesto as you want"

    ],
  },

  ],
  dessert: [

  {  name: "Green tea pancake roll",
    instructions: [
      "Peel the sweet potato, then cut into thin slices and steam for 20 mins until the sweet potato is soft.",
      "Once soft, place the cooked potato into a bowl and mash it up, adding in the milk and butter. Combine till smooth.",
      "Now for the pancake mix, sift flour and green tea powder into bowl.",
      "Add in the sugar to the flour mix and combine.",
      "Now slowly add in the egg and milk to the flour mix and combine .",
      "Then add in a tablespoon of the melted butter, mix and leave to rest for 10 mins.",
      "Heat up a pan and add some butter, swirling the pan around to coat it in the butter.",
      "Pour in a ladle of batter and spread evenly, let the pancake stand for about 1 minute.",
      "Once cooked, place the pancake on a board and add a dollop of sweet potato mix to the middle of the pancake.",
      "Gently start to roll the pancake to encase the potato filling and seal the opening with some butter",
      "Return this roll to pan and gently cook it for a few more minutes",
      "Take off the pan, set on a plate and chop into slices - slices as big or as small as you want. Then dust with some more green tea powder and eat with pleasure!"
    ],
    ingredients: [
      "60 grams flour",
      "1 teaspoon of green tea powder",
      "half tablespoon brown sugar",
      "150 mills of milk",
      "1 egg",
      "30 grams melted butter",
      "350 grams of sweet potato",
      "15 mills of milk",
      "6 grams butter"



    {
      name: "Crepe cake",
      instructions: [
        "Prepare the pancake mix by mixing together flour, sugar and salt",
        "In another bowl whisk together eggs, milk, and sparkling water ",
        "Slowly add in the the egg mix into the flour and combine till smooth.",
        "Chill this mixture in the fridge as you warm up the frying pan with some oil.",
        "Pour in the egg mixture to the pan to thinly coat it, cook for 15 to 30 seconds. Repeat this process with each new crepe and use a towel to stack them.",
        "Once all are cooked and cooled. start to build up the cake by layering the nutella on the pancake, then add another pancakw with more nutella on to stack them.",
        "Once you have stacked them all, marvel at your work before devouring them."
      ],
      ingredients: [
        "2 cups flour",
        "sugar",
        "2 cups of milk",
        "1 and a half cups of sparkling water",
        "250 grams of Nutella",
        "4 eggs whole"
      ],
      ingredientSteps: [
        [0,1],
        [5,2,3],
        [],
        [],
        [],
        [4],
        []
      ]
    },

{
    name: "Apam Balik Folded Pancake",
    instructions: [
      "Mix the dry ingredients: so plain flour, rice flour, cornflour. ",
      "Add into this mix the baking powder, the bicarbonate of soda and salt.",
      "Then add in the sugar.",
      "Crack open the 2 eggs into the flour mix and combine.",
      "Add in the water, along with the vanilla essence and combine.",
      "Leave for at least 15 mins in the fridge. You can make this recipe ahead of time, such as few hours or overnight.",
      "Melt butter in pan over medium-low heat.",
      "Pour a small amount into the pan, like a ladleful, and then swirl around the pan.",
      "Cook till the bottom part of the pancake is golden brown.",
      "Still in the pank, sprinkle some more sugar and some chopped nuts over the top of the pancake.",
      "With the filling added, fold the pancake give it a little pat to fold, and then remove to a plate to cool",
      "Once folded, remove from the pan and cool on a plate. The pancake when it cools will crispen up.",
      "Meanwhile, repeat the process of making the next pancakes."
    ],

    ingredients: [
      "170 grams flour",
      "100 grams rice flour",
      "30 grams cornflour",
      "2 teaspoons of baking powder",
      "half a teaspoon of bicarbonate of soda",
      "half a tablespoon of salt",
      "1 teaspoon of vanilla essence",
      "150 grams of sugar",
      "170 mills of water",
      "150 grams of brown sugar",
      "2 large eggs",
      "150 grams of roasted peanuts"
    ],

    {
       name: "Almond Butter pancake roll",
      instructions:
        "For the pancake mix, sift flour and green tea powder into bowl.",
        "Add in the sugar to the flour mix and combine.",
        "Now slowly add in the egg and milk to the flour mix and combine .",
        "Then add in a tablespoon of the melted butter, mix and leave to rest for 10 mins.",
        "Heat up a pan and add some butter, swirling the pan around to coat it in the butter.",
        "Pour in a ladle of batter and spread evenly, let the pancake stand for about 1 minute.",
        "Once cooked, place the pancake on a board and add a dollop of almond butter to the middle of the pancake.",
        "Gently start to roll the pancake to encase the almond butter filling and seal the opening with some butter",
        "Return this roll to pan and gently cook it for a few more minutes",
        "Take off the pan, set on a plate and chop into slices - slices as big or as small as you want. Then dust with some more green tea powder and eat with pleasure!"
      ],
    {
      ingredients: [
        "60 grams flour",
        "1 teaspoon of green tea powder",
        "half tablespoon brown sugar",
        "150 mills of milk",
        "1 egg",
        "30 grams melted butter",
        "350 grams of Almond butter",
        "15 mills of milk",
        "6 grams butter"


    }
  ]
};

/***********
Execution Code: Avoid editing the code below if you don't know JavaScript.
***********/

// Private methods (this is the actual code logic behind the app)

const _getCurrentStep = handler => handler.attributes['instructions'][handler.attributes['current_step']];

const _intentAndSlotPresent = handler => {
  try {
    return handler.event.request.intent.slots.mealType;
  }
  catch (e){
    return false;
  }
};
const _selectedMealType = handler => {
  return _intentAndSlotPresent(handler) && handler.event.request.intent.slots.mealType.value;
};
const _checkMealTypePresence = handler => {
  return Object.keys(recipes).includes(_selectedMealType(handler));
};
const _setMealType = handler => {
  // Reset remaining recipes in case the user went back from before
  handler.attributes['mealType'] = _selectedMealType(handler);
  _resetRemainingRecipes(handler)
  handler.handler.state = states.RECIPEMODE;
  handler.emitWithState("Recipe");
  return true;
};
const _resetRemainingRecipes = handler => {
  if (handler.attributes['mealType']) {
    // Recipes by meal type
    handler.attributes['remainingRecipes'] = recipes[handler.attributes['mealType']].slice();
  } else {
    // All recipes to select at random
    let remainingRecipes = [];
    Object.values(recipes).forEach(mealTypeRecipes => {
      remainingRecipes = remainingRecipes.concat(mealTypeRecipes);
    });
    handler.attributes['remainingRecipes'] = remainingRecipes;
  }
  handler.attributes['recipesWerePresented'] = false;
}
const _popRemainingRecipe = handler => {
  const remaining = handler.attributes['remainingRecipes'];
   // Select a random recipe
  return remaining.splice(_randomIndexOfArray(remaining), 1)[0];
}

const _randomIndexOfArray = (array) => Math.floor(Math.random() * array.length);
const _pickRandom = (array) => array[_randomIndexOfArray(array)];

const _getIngredientsForStep = (recipe, stepIndex) => {
  if (!recipe.ingredientSteps) {
    return [];
  }
  return recipe.ingredientSteps[stepIndex].map(ingredientIndex => recipe.ingredients[ingredientIndex]);
}

// Handle user input and intents:

const states = {
  STARTMODE: "_STARTMODE",
  RECIPEMODE: "_RECIPEMODE",
  NOMORERECIPESMODE: "_NOMORERECIPESMODE",
  SELECTEDRECIPEMODE: "_SELECTEDRECIPEMODE",
  INSTRUCTIONSMODE: "_INSTRUCTIONSMODE"
};


const newSessionhandlers = {
  'NewSession': function(){
    this.handler.state = states.STARTMODE;
    this.emitWithState('NewSession');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_START, HELP_START_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell', CANCEL_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', REPROMPT_TYPE, REPROMPT_TYPE);
  }
};

const startModeHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
  'NewSession': function(startMessage = CHOOSE_TYPE_MESSAGE){
    if(_checkMealTypePresence(this)){
      // Go directly to selecting a meal if mealtype was already present in the slots
      _setMealType(this);
    }else{
      this.emit(':ask', startMessage, REPROMPT_TYPE);
    }
  },
  'ChooseTypeIntent': function(){
    if(_checkMealTypePresence(this)){
      _setMealType(this);
    }else{
      this.emit(':ask', MEALTYPE_NOT_IN_LIST(_selectedMealType(this)), MEALTYPE_NOT_IN_LIST(_selectedMealType(this)));
    }
  },
  'RandomRecipeIntent': function() {
    this.attributes['mealType'] = null;
    _resetRemainingRecipes(this);
    this.handler.state = states.RECIPEMODE;
    this.emitWithState('Recipe');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_START, HELP_START_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell', CANCEL_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', REPROMPT_TYPE, REPROMPT_TYPE);
  }
});

const recipeModeHandlers = Alexa.CreateStateHandler(states.RECIPEMODE, {
  'Recipe': function(){
    if(this.new){
      _resetRemainingRecipes(this);
    }

    if(this.attributes['remainingRecipes'].length >= 2){
      // Do we have a meal type or are we getting random recipes?
      const hasMealType = !!this.attributes['mealType'];
      // Check if we've already presented some recipes
      const firstRecipes = !this.attributes['recipesWerePresented'];
      this.attributes['recipesWerePresented'] = true
      // Select 2 random recipes and remove them form remainingRecipes
      console.log('Selecting recipes', {
        hasMealType,
        firstRecipes
      });
      this.attributes['recipe1'] = _popRemainingRecipe(this);
      this.attributes['recipe2'] = _popRemainingRecipe(this);
      // Ask user to confirm selection
      if (firstRecipes) {
        if (hasMealType) {
          this.emit(
            ':ask',
            SUGGEST_TWO_RECIPES(this.attributes['mealType'], this.attributes['recipe1'].name, this.attributes['recipe2'].name),
            SUGGEST_TWO_RECIPES(this.attributes['mealType'], this.attributes['recipe1'].name, this.attributes['recipe2'].name)
          );
        } else {
          const format = () => _pickRandom(RANDOM_RECIPE_SUGGESTERS)(this.attributes['recipe1'].name, this.attributes['recipe2'].name);
          this.emit(
            ':ask',
            format(),
            format()
          );
        }
      } else {
        this.emit(
          ':ask',
          MORE_RECIPES(this.attributes['recipe1'].name, this.attributes['recipe2'].name),
          MORE_RECIPES(this.attributes['recipe1'].name, this.attributes['recipe2'].name)
        );
      }
    }else{
      this.handler.state = states.NOMORERECIPESMODE;
      this.emitWithState('Prompt');
    }
  },
  'ChooseFirstRecipeIntent': function() {
    this.attributes['recipe'] = this.attributes['recipe1']
    this.handler.state = states.SELECTEDRECIPEMODE;
    this.emitWithState('Prompt');
  },
  'ChooseSecondRecipeIntent': function() {
    this.attributes['recipe'] = this.attributes['recipe2']
    this.handler.state = states.SELECTEDRECIPEMODE;
    this.emitWithState('Prompt');
  },
  'MoreRecipesIntent': function() {
    this.emitWithState('Recipe');
  },
  'IngredientsIntent': function(){
    var ingredients = this.attributes['recipe'].ingredients.join(', ').replace(/,(?!.*,)/gmi, ' and'); // Add 'and' before last ingredient

    this.emit(':ask', `${INGREDIENTS_INTRO} ${ingredients}. ${INGREDIENTS_ENDING}`, `${INGREDIENTS_INTRO} ${ingredients}. ${INGREDIENTS_ENDING}`)
  },
  'AMAZON.YesIntent': function(){
    this.attributes['instructions'] = this.attributes['recipe'].instructions;
    this.attributes['current_step'] = 0;
    this.handler.state = states.INSTRUCTIONSMODE;
    this.emitWithState('InstructionsIntent');
  },
  'AMAZON.NoIntent': function(){
    this.emitWithState('Recipe');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_RECIPE, HELP_RECIPE_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell', CANCEL_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function() {
    const text = MISUNDERSTOOD_RECIPE_ANSWER(this.attributes['recipe1'].name, this.attributes['recipe2'].name);
    this.emit(':ask', text, text);
  }
});

const noMoreRecipesModeHandlers = Alexa.CreateStateHandler(states.NOMORERECIPESMODE, {
  'Prompt': function(){
    const response = () => _pickRandom(NO_REMAINING_RECIPE);
    this.emit(':ask', response(), response());
  },
  'AMAZON.YesIntent': function(){
    this.attributes['mealType'] = null;
    this.handler.state = states.STARTMODE;
    this.emitWithState('NewSession');
  },
  'AMAZON.NoIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_RECIPE, HELP_RECIPE_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell', CANCEL_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', MISUNDERSTOOD_NO_REMAINING_RECIPE_ANSWER, MISUNDERSTOOD_NO_REMAINING_RECIPE_ANSWER);
  }
});

const selectedRecipeModeHandlers = Alexa.CreateStateHandler(states.SELECTEDRECIPEMODE, {
  'Prompt': function(){
    const text = WHAT_NEXT(this.attributes['recipe'].name)
    this.emit(':ask', text, text);
  },
  'StartRecipeIntent': function() {
    this.attributes['instructions'] = this.attributes['recipe'].instructions;
    this.attributes['current_step'] = 0;
    this.handler.state = states.INSTRUCTIONSMODE;
    this.emitWithState('InstructionsIntent');
  },
  'SaveRecipeIntent': function() {
    this.emit(':tell', RECIPE_SAVED)
  },
  'SendRecipeIntent': function() {
    this.emit(':tell', SENT_TO_PHONE)
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_RECIPE, HELP_RECIPE_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell', CANCEL_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', MISUNDERSTOOD_RECIPE_ANSWER, MISUNDERSTOOD_RECIPE_ANSWER);
  }
});

const instructionsModeHandlers = Alexa.CreateStateHandler(states.INSTRUCTIONSMODE, {
  'InstructionsIntent': function(){
    const firstTimeInstructions = (this.attributes['current_step'] === 0) ? FIRST_TIME_INSTRUCTIONS : '';
    this.emit(':ask', `${_getCurrentStep(this)} ${firstTimeInstructions}`, REPROMPT_INSTRUCTIONS);
  },
  'IngredientsReminderIntent': function(){
    const ingredients = _getIngredientsForStep(this.attributes['recipe'], this.attributes['current_step']);
    if (ingredients.length > 0) {
      const ingredientsText = ingredients.join(', ').replace(/,(?!.*,)/gmi, ' and'); // Add 'and' before last ingredient
      this.emit(':ask', `${INGREDIENTS_REMINDER_INTRO} ${ingredientsText}`, "Do you want to hear the next step?");
    } else {
      this.emit(":ask", INGREDIENTS_REMINDER_NONE, "Do you want to hear the next step?");
    }
  },
  'NextStepIntent': function(){
    this.attributes['current_step']++;

    if(this.attributes['current_step'] < this.attributes['instructions'].length - 1){
      this.emitWithState('InstructionsIntent');
    }else{
      this.emitWithState('InstructionsEnded');
    }
  },
  'InstructionsEnded': function(){
    this.emit(':tell', `${_getCurrentStep(this)} ${CLOSING_MESSAGE}`);
  },
  'DifferentRecipeIntent': function(){
    this.handler.state = states.RECIPEMODE;
    this.emitWithState('Recipe');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_INSTRUCTIONS, HELP_INSTRUCTIONS_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
      this.emit(':tell', CANCEL_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', MISUNDERSTOOD_INSTRUCTIONS_ANSWER, MISUNDERSTOOD_INSTRUCTIONS_ANSWER);
  }
});



exports.handler = (event, context, callback) => {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(
    newSessionhandlers,
    startModeHandlers,
    recipeModeHandlers,
    noMoreRecipesModeHandlers,
    selectedRecipeModeHandlers,
    instructionsModeHandlers
  );
  alexa.execute();
};
