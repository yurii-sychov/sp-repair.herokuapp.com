document.addEventListener('DOMContentLoaded', function () {

	let action = document.getElementsByName('action');
	for (let i=0; i<action.length; i++) {
		action[i].addEventListener('click', (e) => {
			console.log(e.target.value);
		})
	}

	auth = (e) => {
		e.preventDefault();
		let action = document.getElementsByName('action');
		let handler;
		for (let i=0; i<action.length; i++) {
			if (action[i].checked == true) {
				handler = action[i].value;
			}
		}
        let form = document.forms.form;
        let data = {
            email: form.email.value,
			password: form.password.value,
			repassword: form.repassword.value
        }
		
		fetch('/auth/'+handler, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify(data)
		})
		.then(response => response.json())
		.then(json => {
			if (json.status === 'ERROR') {
				alert(json.message);
			} 
			else {
				location.href = '/protective_arsenal';
			}
		});
	}
});