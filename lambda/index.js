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
const HELP_INSTRUCTIONS = "You can ask me to repeat the instructions or say 'next' to hear the next line of instructions.";
const HELP_INSTRUCTIONS_REPROMPT = "You can ask me to repeat the instructions or say 'next' to hear the next line of instructions.";

const CHOOSE_TYPE_MESSAGE = `Hey, welcome to ${SKILL_NAME}! I'm here to help you cook delicious, nutricious and indulgent pancake meals! To start simply ask for a meal like {breakfast}, give me an ingredient like {cheese} or ask for a surprise recipe`;
const REPROMPT_TYPE = "I can help you make tastey pancake meals by meal type, ingredient or ask for a surprise. What would you like?";
const MEALTYPE_NOT_IN_LIST = chosenType => `Oh no, it doesn't look like we have any recipes for that, would you like a breakfast, lunch, dinner, dessert or snack recipe?`;

const RECIPE_ADJECTIVES = [
  "lovely",
  "super simple",
  "fun",
  "tasty"
  "easy"
];
const SUGGEST_RECIPE = recipeName => `So I've found 2 recipes for {meal type}: a {curried sweet potato pancake with raisins} or a {kimchi pancake with mayo sauce}, you can say 1 or 2 or next for another recipe`;
const MISUNDERSTOOD_RECIPE_ANSWER = "Sorry, I didn't catch that, you can choose between {recipe name} or a {recipe name} otherwise ask for another suggestion";
const NO_REMAINING_RECIPE = "This was it. I don't know any more recipes. Do you want to select a different meal type?";
const next_recipe = "Sure let's take a look for a new recipe, how about: {recipe name} or {recipe name}?";
const no_more recipes ="";
const what_next = "{recipe name} sounds good. You can start the recipe, save the recipe or send the recipe details to your phone"''
const affirm_what_next = "Sure, I've sent the recipe details to your phone";
const INGREDIENTS_INTRO = "You will need"; // Here follows a list of ingredients
const INGREDIENTS_ENDING = ""; // Will be said after the list of ingredients
const INGREDIENTS_REMINDER_INTRO = "The ingredients for this step are"; //the ingredients will follows
const INGREDIENTS_REMINDER_NONE = "You've already got the ingredients measured out"; //for if there are no measurements for ingredients

const FIRST_TIME_INSTRUCTIONS = "Say 'next' to go to the next line of instructions. Say 'repeat' if you didn't understand me or want to hear the last line of instructions again.";
const REPROMPT_INSTRUCTIONS = "Say 'next' to go to the next line of instructions. Say 'repeat' if you didn't understand me or want to hear the last line of instructions again.";
const MISUNDERSTOOD_INSTRUCTIONS_ANSWER = "Sorry, I didn't understand you there.";
const CLOSING_MESSAGE = "Wonderful. Hope you have a great meal, or as the Germans say, Guten Appetit!";

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

  ],
  dessert: [
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
  handler.attributes['remainingRecipes'] = recipes[handler.attributes['mealType']];
  handler.handler.state = states.RECIPEMODE;
  handler.emitWithState("Recipe");
  return true;
};

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
      this.attributes['remainingRecipes'] = recipes[this.handler.attributes['mealType']];
    }

    if(this.attributes['remainingRecipes'].length > 0){
      // Select random recipe and remove it form remainingRecipes
      this.attributes['recipe'] = this.attributes['remainingRecipes'].splice(_randomIndexOfArray(this.attributes['remainingRecipes']), 1)[0]; // Select a random recipe
      // Ask user to confirm selection
      this.emit(':ask', SUGGEST_RECIPE(this.attributes['recipe'].name), SUGGEST_RECIPE(this.attributes['recipe'].name));
    }else{
      this.attributes['remainingRecipes'] = recipes[this.attributes['mealType']];
      this.handler.state = states.CANCELMODE;
      this.emitWithState('NoRecipeLeftHandler');
    }
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
  alexa.registerHandlers(newSessionhandlers, startModeHandlers, recipeModeHandlers, instructionsModeHandlers);
  alexa.execute();
};
