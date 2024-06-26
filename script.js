document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('mainContent');
    const converterContent = document.getElementById('converterContent');
    const homeLink = document.getElementById('homeLink');
    const aboutLink = document.getElementById('aboutLink');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const caseSelect = document.getElementById('caseSelect');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const caseDescription = document.getElementById('caseDescription');

    // Wrap text areas with line numbers
    const inputLineNumbers = wrapTextAreaWithLineNumbers(inputText);
    const outputLineNumbers = wrapTextAreaWithLineNumbers(outputText);

    function wrapTextAreaWithLineNumbers(textArea) {
        const wrapper = document.createElement('div');
        wrapper.className = 'textarea-wrapper';
        textArea.parentNode.insertBefore(wrapper, textArea);
        wrapper.appendChild(textArea);

        const lineNumbers = document.createElement('div');
        lineNumbers.className = 'line-numbers';
        wrapper.insertBefore(lineNumbers, textArea);

        return lineNumbers;
    }

    function updateLineNumbers(textArea, lineNumbersElement) {
        const lines = textArea.value.split('\n');
        const lineCount = lines.length;
        let lineNumbersHTML = '';
        for (let i = 1; i <= lineCount; i++) {
            lineNumbersHTML += i + '<br>';
        }
        lineNumbersElement.innerHTML = lineNumbersHTML;
    }

    // Dark mode toggle
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        updateDarkModeIcon();
    }

    function updateDarkModeIcon() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        darkModeToggle.innerHTML = isDarkMode 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    }

    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Initialize dark mode from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', savedDarkMode);
    updateDarkModeIcon();

    // Case descriptions
    const caseDescriptions = {
        lower: {
            title: "lowercase",
            description: "Converts all letters to lowercase.",
            example: "this is lowercase."
        },
        upper: {
            title: "UPPERCASE",
            description: "Converts all letters to uppercase.",
            example: "THIS IS UPPERCASE."
        },
        title: {
            title: "Title Case",
            description: "Capitalizes the first letter of each word.",
            example: "This Is Title Case"
        },
        sentence: {
            title: "Sentence case",
            description: "Capitalizes the first letter of the sentence.",
            example: "This is sentence case."
        },
        camel: {
            title: "camelCase",
            description: "Removes spaces and capitalizes the first letter of each word except the first one.",
            example: "thisIsCamelCase"
        },
        pascal: {
            title: "PascalCase",
            description: "Removes spaces and capitalizes the first letter of each word.",
            example: "ThisIsPascalCase"
        },
        snake: {
            title: "snake_case",
            description: "Replaces spaces with underscores and converts all letters to lowercase.",
            example: "this_is_snake_case"
        },
        kebab: {
            title: "kebab-case",
            description: "Replaces spaces with hyphens and converts all letters to lowercase.",
            example: "this-is-kebab-case"
        },
        constant: {
            title: "CONSTANT_CASE",
            description: "Replaces spaces with underscores and converts all letters to uppercase.",
            example: "THIS_IS_CONSTANT_CASE"
        },
        dot: {
            title: "dot.case",
            description: "Replaces spaces with dots and converts all letters to lowercase.",
            example: "this.is.dot.case"
        },
        path: {
            title: "path/case",
            description: "Replaces spaces with forward slashes and converts all letters to lowercase.",
            example: "this/is/path/case"
        },
        train: {
            title: "Train-Case",
            description: "Capitalizes the first letter of each word and separates words with hyphens.",
            example: "This-Is-Train-Case"
        },
        alternating: {
            title: "aLtErNaTiNg CaSe",
            description: "Alternates between lowercase and uppercase for each character.",
            example: "aLtErNaTiNg CaSe"
        },
        inverse: {
            title: "InVeRsE cAsE",
            description: "Inverts the case of each character.",
            example: "iNVERSE cASE"
        },
        sarcasm: {
            title: "SaRcAsM cAsE",
            description: "Alternates between uppercase and lowercase, starting with uppercase.",
            example: "SaRcAsM cAsE"
        },
        studly: {
            title: "StUdLy CaPs",
            description: "Randomly alternates between uppercase and lowercase for each character.",
            example: "sTuDlY cApS"
        }
    };

    // Core conversion function
    function convertCase(text, targetCase) {
        const lines = text.split('\n');
        return lines.map(line => {
            // Preserve empty lines and code blocks
            if (line.trim() === '' || /^\s+/.test(line)) return line;

            // Handle list items
            const listMatch = line.match(/^(\s*)([*•-]|\d+\.)\s+(.*)/);
            if (listMatch) {
                const [, indent, marker, content] = listMatch;
                return `${indent}${marker} ${convertSingleLine(content, targetCase)}`;
            }

            // Convert regular lines
            return convertSingleLine(line, targetCase);
        }).join('\n');
    }

    function convertSingleLine(text, targetCase) {
        const specialRegex = /(https?:\/\/\S+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|`[^`\n]+`|\*[^*\n]+\*)/g;
        const parts = text.split(specialRegex);
        
        for (let i = 0; i < parts.length; i += 2) {
            parts[i] = applyCase(parts[i], targetCase);
        }

        return parts.join('');
    }

    function applyCase(text, targetCase) {
        switch (targetCase) {
            case 'lower': return text.toLowerCase();
            case 'upper': return text.toUpperCase();
            case 'title': return text.replace(/\S+/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
            case 'sentence': return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
            case 'camel': return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => i === 0 ? w.toLowerCase() : w.toUpperCase()).replace(/\s+/g, '');
            case 'pascal': return text.replace(/(?:^\w|[A-Z]|\b\w)/g, w => w.toUpperCase()).replace(/\s+/g, '');
            case 'snake': return text.replace(/\W+/g, ' ').trim().toLowerCase().replace(/\s+/g, '_');
            case 'kebab': return text.replace(/\W+/g, ' ').trim().toLowerCase().replace(/\s+/g, '-');
            case 'constant': return text.replace(/\W+/g, ' ').trim().toUpperCase().replace(/\s+/g, '_');
            case 'dot': return text.replace(/\W+/g, ' ').trim().toLowerCase().replace(/\s+/g, '.');
            case 'path': return text.replace(/\W+/g, ' ').trim().toLowerCase().replace(/\s+/g, '/');
            case 'train': return text.replace(/\w+/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).replace(/\s+/g, '-');
            case 'alternating': return text.split('').map((c, i) => i % 2 ? c.toUpperCase() : c.toLowerCase()).join('');
            case 'inverse': return text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
            case 'sarcasm': return text.split('').map((c, i) => i % 2 ? c.toLowerCase() : c.toUpperCase()).join('');
            case 'studly': return text.split('').map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join('');
            default: return text;
        }
    }

    // Update output and stats
    function updateOutput() {
        const text = inputText.value;
        const selectedCase = caseSelect.value;
        outputText.value = convertCase(text, selectedCase);
        updateTextStats(text);
        updateCaseDescription(selectedCase);
        updateLineNumbers(inputText, inputLineNumbers);
        updateLineNumbers(outputText, outputLineNumbers);
    }

    function updateTextStats(text) {
        document.getElementById('wordCount').textContent = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        document.getElementById('charCount').textContent = text.length;
        document.getElementById('sentenceCount').textContent = (text.match(/[.!?]+/g) || []).length;
        document.getElementById('lineCount').textContent = text.split('\n').filter(line => line.trim().length > 0).length;
        document.getElementById('paragraphCount').textContent = text.split(/\n\s*\n/).filter(para => para.trim().length > 0).length;
    }

    function updateCaseDescription(selectedCase) {
        const description = caseDescriptions[selectedCase];
        caseDescription.innerHTML = `
            <h4>${description.title}</h4>
            <p>${description.description}</p>
            <p><em>Example: ${description.example}</em></p>
        `;
    }

    // Event listeners
    inputText.addEventListener('input', updateOutput);
    caseSelect.addEventListener('change', updateOutput);

    inputText.addEventListener('scroll', () => {
        inputLineNumbers.scrollTop = inputText.scrollTop;
    });
    outputText.addEventListener('scroll', () => {
        outputLineNumbers.scrollTop = outputText.scrollTop;
    });

    copyBtn.addEventListener('click', () => {
        outputText.select();
        document.execCommand('copy');
        alert('Text copied to clipboard!');
    });

    downloadBtn.addEventListener('click', () => {
        const blob = new Blob([outputText.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted_text.txt';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Navigation
    function showHomePage() {
        mainContent.innerHTML = converterContent.innerHTML;
        initializeConverter();
    }

    function showAboutPage() {
        mainContent.innerHTML = `
            <h1>About Caseify</h1>
            <p>Caseify is a powerful text case converter that allows you to easily transform your text into various case formats. Whether you need to convert text to uppercase, lowercase, title case, or more specialized formats like camelCase or snake_case, Caseify has you covered.</p>
            <p>Our tool is designed with simplicity and efficiency in mind, making it perfect for writers, developers, and anyone who works with text regularly. Caseify runs entirely in your browser, ensuring your text remains private and secure.</p>
            <h2>Features:</h2>
            <ul>
                <li>Multiple case conversion options</li>
                <li>Preserves URLs, email addresses, and special formatting</li>
                <li>Instant conversion as you type</li>
                <li>Copy and download functionality</li>
                <li>Dark mode for comfortable viewing</li>
                <li>Line numbering for easy reference</li>
            </ul>
            <p>We're constantly working to improve Caseify and add new features. If you have any suggestions or feedback, please don't hesitate to contact us.</p>
        `;
    }

    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showHomePage();
    });

    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAboutPage();
    });

    // Initialize
    function initializeConverter() {
        updateOutput();
    }

    initializeConverter();
});
