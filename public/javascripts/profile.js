
 //for deleting the leave request 
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.delete_button').forEach(button => {
    button.addEventListener('click', function() {
        
        var parentDiv = this.closest('.leaves1');
        var id = parentDiv.querySelector('#leave_num').innerText;
        alert('Data updated successfully');
        
        fetch('/updateLeaves', {
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
          window.location.reload();
      });
  });
});
  

//for updating status of task by employee
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.save_button').forEach(button => {
  button.addEventListener('click', function() {
      
      var parentDiv = this.closest('.task1');
    
      var id = parentDiv.querySelector('#username').innerText;
      console.log(id);
      var data = parentDiv.querySelector('#task-status').value;
      
      alert('Data updated successfully');
      window.location.reload();
      fetch('/updateTaskData', {
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

    });
});
});
