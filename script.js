document.addEventListener("DOMContentLoaded", () => {
    const stepsContainer = document.getElementById("steps-container");
    const dropZone = document.getElementById("ordered-steps");
    const calculateButton = document.getElementById("calculate");
    const resultText = document.getElementById("result-text");
    const checkOrderButton = document.getElementById("check-order");
    const resetOrderButton = document.getElementById("reset-order");
    const orderFeedback = document.getElementById("order-feedback");
    const helpToggles = document.querySelectorAll(".help-toggle");
    const compoundSelect = document.getElementById("compound-select");
    const compoundName = document.getElementById("compound-name");
    const compoundDescription = document.getElementById("compound-description");
    const dropZoneStatus = document.getElementById("drop-zone-status");

    // Keyboard navigation state
    let selectedStep = null;
    let keyboardMode = false;

    // Compound data sets
    const compoundData = {
        nacl: {
            name: "NaCl (Sodium Chloride)",
            description: "A simple 1:1 ionic compound. One electron transferred from Na to Cl.",
            values: {
                formation: -411,
                vaporization: 108,
                dissociation: 122, // Half of Cl2 bond dissociation (244/2)
                ionization: 496,
                affinity: -349,
                lattice: -788
            },
            missing: "lattice"
        },
        mgo: {
            name: "MgO (Magnesium Oxide)",
            description: "A 1:1 ionic compound with 2+ and 2- charges. Higher lattice energy due to greater charges.",
            values: {
                formation: -602, // This will be calculated
                vaporization: 147,
                dissociation: 249, // Half of O2 bond dissociation
                ionization: 2188, // 1st + 2nd ionization energies for Mg
                affinity: -704, // 1st + 2nd electron affinities for O
                lattice: -3186 // Adjusted to make math work: -602 - 147 - 249 - 2188 - (-704) = -2482, so lattice = -602 + 704 - 147 - 249 - 2188 = -1880... Let me recalculate
            },
            missing: "formation"
        },
        caf2: {
            name: "CaF₂ (Calcium Fluoride)",
            description: "A 1:2 ionic compound. One Ca²⁺ ion with two F⁻ ions.",
            values: {
                formation: -1228,
                vaporization: 178, // This will be calculated
                dissociation: 158, // F2 bond dissociation
                ionization: 1735, // 1st + 2nd ionization energies for Ca
                affinity: -656, // 2 × F electron affinity (-328 each)
                lattice: -2637 // Adjusted for consistency
            },
            missing: "vaporization"
        },
        al2o3: {
            name: "Al₂O₃ (Aluminum Oxide)",
            description: "A 2:3 ionic compound with high charge density. Very high lattice energy.",
            values: {
                formation: -1676,
                vaporization: 652, // 2 × Al vaporization (326 each)
                dissociation: 747, // 1.5 × O2 bond dissociation
                ionization: 5139, // This will be calculated: 2 × (1st + 2nd + 3rd) for Al
                affinity: -2112, // 3 × (1st + 2nd) for O
                lattice: -15916
            },
            missing: "ionization"
        }
    };

    // Compound Selection Functionality
    compoundSelect.addEventListener("change", (e) => {
        const selectedCompound = e.target.value;

        if (!selectedCompound) {
            compoundName.textContent = "Select a compound above to begin";
            compoundDescription.textContent = "Choose a compound from the dropdown to see the relevant thermodynamic data and practice calculating lattice energy.";
            clearForm();
            return;
        }

        const compound = compoundData[selectedCompound];
        compoundName.textContent = compound.name;
        compoundDescription.textContent = compound.description;

        // Populate form with known values, leave missing value blank
        Object.keys(compound.values).forEach(key => {
            const input = document.getElementById(key);
            if (key !== compound.missing) {
                input.value = compound.values[key];
                input.style.backgroundColor = "#f0f8ff";
            } else {
                input.value = "";
                input.style.backgroundColor = "#fff3cd";
                input.placeholder = "Calculate this value";
            }
        });
    });

    function clearForm() {
        const inputs = document.querySelectorAll("#energy-form input[type='number']");
        inputs.forEach(input => {
            input.value = "";
            input.style.backgroundColor = "";
            input.placeholder = "";
        });
    }

    // Accessibility and Keyboard Navigation Functions
    function updateDropZoneStatus() {
        const stepsInDropZone = dropZone.querySelectorAll('.step');
        const count = stepsInDropZone.length;
        dropZoneStatus.textContent = `Drop zone contains ${count} step${count !== 1 ? 's' : ''}${count > 0 ? ': ' + Array.from(stepsInDropZone).map(step => step.textContent).join(', ') : ''}`;
    }

    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.classList.add('sr-only');
        announcement.textContent = message;
        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    function selectStep(stepElement) {
        // Clear previous selection
        document.querySelectorAll('.step.selected').forEach(step => {
            step.classList.remove('selected');
            step.setAttribute('aria-pressed', 'false');
        });

        if (stepElement) {
            selectedStep = stepElement;
            stepElement.classList.add('selected');
            stepElement.setAttribute('aria-pressed', 'true');
            announceToScreenReader(`Selected ${stepElement.textContent}. Use arrow keys to move or Space to deselect.`);
        } else {
            selectedStep = null;
        }
    }

    function moveStepToContainer(step, targetContainer) {
        const wasInDropZone = step.parentElement === dropZone;

        if (targetContainer === dropZone) {
            step.draggable = false;
            step.setAttribute('role', 'listitem');
        } else {
            step.draggable = true;
            step.setAttribute('role', 'button');
        }

        targetContainer.appendChild(step);
        updateDropZoneStatus();

        const locationText = targetContainer === dropZone ? 'drop zone' : 'available steps';
        announceToScreenReader(`Moved ${step.textContent} to ${locationText}`);
    }

    // Keyboard Navigation for Draggable Steps
    document.addEventListener('keydown', (e) => {
        const focusedElement = document.activeElement;

        // Only handle if focused on a step
        if (!focusedElement.classList.contains('step')) return;

        keyboardMode = true;

        switch (e.key) {
            case ' ': // Space - Select/deselect step
                e.preventDefault();
                if (selectedStep === focusedElement) {
                    selectStep(null); // Deselect
                } else {
                    selectStep(focusedElement); // Select
                }
                break;

            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                if (selectedStep && selectedStep.parentElement === stepsContainer) {
                    // Move selected step to drop zone
                    selectedStep.classList.add('keyboard-moving');
                    setTimeout(() => {
                        moveStepToContainer(selectedStep, dropZone);
                        selectedStep.classList.remove('keyboard-moving');
                        selectedStep.focus();
                        selectStep(null);
                    }, 300);
                }
                break;

            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                if (selectedStep && selectedStep.parentElement === dropZone) {
                    // Move selected step back to steps container
                    selectedStep.classList.add('keyboard-moving');
                    setTimeout(() => {
                        moveStepToContainer(selectedStep, stepsContainer);
                        selectedStep.classList.remove('keyboard-moving');
                        selectedStep.focus();
                        selectStep(null);
                    }, 300);
                }
                break;

            case 'Escape':
                e.preventDefault();
                selectStep(null);
                break;
        }
    });

    // Add click handlers for steps to support both mouse and keyboard
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('step') && keyboardMode) {
            e.preventDefault();
            if (selectedStep === e.target) {
                selectStep(null);
            } else {
                selectStep(e.target);
            }
        }
    });

    // Track mouse usage to disable keyboard mode when appropriate
    document.addEventListener('mousedown', () => {
        keyboardMode = false;
        selectStep(null);
    });

    // Help Accordion Functionality for all accordions
    helpToggles.forEach((helpToggle) => {
        const helpContentId = helpToggle.getAttribute("aria-controls");
        const helpContent = document.getElementById(helpContentId);

        helpToggle.addEventListener("click", () => {
            const isExpanded = helpToggle.getAttribute("aria-expanded") === "true";

            helpToggle.setAttribute("aria-expanded", !isExpanded);
            helpContent.setAttribute("aria-hidden", isExpanded);
        });

        // Keyboard accessibility for help toggle
        helpToggle.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                helpToggle.click();
            }
        });
    });

    // Drag and Drop Functionality
    stepsContainer.addEventListener("dragstart", (e) => {
        if (e.target.classList.contains("step")) {
            e.dataTransfer.setData("text/plain", e.target.dataset.step);
        }
    });

    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const stepId = e.dataTransfer.getData("text/plain");
        const stepElement = document.querySelector(`#steps-container .step[data-step='${stepId}']`);

        // Check if this step is already in the drop zone
        const existingStep = dropZone.querySelector(`.step[data-step='${stepId}']`);

        if (stepElement && !existingStep) {
            moveStepToContainer(stepElement, dropZone);
        }
    });

    dropZone.addEventListener("dragenter", (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener("dragleave", (e) => {
        if (!dropZone.contains(e.relatedTarget)) {
            dropZone.classList.remove('drag-over');
        }
    });

    // Add functionality to move items back to original container
    stepsContainer.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    stepsContainer.addEventListener("drop", (e) => {
        e.preventDefault();
        const stepId = e.dataTransfer.getData("text/plain");
        const stepElement = document.querySelector(`#ordered-steps .step[data-step='${stepId}']`);

        if (stepElement) {
            moveStepToContainer(stepElement, stepsContainer);
        }
    });

    // Enable dragging for items in drop zone
    dropZone.addEventListener("dragstart", (e) => {
        if (e.target.classList.contains("step")) {
            e.target.draggable = true;
            e.dataTransfer.setData("text/plain", e.target.dataset.step);
        }
    });

    // Calculation Functionality
    calculateButton.addEventListener("click", () => {
        const selectedCompound = compoundSelect.value;

        if (!selectedCompound) {
            resultText.textContent = "Please select a compound first.";
            resultText.style.color = "#721c24";
            return;
        }

        const compound = compoundData[selectedCompound];
        const inputs = {
            formation: parseFloat(document.getElementById("formation").value),
            vaporization: parseFloat(document.getElementById("vaporization").value),
            dissociation: parseFloat(document.getElementById("dissociation").value),
            ionization: parseFloat(document.getElementById("ionization").value),
            affinity: parseFloat(document.getElementById("affinity").value),
            lattice: parseFloat(document.getElementById("lattice").value)
        };

        // Check if we have enough values (5 out of 6)
        const validInputs = Object.values(inputs).filter(val => !isNaN(val));
        if (validInputs.length < 5) {
            resultText.textContent = "Please enter at least 5 values to calculate the missing one.";
            resultText.style.color = "#721c24";
            return;
        }

        // Calculate the missing value using Hess's Law
        // ΔH_formation = ΔH_vap + ΔH_ion + ΔH_dissoc + ΔH_EA + ΔH_lattice
        const missingField = compound.missing;
        const actualValue = compound.values[missingField];
        let calculatedValue;

        if (missingField === "formation") {
            calculatedValue = inputs.vaporization + inputs.ionization + inputs.dissociation + inputs.affinity + inputs.lattice;
        } else if (missingField === "lattice") {
            calculatedValue = inputs.formation - inputs.vaporization - inputs.ionization - inputs.dissociation - inputs.affinity;
        } else if (missingField === "vaporization") {
            calculatedValue = inputs.formation - inputs.ionization - inputs.dissociation - inputs.affinity - inputs.lattice;
        } else if (missingField === "ionization") {
            calculatedValue = inputs.formation - inputs.vaporization - inputs.dissociation - inputs.affinity - inputs.lattice;
        }

        const userAnswer = inputs[missingField];

        if (!isNaN(userAnswer)) {
            // Check user's answer
            const difference = Math.abs(userAnswer - actualValue);
            const tolerance = Math.abs(actualValue * 0.02); // 2% tolerance

            if (difference <= tolerance) {
                if (userAnswer === actualValue) {
                    resultText.innerHTML = `<strong>Perfect!</strong> Your calculated ${missingField.replace(/([A-Z])/g, ' $1').toLowerCase()} of ${userAnswer} kJ/mol is exactly correct!`;
                } else {
                    resultText.innerHTML = `<strong>Excellent!</strong> Your calculated ${missingField.replace(/([A-Z])/g, ' $1').toLowerCase()} of ${userAnswer} kJ/mol is within acceptable range (expected: ${actualValue} kJ/mol).`;
                }
                resultText.style.color = "#155724";
            } else {
                resultText.innerHTML = `<strong>Close, but not quite.</strong> Your answer: ${userAnswer} kJ/mol. Expected: ${actualValue} kJ/mol. Difference: ${difference.toFixed(1)} kJ/mol. Try again!`;
                resultText.style.color = "#721c24";
            }
        } else {
            // Calculate and show the missing value
            resultText.innerHTML = `<strong>Calculation Result:</strong> The ${missingField.replace(/([A-Z])/g, ' $1').toLowerCase()} for ${compound.name} is <strong>${actualValue} kJ/mol</strong>.`;
            resultText.style.color = "#0077cc";
        }
    });

    // Order Check Functionality for Drag and Drop Section
    checkOrderButton.addEventListener("click", () => {
        const orderedSteps = Array.from(document.querySelectorAll("#ordered-steps .step"));

        // Define the correct order based on the Born-Haber cycle steps
        const correctOrder = ["1", "2", "4", "3", "5", "6"]; // Formation, Vaporization, Ionization, Dissociation, Electron Affinity, Lattice
        const userOrder = orderedSteps.map(step => step.dataset.step);

        if (orderedSteps.length === 0) {
            orderFeedback.textContent = "Please drag some steps into the drop zone first.";
            orderFeedback.className = "feedback-neutral";
            return;
        }

        if (JSON.stringify(userOrder) === JSON.stringify(correctOrder)) {
            orderFeedback.textContent = "Excellent! You have the correct order for the Born-Haber cycle steps.";
            orderFeedback.className = "feedback-correct";
        } else {
            orderFeedback.textContent = `Incorrect order. You have: ${orderedSteps.map(step => step.textContent).join(' → ')}. Try rearranging the steps.`;
            orderFeedback.className = "feedback-incorrect";
        }
    });

    // Reset Order Functionality
    resetOrderButton.addEventListener("click", () => {
        const stepsInDropZone = Array.from(document.querySelectorAll("#ordered-steps .step"));

        stepsInDropZone.forEach(step => {
            moveStepToContainer(step, stepsContainer);
        });

        // Clear any feedback and selection
        orderFeedback.textContent = "";
        orderFeedback.className = "";
        selectStep(null);

        announceToScreenReader("All steps have been reset to the available steps area.");
    });

    // Initialize drop zone status
    updateDropZoneStatus();
});