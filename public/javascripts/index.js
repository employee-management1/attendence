
  
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.save_button').forEach(button => {
    button.addEventListener('click', function() {
        
        var parentDiv = this.closest('.leaves');
        var id = parentDiv.querySelector('#username').innerText;
        var data = parentDiv.querySelector('#department').value;
        alert('Data updated successfully');
        

        fetch('/updateData', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id, data: data })
          })
          .then(response => response.json())
          .then(result => {
            if (result.success) {
              alert('Data updated successfully');
            } else {
              alert('Error updating data');
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
          window.location.reload();
      });
  });
});
  