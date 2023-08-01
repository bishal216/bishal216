function gravityDrop() {
    const leaf = document.getElementById('blossom-leaf');
    const overlayHeight = document.getElementById('overlay').clientHeight;
    const leafHeight = leaf.clientHeight;
    let velocity = 0;
  
    // Calculate the target position (bottom of the screen)
    let targetPosition = overlayHeight - leafHeight - 5;
    let currentPosition = 120;

    // Define the animation function
    function animateDrop() {
      // Calculate the current position
      var acceleration = 0.1; // Adjust this value as needed
  
      // Update the velocity and position
      velocity += acceleration;
      currentPosition += velocity;
  
      // Check if the box reached the target position
      if (currentPosition >= targetPosition) {
        leaf.remove();
      } else {
        leaf.style.top = currentPosition + 'px';
        // Continue the animation with requestAnimationFrame
        requestAnimationFrame(animateDrop);
      }
    }
  
    // Call the animation function to start the drop animation
    animateDrop();
  }
  