const BLOCK_CLASS = "pinned_block";
let schedule_wrapper = document.getElementById("plantablecontainer");

//
// Get DOM property
//
function property(e, prop) {
  return window.getComputedStyle(e, null).getPropertyValue(prop);
}

//
// Calculate day of week based on position
//
function getDay(left, width) {
  let result  = 0;
  let percent = left * 100 / parseFloat(property(schedule_wrapper, "width"));
  
  for(;percent >= Math.floor(width); percent -= width) {
    result++;
  }
  
  if(left < 0) {
    return "ignore";
  }
  
  return result;
}

//
// Add class to DOM element
//
function addClass(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}

//
// Assign days of week
//
function assignDays(view = 1) {
  schedule_wrapper = document.getElementById("plantablecontainer");
  
  const blocks = document.getElementsByClassName("activity_block");
  
  // prevent redundancy
  if(blocks.length > 0 && blocks[0].classList.contains("_syjon"))
    return;
  
  for(var i = 0; i < blocks.length; i++) {
    addClass(blocks[i], "_syjon");
    
    let blockClass = "_syjon_day_";
    
    // weekend view
    if(view === 2) {
      blockClass += "weekend_" + getDay(parseFloat(property(blocks[i], "left")), 50);
    }
    
    // working days view
    if(view === 5) {
      blockClass += "working_" + getDay(parseFloat(property(blocks[i], "left")), 20);
    }

    // whole week view
    if(view === 7) {
      blockClass += "whole_" + getDay(parseFloat(property(blocks[i], "left")), 14.285714286);
    }
    
    addClass(blocks[i], blockClass);
  }
}

//
// Formats time from float
//
function formatTime(ftime) {
  let hour = Math.floor(ftime);
  let minutes = Math.round(ftime % Math.floor(ftime) * 60); 
  
  if(minutes >= 60) {
    hour++;
    minutes %= 60;
  }
  
  if(minutes / 10 === 0) {
    minutes = "0" + minutes;
  }
  
  
  return hour + ":" + minutes;
  
}

//
// Assign time schedule
//
function assignTime() {
  schedule_wrapper = document.getElementById("plantablecontainer");
  
  const blocks = document.getElementsByClassName("activity_block");
  
  for(let i = 0; i < blocks.length; i++) {
    const top    = parseFloat(property(blocks[i], "top"));
    const height = parseFloat(property(blocks[i], "height"));
    
    const wrapper_height = parseFloat(property(schedule_wrapper, "height"));
    
    // schedule time
    if(blocks[i].getElementsByClassName("_syjon_time").length < 1) {
      const start_time = formatTime(8 + 13 * top/wrapper_height);
      const end_time = formatTime(8 + 13 * (top + height)/wrapper_height);
      
      const time_wrapper = document.createElement("div");
      time_wrapper.innerHTML = start_time + " - " + end_time;
      
      addClass(time_wrapper, "_syjon_time");

      blocks[i].getElementsByClassName("activity_content")[0].appendChild(time_wrapper);
    }

  }
}

//
// Injects a set of checkboxes
//
function injectCheckboxes() {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "activity_checkbox";
  checkbox.addEventListener( 'change', (e) => {
    if(element.checked) {
      element.parentElement.classList.add(BLOCK_CLASS);
    } else {
      element.parentElement.classList.remove(BLOCK_CLASS);
    }
  });
  
  const blocks = document.getElementsByClassName("activity_block");
  
  for(let i = 0; i < blocks.length; i++) {
    var currentCheckbox = checkbox.cloneNode(true);
    currentCheckbox.className += " _chk_" + i;
    
    if(blocks[i].getElementsByClassName("activity_checkbox").length === 0) {
      blocks[i].appendChild(currentCheckbox);
    }
  }
}



var days = document.getElementById("weekday_header").children[0].rows[0].cells.length; 
assignDays(days);
assignTime();
injectCheckboxes();