// Get the input elements
const newprodNom = document.querySelector('#in_nombre');
const newprodImg = document.querySelector('#in_img');
const newprodDir = document.querySelector('#in_direccion');
const newprodHor = document.querySelector('#in_horario');

// Validate the form
function validarForm() {
    const forms = document.querySelectorAll('.needs-validation');

    let estado = false;

    forms.forEach(form => {
        if (form.checkValidity()) {
            estado = true;
        };

        form.classList.add('was-validated');
    });

    return estado;
};

// Render the new product example
function renderNuevoEjemplo() {
    if (validarForm()) {
        const nombre = newprodNom.value;
        const imagen = newprodImg.value;
        const direccion = newprodDir.value;
        const horario = newprodHor.value;

        document.querySelector('#nombre-ejemplo').innerText = nombre;
        document.querySelector('#img-ejemplo').setAttribute('src', imagen);
        document.querySelector('#precio-ejemplo').innerText = direccion;
        document.querySelector('#stock-ejemplo').innerText = horario;
    }
}