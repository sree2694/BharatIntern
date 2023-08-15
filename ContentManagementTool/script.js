const elements = document.querySelectorAll('.element');
    const workspace = document.getElementById('workspace');
    const textEditor = document.getElementById('textEditor');
    const imageElement = document.getElementById('imageElement');
    const imageUploadInput = imageElement.querySelector('.image-upload');
    const videoElement = document.getElementById('videoElement');
    const videoUploadInput = videoElement.querySelector('.video-upload');
    
    videoUploadInput.addEventListener('change', handleVideoUpload);
    imageUploadInput.addEventListener('change', handleImageUpload);

    function handleVideoUpload(event) {
      const file = event.target.files[0];
      
      if (file && file.type.includes('video')) {
        const videoElement = document.createElement('video');
        videoElement.src = URL.createObjectURL(file);
        videoElement.controls = true;
        videoElement.className = 'resizable-video'; // Add this line
        textEditor.appendChild(videoElement);
      }
    }

    function f1() {
      //function to make the text bold using DOM method
      document.getElementById("textarea1").style.fontWeight = "bold";
  }
    
  function f2() {
      //function to make the text italic using DOM method
      document.getElementById("textarea1").style.fontStyle = "italic";
  }
    
  function f3() {
      //function to make the text alignment left using DOM method
      document.getElementById("textarea1").style.textAlign = "left";
  }
    
  function f4() {
      //function to make the text alignment center using DOM method
      document.getElementById("textarea1").style.textAlign = "center";
  }
    
  function f5() {
      //function to make the text alignment right using DOM method
      document.getElementById("textarea1").style.textAlign = "right";
  }
    
  function f6() {
      //function to make the text in Uppercase using DOM method
      document.getElementById("textarea1").style.textTransform = "uppercase";
  }
    
  function f7() {
      //function to make the text in Lowercase using DOM method
      document.getElementById("textarea1").style.textTransform = "lowercase";
  }
    
  function f8() {
      //function to make the text capitalize using DOM method
      document.getElementById("textarea1").style.textTransform = "capitalize";
  }
    
  function f9() {
      //function to make the text back to normal by removing all the methods applied 
      //using DOM method
      document.getElementById("textarea1").style.fontWeight = "normal";
      document.getElementById("textarea1").style.textAlign = "left";
      document.getElementById("textarea1").style.fontStyle = "normal";
      document.getElementById("textarea1").style.textTransform = "capitalize";
      document.getElementById("textarea1").value = " ";
  }

function handleImageUpload(event) {
  const file = event.target.files[0];
  // Inside the 'handleImageUpload' function
if (file && file.type.includes('image')) {
  const imageElement = document.createElement('img');
  imageElement.src = URL.createObjectURL(file);
  imageElement.className = 'resizable-image'; // Add this line
  workspace.appendChild(imageElement);

  // Enable resizing using interact.js
  interact(imageElement)
    .resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      preserveAspectRatio: true, // Maintain aspect ratio while resizing
    })
    .on('resizemove', function (event) {
      const target = event.target;
      const x = parseFloat(target.getAttribute('data-x')) || 0;
      const y = parseFloat(target.getAttribute('data-y')) || 0;

      target.style.width = event.rect.width + 'px';
      target.style.height = event.rect.height + 'px';

      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    });
}

}

    elements.forEach(element => {
      element.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', element.textContent);
      });
    });

    workspace.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    workspace.addEventListener('drop', (e) => {
      e.preventDefault();
      const data = e.dataTransfer.getData('text/plain');
      const newElement = document.createElement('div');
      newElement.textContent = data;
      newElement.className = 'element';
      workspace.appendChild(newElement);
    });

    textEditor.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    textEditor.addEventListener('drop', (e) => {
      e.preventDefault();
      const droppedItem = e.dataTransfer.files[0];
      
      if (droppedItem.type.includes('image')) {
        const imageElement = document.createElement('img');
        imageElement.src = URL.createObjectURL(droppedItem);
        textEditor.appendChild(imageElement);
      } else if (droppedItem.type.includes('video')) {
        const videoElement = document.createElement('video');
        videoElement.src = URL.createObjectURL(droppedItem);
        videoElement.controls = true;
        textEditor.appendChild(videoElement);
      }
    });