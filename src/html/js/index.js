var schedule = [
	{
		name: 'Class 1',
		block: '1',
		id: 123456,
		from: '7:30',
		to: '8:00',
		teacher: 'Mr. Smith'
	},
	{
		name: 'Class 2',
		block: '2',
		id: 789012,
		from: '8:03',
		to: '11:50',
		teacher: 'Ms. Jones'
	}
];
var assignments = [
	{
		name: 'Test assignment',
		className: 'Class 1',
		type: 'Homework',
		assigned: '10/23/2015',
		due: '10/27/2015',
		status: 'Overdue'
	}
];
$(function() {
	$.material.init();
	//setup navbar
	$('.navbar-page-button-schedule').on('pointer.short',function(e) {
		try {
			window.history.replaceState(null, null, $(this).attr('href'));
		}catch(e){
			//fallback if it doesn't support the History API
			window.location = $(this).attr('href');
		}
	}).on('pointer.long', function(e){
		var $this = $(this)
		$this
			.attr('aria-expanded','true')
			.focus()
			.removeClass('open dropdown-item-selected')
			.focus(function() {
				$this.removeClass('open');
			}).blur(function(e) {
				if (e.relatedTarget !== null && $(e.relatedTarget).is('.navbar-page-button-schedule [data-nofocus="true"], .navbar-page-button-schedule [data-nofocus="true"] *')) {
					//cancel close because a child element not an item was focused
					$this.addClass('open');//force open (cancel close from blur)
					$(e.relatedTarget).one('focus', function() {//when the child is focused, switch focus back to me
						$this.focus();
					});
				} else if (e.relatedTarget !== null && $(e.relatedTarget).is('.navbar-page-button-schedule *')) {
					//close because one of the items was clicked
					$this.addClass('dropdown-item-selected').removeClass('open');
				} else {
					//close because something was clicked outside of the dropdown
					$this.removeClass('open dropdown-item-selected');
				}
			});
	});
	var scheduleView = new StudentScheduleView(schedule);
	var assignmentsView = new StudentAssignmentView(assignments);
	var views = [scheduleView, assignmentsView];
	$(window).on('hashchange',function() {
		var hash = window.location.hash;
		if (hash.length <= 1) {
			$('[data-active-hash=\'\'],[data-active-hash=\'#\']').addClass('hash-active');
			$('.hash-active:not([data-active-hash=\'\']):not([data-active-hash=\'#\'])').removeClass('hash-active');
			hash = null;
		} else {
			$('[data-active-hash=\''+hash+'\']').addClass('hash-active');
			$('.hash-active:not([data-active-hash=\''+hash+'\']').removeClass('hash-active');
			hash = hash.substring(1);
		}
		views.forEach(function(view) {
			view.disable();
		});
		switch(hash) {
			case "schedule":
				scheduleView.init().then(function(){scheduleView.enable();});
				break;
			case "assignments":
				assignmentsView.init().then(function(){assignmentsView.enable();});
				break;
		}
	}).trigger('hashchange');//to initialize w/ current hash
});