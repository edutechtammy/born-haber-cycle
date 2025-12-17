# Born-Haber Cycle Interactive Activity

An interactive web-based educational tool designed for higher education chemistry students to learn and practice the Born-Haber cycle concept through hands-on activities.

## 🧪 About the Born-Haber Cycle

The Born-Haber cycle is a thermodynamic approach used to calculate lattice energy by breaking down the formation of an ionic solid into a series of individual steps. Each step represents a specific energy change that can be measured or calculated, allowing us to apply Hess's Law to determine the overall lattice energy.

## 📚 Educational Objectives

This interactive activity helps students:
- Understand the sequential steps involved in the Born-Haber cycle
- Apply Hess's Law to thermochemical calculations
- Practice calculating lattice energies for various ionic compounds
- Visualize the relationship between different thermodynamic properties

## 🎯 Features

### Activity 1: Order the Born-Haber Cycle Steps
- **Interactive Drag & Drop**: Students drag and drop thermodynamic steps into the correct order
- **Real-time Feedback**: Immediate validation of the arranged sequence
- **Built-in Help System**: Expandable help sections with detailed explanations
- **Reset Functionality**: Easy reset to try different arrangements

**Steps Included:**
1. Enthalpy of Formation
2. Enthalpy of Vaporization  
3. Ionization Energy
4. Bond Dissociation Energy
5. Electron Affinity
6. Lattice Enthalpy

### Activity 2: Calculate Lattice Energy
- **Multiple Compound Examples**: Practice with NaCl, MgO, CaF₂, and Al₂O₃
- **Hess's Law Application**: Calculate unknown thermodynamic values using provided data
- **Adaptive Learning**: Each compound has one missing value for students to determine
- **Tolerance-based Grading**: Accepts answers within a reasonable range (2% tolerance)
- **Contextual Help**: Detailed calculation examples and step-by-step guidance

## 🗂️ Project Structure

```
born-haber-cycle/
├── index.html          # Main HTML structure and content
├── style.css           # Responsive CSS styling and animations  
├── script.js           # Interactive JavaScript functionality
└── README.md          # Project documentation
```

## 🛠️ Technical Implementation

### Technologies Used
- **HTML5**: Semantic markup with accessibility features (ARIA attributes)
- **CSS3**: Modern styling with flexbox/grid layouts and smooth animations
- **Vanilla JavaScript**: ES6+ features for interactive functionality
- **Responsive Design**: Mobile-friendly layout that adapts to different screen sizes

### Key JavaScript Features
- Drag and Drop API implementation
- Real-time form validation
- Dynamic compound data loading
- Accordion-style help sections
- Thermodynamic calculations with Hess's Law

### Accessibility Features
- ARIA labels and roles for screen readers
- Keyboard navigation support
- High contrast color schemes
- Semantic HTML structure
- Live regions for dynamic feedback

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start exploring the interactive activities!

### Usage
1. **Activity 1**: Drag the thermodynamic steps from the left container to the drop zone on the right in the correct Born-Haber cycle order
2. **Activity 2**: Select a compound from the dropdown menu and calculate the missing thermodynamic value using the provided data

## 📊 Compound Data Sets

The activity includes thermodynamic data for four different ionic compounds:

| Compound | Type | Key Learning Focus |
|----------|------|-------------------|
| **NaCl** (Sodium Chloride) | Simple 1:1 ionic compound | Basic lattice energy calculation |
| **MgO** (Magnesium Oxide) | 1:1 with higher charges (2+/2-) | Effect of charge on lattice energy |
| **CaF₂** (Calcium Fluoride) | 1:2 compound | Multi-ion calculations |
| **Al₂O₃** (Aluminum Oxide) | 2:3 complex compound | Advanced stoichiometry |

## 🎓 Educational Integration

### Recommended Usage
- **Pre-lab Activity**: Before laboratory experiments involving ionic compounds
- **Lecture Supplement**: Interactive demonstration during thermodynamics lessons  
- **Homework Assignment**: Self-paced practice for students
- **Assessment Tool**: Formative assessment of student understanding

### Learning Outcomes
Students who complete this activity will be able to:
- Identify and sequence the steps in a Born-Haber cycle
- Apply Hess's Law to calculate unknown thermodynamic quantities
- Understand the relationship between ionic compound properties and lattice energy
- Interpret thermodynamic data in the context of ionic bonding

## 🔧 Customization

### Adding New Compounds
To add additional compounds, modify the `compoundData` object in `script.js`:

```javascript
const compoundData = {
    newcompound: {
        name: "Compound Name",
        description: "Educational description",
        values: {
            formation: -xxx,
            vaporization: xxx,
            dissociation: xxx,
            ionization: xxx,
            affinity: -xxx,
            lattice: -xxx
        },
        missing: "lattice" // The value students will calculate
    }
};
```

### Styling Modifications
- Colors and themes can be adjusted in `style.css`
- The primary color scheme uses `#0077cc` (blue) which can be easily changed
- Responsive breakpoints are included for mobile optimization

## 🐛 Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ⚠️ Internet Explorer not supported (uses modern ES6+ features)

## 📝 License

This educational resource is provided under the MIT License. Feel free to use, modify, and distribute for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please consider:
- Adding more compound examples
- Improving accessibility features
- Enhancing mobile responsiveness
- Adding multi-language support
- Creating additional thermodynamic activities

## 📧 Contact

For questions, suggestions, or educational collaboration opportunities, please open an issue on this repository.

---

**Keywords**: Chemistry Education, Born-Haber Cycle, Thermodynamics, Interactive Learning, Lattice Energy, Hess's Law, Educational Technology, Web-based Learning