function showAlert() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Te vas a desconectar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, desconectarme'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Te has desconectado!',
                'Sesión cerrada correctamente',
                'success'
            ).then(function () {
                window.location = '/users/logout';
            });
        }
    });
}

// AL AGRESAR USARIO EN MANTENEDOR


