const authMethod = document.title;
let startTime;
let keyPressTimes = [];
let lastKeyPressTime = null;

const apiUrl = '/behavioral-biometrics-api';

window.onload = function(){
    startTime = new Date().getTime();

    $("#login").on("click", function(){ login(); });
    $("#signup").on("click", function(){ signup(); });

    $("#password").on('keypress', function(e) {
      if (e.which === 13) { // Enter key pressed
        if ($("#login").length) {
          $("#login").click();
        } else if ($("#signup").length) {
          $("#signup").click();
        }
      }
    });

    $('#password').on('keydown', function(event) {
        // List of keys that should not trigger a time record
        const ignoredKeys = [
            'Shift', 'Control', 'Alt', 'Meta', 'Tab', 'CapsLock',
            'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
            'Insert', 'Home', 'End', 'PageUp', 'PageDown', 'Enter'
        ];

        if (ignoredKeys.includes(event.key)) {
            return; // Ignore this key
        }

        if (event.key === 'Backspace' || event.key === 'Delete') {
            resetInput();
        } else {
            const currentTime = Date.now();
            if (lastKeyPressTime) {
                keyPressTimes.push(currentTime - lastKeyPressTime);
            }
            lastKeyPressTime = currentTime;
        }

        validatePassword();

    });
}

function resetInput() {
    $('#password').val('');
    keyPressTimes = [];
    lastKeyPressTime = null;
}

function validatePassword() {
  const password = $("#password").val();
  
  const requirements = {
      characters: { element: $('#requirement-characters'), regex: /.{5,}/ } // Has 6 or more characters
  };
  for (const key in requirements) {
    const requirement = requirements[key];
    if (requirement.regex.test(password)) {
      requirement.element.attr('status', 'success');
    } else {
      requirement.element.attr('status', 'fail');
    }
  }
}

async function login() {
    const action = 'login';
    const readyTime = new Date().getTime();
    const timeMs = readyTime - startTime;

    const username = $("#username").val();
    const password = $("#password").val();
    try {
        showLoad();
        const response = await fetch(apiUrl + '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, keyPressTimes })
        });
        const result = await response.json();
        if (response.ok) {
            const params = new URLSearchParams({ authMethod, action, timeMs }).toString();
            window.location.href = '/success?' + params;
        } else {
            showMain();
            showError(result.error);
            resetInput();
        }
    } catch (error) {
        showMain();
        showError('Network error');
        resetInput();
    }
}

async function signup() {
    const action = 'signup';
    const readyTime = new Date().getTime();
    const timeMs = readyTime - startTime;
    const username = $("#username").val();
    const password = $("#password").val();
    try {
        showLoad();
        const response = await fetch(apiUrl + '/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, keyPressTimes })
        });
        const result = await response.json();
        if (response.ok) {
            const params = new URLSearchParams({ authMethod, action, timeMs }).toString();
            window.location.href = '/success?' + params;
        } else {
            showMain();
            showError(result.error);
            resetInput();
        }
    } catch (error) {
        showMain();
        showError('Network error');
        resetInput();
    }
}

