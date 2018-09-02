// Storage controller

// Item controller
const ItemCtrl = (function(){
  // Item constructor
  const Item = function(id,name,calories){
      this.id = id;
      this.name = name;
      this.calories = calories;
  }

  // Data structure
  const data = {
      items : [
        //   {id : 0,name : "Steak Meal", calories : 1200},
        //   {id : 1,name : "Cookies", calories : 800},
        //   {id : 2,name : "Eggs", calories : 300}
      ],
      currentItem : null,
      totalCalories : 0
  }

  // Public method
  return {
    getItems : function(){
        return data.items;
    },
    addItem : function(name,calories){
        // Create ID
        let ID;

        if(data.items.length > 0){
            ID = data.items[data.items.length -1].id + 1;
        }else{
            ID = 0;
        }
        // parse calories into integer
        calories = parseInt(calories);
       
        //Create new item
        newItem = new Item(ID,name,calories);
        data.items.push(newItem);
       
        return newItem;
    },
    getTotalCalories : function(){
       let total = 0;
       data.items.forEach(function(item){
           total += item.calories;
       });
       // update total calories
       data.totalCalories = total;

       return data.totalCalories;
    },
    getItemById : function(id){
       let found = null;
       data.items.forEach(function(item){
        if(item.id === id){
            found = data.items[id]
        }
    });

    return found;
    },
    updateItem : function(name,calories){
         // Calories to number
         calories = parseInt(calories);
        let found = null;
        data.items.forEach(function(item){
         if(item.id === data.currentItem.id){
             item.name = name;
             item.calories = calories;
             found = item;
         }
     });
 
     return found;
     },
     deleteItem : function(id){
         // get id's
         const ids = data.items.map(function(item){
             return item.id;
         });
         // get index
         const index = ids.indexOf(id);
         // remove item
         data.items.splice(index,1);
     },
     clearAllItems : function(){
         data.items = [];
     },
    setCurrentItem : function(item){
        data.currentItem = item;
    },
    getCurrentItem : function(){
        return data.currentItem;
    },
    logData : function(){
      return data;
  }}

})();
// UI controller
const UICtrl = (function(){
  
    UISelectors = {
        itemList : "#item-list",
        listItems : "#item-list li",
        addItemBtn : ".add-btn",
        updateItemBtn : ".update-btn",
        deleteItemBtn : ".delete-btn",
        backItemBtn : ".back-btn",
        itemNameInput : "#item-name",
        itemCaloriesInput : "#item-calories",
        totalCalories : ".total-calories",
        clearBtn : ".clear-btn"
    }
    //Public methods
    return {
        populateItemList : function(items){
            var html = "";
            items.forEach(item => {
                
                html += `<li class="collection-item" id="item-${item.id}"><strong>${item.name} : <em>${item.calories} calories</em></strong>
                <a href="#" class="secondary-content"> <i class="fas fa-pen "></i></a>
             </li>`;
                
            });
            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getSelectors : function(){
            return UISelectors;
        },
        getItemInput : function(){
            return {
                name : document.querySelector(UISelectors.itemNameInput).value,
                calories : document.querySelector(UISelectors.itemCaloriesInput).value,
            }
        },
        addListItem : function(item){
            // create li element
            const li = document.createElement('li');
            // add class
            li.className = "collection-item";
            // add id
            li.id = `item-${item.id}`;
            // add html
            li.innerHTML = `<strong>${item.name} : <em>${item.calories} calories</em></strong>
            <a href="#" class="secondary-content"> <i class="fas fa-pen">`;
            // insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
            // show li item 
            document.querySelector(UISelectors.itemList).style.display = "block";
        },
        updatedListItem : function(item){
            // get all list items
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // turn node list into array
            listItems = Array.from(listItems);
            
            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');
                console.log("list itemID "+itemID);
                console.log("item id "+item.id);
                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name} : <em>${item.calories} calories</em></strong>
                    <a href="#" class="secondary-content"> <i class="fas fa-pen">`;
                }
            })
        },
        deleteListItem : function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        removeItems : function(){
            // get all list items
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // turn node list into array
            listItems = Array.from(listItems);
            // remove items
            listItems.forEach(function(item){
                item.remove();
            })
        },
        showTotalCalories : function(total){
              document.querySelector(UISelectors.totalCalories).textContent = total;
        },
        clearFields : function(){
            document.querySelector(UISelectors.itemNameInput).value = "";
            document.querySelector(UISelectors.itemCaloriesInput).value = "";
        },
        addItemToForm : function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        hideList : function(){
            document.querySelector(UISelectors.itemList).style.display = "none";
        },
        clearEditState : function(){
            UICtrl.clearFields();
            document.querySelector(UISelectors.updateItemBtn).style.display = "none";
            document.querySelector(UISelectors.deleteItemBtn).style.display = "none";
            document.querySelector(UISelectors.backItemBtn).style.display = "none";
            document.querySelector(UISelectors.addItemBtn).style.display = "inline";
        },
        showEditState : function(){
            
            document.querySelector(UISelectors.updateItemBtn).style.display = "inline";
            document.querySelector(UISelectors.deleteItemBtn).style.display = "inline";
            document.querySelector(UISelectors.backItemBtn).style.display = "inline";
            document.querySelector(UISelectors.addItemBtn).style.display = "none";
        }
    }
})();
// App controller
const App = (function(ItemCtrl,UICtrl){
  
      // Load event listeners
      const loadEventListeners = function(){
      // get UISelectors
      const UISelectors = UICtrl.getSelectors();
      // disable enter 
      document.addEventListener('keypress',function(e){
          if(e.keyCode === 13 || e.which === 13){
              e.preventDefault();
              return false;
          }
      });
      // Add item event
      document.querySelector(UISelectors.addItemBtn).addEventListener('click',addItem);
      // Edit icon click event
      document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);
      // Update submit
      document.querySelector(UISelectors.updateItemBtn).addEventListener('click',itemUpdateSubmit);
      // Back button
      document.querySelector(UISelectors.backItemBtn).addEventListener('click',UICtrl.clearEditState);
      // Delete item event
      document.querySelector(UISelectors.deleteItemBtn).addEventListener('click',itemDeleteSubmit);
      // Clear all event
      document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItemsClick);
   }

   //Add item function
   function addItem(e){
        e.preventDefault();
       
        // get Selector input
      const input = UICtrl.getItemInput();
      // check for name and calories 
      if(input.name != '' && input.calories != ''){
          // Add item to ItemCtrl
          const newItem = ItemCtrl.addItem(input.name, input.calories);
          // add item to UI item list
          UICtrl.addListItem(newItem);
          // Get total calories
          const totalCalories = ItemCtrl.getTotalCalories();
         // add total calories to UI
         UICtrl.showTotalCalories(totalCalories);
          // clear fields
          UICtrl.clearFields();
      }
   }

   // Edit Click
   function itemEditClick(e){
     e.preventDefault();
     
     if(e.target.classList.contains('fas')){
        // get list item id item-0 ... item-1
        const itemId = e.target.parentNode.parentNode.id;
        //Break into array
        const listArray = itemId.split('-');
        // take actual id
        const id = parseInt(listArray[1]);
        // get item
        const itemToEdit = ItemCtrl.getItemById(id);
       //set item to current
       ItemCtrl.setCurrentItem(itemToEdit);
       // add item to form
       UICtrl.addItemToForm();
     }
   }

   // item update submit
   function itemUpdateSubmit(e){
       
       //get input 
       const input = UICtrl.getItemInput();
       // update item
       const updated = ItemCtrl.updateItem(input.name, input.calories);
       // update UI
       UICtrl.updatedListItem(updated);
       // Get total calories
       const totalCalories = ItemCtrl.getTotalCalories();
       // add total calories to UI
       UICtrl.showTotalCalories(totalCalories);
       // clear fields
       UICtrl.clearEditState();
       e.preventDefault();
   }

   // item delete submit
   function itemDeleteSubmit(e){
      // get current item
      const currentItem = ItemCtrl.getCurrentItem();
      // delete current item
      ItemCtrl.deleteItem(currentItem.id);
      // delet from UI
      UICtrl.deleteListItem(currentItem.id);
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      // clear fields
      UICtrl.clearEditState();
    e.preventDefault();
   }

   // clear all event click
   function clearAllItemsClick(e){
    // clear all items in itemCtrl
    ItemCtrl.clearAllItems();   
    // remove from UI
    UICtrl.removeItems();
    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);
    // hide UL
    UICtrl.hideList();
    e.preventDefault();
   }

  
    // Public method
    return {
        init : function(){
            // clear edit state
            UICtrl.clearEditState();
            // Fetch items from data structure
            const items = ItemCtrl.getItems();
            // hide li if items = 0
            if(items.length === 0){
                UICtrl.hideList();
            }else{
                 // Populate items with UI controller
                 UICtrl.populateItemList(items);
            }
            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
           
            // Initialize events from UICtrl
            loadEventListeners();
        }
    }
})(ItemCtrl,UICtrl);

// Initialize app
App.init();