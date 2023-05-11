// Función para envíar email en el formulario de contacto
// toma los valores edl formulario, y los envía mediante
// la funcionalidades de emailJS y muestra mensaje de envio
// correcto usando SweetAlert 2

const btn = document.getElementById('button');

document.getElementById('form')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    btn.value = 'Sending...';

    const serviceID = 'default_service';
    const templateID = 'template_iz90ubw';

    emailjs.sendForm(serviceID, templateID, this)
      .then(() => {
        btn.value = 'Send Email';
        Swal.fire({
          title: "Mensaje enviado!",
          icon: "success",
        });
      }, (err) => {
        btn.value = 'Send Email';
        alert(JSON.stringify(err));
      });
  });