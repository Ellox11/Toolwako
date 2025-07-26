document.addEventListener('DOMContentLoaded', () => {
    // Get all necessary DOM elements
    const unitRadios = document.querySelectorAll('input[name="unit"]');
    const metricInputs = document.getElementById('metric-inputs');
    const imperialInputs = document.getElementById('imperial-inputs');
    const calculateBtn = document.getElementById('calculate-btn');
    const errorMessage = document.getElementById('error-message');
    const resultSection = document.getElementById('result-section');
    const bmiValueEl = document.getElementById('bmi-value');
    const bmiCategoryEl = document.getElementById('bmi-category');
    const bmiIndicator = document.getElementById('bmi-indicator');

    // Add event listeners
    unitRadios.forEach(radio => radio.addEventListener('change', toggleUnits));
    calculateBtn.addEventListener('click', calculateBMI);

    // Function to toggle between metric and imperial input fields
    function toggleUnits() {
        if (document.getElementById('metric').checked) {
            metricInputs.style.display = 'grid';
            imperialInputs.style.display = 'none';
        } else {
            metricInputs.style.display = 'none';
            imperialInputs.style.display = 'grid';
        }
        clearResults();
    }

    // Main calculation function
    function calculateBMI() {
        clearError();
        clearResults();

        const unit = document.querySelector('input[name="unit"]:checked').value;
        let height, weight;

        // 1. Get and validate inputs based on selected unit
        if (unit === 'metric') {
            height = parseFloat(document.getElementById('height-cm').value);
            weight = parseFloat(document.getElementById('weight-kg').value);
            if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
                showError('Please enter valid height and weight.');
                return;
            }
        } else { // Imperial
            const ft = parseFloat(document.getElementById('height-ft').value);
            const inch = parseFloat(document.getElementById('height-in').value) || 0;
            const lbs = parseFloat(document.getElementById('weight-lbs').value);
            if (isNaN(ft) || isNaN(inch) || isNaN(lbs) || ft <= 0 || lbs <= 0) {
                showError('Please enter valid height and weight.');
                return;
            }
            // Convert to metric for calculation
            height = (ft * 12 + inch) * 2.54;
            weight = lbs * 0.453592;
        }

        // 2. Calculate BMI
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);

        if (isNaN(bmi) || !isFinite(bmi)) {
            showError('Could not calculate BMI. Please check your inputs.');
            return;
        }

        // 3. Display the results
        displayResults(bmi);
    }

    // Function to update the UI with results
    function displayResults(bmi) {
        const { category, color } = getBMICategory(bmi);

        bmiValueEl.textContent = bmi.toFixed(1);
        bmiCategoryEl.textContent = category;
        bmiCategoryEl.style.color = color;

        // Update the gauge indicator position
        updateGauge(bmi);

        resultSection.style.display = 'block';
    }

    // Helper to determine BMI category and color
    function getBMICategory(bmi) {
        if (bmi < 18.5) return { category: 'Underweight', color: 'var(--underweight-color)' };
        if (bmi >= 18.5 && bmi < 25) return { category: 'Normal weight', color: 'var(--normal-color)' };
        if (bmi >= 25 && bmi < 30) return { category: 'Overweight', color: 'var(--overweight-color)' };
        return { category: 'Obese', color: 'var(--obese-color)' };
    }
    
    // Helper to update the position of the gauge indicator
    function updateGauge(bmi) {
        let percentage = 0;
        // Map the BMI value to a 0-100% scale for positioning
        if (bmi < 18.5) {
            percentage = (bmi / 18.5) * 25;
        } else if (bmi < 25) {
            percentage = 25 + ((bmi - 18.5) / (25 - 18.5)) * 25;
        } else if (bmi < 30) {
            percentage = 50 + ((bmi - 25) / (30 - 25)) * 25;
        } else {
            // Cap the indicator at the start of the obese section or scale it within
            percentage = 75 + ((bmi - 30) / 10) * 25; // Scale up to BMI 40
        }
        
        // Clamp the percentage between 0 and 100
        percentage = Math.max(0, Math.min(100, percentage));

        bmiIndicator.style.left = `${percentage}%`;
    }

    function showError(message) {
        errorMessage.textContent = message;
    }

    function clearError() {
        errorMessage.textContent = '';
    }

    function clearResults() {
        resultSection.style.display = 'none';
    }
});
