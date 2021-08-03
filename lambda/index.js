'use strict';
const Alexa = require('ask-sdk-v1adapter');
const APP_ID = undefined;
const recipes = require('./recipes');

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
const INGREDIENTS_INTRO = "{Discourse Marker}, for this recipe you'll need {ingredient list}"; // Here follows a list of ingredients
const INGREDIENTS_ENDING = "what would you like to do now?"; // Will be said after the list of ingredients

const INGREDIENTS_REMINDER_INTRO = "The ingredients for this step are"; //the ingredients will follows
const INGREDIENTS_REMINDER_NONE = "You've already got the ingredients measured out"; //for if there are no measurements for ingredients

const FIRST_TIME_INSTRUCTIONS = "Super, let me know if you need a step repeated or if you're ready for the next step. Let's start cooking. ";
const REPROMPT_INSTRUCTIONS = "Say 'next' to go to the next line of instructions. Say 'repeat' if you didn't understand me or want to hear the last line of instructions again.";
const MISUNDERSTOOD_INSTRUCTIONS_ANSWER = "Sorry, I didn't understand you there.";
const CLOSING_MESSAGE = "";

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
