const sessionForm = document.getElementById('sessionForm');

sessionForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(sessionForm);
  const userName = formData.get('userName');
  
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userName })
    });

    if (!response.ok) {
      throw new Error('Failed to log in');
    }

    // Redirect to canvas.html on successful login
    window.location.href = '/canvas';
  } catch (error) {
    console.error('Error logging in:', error.message);
  }
});
