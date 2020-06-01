import $ from 'jquery';
import ko from 'knockout';

const teachers = [];
const docent = ko.observableArray([]);
const prof = ko.observableArray([]);
const others = ko.observableArray([]);

function getUserInfo(user) {
  return $.ajax({
    type: 'GET',
    dataType: 'json',
    url: `https://journal.bsuir.by/api/v1/studentGroup/schedule?studentGroup=${user}`,
  });
}

function getTeacherInfo(teacher) {
  return $.ajax({
    type: 'GET',
    dataType: 'json',
    url: `https://journal.bsuir.by/api/v1/portal/employeeSchedule?employeeId=${teacher}`,
  });
}

function getTeachers() {
  return $.ajax({
    type: 'GET',
    dataType: 'json',
    url: 'https://journal.bsuir.by/api/v1/employees',
  });
}

$(document).ready(() => {
  getTeachers().then(
    (data) => {
      console.log(data);
      data.forEach((elem) => {
        teachers.push(elem);
        if (elem.rank === 'Профессор') {
          prof.push(elem);
        } else if (elem.rank === 'Доцент') {
          docent.push(elem);
        } else if (elem.rank === null) {
          others.push(elem);
        }
      });
      ko.applyBindings({ professors: prof, docent, others });
    },
    (errData) => {
      console.log(errData);
    },
  );

  $('#getGroup').click(() => {
    $('.body').empty();
    $('.temp-bg').removeClass('d-none');
    $('#teachBlock').addClass('d-none');
    const user = $('#group').val();
    if (user === '') {
      alert('Please, fill input correctly');
    } else {
      getUserInfo(user).then(
        (data) => {
          $('.temp-bg').addClass('d-none');
          data.schedules.forEach((day) => {
            $('.body').append(`<h1>${day.weekDay} : <br></h1>`);
            day.schedule.forEach((less) => {
              if (less.lessonType === 'ЛР') {
                $('.body').append(
                  `<span class = "lab">${less.subject} - ${less.lessonType}</span> <br>`,
                );
              } else if (less.lessonType === 'ПЗ') {
                $('.body').append(
                  `<span class = "pract">${less.subject} - ${less.lessonType}</span> <br>`,
                );
              } else {
                $('.body').append(
                  `<span class = "lect">${less.subject} - ${less.lessonType}</span> <br>`,
                );
              }
            });
            $('.body').append('<br>');
          });
        },
        (errData) => {
          console.log(errData);
          alert('There is no such group');
        },
      );
    }
  });

  $('#getTeach').click(() => {
    $('.temp-bg').addClass('d-none');
    $('.body').empty();
    $('#teachBlock').removeClass('d-none');
  });
});
