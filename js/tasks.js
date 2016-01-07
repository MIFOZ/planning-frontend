//=require ../libs/gantt/gantt.js

var ge;

var gantt_tasks;

Storage.prototype.getObject = function(key) {
  return this.getItem(key) && JSON.parse(this.getItem(key));
};

Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
};

function setFormValue(form) {
  $(form).siblings()
}

function setLabelText(label) {
  var currentTd = $(label).closest('td');
  var input = $(currentTd).find('.task-form');

  $(label).val(input.value);
}

function serializeData(currentTr) {
  var formData = [];
  $(currentTr).find('input').each(function() {
    formData.push({ name: this.name, value: this.value });
  });
  $(currentTr).find('select').each(function() {
    formData.push({ name: this.name, value: this.value });
  });
}

jQuery.fn.blockUi = function() {
  $.block({ message: '<h1><img src="busy.gif" /> Just a moment...</h1>' });
}

$(document).ajaxStart($.blockUi).ajaxStop($.unblockUI);

function onChangeInputField(e) {
  var currentTr = ($(this).closest('tr'));

  var taskForm = $(currentTr).find('form');

  var formData = [];
  formData.push({ name: this.name, value: this.value });

  // $.blockUI();

  $.ajax({
    url: taskForm.attr('action'),
    type: 'PUT',
    data: formData,
    dataType: 'script',
    success: function() {
      $(this).css({'border': '4px solid lightgreen;'});
      // alert('success');
    },
    error: function() {
      $(this).css({'border': '4px solid red;'});
      // alert('error');
    }
  });
}

$(function() {

  alert('Tasks.js');

  initGantt();

  var editTaskInput = $('#edit-mode');
  $(editTaskInput).val(0);

  // New task button
  $('#add-task').click(function(e) {

    e.preventDefault();

    var form = $(this).parent('form');

    console.log(form.attr('action'));

    $.ajax({
      url: form.attr('action'),
      type: 'POST',
      dataType: 'script'
    });
  });

  var taskTable = $('#tasks');

  $(taskTable).find('.task-form').each(function() {
    $(this).on('change paste keyup', onChangeInputField);
  });

  // Edit task button
  $('#edit-task-form').on('submit', function(e) {

    e.preventDefault();

    var isEditMode = $(editTaskInput).val() == 0 ? false : true;
    isEditMode = !isEditMode;
    $(editTaskInput).val(isEditMode ? 1 : 0);

    if (isEditMode)
      $('#edit-task').prop('value', 'Сохранить изменения');
    else
      $('#edit-task').prop('value', 'Изменить задачу');

    if (!isEditMode) {
      
      var currentTr = $('#tasks').find('input:checked.task-checker').closest('tr');
      var taskForm = $(currentTr).find('form');
      
      var formData = [];
      $(currentTr).find('input').each(function() {
        formData.push({ name: this.name, value: this.value });
      });
      $(currentTr).find('select').each(function() {
        formData.push({ name: this.name, value: this.value });
      });

      $.ajax({
        url: taskForm.attr('action') + '/finish_editing',
        type: 'PATCH',
        data: formData,
        dataType: 'script'
        });


    }

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
  });

  // Remove task button
  $('#remove-task').click(function(e) {

    e.preventDefault();

    var form = $(this).parent('form');

    var removedRows = [];

    $(taskTable).find('input.task-checker:checked').each(function() {

      var currentTr = ($(this).closest('tr'));
      
      if (removedRows.indexOf(currentTr.attr('id')) != -1)
        return true;

      $.ajax({
        url: form.attr('action') + '/' + currentTr.attr('id'),
        type: 'DELETE',
        data: {
          _method: 'delete'
        },
        dataType: 'script'
        });

      removedRows.push(currentTr.attr('id'));
    });
  });
})

function initGantt() {
  ge = new GanttMaster();
  ge.init($("#workSpace"));

  loadFromLocalStorage();
}

function saveGanttOnServer() {
  if(!ge.canWrite)
    return;

  saveInLocalStorage();
}

// function Task() {
// }

//Task.prototype

function loadFromLocalStorage() {
  var ret;
  if (localStorage) {
    if (localStorage.getObject("teamworkGantDemo")) {
      ret = localStorage.getObject("teamworkGantDemo");
    }
  } else {
    $("#taZone").show();
  }

  if (!ret || !ret.tasks || ret.tasks.length == 0) {
    ret = JSON.parse($("#ta").val());

    //actualize data
    var offset = new Date().getTime() - ret.tasks[0].start;
    for (var i=0;i<ret.tasks.length;i++)
      ret.tasks[i].start = ret.tasks[i].start + offset;
  }
  ge.loadProject(ret);
  ge.checkpoint(); //empty the undo stack

  // alert('loadFromLocalStorage');

  // var project = {}
  // project.tasks = []

  // var trVec = $('table#tasks').children('tbody').find('tr').each(function() {

  //   // console.log(this.id);

  //   if (this.id == '')
  //     return true;

  //   var task = new Task();

  //   task.name = $(this).find('.task_title').children('input').val();

  //   task.id = 0 - this.id;


  //   task.code = 1;
  //   task.level = 0;
  //   task.status = "STATUS_ACTIVE";
  //   task.canWrite = true;
  //   task.start = 1396994400000;
  //   task.duration = 21;
  //   task.end = 1399672799999;
  //   task.startIsMilestone = true;
  //   task.endIsMilestone = false;
  //   task.collapsed = false;
  //   task.hasChild = false;
  //   task.assigs = []

  //   project.tasks.push(task);

  //   // console.log(project);
  // });

  // ge.loadProject(project);
}

function saveInLocalStorage() {
  var prj = ge.saveProject();
  if (localStorage) {
    localStorage.setObject("teamworkGantDemo", prj);
  } else {
    $("#ta").val(JSON.stringify(prj));
  }
}

$.JST.loadDecorator("ASSIGNMENT_ROW", function(assigTr, taskAssig) {

    alert("loadDecorator");

    console.log('resources: ' + taskAssig.task.master.resources);

    var resEl = assigTr.find("[name=resourceId]");
    for (var i in taskAssig.task.master.resources) {
      var res = taskAssig.task.master.resources[i];
      var opt = $("<option>");
      opt.val(res.id).html(res.name);
      if (taskAssig.assig.resourceId == res.id)
        opt.attr("selected", "true");
      resEl.append(opt);
    }

    var roleEl = assigTr.find("[name=roleId]");
    for (var i in taskAssig.task.master.roles) {
      var role = taskAssig.task.master.roles[i];
      var optr = $("<option>");
      optr.val(role.id).html(role.name);
      if (taskAssig.assig.roleId == role.id)
        optr.attr("selected", "true");
      roleEl.append(optr);
    }

    if(taskAssig.task.master.canWrite && taskAssig.task.canWrite){
      assigTr.find(".delAssig").click(function() {
        var tr = $(this).closest("[assigId]").fadeOut(200, function() {
          $(this).remove();
        });
      });
    }
  });