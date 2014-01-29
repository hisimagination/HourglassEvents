'use strict';

/* Controllers */

angular.module('myApp.controllers', ['googlechart', 'firebase', 'ui.calendar'])
	.controller('HomeCtrl', ['$scope', 'syncData', function($scope, syncData) {
			syncData('syncedValue').$bind($scope, 'syncedValue');
			var keys = syncData('syncedValue').$getIndex($scope, 'syncedValue');
			keys.forEach(function(key, i) {
						 console.log(i, $scope.exhbitors[key]); // prints items in order they appear in Firebase
			});
	}])

// EXHIBITOR DETAILS CONTROLLER
.controller("ExhibitorDetailCtrl", [ '$firebase', '$scope', '$routeParams', '$location', function($firebase, $scope, $routeParams, $location) {
		//$scope.exhibitor = Exhibitor.data;

		var exhibitorUrl = $location.path()
	
		 var exhibitorRef = new Firebase("https://hourglass-events.firebaseIO.com/" + exhibitorUrl);
	 	 $scope.exh = $firebase(exhibitorRef);
	 	 $scope.removeExhibitor = function(){
	 	 	exhibitorRef.remove();
	 	 };


}])

//var fb = new Firebase('https://hourglass-events.firebaseio-demo.com/');

// DASHBOARD CONTROLLER
.controller("DashboardController", ['$firebase', '$scope', '$location',
	function($firebase, $scope, $location) {
	$scope.title = "Dashboard";

}])

// TEST CONTROLLER
.controller("TestController", [ '$firebase','syncData', '$scope', '$timeout',
  	function($firebase, syncData, $scope, $timeout) {

	syncData('syncedValue').$bind($scope, 'syncedValue');
	//$scope.exhibitors = fireService;

	 var exhibitorRef = new Firebase("https://hourglass-events.firebaseIO.com/exhibitors");
	 $scope.exhibitors = $firebase(exhibitorRef);
			 
		
	$scope.title = 'Exhibitors';
	$scope.doneEditing = function (id, field, newval) {

		
	};
	$scope.addExhibitor = function(){
		$scope.exhibitors.$add({soft: 0});
	};
	$scope.softDelete = function(id){
		  var updateRef  = new Firebase("https://hourglass-events.firebaseIO.com/exhibitors/" + id);

		updateRef.child('soft').set( 1 );
		console.log(id)
	};
	 $scope.searchValue = function (name, value) {
	        if (!$scope.search) {
	            $scope.search = {};
	        }
	        $scope.search[name] = value;
	    }	
}])

.controller("TrashController", [ '$firebase','syncData', '$scope', '$timeout',
  	function($firebase, syncData, $scope, $timeout) {

	syncData('syncedValue').$bind($scope, 'syncedValue');
	//$scope.exhibitors = fireService;

	 var exhibitorRef = new Firebase("https://hourglass-events.firebaseIO.com/exhibitors");
	 $scope.exhibitors = $firebase(exhibitorRef);
			 
	$scope.restore = function(id){
		  var updateRef  = new Firebase("https://hourglass-events.firebaseIO.com/exhibitors/" + id);

		updateRef.child('soft').set( 0 );
		console.log(id)
	};
}])

// CALENDAR CONTROLLER
.controller("calendarController", [ '$firebase','syncData', '$scope', '$timeout',
  	function($firebase, syncData, $scope, $timeout) {
  	syncData('syncedValue').$bind($scope, 'syncedValue');
	//$scope.exhibitors = fireService;

	var eventsRef = new Firebase("https://hourglass-events.firebaseIO.com/globals/events");

  }])
.controller("CalendarCtrl", ["$scope", function($scope){
	var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    /* event source that pulls from google.com */
    $scope.eventSource = {
            url: "https://www.google.com/calendar/feeds/b94al9akkgbhoeje35him0ekb0%40group.calendar.google.com/private-22dee707edfa53ca61142b8b32b951c2/basic",
            className: 'gcal-event',           // an option!
            editable: true,
            currentTimezone: 'America/Chicago' // an option!
    };
    /* event source that contains custom events on the scope */
    $scope.events = [
      {title: 'All Day Event',start: new Date(y, m, 1)},
      {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
      {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
      {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    ];
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
      callback(events);
    };
    /* alert on eventClick */
    $scope.addEventOnClick = function( date, allDay, jsEvent, view ){
        $scope.$apply(function(){
          $scope.alertMessage = ('Day Clicked ' + date);
        });
    };
    /* alert on Drop */
     $scope.alertOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
        $scope.$apply(function(){
          $scope.alertMessage = ('Event Droped to make dayDelta ' + dayDelta);
        });
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){
        $scope.$apply(function(){
          $scope.alertMessage = ('Event Resized to make dayDelta ' + minuteDelta);
        });
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    /* add custom event*/
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
}])


// ADD TODO CONTROLLER
.factory("addTodosService", function($http){
  return {
	 get: function() {
		  return $http.get('exhibitors');
	 }
  };
})



// TODOS CONTROLLER
.controller('todoController', function TodoCtrl($scope, $location, $firebase, $routeParams) {
	
				
	$scope.firepath = $location.path();
	
	
	if($location.path() == '/dashboard') {
			var globalTodoRef = new Firebase('https://hourglass-events.firebaseio.com/globals/todos');
			$scope.fireRef = globalTodoRef;
	}else{
		

		 var exhibitorTodo = new Firebase('https://hourglass-events.firebaseio.com/' + $scope.firepath + '/todos');
		 $scope.fireRef = exhibitorTodo;
	
	}

		  
				//$firebase(fireRef.child("exhibitors/" + $scope.exhibitorId));


				



	$scope.$watch('todos', function () {
	  var total = 0;
	  var remaining = 0;
	  $scope.todos.$getIndex().forEach(function (index) {
			  var todo = $scope.todos[index];
		 // Skip invalid entries so they don't break the entire app.
			  if (!todo || !todo.title) {
					  return;
			  }

			  total++;
			  if (todo.completed === false) {
				 remaining++;
			  }
	  });
	  $scope.totalCount = total;
	  $scope.remainingCount = remaining;
	  $scope.completedCount = total - remaining;
	  $scope.allChecked = remaining === 0;
	}, true);

	$scope.addTodo = function () {
	  var newTodo = $scope.newTodo.trim();
	  if (!newTodo.length) {
		 return;
	  }
	  $scope.todos.$add({
		 title: newTodo,
		 completed: false
	  });
	  $scope.newTodo = '';
	};

	$scope.editTodo = function (id) {
	  $scope.editedTodo = $scope.todos[id];
	  $scope.originalTodo = angular.extend({}, $scope.editedTodo);
	};

	$scope.doneEditing = function (id) {
	  $scope.editedTodo = null;
	  var title = $scope.todos[id].title.trim();
	  if (title) {
		 $scope.todos.$save(id);
	  } else {
		 $scope.removeTodo(id);
	  }
	};

	$scope.revertEditing = function (id) {
	  $scope.todos[id] = $scope.originalTodo;
	  $scope.doneEditing(id);
	};

	$scope.removeTodo = function (id) {
	  $scope.todos.$remove(id);
	};

	$scope.toggleCompleted = function (id) {
	  var todo = $scope.todos[id];
	  todo.completed = !todo.completed;
	  $scope.todos.$save(id);
	};

	$scope.clearCompletedTodos = function () {
	  angular.forEach($scope.todos.$getIndex(), function (index) {
		 if ($scope.todos[index].completed) {
			$scope.todos.$remove(index);
		 }
	  });
	};

	$scope.markAll = function (allCompleted) {
	  angular.forEach($scope.todos.$getIndex(), function (index) {
		 $scope.todos[index].completed = !allCompleted;
	  });
	  $scope.todos.$save();
	};

	$scope.newTodo = '';
	$scope.editedTodo = null;

	if ($location.path() === $scope.urlpath ) {
	  $location.path($scope.urlpath);
	}
	$scope.location = $location;

	$scope.todos = $firebase($scope.fireRef);
	// Bind the todos to the firebase provider.
})

// NOTES CONTROLLER
.controller('NoteCtrl', function NoteCtrl($scope, $location, $firebase, $routeParams) {
			
	$scope.firepath = $location.path();
	
	
	if($location.path() == '/dashboard') {
			var globalNotesRef = new Firebase('https://hourglass-events.firebaseio.com/globals/notes');
			$scope.fireRef = globalNotesRef;
	}else{
		

		 var exhibitorNotes = new Firebase('https://hourglass-events.firebaseio.com/' + $scope.firepath + '/notes');
		 $scope.fireRef = exhibitorNotes;
	
	}
	

	
	
	
	//$firebase(fireRef.child("exhibitors/" + $scope.exhibitorId));

	$scope.$watch('notes', function () {
	  var total = 0;
	  var remaining = 0;
	  $scope.notes.$getIndex().forEach(function (index) {
			  var note = $scope.notes[index];
		 // Skip invalid entries so they don't break the entire app.
			  if (!note || !note.title) {
					  return;
			  }

			  total++;
			  if (note.completed === false) {
				 remaining++;
			  }
	  });
	  $scope.totalCount = total;
	  $scope.remainingCount = remaining;
	  $scope.completedCount = total - remaining;
	  $scope.allChecked = remaining === 0;
	}, true);

	$scope.addNote = function () {
	  var newNote = $scope.newNote.trim();
	  if (!newNote.length) {
		 return;
	  }
	  $scope.notes.$add({
		 title: newNote,
		 completed: false
	  });
	  $scope.newNote = '';
	};

	$scope.editNote = function (id) {
	  $scope.editedNote = $scope.notes[id];
	  $scope.originalNote = angular.extend({}, $scope.editedNote);
	};

	$scope.doneEditing = function (id) {
	  $scope.editedNote = null;
	  var title = $scope.notes[id].title.trim();
	  if (title) {
		 $scope.notes.$save(id);
	  } else {
		 $scope.removeNote(id);
	  }
	};

	$scope.revertEditing = function (id) {
	  $scope.notes[id] = $scope.originalNote;
	  $scope.doneEditing(id);
	};

	$scope.removeNote = function (id) {
	  $scope.notes.$remove(id);
	};

	$scope.toggleCompleted = function (id) {
	  var note = $scope.notes[id];
	  note.completed = !note.completed;
	  $scope.notes.$save(id);
	};

	$scope.clearCompletedNotes = function () {
	  angular.forEach($scope.notes.$getIndex(), function (index) {
		 if ($scope.notes[index].completed) {
			$scope.notes.$remove(index);
		 }
	  });
	};

	$scope.markAll = function (allCompleted) {
	  angular.forEach($scope.notes.$getIndex(), function (index) {
		 $scope.notes[index].completed = !allCompleted;
	  });
	  $scope.notes.$save();
	};

	$scope.newNote = '';
	$scope.editedNote = null;

	if ($location.path() === $scope.urlpath ) {
	  $location.path($scope.urlpath);
	}
	$scope.location = $location;

	// Bind the notes to the firebase provider.
	$scope.notes = $firebase( $scope.fireRef);
})
.controller('ChatCtrl', ['$scope', 'syncData', function($scope, syncData) {
		$scope.newMessage = null;

		// constrain number of messages by limit into syncData
		// add the array into $scope.messages
		$scope.messages = syncData('messages', 10);
		console.log($scope.messages);

		// add new messages to the list
		$scope.addMessage = function() {
			if( $scope.newMessage ) {
				$scope.messages.$add({text: $scope.newMessage});
				$scope.newMessage = null;
			}
		};
}])

.controller('LoginCtrl', ['$scope', 'loginService', '$location', function($scope, loginService, $location) {
$scope.email = null;
$scope.pass = null;
$scope.confirm = null;
$scope.createMode = false;

$scope.login = function(cb) {
	$scope.err = null;
	if( !$scope.email ) {
		$scope.err = 'Please enter an email address';
	}
	else if( !$scope.pass ) {
		$scope.err = 'Please enter a password';
	}
	else {
		loginService.login($scope.email, $scope.pass, function(err, user) {
			$scope.err = err? err + '' : null;
			if( !err ) {
				cb && cb(user);
			}
		});
	}
};

$scope.createAccount = function() {
	$scope.err = null;
	if( assertValidLoginAttempt() ) {
		loginService.createAccount($scope.email, $scope.pass, function(err, user) {
			if( err ) {
				$scope.err = err? err + '' : null;
			}
			else {
				// must be logged in before I can write to my profile
				$scope.login(function() {
					loginService.createProfile(user.uid, user.email);
					$location.path('/account');
				});
			}
		});
	}
};

function assertValidLoginAttempt() {
	if( !$scope.email ) {
		$scope.err = 'Please enter an email address';
	}
	else if( !$scope.pass ) {
		$scope.err = 'Please enter a password';
	}
	else if( $scope.pass !== $scope.confirm ) {
		$scope.err = 'Passwords do not match';
	}
	return !$scope.err;
}
}])

.controller('AccountCtrl', ['$scope', 'loginService', 'syncData', '$location', function($scope, loginService, syncData, $location) {
syncData(['users', $scope.auth.user.uid]).$bind($scope, 'user');

$scope.logout = function() {
	loginService.logout();
};

$scope.oldpass = null;
$scope.newpass = null;
$scope.confirm = null;

$scope.reset = function() {
	$scope.err = null;
	$scope.msg = null;
};

$scope.updatePassword = function() {
	$scope.reset();
	loginService.changePassword(buildPwdParms());
};

function buildPwdParms() {
	return {
		email: $scope.auth.user.email,
		oldpass: $scope.oldpass,
		newpass: $scope.newpass,
		confirm: $scope.confirm,
		callback: function(err) {
			if( err ) {
				$scope.err = err;
			}
			else {
				$scope.oldpass = null;
				$scope.newpass = null;
				$scope.confirm = null;
				$scope.msg = 'Password updated!';
			}
		}
	}
}

}]);