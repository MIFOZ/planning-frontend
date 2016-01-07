$(function() {
  alert('Plans.js');

  var editTaskInput = $('#edit-mode');
  $(editTaskInput).val(0);

  $('#edit-task-form').on('submit', function(e) {

    e.preventDefault();

    var isEditMode = $(editTaskInput).val() == 0 ? false : true;
    alert(isEditMode);
    isEditMode = !isEditMode;
    $(editTaskInput).val(isEditMode ? 1 : 0);

    alert(isEditMode);

    if (isEditMode)
      $('#edit-task').prop('value', 'Сохранить изменения');
    else
      $('#edit-task').prop('value', 'Изменить задачу');

    var taskTable = $('#tasks');
    $(taskTable).find('.task-checker').each(function() {

      if ($(this).is(':checked'))
      {
        var currentTr = ($(this).closest('tr'));
        $(currentTr).find('.task-form').each(function() {
          if (isEditMode)
            $(this).show();
          else
            $(this).hide();
        })
        $(currentTr).find('.task-label').each(function() {
          if (isEditMode)
            $(this).hide();
          else
          {
            $(this).show();
            setLabelText(this);
          }
        })
      }
    });
    
    if (!isEditMode)
    {
      var currentTr = $('#tasks').find('input:checked.task-checker').closest('tr');

      var taskForm = $(currentTr).find('form');
      console.log(taskForm);

      $(taskForm).trigger('submit.rails');

      // $.ajax({
      //   url: taskForm.attr('action'),
      //   type: 'patch',
      //   data: $(taskForm).serializeObject(),
      //   // data: JSON.stringify(taskForm),
      //   dataType: 'script'
      // });
    }
  });

  $('#delete-task').on('click', function() {
    
  });
});