// State variables
let selectedTipPercentage = 15;

// DOM Elements
const billInput = document.getElementById('bill-input');
const peopleInput = document.getElementById('people-input');
const customTipInput = document.getElementById('custom-tip');
const tipButtons = document.querySelectorAll('.tip-btn');
const peopleError = document.getElementById('people-error');

const tipPerPersonDisplay = document.getElementById('tip-per-person');
const totalPerPersonDisplay = document.getElementById('total-per-person');
const grandTotalDisplay = document.getElementById('grand-total-amount');
const resetButton = document.getElementById('reset-btn');

// Initialize event listeners
function initApp() {
    billInput.addEventListener('input', calculateAll);
    peopleInput.addEventListener('input', calculateAll);
    customTipInput.addEventListener('input', handleCustomTipInput);

    tipButtons.forEach(button => {
        button.addEventListener('click', handleTipButtonClick);
    });

    resetButton.addEventListener('click', resetAll);
}

// Handle preset tip button click
function handleTipButtonClick(event) {
    tipButtons.forEach(btn => btn.classList.remove('active'));
    
    const clickedBtn = event.currentTarget;
    clickedBtn.classList.add('active');
    
    selectedTipPercentage = parseFloat(clickedBtn.dataset.percentage);
    customTipInput.value = ''; // Clear custom tip input when a button is clicked
    
    calculateAll();
}

// Handle typing into custom tip input
function handleCustomTipInput() {
    tipButtons.forEach(btn => btn.classList.remove('active'));
    
    const customValue = parseFloat(customTipInput.value);
    selectedTipPercentage = isNaN(customValue) || customValue < 0 ? 0 : customValue;
    
    calculateAll();
}

// Core calculation logic
function calculateAll() {
    const billValue = parseFloat(billInput.value);
    const peopleValue = parseInt(peopleInput.value, 10);

    // Validate number of people
    if (peopleValue <= 0 || isNaN(peopleValue)) {
        peopleError.classList.remove('hidden');
        peopleInput.style.borderColor = 'var(--error-color)';
        clearResultsDisplay();
        return;
    } else {
        peopleError.classList.add('hidden');
        peopleInput.style.borderColor = 'transparent';
    }

    // Enable/disable reset button depending on user input
    if (billValue > 0 || peopleValue > 1 || selectedTipPercentage !== 15) {
        resetButton.disabled = false;
    } else {
        resetButton.disabled = true;
    }

    // Calculate amounts if bill input is valid
    if (!isNaN(billValue) && billValue > 0) {
        const totalTipAmount = billValue * (selectedTipPercentage / 100);
        const overallTotal = billValue + totalTipAmount;
        
        const tipPerPerson = totalTipAmount / peopleValue;
        const totalPerPerson = overallTotal / peopleValue;

        // Render values
        tipPerPersonDisplay.textContent = formatCurrency(tipPerPerson);
        totalPerPersonDisplay.textContent = formatCurrency(totalPerPerson);
        grandTotalDisplay.textContent = formatCurrency(overallTotal);
    } else {
        clearResultsDisplay();
    }
}

// Helper: Format numbers to Pakistani Rupees
function formatCurrency(amount) {
    return 'Rs ' + amount.toFixed(2);
}

// Clear outputs back to zero
function clearResultsDisplay() {
    tipPerPersonDisplay.textContent = 'Rs 0.00';
    totalPerPersonDisplay.textContent = 'Rs 0.00';
    grandTotalDisplay.textContent = 'Rs 0.00';
}

// Reset form to default state
function resetAll() {
    billInput.value = '';
    peopleInput.value = '1';
    customTipInput.value = '';
    selectedTipPercentage = 15;

    tipButtons.forEach(btn => btn.classList.remove('active'));
    // Reactivate default 15% button
    document.querySelector('.tip-btn[data-percentage="15"]').classList.add('active');

    peopleError.classList.add('hidden');
    peopleInput.style.borderColor = 'transparent';
    
    clearResultsDisplay();
    resetButton.disabled = true;
}

// Run app
initApp();