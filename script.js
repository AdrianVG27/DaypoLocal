document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById("test-form");
    const results = document.getElementById("results");
    const submitButton = document.getElementById("submit-button");
    const testDropdown = document.getElementById("test-dropdown");
    const testSelector = document.getElementById("test-selector"); // Agrega el selector

    let currentQuestionIndex = 0;
    let questions = [];
    let answers = {};
    let selectedTest = ""; // Variable para almacenar el test seleccionado

    // Inicializa el selector de tests
    // (Ya no es necesario actualizar las opciones del selector)
    // Añade un evento al menú desplegable para cargar el test seleccionado
    testDropdown.addEventListener("change", function () {
        selectedTest = this.value; // Almacena el test seleccionado
        console.log("Test seleccionado:", selectedTest); // Verifica el test seleccionado aquí

        // Verifica si el usuario seleccionó la opción "seleccionar"
        if (selectedTest === "seleccionar") {
            // Redirige a la página principal
            window.location.href = "/main.html"; // Reemplaza "/" con la URL de tu página principal
        } else {
            // Limpia el contenido del formulario y los resultados
            form.innerHTML = "";

            // Oculta el selector de tests
            testSelector.style.display = "none"; 

            // Muestra el contenedor del formulario 
            form.style.display = "block"; 

            // Muestra el botón de envío
            submitButton.style.display = "block";

            // Carga las preguntas del test seleccionado
            fetch(`./tests/${selectedTest}.json`)
                .then(response => response.json())
                .then(loadedQuestions => {
                    questions = loadedQuestions;
                    currentQuestionIndex = 0;
                    answers = {}; // Reiniciar las respuestas
                    // Mostrar la primera pregunta si hay preguntas en el test
                    if (questions.length > 0) {
                        showQuestion();
                    }
                });
        }
    });

    // Función para mostrar la pregunta actual
    function showQuestion() {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];

            // Verifica si la propiedad 'tipo' existe antes de usarla
            if (question && question.tipo) {
                // Crea el elemento de pregunta
                let questionElement = createQuestionElement(question);
                // Añade la pregunta al formulario
                form.appendChild(questionElement);
            } else {
                // Mostrar un mensaje de error
                alert("Error: La pregunta no tiene el tipo definido.");
            }
        } else {
            // Todas las preguntas han sido respondidas
            // Muestra los resultados aquí
            showResults();
        }
    }

    // Función para crear un elemento de pregunta
    function createQuestionElement(question) {
        // Crea un elemento de pregunta según el tipo de respuesta
        let questionElement;
        if (question.tipo === "radio") {
            questionElement = createRadioQuestion(question);
        } else if (question.tipo === "checkbox") {
            questionElement = createCheckboxQuestion(question);
        } else if (question.tipo === "text") {
            questionElement = createTextQuestion(question);
        }
        // ... (Añade más tipos de pregunta si es necesario)

        return questionElement;
    }

    // Función para procesar las respuestas y mostrar los resultados
    function showResults() {
        results.innerHTML = "<h1>Resultados</h1>"; 
        for (const question in answers) {
            const resultElement = document.createElement("p");
            resultElement.textContent = `${question}: ${answers[question]}`; 
            results.appendChild(resultElement);
        }

        // Oculta el botón "Enviar" y muestra el selector de test
        submitButton.style.display = "none";
        testSelector.style.display = "block";

        // Oculta el contenedor del formulario
        form.style.display = "none";

        // Preselecciona el test que se acaba de realizar
        testDropdown.value = selectedTest;
    }

    // Añade un evento al botón de envío para procesar las respuestas
    submitButton.addEventListener("click", function (event) {
        event.preventDefault();

        // **Corrección**: Verifica que haya una pregunta antes de obtener la respuesta
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            let answer;
            if (question.tipo === "radio") {
                answer = document.querySelector(`input[name="${question.pregunta}"]:checked`).value;
            } else if (question.tipo === "checkbox") {
                answer = Array.from(document.querySelectorAll(`input[name="${question.pregunta}"]:checked`)).map(input => input.value);
            } else if (question.tipo === "text") {
                answer = document.querySelector(`input[name="${question.pregunta}"`).value; // Corrección: faltaba cerrar el selector
            }

            // Guarda la respuesta en el objeto `answers`
            answers[question.pregunta] = answer; // Corrección: asigna el valor correctamente
            // Avanza al siguiente índice de pregunta
            currentQuestionIndex++;
            // Limpia el formulario
            form.innerHTML = "";

            // Muestra la siguiente pregunta
            showQuestion();
        } else {
            // Mostrar resultados si todas las preguntas han sido respondidas
            showResults();
        }
    });

    // Función para crear una pregunta de tipo radio
    function createRadioQuestion(question) {
        const label = document.createElement("label");
        label.htmlFor = question.pregunta;
        label.textContent = question.pregunta;

        question.opciones.forEach(opcion => {
            const optionElement = document.createElement("label");
            const optionInput = document.createElement("input");
            optionInput.type = "radio";
            optionInput.name = question.pregunta;
            optionInput.value = opcion;
            optionElement.appendChild(optionInput);
            optionElement.appendChild(document.createTextNode(opcion));
            label.appendChild(optionElement);
        });

        return label;
    }

    // Función para crear una pregunta de tipo checkbox
    function createCheckboxQuestion(question) {
        const label = document.createElement("label");
        label.htmlFor = question.pregunta;
        label.textContent = question.pregunta;

        question.opciones.forEach(opcion => {
            const optionElement = document.createElement("label");
            const optionInput = document.createElement("input");
            optionInput.type = "checkbox";
            optionInput.name = question.pregunta;
            optionInput.value = opcion;
            optionElement.appendChild(optionInput);
            optionElement.appendChild(document.createTextNode(opcion));
            label.appendChild(optionElement);
        });

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
});