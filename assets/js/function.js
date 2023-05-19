 // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/rDP8JzbbS/";

    let model, webcam, labelContainer, maxPredictions,resultsContainer;
    const parentElement = document.getElementById('webcam-container');
    const parentWidth = parentElement.offsetWidth;
    const parentHeight = parentElement.offsetHeight;
    // Load the image model and setup the webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(parentWidth - 30, parentHeight - 30, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        resultsContainer = document.getElementById("results-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
    }

    async function loop() {
        webcam.update(); 
        await predict();
        window.requestAnimationFrame(loop);
    }

    // run the webcam image through the image model
    async function predict() {
        const prediction = await model.predict(webcam.canvas);
        labelContainer.innerHTML = '';
        
        let maxProbability = 0;
        let maxProbabilityIndex = 0;
        
        for (let i = 0; i < maxPredictions; i++) {
            const probability = prediction[i].probability.toFixed(2);
            
            if (probability > maxProbability) {
                maxProbability = probability;
                maxProbabilityIndex = i;
            }
        }
        
        const predictionResult = prediction[maxProbabilityIndex].probability.toFixed(2);
        
        const className = prediction[maxProbabilityIndex].className.replace(/\s/g, '-');
        const predictionElement = document.createElement('div');
        predictionElement.classList.add(className);
        predictionElement.innerHTML = "<h2>" + prediction[maxProbabilityIndex].className + "</h2>";
        labelContainer.appendChild(predictionElement);
        resultsContainer.innerHTML = "<h3>" + predictionResult * 100 + "%</h3>";

    }

    const toggleButton = document.getElementById('show');
    const results = document.getElementById('results-container');
    
    toggleButton.addEventListener('click', function() {
        results.classList.toggle('show');
        if (results.classList.contains('show')) {
            toggleButton.textContent = 'Hide Probability results';
          } else {
            toggleButton.textContent = 'Show Probability results';
          }
    });
    