document.addEventListener('DOMContentLoaded', function () {
	var elems = document.querySelectorAll('.carousel');
	var instances = M.Carousel.init(elems, { indicators: true });

	var elems = document.querySelectorAll('.tooltipped');
	var instances = M.Tooltip.init(elems, {});

	var elems = document.querySelectorAll('.sidenav');
	var instances = M.Sidenav.init(elems, {});

	var elems = document.querySelectorAll('.datepicker');
	var instances = M.Datepicker.init(elems, { autoClose: true, format: 'yyyy-mm-dd', firstDay: 1 });

	var elems = document.querySelectorAll('.dropdown-trigger');
	var instances = M.Dropdown.init(elems, { container: true, constrainWidth: false });

	var elems = document.querySelectorAll('.fixed-action-btn');
	var instances = M.FloatingActionButton.init(elems, { hoverEnabled: true });

	var elems = document.querySelectorAll('select');
	var dropdownOptions = {
		coverTrigger: false,
	}
	var instances = M.FormSelect.init(elems, { classes: "select-stantion", dropdownOptions });

	let elem = document.getElementById('TabProfile');
	let instance = M.Tabs.init(elem, {});

	createRow = (e) => {
		e.preventDefault();
		let form = document.forms.form;
		let formData = new FormData(form);
		fetch('/' + location.pathname.split('/')[1] + '/create', {
			method: 'POST',
			headers: {
				// 'Content-type': 'application/json; charset=UTF-8'
			},
			body: formData
		})
			.then(response => response.json())
			.then(json => {
				if (json.status === 'ERROR') {
					M.toast({ html: json.message, classes: 'rounded' });
					document.getElementById(json.field).classList.add('invalid');
				}
				else {
					location.href = '/' + location.pathname.split('/')[1];
				}
			});
	}

	createRows = (e) => {
		e.preventDefault();
		alert('Функция в разработке');
		// let form = document.forms.form;
		// let formData = new FormData(form);
		// fetch('/'+location.pathname.split('/')[1]+'/create_several', {
		// 	method: 'POST',
		// 	headers: {
		// 		// 'Content-type': 'application/json; charset=UTF-8'
		// 	},
		// 	body: formData
		// })
		// .then(response => response.json())
		// .then(json => {
		// 	if (json.status === 'ERROR') {
		// 		M.toast({html: json.message, classes: 'rounded'});
		// 		document.getElementById(json.field).classList.add('invalid');
		// 	} 
		// 	else {
		// 		// location.href = '/'+location.pathname.split('/')[1];
		// 	}
		// });
	}

	updateRow = (e) => {
		e.preventDefault();
		let form = document.forms.form;
		let formData = new FormData(form);
		fetch('/' + location.pathname.split('/')[1] + '/update', {
			method: 'PUT',
			headers: {
				// 'Content-type': 'application/json; charset=UTF-8'
			},
			body: formData
		})
			.then(response => response.json())
			.then(json => {
				if (json.status === 'ERROR') {
					M.toast({ html: json.message, classes: 'rounded' });
					document.getElementById(json.field).classList.add('invalid');
				}
				else {
					location.href = '/' + location.pathname.split('/')[1];
				}
			});
	}

	deleteRow = (e) => {
		e.preventDefault();
		let id = e.target.dataset.id;
		let table = e.target.closest('table');
		let tr = e.target.parentElement.parentElement.parentElement;
		let tr_length = e.target.closest('table').rows.length;
		if (confirm('Вы дествительно хотите удалить запись с id=' + id) === true) {
			fetch('/' + location.pathname.split('/')[1] + '/delete', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ 'id': id })
			});
			tr.remove();
			if (tr_length == 2) table.remove();
		}
		else {
			console.log('Вы отменили удаление.');
		}
	}

	pdf = (e) => {
		console.log(e)
		// location.href = '/protective_arsenal/pdf/'+e.target.value;

		window.open('/protective_arsenal/pdf/' + e.target.dataset.id, '_blank');
		e.target.selectedIndex = 0;
	}

	addRow = (e) => {
		e.preventDefault();
		alert('Функция в разработке');
	}

	removeRow = (e) => {
		e.preventDefault();
		alert('Функция в разработке');
	}

	changePassword = (e) => {
		e.preventDefault();
		let form = document.forms.form;
		let formData = new FormData(form);
		fetch('/profile/change_password', {
			method: 'PUT',
			headers: {
				// 'Content-type': 'application/json; charset=UTF-8'
			},
			body: formData
		})
			.then(response => response.json())
			.then(json => {
				if (json.status === 'ERROR') {
					M.toast({ html: json.message, classes: 'rounded' });
					document.getElementById(json.field).classList.add('invalid');
				}
				else {
					M.toast({ html: json.message, classes: 'rounded' });
				}
			});
	}

	uploadFoto = (e) => {
		e.preventDefault();
		let form = document.forms.form_foto;
		let formData = new FormData(form);
		fetch('/profile', {
			method: 'POST',
			headers: {
				// 'Content-type': 'application/json; charset=UTF-8'
			},
			body: formData
		})
			// .then(response => response.json())
			.then(json => {
				if (json.status === 'ERROR') {
					// M.toast({ html: json.message, classes: 'rounded' });
				}
				else {
					// M.toast({ html: json.message, classes: 'rounded' });
				}
			});
	}

	async function request(url, method = 'GET', data = null) {
		try {
			const headers = {}
			let body

			if (data) {
				headers['Content-Type'] = 'application/json'
				body = JSON.stringify(data)
			}

			const response = await fetch(url, {
				method,
				headers,
				body
			})
			return await response.json()
		} catch (e) {
			console.warn('Error:', e.message)
		}
	}
});