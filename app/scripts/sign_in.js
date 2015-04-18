/*global $:true */
/*global Handlebars:true */
'use strict';

var authToken;

var UserApp = (function() {
  var apiHost;

  var run = function() {
    authToken = localStorage.getItem('authToken');
    // apiHost = 'http://localhost:3000';
    apiHost = 'https://project-management-api.herokuapp.com';
    setupAjaxRequests();
    $('#sign-in-form').on('submit', submitLogin);
    $('#sign-up-form').on('submit', submitRegistration);
    $('#signout').on('click', signOut);
  };

  var submitRegistration = function(event) {
    event.preventDefault();
    $.ajax({
      url: apiHost + '/users',
      type: 'POST',
      data: {user: {username: $('#username').val(), title: $('#title').val(),email: $('#email').val(), password: $('#password').val()}},
    })
    .done(function(results){
      loginSuccess(results);
    })
    .fail(function(err) {
      console.log(err);
    });
    return false;
  };

  var loginSuccess = function(userData) {
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('currentUser', userData.id);
    $.ajax({
      url: App.url + '/users/' + userData.id,
      type: 'GET'
    }).done(function(response){
      var template = Handlebars.compile($('#userTemplate').html());
      $('#container').html(template({
        user: response
      }));
      $( 'button#avatar-change' ).click(function () {
        if ( $( "div#sign-in-form-slide" ).is( ":hidden" ) ) {
          $( "div#avatar-form" ).slideDown( "slow" );
          App.getAmazonKey();
        } else {
          $( "div#sign-in-form-slide" ).hide();
        }
      });
    }).fail(function(jqXHR, textStatus, errorThrown){
      trace(jqXHR, textStatus, errorThrown);
    }).always(function(response){
      trace(response);
    });
     window.location.href = '/ProjectManagementApp/#/users/' + userData.id;
     // window.location.href = '/#/users/' + userData.id;
  };

  var submitLogin = function(event) {
    var $form;
    event.preventDefault();
    $form = $(this);
    $.ajax({
      url: apiHost + '/users/sign_in',
      type: 'POST',
      data: $form.serialize()
    })
    .done(loginSuccess)
    .fail(function(err) {
      console.log(err);
    });
    return false;
  };

  var setupAjaxRequests = function() {
    $.ajaxPrefilter(function ( options ) {
      options.headers = {};
      options.headers['AUTHORIZATION'] = "Token token=" + localStorage.authToken;
    });
  };

  var acceptFailure = function(error) {
    if (error.status === 401) {
      console.log('SEND TO LOGIN SCREEN');
      window.location.href = '/ProjectManagementApp/index.html';
      // window.location.href = '/index.html';
    }
  };

  var signOut = function(event){
    event.preventDefault();
    localStorage.removeItem('authToken');
    authToken = undefined;
    location.reload();
     // window.location.href = '/index.html';
     window.location.href = '/ProjectManagementApp/index.html';
  };
  return {run: run};
})();

var SignUp = function(){
  $( 'button#sign-up' ).click(function () {
    $( "div#sign-in-form-slide" ).hide();
    if ( $( 'div#form-slide' ).is( ':hidden' ) ) {
      $( 'div#form-slide' ).slideDown( 'slow' );
    } else {
      $( 'div#form-slide' ).hide();
    }
  });
};

var SignIn = function(){
$( 'button#sign-in' ).click(function () {
  $( 'div#form-slide' ).hide();
    if ( $( "div#sign-in-form-slide" ).is( ":hidden" ) ) {
      $( "div#sign-in-form-slide" ).slideDown( "slow" );
    } else {
      $( "div#sign-in-form-slide" ).hide();
    }
  });
};



$(document).ready(function() {
  UserApp.run();
  $( "div#form-slide" ).hide();
  $( "div#sign-in-form-slide").hide();
  $( "div#avatar-form-slide").hide();
  SignUp();
  SignIn();
});
