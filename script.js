document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById("test-form");
    const results = document.getElementById("results");
    const submitButton = document.getElementById("submit-button");
    const testDropdown = document.getElementById("test-dropdown");
    const authorDropdown = document.getElementById("author-dropdown");
    const testSelector = document.getElementById("test-selector");
    const authorSelector = document.getElementById("author-selector");
    const moduleDropdown = document.getElementById("module-dropdown"); 
    const moduleSelector = document.getElementById("module-selector"); 

    // Botones Menu Principal y Repetir
    const menuPrincipalButton = document.getElementById("menu-principal-button");
    const repetirButton = document.getElementById("repetir-button");

    let currentQuestionIndex = 0;
    let questions = [];
    let answers = {};
    let selectedTest = "";
    let selectedAuthor = "";
    let selectedModule = ""; 

    // Inicialmente, muestra el selector de autor
    authorSelector.style.display = "block";

    // Función para cargar la lista de autores
    function loadAuthors() {
        fetch("./tests/authors.json")
            .then(response => response.json())
            .then(authors => {
                authorDropdown.innerHTML = ""; 

                const defaultOption = document.createElement("option");
                defaultOption.value = "seleccionar";
                defaultOption.text = "Selecciona un autor";
                defaultOption.selected = true; 
                authorDropdown.appendChild(defaultOption);

                authors.forEach(author => {
                    const option = document.createElement("option");
                    option.value = author;
                    option.text = author;
                    authorDropdown.appendChild(option);
                });
            });
    }

    // Función para cargar la lista de módulos para el autor seleccionado
    function loadModules(author) {
        fetch(`./tests/${author}/modules.json`)
            .then(response => response.json())
            .then(modules => {
                moduleDropdown.innerHTML = ""; 

                const defaultOption = document.createElement("option");
                defaultOption.value = "seleccionar";
                defaultOption.text = "Selecciona un módulo";
                defaultOption.selected = true; 
                moduleDropdown.appendChild(defaultOption);

                modules.forEach(module => {
                    const option = document.createElement("option");
                    option.value = module;
                    option.text = module;
                    moduleDropdown.appendChild(option);
                });
            });
    }

    // Función para cargar la lista de tests para el autor y módulo seleccionados
    function loadTests(author, module) {
        fetch(`./tests/${author}/${module}/tests.json`)
            .then(response => response.json())
            .then(tests => {
                testDropdown.innerHTML = ""; 

                const defaultOption = document.createElement("option");
                defaultOption.value = "seleccionar";
                defaultOption.text = "Selecciona un test";
                defaultOption.selected = true; 
                testDropdown.appendChild(defaultOption);

                tests.forEach(test => {
                    const option = document.createElement("option");
                    option.value = test;
                    option.text = test;
                    testDropdown.appendChild(option);
                });
            });
    }

    // Evento para cambiar el autor
    authorDropdown.addEventListener("change", function () {
        selectedAuthor = this.value;
        console.log("Autor seleccionado:", selectedAuthor);

        if (selectedAuthor === "seleccionar") {
            window.location.href = "/main.html";
            return;
        }

        moduleSelector.style.display = "block";
        moduleSelector.style.marginTop = "20px"; 
        loadModules(selectedAuthor);

        authorSelector.style.marginTop = "20px"; 
    });

    // Evento para cambiar el módulo
    moduleDropdown.addEventListener("change", function () {
        selectedModule = this.value;
        console.log("Módulo seleccionado:", selectedModule);

        if (selectedModule === "seleccionar") {
            window.location.href = `/main.html?author=${selectedAuthor}`; 
            return; 
        }

        testSelector.style.display = "block";
        testSelector.style.marginTop = "20px"; 
        loadTests(selectedAuthor, selectedModule);

        moduleSelector.style.marginTop = "20px"; 
    });

    // Evento para cambiar el test
    testDropdown.addEventListener("change", function () {
        selectedTest = this.value; 
        console.log("Test seleccionado:", selectedTest);

        if (selectedTest === "seleccionar") {
            window.location.href = `/main.html?author=${selectedAuthor}&module=${selectedModule}`; 
            return; 
        }

        testSelector.style.display = "none";
        authorSelector.style.display = "none";
        moduleSelector.style.display = "none";
        form.style.display = "block";
        submitButton.style.display = "block";

        fetch(`./tests/${selectedAuthor}/${selectedModule}/${selectedTest}.json`)
            .then(response => response.json())
            .then(loadedQuestions => {
                questions = loadedQuestions;
                currentQuestionIndex = 0;
                answers = {}; 
                if (questions.length > 0) {
            showQuestion();
        }
    });
});

    // Función para mostrar la pregunta actual
    function showQuestion() {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];

            if (question && question.tipo) {
                let questionElement = createQuestionElement(question);
                form.appendChild(questionElement);
            } else {
                alert("Error: La pregunta no tiene el tipo definido.");
            }
        } else {
            showResults();
        }

        authorSelector.style.display = "none";
        moduleSelector.style.display = "none";
    }

    // Función para crear un elemento de pregunta
    function createQuestionElement(question) {
        let questionElement;
        if (question.tipo === "radio") {
            questionElement = createRadioQuestion(question);
        } else if (question.tipo === "checkbox") {
            questionElement = createCheckboxQuestion(question);
        } else if (question.tipo === "text") {
            questionElement = createTextQuestion(question);
        }
        
        const questionContainer = document.createElement("div");
        questionContainer.style.display = "flex"; 
        questionContainer.style.flexDirection = "column"; 

        questionContainer.appendChild(questionElement); 
        return questionContainer;
    }

    // Función para crear una pregunta de tipo radio
    function createRadioQuestion(question) {
        const label = document.createElement("label");
        label.htmlFor = question.pregunta;
        label.textContent = question.pregunta;

        const optionsContainer = document.createElement("div"); 
        optionsContainer.style.display = "flex";
        optionsContainer.style.flexDirection = "column";

        question.opciones.forEach(opcion => {
            const optionElement = document.createElement("label");
            const optionInput = document.createElement("input");
            optionInput.type = "radio";
            optionInput.name = question.pregunta;
            optionInput.value = opcion;
            optionElement.appendChild(optionInput);
            optionElement.appendChild(document.createTextNode(opcion));
            optionsContainer.appendChild(optionElement); 
        });

        label.appendChild(optionsContainer); 

        return label;
    }

    // Función para crear una pregunta de tipo checkbox
    function createCheckboxQuestion(question) {
        const label = document.createElement("label");
        label.htmlFor = question.pregunta;
        label.textContent = question.pregunta;

        const optionsContainer = document.createElement("div"); 
        optionsContainer.style.display = "flex";
        optionsContainer.style.flexDirection = "column";

        question.opciones.forEach(opcion => {
            const optionElement = document.createElement("label");
            const optionInput = document.createElement("input");
            optionInput.type = "checkbox";
            optionInput.name = question.pregunta;
            optionInput.value = opcion;
            optionElement.appendChild(optionInput);
            optionElement.appendChild(document.createTextNode(opcion));
            optionsContainer.appendChild(optionElement); 
        });

        label.appendChild(optionsContainer); 

        return label;
    }

    // Función para crear una pregunta de tipo texto
    function createTextQuestion(question) {
        const label = document.createElement("label");
        label.htmlFor = question.pregunta;
        label.textContent = question.pregunta;

        const input = document.createElement("input");
        input.type = "text";
        input.name = question.pregunta;
        input.id = question.pregunta;

        label.appendChild(input);

        return label;
    }

    // Función para procesar las respuestas y mostrar los resultados
    function showResults() {
        // Limpia el contenido anterior del contenedor de resultados
        results.innerHTML = "";

        // Crea un contenedor para los botones
        const buttonsContainer = document.createElement("div");
        buttonsContainer.style.display = "flex";
        buttonsContainer.style.justifyContent = "center";
        buttonsContainer.appendChild(menuPrincipalButton);
        buttonsContainer.appendChild(repetirButton);

        // Agrega el encabezado de los resultados
        const resultsHeader = document.createElement("h1");
        resultsHeader.textContent = "Resultados";

        // Crea un contenedor para los resultados
        const resultsContainer = document.createElement("div");
        resultsContainer.style.display = "flex"; 
        resultsContainer.style.flexDirection = "column"; 

        // Itera sobre las respuestas y agrega cada una como un párrafo
        for (const question in answers) {
            const resultElement = document.createElement("p");
            resultElement.textContent = `${question}: ${answers[question]}`;
            resultsContainer.appendChild(resultElement);
    }

        // Agrega los botones, el encabezado y los resultados al contenedor de resultados
        results.appendChild(buttonsContainer);
        results.appendChild(resultsHeader);
        results.appendChild(resultsContainer);

        // Oculta el botón "Enviar" y los selectores de autor, módulo y test
        submitButton.style.display = "none";
        //testSelector.style.display = "block"; // <--- Se elimina esta línea
        form.style.display = "none";

        // Selecciona el test actual en el menú desplegable
        //testDropdown.value = selectedTest; // <--- Se elimina esta línea

        // Muestra el selector de autor
        authorSelector.style.display = "block";
        // Selecciona el autor actual en el menú desplegable
        authorSelector.value = selectedAuthor;

        // Muestra el selector de módulo
        moduleSelector.style.display = "block";
        // Selecciona el módulo actual en el menú desplegable
        moduleDropdown.value = selectedModule;

        // Define los márgenes de los selectores de autor y módulo
        authorSelector.style.marginTop = "20px";
        moduleSelector.style.marginTop = "40px";

        // Muestra los botones "Menu Principal" y "Repetir"
        menuPrincipalButton.style.display = "block";
        repetirButton.style.display = "block";
    }

    // Añade un evento al botón de envío para procesar las respuestas
    submitButton.addEventListener("click", function (event) {
        event.preventDefault();

        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            let answer;
            if (question.tipo === "radio") {
                answer = document.querySelector(`input[name="${question.pregunta}"]:checked`).value;
            } else if (question.tipo === "checkbox") {
                answer = Array.from(document.querySelectorAll(`input[name="${question.pregunta}"]:checked`)).map(input => input.value);
            } else if (question.tipo === "text") {
                answer = document.querySelector(`input[name="${question.pregunta}"`).value; 
            }

            answers[question.pregunta] = answer;
            currentQuestionIndex++;
            form.innerHTML = "";
            showQuestion();
        } else {
            showResults();
        }
    });

    // Añade eventos a los botones "Menu Principal" y "Repetir"
    menuPrincipalButton.addEventListener("click", function () {
        window.location.href = "/main.html";
    });

    repetirButton.addEventListener("click", function () {
        // Oculta los botones "Menu Principal" y "Repetir"
        menuPrincipalButton.style.display = "none";
        repetirButton.style.display = "none";

        // Reinicia el índice de la pregunta actual
        currentQuestionIndex = 0;

        // Reinicia el formulario
        form.innerHTML = "";

        // Carga las preguntas del test seleccionado
        fetch(`./tests/${selectedAuthor}/${selectedModule}/${selectedTest}.json`)
            .then(response => response.json())
            .then(loadedQuestions => {
                questions = loadedQuestions;
                answers = {}; // Reiniciar las respuestas
                // Mostrar la primera pregunta si hay preguntas en el test
                if (questions.length > 0) {
                    showQuestion();
                }
            });

        // Muestra el botón "Enviar"
        submitButton.style.display = "block";

        // Oculta los selectores de autor, módulo y test
        authorSelector.style.display = "none";
        moduleSelector.style.display = "none";
        //testSelector.style.display = "none"; // <--- Se elimina esta línea

        // Muestra el contenedor del formulario
        form.style.display = "block";

        // Limpia el contenido del contenedor de resultados para que no se muestren los resultados anteriores
        results.innerHTML = ""; 
    });

    // Cargar la lista de autores al inicio
    loadAuthors();
});