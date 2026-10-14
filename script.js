let currentInput = '0';
let previousInput = '';
let operator = null;
let memory = 0;
let grandTotal = 0;
let resetInputNext = false;

const display = document.getElementById('display');
const memoryIndicator = document.getElementById('memory-indicator');

function updateDisplay() {
    // Format number to avoid overflow
    if (currentInput.length > 12) {
        display.innerText = Number(currentInput).toExponential(6);
    } else {
        display.innerText = currentInput;
    }
    
    let indicators = [];
    if (memory !== 0) indicators.push('M');
    if (grandTotal !== 0) indicators.push('GT');
    memoryIndicator.innerText = indicators.join(' ');
}

function handleNumber(num) {
    if (currentInput === '0' || resetInputNext) {
        currentInput = num;
        resetInputNext = false;
    } else {
        // Prevent multiple decimals
        if (num === '.' && currentInput.includes('.')) return;
        currentInput += num;
    }
    updateDisplay();
}

function handleOperator(op) {
    if (operator && !resetInputNext) {
        calculate();
    }
    previousInput = currentInput;
    operator = op;
    resetInputNext = true;
}

function calculate() {
    if (!operator || !previousInput) return;
    
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result = 0;
    
    switch (operator) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/': 
            if (current === 0) {
                currentInput = 'Error';
                operator = null;
                updateDisplay();
                resetInputNext = true;
                return;
            }
            result = prev / current; 
            break;
    }
    
    // Round to prevent floating point issues (up to 10 decimal places)
    result = Math.round(result * 10000000000) / 10000000000;
    currentInput = result.toString();
    operator = null;
    previousInput = '';
    resetInputNext = true;
    grandTotal += result;
    updateDisplay();
}

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');
        const op = button.getAttribute('data-operator');
        const action = button.getAttribute('data-action');
        
        if (value) {
            handleNumber(value);
        } else if (op) {
            handleOperator(op);
        } else if (action) {
            switch (action) {
                case 'ac':
                    currentInput = '0';
                    previousInput = '';
                    operator = null;
                    resetInputNext = false;
                    break;
                case 'ce':
                    currentInput = '0';
                    break;
                case 'backspace':
                    if (currentInput.length > 1) {
                        currentInput = currentInput.slice(0, -1);
                    } else {
                        currentInput = '0';
                    }
                    break;
                case 'toggle-sign':
                    if (currentInput !== '0' && currentInput !== 'Error') {
                        currentInput = (parseFloat(currentInput) * -1).toString();
                    }
                    break;
                case 'calculate':
                    calculate();
                    break;
                case 'm+':
                    if (currentInput !== 'Error') {
                        memory += parseFloat(currentInput);
                        resetInputNext = true;
                    }
                    break;
                case 'm-':
                    if (currentInput !== 'Error') {
                        memory -= parseFloat(currentInput);
                        resetInputNext = true;
                    }
                    break;
                case 'mrc':
                    if (resetInputNext && currentInput === memory.toString()) {
                        // Double press clears memory
                        memory = 0;
                    } else {
                        // Single press recalls memory
                        currentInput = memory.toString();
                        resetInputNext = true;
                    }
                    break;
                case 'gt':
                    currentInput = grandTotal.toString();
                    resetInputNext = true;
                    break;
            }
            updateDisplay();
        }
    });
});
