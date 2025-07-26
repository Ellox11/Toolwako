document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const dayInput = document.getElementById('day-input');
    const monthInput = document.getElementById('month-input');
    const yearInput = document.getElementById('year-input');
    const calculateBtn = document.getElementById('calculate-btn');
    const errorMessage = document.getElementById('error-message');
    const resultSection = document.getElementById('result-section');

    // Result output elements
    const yearsOutput = document.getElementById('years-output');
    const monthsOutput = document.getElementById('months-output');
    const daysOutput = document.getElementById('days-output');
    const totalMonthsOutput = document.getElementById('total-months-output');
    const totalWeeksOutput = document.getElementById('total-weeks-output');
    const totalDaysOutput = document.getElementById('total-days-output');
    const totalHoursOutput = document.getElementById('total-hours-output');
    const totalMinutesOutput = document.getElementById('total-minutes-output');
    const totalSecondsOutput = document.getElementById('total-seconds-output');

    calculateBtn.addEventListener('click', calculateAge);

    function calculateAge() {
        // Clear previous errors and results
        clearError();
        hideResults();

        // Get input values as numbers
        const day = parseInt(dayInput.value);
        const month = parseInt(monthInput.value);
        const year = parseInt(yearInput.value);

        // --- Input Validation ---
        if (!day || !month || !year) {
            showError('Please fill in all fields.');
            return;
        }

        const birthDate = new Date(year, month - 1, day);
        // Check if the date is valid (e.g., handles Feb 30)
        if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month - 1 || birthDate.getDate() !== day) {
            showError('Please enter a valid date.');
            return;
        }

        const today = new Date();
        if (birthDate > today) {
            showError('Date of birth must be in the past.');
            return;
        }

        // --- Calculation ---
        let ageYears = today.getFullYear() - birthDate.getFullYear();
        let ageMonths = today.getMonth() - birthDate.getMonth();
        let ageDays = today.getDate() - birthDate.getDate();

        // Adjust months and days if the current day/month is before the birth day/month
        if (ageDays < 0) {
            ageMonths--;
            // Get the last day of the previous month
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            ageDays += lastMonth.getDate();
        }

        if (ageMonths < 0) {
            ageYears--;
            ageMonths += 12;
        }

        // --- Summary Calculation ---
        const timeDiff = today.getTime() - birthDate.getTime();
        const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalHours = Math.floor(timeDiff / (1000 * 60 * 60));
        const totalMinutes = Math.floor(timeDiff / (1000 * 60));
        const totalSeconds = Math.floor(timeDiff / 1000);
        const totalMonths = ageYears * 12 + ageMonths;

        // --- Display Results ---
        displayResults({
            years: ageYears,
            months: ageMonths,
            days: ageDays,
            totalMonths: totalMonths,
            totalWeeks: totalWeeks,
            totalDays: totalDays,
            totalHours: totalHours,
            totalMinutes: totalMinutes,
            totalSeconds: totalSeconds
        });
    }

    function displayResults(results) {
        yearsOutput.textContent = results.years;
        monthsOutput.textContent = results.months;
        daysOutput.textContent = results.days;
        
        // Format summary numbers with commas
        totalMonthsOutput.textContent = results.totalMonths.toLocaleString();
        totalWeeksOutput.textContent = results.totalWeeks.toLocaleString();
        totalDaysOutput.textContent = results.totalDays.toLocaleString();
        totalHoursOutput.textContent = results.totalHours.toLocaleString();
        totalMinutesOutput.textContent = results.totalMinutes.toLocaleString();
        totalSecondsOutput.textContent = results.totalSeconds.toLocaleString();

        resultSection.classList.add('visible');
    }

    function showError(message) {
        errorMessage.textContent = message;
    }

    function clearError() {
        errorMessage.textContent = '';
    }

    function hideResults() {
        resultSection.classList.remove('visible');
        const defaultText = '--';
        yearsOutput.textContent = defaultText;
        monthsOutput.textContent = defaultText;
        daysOutput.textContent = defaultText;
        totalMonthsOutput.textContent = defaultText;
        totalWeeksOutput.textContent = defaultText;
        totalDaysOutput.textContent = defaultText;
        totalHoursOutput.textContent = defaultText;
        totalMinutesOutput.textContent = defaultText;
        totalSecondsOutput.textContent = defaultText;
    }
});
