/**
 * Main JavaScript file for client-side functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Handle flash message dismissal
  const flashMessages = document.querySelectorAll('.flash-message');
  flashMessages.forEach(message => {
    // Auto-dismiss flash messages after 5 seconds
    setTimeout(() => {
      message.style.display = 'none';
    }, 5000);
    
    // Allow manual dismissal with close button
    const closeBtn = message.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        message.style.display = 'none';
      });
    }
  });
  
  // Add form validation feedback
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input');
    
    inputs.forEach(input => {
      // Add visual feedback on input validation
      input.addEventListener('input', function() {
        if (this.validity.valid) {
          this.classList.remove('invalid');
          this.classList.add('valid');
        } else {
          this.classList.remove('valid');
          this.classList.add('invalid');
        }
      });
    });
  });

// ---- Features boxes added by Emma ------

const cards = document.querySelectorAll(".feature-card");
  if (cards.length === 3) {
    let index = 0;

    setInterval(() => {
      cards.forEach(card => card.classList.remove("active", "next", "prev"));

      cards[index].classList.add("active");
      cards[(index + 1) % 3].classList.add("next");
      cards[(index + 2) % 3].classList.add("prev");

      index = (index + 1) % 3;
    }, 3000);
  }



});