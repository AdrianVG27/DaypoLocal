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
    const themeDropdown = document.getElementById("theme-dropdown");
    const themeSelector = document.getElementById("theme-selector");

    // Botones Menu Principal y Repetir
    const menuPrincipalButton = document.getElementById("menu-principal-button");
    const repetirButton = document.getElementById("repetir-button");

    let currentQuestionIndex = 0;
    let questions = [];
    let answers = {};
    let selectedTest = "";
    let selectedAuthor = "";
    let selectedModule = "";
    let selectedTheme = "";

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

    // Función para cargar la lista de temas para el autor y módulo seleccionados
    function loadThemes(author, module) {
        // Verifica si el archivo themes.json existe antes de intentar cargarlo
        fetch(`./tests/${author}/${module}/temas.json`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    // Si no existe, muestra un mensaje de error o redirige a otra página
                    console.error(`Error: No se encontró el archivo themes.json para ${author}/${module}`);
                    // Por ejemplo, redirige a main.html:
                    window.location.href = `/main.html?author=${author}&module=${module}`;
                    return Promise.reject('Themes not found');
                }
            })
            .then(themes => {
                themeDropdown.innerHTML = "";

                const defaultOption = document.createElement("option");
                defaultOption.value = "seleccionar";
                defaultOption.text = "Selecciona un tema";
                defaultOption.selected = true;
                themeDropdown.appendChild(defaultOption);

                themes.forEach(theme => {
                    const option = document.createElement("option");
                    option.value = theme;
                    option.text = theme;
                    themeDropdown.appendChild(option);
                });
            })
            .catch(error => {
                console.error("Error loading themes:", error);
            });
    }

    // Función para cargar la lista de tests para el autor, módulo y tema seleccionados
    function loadTests(author, module, theme) {
        fetch(`./tests/${author}/${module}/${theme}/tests.json`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error(`Error: No se encontró el archivo tests.json para ${author}/${module}/${theme}`);
                    return Promise.reject('Tests not found');
                }
            })
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
            })
            .catch(error => {
                console.error("Error loading tests:", error);
            });
    }

    // Evento para cambiar el autor
    authorDropdown.addEventListener("change", function () {
        selectedAuthor = this.value;
        console.log("Autor seleccionado:", selectedAuthor);

        if (selectedAuthor === "seleccionar") {
            // No se redirige a la selección de autor. Se mantiene en la selección de autor.
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
            // No se redirige a la selección de autor. Se mantiene en la selección de módulo.
            return;
        }
        themeSelector.style.display = "block";
        themeSelector.style.marginTop = "20px";
        loadThemes(selectedAuthor, selectedModule);

        moduleSelector.style.marginTop = "20px";
    });

    // Evento para cambiar el tema
    themeDropdown.addEventListener("change", function () {
        selectedTheme = this.value;
        console.log("Tema seleccionado:", selectedTheme);

        if (selectedTheme === "seleccionar") {
            // No se redirige a la selección de módulo. Se mantiene en la selección de tema.
            return;
        }
        testSelector.style.display = "block";
        testSelector.style.marginTop = "20px";
        loadTests(selectedAuthor, selectedModule, selectedTheme);

        themeSelector.style.marginTop = "20px";
    });

    // Evento para cambiar el test
    testDropdown.addEventListener("change", function () {
        selectedTest = this.value;
        console.log("Test seleccionado:", selectedTest);

        if (selectedTest === "seleccionar") {
            // No se redirige a la selección de tema. Se mantiene en la selección de test.
            return;
        }

        testSelector.style.display = "none";
        authorSelector.style.display = "none";
        moduleSelector.style.display = "none";
        themeSelector.style.display = "none";
        form.style.display = "block";
        submitButton.style.display = "block";

        fetch(`./tests/${selectedAuthor}/${selectedModule}/${selectedTheme}/${selectedTest}.json`)
            .then(response => response.json())
            .then(loadedQuestions => {
                questions = loadedQuestions;
                currentQuestionIndex = 0;
                answers = {};
                if (questions.length > 0) {
                    showQuestion();
                }
            })
            .catch(error => {
                console.error("Error loading tests:", error);
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
        themeSelector.style.display = "none";
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

        // Crea un contenedor para mostrar las preguntas y respuestas
        const questionResults = document.createElement("div");
        questionResults.style.display = "flex";
        questionResults.style.flexDirection = "column";

        // Itera sobre las preguntas y muestra si se respondieron correctamente o no
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            const userAnswer = answers[question.pregunta];

            // Compara la respuesta del usuario con la respuesta correcta
            let isCorrect = false;
            if (question.tipo === "radio" || question.tipo === "text") {
                isCorrect = userAnswer === question.respuesta;
            } else if (question.tipo === "checkbox") {
                isCorrect = Array.isArray(question.respuesta) && userAnswer.length === question.respuesta.length &&
                    userAnswer.every(answer => question.respuesta.includes(answer));
            }

            // Muestra la pregunta, la respuesta del usuario y la respuesta correcta
            const resultElement = document.createElement("p");
            resultElement.textContent = `${i + 1}. ${question.pregunta}: Tu respuesta: ${userAnswer} - Respuesta correcta: ${question.respuesta} - ${isCorrect ? '¡Correcto!' : 'Incorrecto'}`;
            questionResults.appendChild(resultElement);
        }

        // Agrega los resultados de las preguntas al contenedor de resultados
        resultsContainer.appendChild(questionResults);

        // Calcula el porcentaje de respuestas correctas
        let correctAnswers = 0;
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            const userAnswer = answers[question.pregunta];

            if (question.tipo === "radio" || question.tipo === "text") {
                if (userAnswer === question.respuesta) {
                    correctAnswers++;
                }
            } else if (question.tipo === "checkbox") {
                if (Array.isArray(question.respuesta) && userAnswer.length === question.respuesta.length &&
                    userAnswer.every(answer => question.respuesta.includes(answer))) {
                    correctAnswers++;
            }
            }
        }
        const percentage = Math.round((correctAnswers / questions.length) * 100);

        // Agrega el porcentaje de respuestas correctas a los resultados
        const resultElement = document.createElement("p");
        resultElement.textContent = `Porcentaje de respuestas correctas: ${percentage}%`;
        resultsContainer.appendChild(resultElement);

        // Agrega los botones, el encabezado y los resultados al contenedor de resultados
        results.appendChild(buttonsContainer);
        results.appendChild(resultsHeader);
        results.appendChild(resultsContainer);

        // Oculta el botón "Enviar" y los selectores de autor, módulo y test
        submitButton.style.display = "none";
        form.style.display = "none";

        // Muestra el selector de autor
        authorSelector.style.display = "block";
        // Selecciona el autor actual en el menú desplegable
        authorSelector.value = selectedAuthor;

        // Muestra el selector de módulo
        moduleSelector.style.display = "block";
        // Selecciona el módulo actual en el menú desplegable
        moduleDropdown.value = selectedModule;

        // Muestra el selector de tema
        themeSelector.style.display = "block";
        // Selecciona el tema actual en el menú desplegable
        themeDropdown.value = selectedTheme;

        // Define los márgenes de los selectores de autor y módulo
        authorSelector.style.marginTop = "20px";
        moduleSelector.style.marginTop = "40px";
        themeSelector.style.marginTop = "60px";

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
        fetch(`./tests/${selectedAuthor}/${selectedModule}/${selectedTheme}/${selectedTest}.json`)
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
        themeSelector.style.display = "none";

        // Muestra el contenedor del formulario
        form.style.display = "block";

        // Limpia el contenido del contenedor de resultados para que no se muestren los resultados anteriores
        results.innerHTML = "";
    });

    // Cargar la lista de autores al inicio
    loadAuthors();
});
