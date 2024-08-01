document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.delete_button1').forEach(button => {
    button.addEventListener('click', function() {
        
        var parentDiv = this.closest('.employees-data');
        var id = parentDiv.querySelector('#user').innerText;
        alert('Data updated successfully');
        window.location.reload();
        fetch('/updateEmployees', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id})
          })
          .then(response => {
            if(response.ok){
                alert("Data sent")
            }
          })
          .then(result => {
            if (result.success) {
              alert('Data updated successfully');
             
            } else {
              alert('Error updating data');
            }
          })
          .catch(error => {
            console.error('Error:', error);
          })

      });
  });
});