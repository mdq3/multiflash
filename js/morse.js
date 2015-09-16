/*
  Copyright Michael Quested 2014.
  
  This file is part of Multiflash.

  Multiflash is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  Multiflash is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with Multiflash.  If not, see <https://www.gnu.org/licenses/>.
*/

/**
 * Morse code mode functionality.
 */
var MORSE_MODE = (function() {
  // PUBLIC:
  var public = {};
  
  public.show = function() {
    var header = document.getElementsByTagName("h1");
    header[0].innerHTML = "Morse Code";
    document.getElementById('morse-mode').style.display = 'flex';
  };
  
  public.hide = function() {
    document.getElementById('morse-mode').style.display = 'none';
  };
  
  // Reset morse mode
  public.reset = function() {
    stop();
  };
  
  // PRIVATE:
  var textInput = document.getElementById('message-input');
  var startButton = document.getElementById('morse-start-button');
  var stopButton = document.getElementById('morse-stop-button');
  var clearButton = document.getElementById('morse-clear-button');
  var userMessage = "";
  var running = false;
  var timeUnit = 150; // length in milliseconds of one time unit in morse code
  
  // Start the morse code sequence.
  function start() {
    console.log('Started morse sequence');
    var text = textInput.innerHTML.replace(/(<br>|&nbsp;)/g, "").trim(); // Remove unwanted html entities & whitespace;
    if(text.length > 0 && !running) {
      userMessage = text;
      textInput.removeAttribute('contenteditable');
      running = true;                        
      jQuery.when(doMorseSequence(userMessage.toUpperCase()).done(function() {
        stop();
      }));
    } else if (!running){
      buttonUp(startButton);
      //alert("Enter your message into the text box...");
    }
  }

  // Stop the morse code sequence.
  function stop() {
    buttonUp(stopButton);
    if(running) {
      console.log('Finished morse sequence');
      buttonUp(startButton);
      textInput.setAttribute('contenteditable', 'true');
      if(textInput.innerHTML == "") {
        userMessage = textInput.innerHTML;
      }
      textInput.innerHTML = userMessage;
      running = false;
      FLASH_LIGHT.off(); 
    }
  }
  
  /**
   * Execute the sequential function chain of the morse code sequence.
   */
  function doMorseSequence(text) {
    var def = jQuery.Deferred();
    var code = getCodeList(text);
    doMorseSequence2(code, 0, def);
    return def.promise();
  }
  
  /**
   *
   */
  function doMorseSequence2(codeList, index, promise) {
    var p = playCodeWord(codeList[index]);
    highlightText(userMessage, index + 1);
    jQuery.when(p).done(function() {
      if((index + 1 == codeList.length) || !running) {
        promise.resolve();
      } else {
        doMorseSequence2(codeList, index + 1, promise);
      }
    });
  }
  
  /**
   *
   */
  function playCodeWord(codeWord) {
    var def = jQuery.Deferred();
    playCodeWord2(codeWord, 0, def);
    jQuery.when(def).done(function() {def.resolve();});
    return def.promise();
  }
  
  /**
   *
   */
  function playCodeWord2(codeWord, index, promise) {
    var p = playCodeChar(codeWord[index]);
    jQuery.when(p).done(function() {
      if(!running) {
        promise.resolve();
      } else if(index + 1 == codeWord.length) {
        setTimeout(function() {promise.resolve();}, timeUnit * 2); // Gap between text characters
      } else {
        playCodeWord2(codeWord, index + 1, promise);
      }
    });
  }
  
  /**
   *
   */
  function playCodeChar(codeChar) {
    if(codeChar != ' ') {
      FLASH_LIGHT.on();
    }
    var def = jQuery.Deferred();
    setTimeout(function() {
        FLASH_LIGHT.off();
        setTimeout(function() {def.resolve();}, timeUnit * 1); // Gap between code characters
      }, 
      getTimeOut(codeChar));
    return def.promise();
  }
  
  /**
   *
   */
  function getCodeList(text) {
    var code = [];
    for(var i = 0; i < text.length; i++) {
      code.push(getCode(text[i]));
    }
    return code;
  }
  
  /**
   *
   */
  function getTimeOut(codeChar) {
    switch(codeChar) {
      case '.':
        return timeUnit * 1;
      case '-':
        return timeUnit * 3;
      case ' ':
        return timeUnit * 5;
    }
  }

  /**
   * Highlight text from start of string to given length.
   */
  function highlightText(text, highlightLength) {
    var highlightedText = text.substring(0, highlightLength);
    var rest = text.substring(highlightLength, text.length);
    textInput.innerHTML = '<span class="text-highlight">' + highlightedText + '</span>' + rest;
  }

  // EVENT LISTENERS:
  startButton.addEventListener('touchstart', function() { 
    buttonDown(startButton);
  });
  startButton.addEventListener('touchend', function() {
    start();
  });

  stopButton.addEventListener('touchstart', function() {
    buttonDown(stopButton);
  });
  stopButton.addEventListener('touchend', function() {
    stop();
  }); 
  
  clearButton.addEventListener('touchstart', function() {
    buttonDown(clearButton);
  });
  clearButton.addEventListener('touchend', function() {
    buttonUp(clearButton);
    stop();
    textInput.innerHTML = "";
    userMessage = "";
  }); 
  
  /**
   * Lookup of morse code based on given character.
   */
  function getCode(char) {
    switch(char) {
      case "A":
        return ".-";
      case "B":
        return "-...";
      case "C":
        return "-.-.";
      case "D":
        return "-..";
      case "E":
        return ".";
      case "F":
        return "..-.";
      case "G":
        return "--.";
      case "H":
        return "....";
      case "I":
        return "..";
      case "J":
        return ".---";
      case "K":
        return "-.-";
      case "L":
        return ".-..";
      case "M":
        return "--";
      case "N":
        return "-.";
      case "O":
        return "---";
      case "P":
        return ".--.";
      case "Q":
        return "--.-";
      case "R":
        return ".-.";
      case "S":
        return "...";
      case "T":
        return "-";
      case "U":
        return "..-";
      case "V":
        return "...-";
      case "W":
        return ".--";
      case "X":
        return "-..-";
      case "Y":
        return "-.--";
      case "Z":
        return "--..";
      case "1":
        return ".----";
      case "2":
        return "..---";
      case "3":
        return "...--";
      case "4":
        return "....-";
      case "5":
        return ".....";
      case "6":
        return "-....";
      case "7":
        return "--...";
      case "8":
        return "---..";
      case "9":
        return "----.";
      case "0":
        return "-----";
      default:
        return " ";
    }
  }

  return public;
}());
