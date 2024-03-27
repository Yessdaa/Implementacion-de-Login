const btnclose = document.getElementById('btnclose');

btnclose.addEventListener('click', () => {
    fetch('/api/sessions/logout')
        .then(result => {
            if (result.status === 200) {
                window.location.replace('/users/login');
            }
        })
        .catch(error => {
            console.error('Hubo un error al cerrar sesión:', error);
        });
});