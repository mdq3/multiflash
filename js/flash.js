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
  along with Multiflash.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * Flash mode functionality.
 */
var FLASH_MODE = (function() {
  // PUBLIC:
  var public = {};
  
  public.show = function() {
    var header = document.getElementsByTagName('h1');
    header[0].innerHTML = "Flashlight";
    document.getElementById('flash-mode').style.display = 'flex';
  };
  
  public.hide = function() {
    document.getElementById('flash-mode').style.display = 'none';
  };
  
  // Reset flash mode
  public.reset = function() {
    if(FLASH_LIGHT.isOn()) {
      toggleFlash();
    }
  };
  
  // PRIVATE:
  var flashButton = document.getElementById('flash-button');
  
  // Toggle flash light on/off.
  function toggleFlash() {
    if(!FLASH_LIGHT.isOn()) {
      flashButton.innerHTML = "Off";
      FLASH_LIGHT.on();
    } else {
      flashButton.innerHTML = "On";
      FLASH_LIGHT.off();
    }
    vibrate(100);
  }
  
  // EVENT LISTENERS:
  flashButton.addEventListener('touchstart', function(){
    buttonDown(flashButton);
  });
  flashButton.addEventListener('touchend', function(){
    buttonUp(flashButton);
    toggleFlash();
  });
  
	return public;
}());