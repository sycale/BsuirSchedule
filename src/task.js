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
        }
        else if (elem.rank === null)
        {
          others.push(elem);
        }
      });
      ko.applyBindings({ professors: prof, docent, others });
    },
    (errData) => {
      console.log(errData);
    },
  );

  $('.btn').click(() => {
    $('.body').empty();
    const user = $('.us').val();
    getUserInfo(user).then(
      (data) => {
        data.schedules.forEach((day) => {
          $('.body').append(`<h1>${day.weekDay} : <br></h1>`);
          day.schedule.forEach((less) => {
            $('.body').append(`<span>${less.subject} - ${less.lessonType}</span> <br>`);
          });
          $('.body').append('<br>');
        });
      },
      (errData) => {
        console.log(errData);
      },
    );
  });

  $('#start').click(() => {
    $('.professors').removeClass('d-none');
  });

  $('.teacher').click(() => {
    $('.body').empty();
    console.log('test');
    const teacher = $('.us').val();
    getTeacherInfo(teacher).then(
      (data) => {
        console.log(data);
        $('.body')
          .append(`<h1>${data.employee.firstName} ${data.employee.lastName} ${data.employee.middleName}</h1> <br>
      <img src = "${data.employee.photoLink}">
      `);
        data.schedules.forEach((day) => {
          $('.body').append(`<h1>${day.weekDay}: </h1><br>
        
        `);
          day.schedule.forEach((less) => {
            $('.body').append(
              `<span> ${less.subject} : ${less.lessonType} - ${less.auditory} - ${less.lessonTime}  <br>`,
            );
          });
        });
      },
      (errData) => {
        console.log(errData);
      },
    );
  });
});
