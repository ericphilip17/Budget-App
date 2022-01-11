/********************************************************************************************
Lecture 77: Module Pattern and Data encapsulation


Module Pattern :: Helps us organize/break down code in separate sections to ease reviewing...
::Uses IIFEs and Closure concepts
::IIFEs create a new scope that is not available at the global scope.
%%%Module pattern secret: It returns an object of all the functions that we want to be public.
Data encapsulation :: The process of hiding private data(code) from the public and exposing public data
for use at every scope.
::Separation of concerns::: Means each module is tasked to do a particular thing independent of the others:: A stand alone.
********************************************************************************************/

// var budgetController = (function(){
//
//   var x = 23;
//   var add = function(a){
//     return x + a;
//   }
//   return{                      //This is an OBJECT.. Modules returns Objects that are accessible on global scope.
//     publicTest: function(b){  //Closure that can access a & add(). Returns and is assigned to var budgetController.
//       return add(b);    //We can use x and add() but we cant access them from outside.
//     }
//   }
// })();
//
//
// var uIController = (function(){
//
//
// })();
//
//
// var controller = (function(budgetCtrl, uICtrl){
//   var z = budgetCtrl.publicTest(5);
//   return {
//     anotherPublic: function(){
//       console.log(z);
//     }
//   }
// })(budgetController, uIController);

/***********************************************************************************************************************
Lecture 78:: Event listners for keypress events
                   Using Events as Objects.

::How to organize code to avoid redudancy;
::How to correctly choose your data structures for various instances;
::Using Objects to store HTML parameters for ease of correction incase changes are made on the HTML file.

L 77
:: How to use the mopdule Pattern || Private and Public data Encapsulation
L 78
:: Setting up event listeners to handle KEYPRESS EVENTS || Using an event OBJECT
L 79
:: How to read data from different HTML input types
L 80
:: How and why to creat an init function -- To organize the code well. You have to return it in the UI to expose it to the global scope, then call it from outside to start the program.
L 81
:: How to choose function constructors that meet our appllication's needs || How to set up a proper data structure for our budget Controller
L 82
:: How and why to pass datat from one module to another-- Using return objects to allow modules to communicate. ||  How to avoid conflicts in our data structures
L 83
:: Adding big chunks of HTML into the DOM ---Wraopping an HTML string, replace method, replacing items in the strings
::How to REPLACE parts of the srings
:: How to do DOM Manipulation using insertAdjacentHTML method
l 84
:: Clearing input fields after entering an input -- querySelectorAll METHOD
:: How to clear HTML fields --
:: Using querySelectorAll -- Selects all input fields in the entire web page. It returns a LIST instead of an Array.
::Slice Method -- Returns a copy of the array that is called on. slice.fields() wont work cos its not an array. We have to convert it as below...
::Converting a lsit into an array --- Array.prototype.slice.call() ||Array-- the function constructor for all arrays in the program. All methods inherited are in the Array prototype property, same to slice method. Then we call it using the Call() method.
:: forEach() method --- Loops though an array. Uses an anonymous function, with 3 arguments. Current elemeent of the array, index of every element, the entire array.
::                  --- current.value = ""; loops though all selected elements of the array and sets them back no empty, hence clearing the fields.
L 85
:: Using parseFloat method to convert a string number into a NUMBER, from html input values
:: Using if statement to ensure only valid inputs from the input fields are processed  Using !isNaN() METHOD to verify empty numbers
:: creating a separate function to calculate and update budget ion the UI.
L 86
::
L 90
::Using Event Delegation--- Helps to select many HTML elements at once, eg, when there is a click. uSES NORMAL addEventListener.
::Using IDs in HTML to connect the UI with the data model---
:: How traversing works. When deleting an Item, we click on a delete button but we want the effect to be felt by the entire Item. So we have to traverse upwards using parentNode property, The number of traverses depends on the position the the target class.
::Using the SPLIT method to split a string and form an array, so as to separate the type of item from its ID;

L 91
::Deleting an Item from the UI.
:: We can only delete a child in JS, not the entire parent. So we traverse again to the parent ID. Then we can select the child, then remove it using removeChild() METHOD.
:: He has a site with more DOM Manipulation features.
::Once the functionis created on the UIcontroller, we call it on the AppController and pass the Item we want to delete, which is then received as the selectorID argument of the delete function on the UI.
::In the AppController we call the updateBudget function again to update the budget after deleting an Item.
:: This allows the budget to be updated on the UI once we click the delete button. The Item clicked also gets removed.

L 94
:: Updating income percentages once we add or remove an Item.
:: We create a updateBudget function and task it with this operation on the AppController.
:: We can then call the function on the ctrlDeleteItem and CtrlAdditem functions on the App controller.

L 95
::


***********************************************************************************************************************/

/*888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888*/
//Budget controller

var budgetController = (function(){

  var Expenses = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expenses.prototype.calcPercentage = function(totalIncome){
    if(totalIncome > 0){
      this.percentage = Math.round((this.value / totalIncome) * 100);
    }else{
      this.percentage = -1;
    }
  };

  Expenses.prototype.getPercentage = function(){
    return this.percentage;
  }

  var Incomes = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type){
    var sum = 0;
    data.allItems[type].foreach(function(current){
      sum += current.value;
    });
    data.totals[type] = sum;
  };

  var calculateTotal = function(type){
    var sum = 0;
    data.allItems[type].forEach(function(cur){
      sum += cur.value;

    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: [],
      inc: []
    },
    budget: 0,
    percentage: -1,

  };

  return {
    addItem: function(type, des, val){
      var newItem, ID;

      //[1, 2, 3, 4, 5], next ID = 6;
      //[1, 2, 4, 6, 8], next ID = 9;
      //wE WANT; ID = last ID + 1;

      //Create new ID
      if(data.allItems[type].length > 0){
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      }else if(data.allItems[type].length === 0){
        ID = 0;
      };

      // create new Item based on INC OR EXP types
      if(type === 'exp'){
        newItem = new Expenses(ID, des, val);
      }else if (type === 'inc'){
        newItem = new Incomes(ID, des, val)
      };

      //Push it into the new Expense or income object :: data structure
      data.allItems[type].push(newItem);

      //Return the new Object
      return newItem; //So that other modules can have a direct access to the newItem that we just created.
    },

    deleteItem: function(type, id){
      var ids, index;

      //id = 6
      //data.allItems[type][id];
      //ids = [1, 2, 4, 6, 8],
      //index = 3

      ids = data.allItems[type].map(function(current){       //Accepts same args like forEach.
        return current.id;                                   //returns the current id value.
      });
      index = ids.indexOf(id);                //Gets the index of the element specified in the brackets.

      if(index !== -1){
        data.allItems[type].splice(index, 1);  //1st arg:: index where we'll start deleting, 2nd arg:: No of items to delete.
      }
    },

    calculateBudget: function(){

      //Calculate Total income and expenses_list
      calculateTotal('exp');
      calculateTotal('inc');
      //Calculate the budget:: Income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      //Calculate the percentage of the income that we spend.

      if(data.totals.inc > 0){
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      }else{
        data.percentage = -1;
      };

    },

    calculatePercentages: function(){

      /* Expenses
      a=20,
      b=10
      c=40
      Tincome: 100;
      a: 20/100 *100 = 20%
      b: 10%;
      c:40%
      */
      data.allItems.exp.forEach(function(cur){
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function(){
      var allPerc = data.allItems.exp.map(function(cur){       //Map loops over an array and creates an new Array, but ForEach does not. We now store it on the variable.
        return cur.getPercentage();    //The exp array gets called a number of times equal to the number of elements it contains
      });
      return allPerc;  //An array with all the percentages.
    },


    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    testing: function() {
        console.log(data);
    }
  };
})();

/*888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888*/
// The App UI Controller

var uIController = (function(){

  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses_list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercentageLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  }

    var formatNumber = (function(num, type){
    var numSplit, int, dec, type;

    /*Rules
    +/- before a numbers
    Exactly 2 deccimal points for each numbers
    Comma separating thousands
    */
    num = Math.abs(num);
    num = num.toFixed(2);    //A string with 2 dp
    numSplit = num.split('.') //Splits the charactersitc from mantissa

    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }

    dec = numSplit[1]
    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    // type === 'inc' ? int = '+ ' + int : int = '- ' + int;

    // type === 'exp' ? '-' : '+';
    // return type + ' ' + int + '.' + dec;
    // return type + '.' + dec;
  })

  var nodeListForEach = function(list, callback) {
    for (var i = 0; i < list.length; i++){
       callback(list[i], i);
    }
  };

  return {
    getInputs: function(){
      return{
        type: document.querySelector(DOMStrings.inputType).value,   //The input may be an income(+) or Expense(-)
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };
    },


    addListItem: function(obj, type){
      var html, newHtml, element;
      //Create a HTNML string with a PLaceholder text
      if(type === 'inc'){
        element = DOMStrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }else if(type === 'exp'){
        element = DOMStrings.expensesContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }
      //Replace the placeholder tect with actual Data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
      //Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },


    deleteListItems: function(selectorID){

      var el;
      el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);

    },


    clearFields: function(){
      var fields, fieldsArr;

      fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

      fieldsArr = Array.prototype.slice.call(fields)

      fieldsArr.forEach(function(current, index, array){
        current.value = "";
      });
      fieldsArr[0].focus();
    },


    displayBudget: function(obj){
      var type;

      obj.budget > 0 ? type = 'inc' : type = 'exp';

      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

      if(obj.percentage > 0){
        document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
      }else{
        document.querySelector(DOMStrings.percentageLabel).textContent = '--'
      }
    },

    displayPercentages: function(percentages){  //Select all Items with item__percentage class on the HTML.
      var fields;
      fields = document.querySelectorAll(DOMStrings.expensesPercentageLabel); //returns A NODElIST. Because in the DOM tree(Where all our HTML elements are stored), each element is called a node. THats why the element we used to traverse up in the DOM is called a parentNode.

      nodeListForEach(fields, function(current, index) {

        if(percentages[index] > 0){
          current.textContent = percentages[index] + '%';
        }else {
          current.textContent = '--';
        }
      });

    },

    displayMonth: function(){
      var now, month, months, year;

      now = new Date();
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Setemebr', 'October', 'November', 'December'];
      month = now.getMonth();
      month = months[month];
      //newYear = new Date(2020, 0, 1)  //YYYY, MM-1, DD
      year = now.getFullYear();
      console.log(month + ' ' + year);
      document.querySelector(DOMStrings.dateLabel).textContent = month + ' ' + year;
    },

    displayDate: function(){
      let curYear, today, month, dayDate;

      today = new Date();
      month = today.getMonth();
      dayDate = today.getDate();
      curYear = today.getFullYear();
      // console.log(`Today ${dayDate}/${month}/${curYear}`);
      document.querySelector(DOMStrings.dateLabel).textContent = `Available Cash Today ${dayDate}/${month + 1}/${curYear}`;
    },

    changedType: function(){

      var fields = document.querySelectorAll(
        DOMStrings.inputType + ',' +
        DOMStrings.inputDescription + ',' +
        DOMStrings.inputValue
      );
      nodeListForEach(fields, function(cur){
        cur.classList.toggle('red-focus');
      });
      document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
    },

    getDOMStrings: function(){
      return DOMStrings;
    },
  }

})();

/*888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888*/
// Global app Controller
var controller = (function(budgetCtrl, uICtrl){

  var setEventListeners = function(){
      var DOM = uICtrl.getDOMStrings();

      document.querySelector(DOM.inputBtn).addEventListener('click', crtlAddItem);  //For the save button
      document.addEventListener('keypress', function(event){                        ////For the  Enter key
        // console.log(event);
        if(event.keyCode === 13 || event.while === 13){
          crtlAddItem();
        };
      });

      document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
      document.querySelector(DOM.inputType).addEventListener('change', uICtrl.changedType);
  };

  var updateBudget = function(){
        //5. Calculate the budget
        budgetCtrl.calculateBudget();
        //Return the budget
        var budget = budgetCtrl.getBudget();
        //6. Display the budget to the UI
        uICtrl.displayBudget(budget);

  };

  var updatePercentages = function(){

    //1. Calculate the update Percentages
    budgetCtrl.calculatePercentages();

    //2. Read percentages from the budget control.
    var percentages = budgetCtrl.getPercentages();

    //3. Update the new percentages on the UI.
    uICtrl.displayPercentages(percentages);
  }

  var crtlAddItem = function(){
    var newItem, input;
    //1. Get the field input Data
    input = uIController.getInputs();
    //2. Add the item to the budget Controller

    if(input.description !== "" && !isNaN(input.value) && input.value > 0){
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      //3. Add the item to the UI
      uICtrl.addListItem(newItem, input.type);
      //4 Clear the fields
      uICtrl.clearFields();
      //5. Calculate and update the budget
      updateBudget();
      //6. Calculate and Update the percentages on the UI.
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function(event){
    var itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;                        //DOM Traversing.

    if(itemID){
      //Format is:: inc-1 , inc-2 || exp-1 , exp-2 ...
      splitID = itemID.split('-');    //sPLIT METHOD splits a string into an array at the specified element in the brackets. In this case the '-' element. To separate the type and ID.
      type = splitID[0];
      ID = parseInt(splitID[1]);

      //1. Delete the item from the data structure.
      budgetCtrl.deleteItem(type, ID);
      //2. Delete the item from the UI
      uICtrl.deleteListItems(itemID);
      //3 Update and show the new budget.
      updateBudget();
      //4. Update the percentages on the UI.
      updatePercentages();

    }
  }

  return {
    init: function(){
      console.log("The Application has started!");
      uICtrl.displayDate();
      uICtrl.displayBudget({
          budget: 0,
          totalInc: 0,
          totalExp: 0,
          percentage: -1
        });
      setEventListeners();
    }
  }

})(budgetController, uIController);


controller.init();


//
// var P1, P2, V, R1, R2, I;
//
// //From P = (V**2)/R
// V = 200;
// P1 = 60;
// P2 = 100;
//
// R1 = (V**2)/P1;
// R2 = (V**2)/P2
// I = V/(R1+R2);
//
// P1new = I**2 * R1;
// P2new = I**2 * R2;
//
// console.log("R1: " + Math.round(R1) + " R2: " + R2);
// console.log("Current: " + I + "\nPower Dissipated by 60W Bulb: " +  Math.round(P1new) + "\nPower Dissipated by 100W Bulb: " + Math.round(P2new));


































console.log("...end...");
