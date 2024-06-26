document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('mainContent');
    const converterContent = document.getElementById('converterContent');
    const homeLink = document.getElementById('homeLink');
    const aboutLink = document.getElementById('aboutLink');
    const contactLink = document.getElementById('contactLink');
    const darkModeToggle = document.getElementById('darkModeToggle');

    document.addEventListener('keydown', function(event) {
        // Ctrl+C or Cmd+C to copy
        if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
            event.preventDefault();
            document.getElementById('copyBtn').click();
        }
        // Ctrl+S or Cmd+S to download
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            document.getElementById('downloadBtn').click();
        }
    });

    const caseDescriptions = {
        sentence: {
            title: "Sentence case",
            description: "Capitalizes the first letter of each sentence.",
            example: "This is a sentence. This is another sentence."
        },
        lower: {
            title: "Lowercase",
            description: "Converts all letters to lowercase.",
            example: "all letters are lowercase."
        },
        upper: {
            title: "Uppercase",
            description: "Converts all letters to uppercase.",
            example: "ALL LETTERS ARE UPPERCASE."
        },
        capitalized: {
            title: "Capitalized Case",
            description: "Capitalizes the first letter of each word.",
            example: "Every Word Starts With A Capital Letter"
        },
        title: {
            title: "Title Case",
            description: "Capitalizes the first letter of each word, except for certain small words.",
            example: "This Is a Title Case Example"
        },
        alternating: {
            title: "Alternating Case",
            description: "Alternates between lowercase and uppercase for each character.",
            example: "aLtErNaTiNg CaSe ExAmPlE"
        },
        inverse: {
            title: "Inverse Case",
            description: "Inverts the case of each character.",
            example: "iNVERSE cASE eXAMPLE"
        }
    };

    // Function to toggle dark mode
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        
        // Update the icon
        const sunIcon = darkModeToggle.querySelector('.fa-sun');
        const moonIcon = darkModeToggle.querySelector('.fa-moon');
        
        if (isDarkMode) {
            sunIcon.style.opacity = '0';
            moonIcon.style.opacity = '1';
        } else {
            sunIcon.style.opacity = '1';
            moonIcon.style.opacity = '0';
        }
    }

    // Event listener for dark mode toggle
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Check for saved dark mode preference, default to light mode if not set
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    // Set initial icon state
    const sunIcon = darkModeToggle.querySelector('.fa-sun');
    const moonIcon = darkModeToggle.querySelector('.fa-moon');
    if (document.body.classList.contains('dark-mode')) {
        sunIcon.style.opacity = '0';
        moonIcon.style.opacity = '1';
    } else {
        sunIcon.style.opacity = '1';
        moonIcon.style.opacity = '0';
    }

    function initializeConverter() {
        const inputText = document.getElementById('inputText');
        const outputText = document.getElementById('outputText');
        const caseSelect = document.getElementById('caseSelect');
        const wordCount = document.getElementById('wordCount');
        const charCount = document.getElementById('charCount');
        const sentenceCount = document.getElementById('sentenceCount');
        const lineCount = document.getElementById('lineCount');
        const copyBtn = document.getElementById('copyBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const caseDescription = document.getElementById('caseDescription');

        function updateTextStats(text) {
            // Word count: Split by whitespace, filter out empty strings
            const words = text.trim().split(/\s+/).filter(word => word.length > 0);
            document.getElementById('wordCount').textContent = words.length;
        
            // Character count (including whitespace)
            document.getElementById('charCount').textContent = text.length;
        
            // Sentence count: Match sentence-ending punctuation, but handle edge cases
            const sentences = text.match(/[.!?]+(?=\s+|$)/g) || [];
            document.getElementById('sentenceCount').textContent = sentences.length;
        
            // Line count: Split by newline, filter out empty lines
            const lines = text.split('\n').filter(line => line.trim().length > 0);
            document.getElementById('lineCount').textContent = lines.length;
        
            // Paragraph count: Split by multiple newlines
            const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0);
            document.getElementById('paragraphCount').textContent = paragraphs.length;
        
            // Read time: Assuming 200 words per minute
            const readTimeMinutes = Math.ceil(words.length / 200);
            document.getElementById('readTime').textContent = `${readTimeMinutes} min`;
        }

        function convertCase(text, selectedCase) {
            switch (selectedCase) {
                case 'sentence':
                    return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
                case 'lower':
                    return text.toLowerCase();
                case 'upper':
                    return text.toUpperCase();
                case 'capitalized':
                    return text.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
                case 'title':
                    return text.toLowerCase().replace(/\b\w+/g, function(word) {
                        const lowercaseWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'in', 'of'];
                        return lowercaseWords.includes(word) ? word : word.charAt(0).toUpperCase() + word.slice(1);
                    });
                case 'alternating':
                    return text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
                case 'inverse':
                    return text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
                default:
                    return text;
            }
        }

        function updateOutput() {
            const text = inputText.value;
            const selectedCase = caseSelect.value;
            outputText.value = convertCase(text, selectedCase);
            updateTextStats(text);
            updateCaseDescription(selectedCase);
        }

        function updateCaseDescription(selectedCase) {
            const description = caseDescriptions[selectedCase];
            caseDescription.innerHTML = `
                <h4>${description.title}</h4>
                <p>${description.description}</p>
                <p><em>Example: ${description.example}</em></p>
            `;
        }

        inputText.addEventListener('input', updateOutput);
        caseSelect.addEventListener('change', updateOutput);

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
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        updateOutput();
    }

    function showHomePage() {
        mainContent.innerHTML = converterContent.innerHTML;
        initializeConverter();
    }

    function showAboutPage() {
        mainContent.innerHTML = `
            <h1>About Caseify</h1>
            <section id="about" class="blurb">
    
    <h3>🎯 Our Mission</h3>
    <p>At Caseify, we believe in empowering users with simple, effective tools that respect their privacy. Our mission is to provide a seamless text transformation experience without compromising your data security.</p>

    <h3>💡 The Caseify Difference</h3>
    <ul>
        <li>Built with pure JavaScript for lightning-fast performance</li>
        <li>No external dependencies or API calls - everything happens in your browser</li>
        <li>Designed with accessibility in mind - usable by everyone</li>
        <li>Regularly updated with new features based on user feedback</li>
    </ul>

    <h3>👥 Who We Are</h3>
    <p>Caseify was created by a team of passionate developers who believe in the power of open-source software and the importance of online privacy. We're committed to maintaining and improving Caseify as a free tool for the global community.</p>

    <h3>🌱 Our Commitment</h3>
    <p>We're dedicated to keeping Caseify:</p>
    <ul>
        <li>Free for everyone, always</li>
        <li>Ad-free and tracker-free</li>
        <li>Open to suggestions and improvements from our users</li>
    </ul>

    <p>Join us in our mission to make text transformation easy, fun, and secure for everyone!</p>
</section>
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

    // Initialize the converter on page load
    initializeConverter();
});
