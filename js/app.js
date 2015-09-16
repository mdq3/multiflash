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

console.log("MultiFlash started");

var modes = {flash: FLASH_MODE, morse: MORSE_MODE};
var currentMode = modes.flash;
modes.flash.show();
modes.morse.hide();

var error = document.getElementById('error');
error.style.display = 'none';
//document.getElementById('error').hide();

var flashModeButton = document.getElementById('flash-mode-button');
var morseModeButton = document.getElementById('morse-mode-button');

//FLASH_LIGHT.checkCameras();

// Change current mode to given mode.
function changeMode(mode) {
  if(currentMode != mode) {
    currentMode.hide();
    currentMode.reset();
    mode.show();
    currentMode = mode;
  }
}

// Button is pressed.
function buttonDown(button) {
  button.classList.remove('button-up');
  button.classList.add('button-down');
}

// Button is unpressed.
function buttonUp(button) {
  button.classList.remove('button-down');
  button.classList.add('button-up');
}

// Vibrate for given milliseconds.
function vibrate(milliseconds) {
  if('vibrate' in navigator) {
    navigator.vibrate(milliseconds);
  }
}

// EVENT LISTENERS:
flashModeButton.addEventListener('touchstart', function(){
  buttonDown(flashModeButton);
});
flashModeButton.addEventListener('touchend', function(){
  buttonUp(flashModeButton);
  changeMode(modes.flash);
});

morseModeButton.addEventListener('touchstart', function(){
  buttonDown(morseModeButton);
});
morseModeButton.addEventListener('touchend', function(){
  buttonUp(morseModeButton);
  changeMode(modes.morse);
});

// App loaded.
window.addEventListener('load', function() {
  FLASH_LIGHT.checkCameras();
  vibrate(150);
});

// App gained focus.
window.addEventListener('focus', function() {
  FLASH_LIGHT.checkCameras();
});

// App lost focus.
window.addEventListener('blur', function() {
  currentMode.reset();
  FLASH_LIGHT.releaseCamera();
});


/**
 * Flash light control.
 */
var FLASH_LIGHT = (function() {
  // PUBLIC:
  var public = {};
  
  public.on = function() {
    camera.flashMode = 'torch';
    flashIsOn = true;
  };

  public.off = function() {
    camera.flashMode = 'off';
    flashIsOn = false;
  };
  
  public.isOn = function() {
    return flashIsOn;
  };
  
  // Find cameras and check if they include a flash.
  public.checkCameras = function() {
    var deviceCameras = navigator.mozCameras.getListOfCameras();
    var cameras = navigator.mozCameras;
    console.log("Number of cameras found: " + deviceCameras.length);
    for(var i = 0; i < deviceCameras.length; i++) {
      cameras.getCamera(cameras[i], null, foundCamera);
    }
  };
  
  // Release control of the camera so it can be used with another app.
  public.releaseCamera = function() {
    if (camera) {
      camera.release(onCameraRelease);
    }
  };
  
  // PRIVATE:
  var flashIsOn = false;
  var camera = null;
  
  // Callback function for when camera is found, check camera for flash.
  function foundCamera(currentCamera) {
    var flashModes = currentCamera.capabilities.flashModes;
    if(flashModes && flashModes.indexOf('torch') >= 0) {
      camera = currentCamera;
      console.log("Found camera flash. Ready.");
    } else {
      console.log('No camera flash');
      //error.style.display = 'block';
      //document.querySelector('footer').style.display = 'none'
      //currentMode.hide();
    }
  }
  
  // Callback function for when camera is released.
  function onCameraRelease() {
    console.log("Camera released, available for other use.");
  }
  
  //checkCameras();
  return public;
}());

// if(!FLASH_LIGHT.available) {
//   error.style.display = 'block';
//   document.querySelector('footer').style.display = 'none'
//   currentMode.hide();
// }
