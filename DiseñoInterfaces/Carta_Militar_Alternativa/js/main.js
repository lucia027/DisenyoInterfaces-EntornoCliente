'use strict';
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 24), {passive:true});
for (const anchor of document.querySelectorAll('#menu .nav-link, #menu .nav-cta')) {
  anchor.addEventListener('click', () => {
    const collapse = document.getElementById('menu');
    if (window.innerWidth < 992 && collapse.classList.contains('show') && window.bootstrap) {
      bootstrap.Collapse.getOrCreateInstance(collapse).hide();
    }
  });
}
const form = document.getElementById('formContacto');
const status = document.getElementById('estadoFormulario');
form.addEventListener('submit', e => {
  e.preventDefault(); e.stopPropagation(); form.classList.add('was-validated');
  if (!form.checkValidity()) { status.textContent = 'Revisa los campos señalados antes de continuar.'; return; }
  const name=document.getElementById('nombre').value.trim();
  const email=document.getElementById('correo').value.trim();
  const subject=document.getElementById('tema').value;
  const message=document.getElementById('mensaje').value.trim();
  const content=`Nombre: ${name}\nCorreo: ${email}\nAsunto: ${subject}\n\n${message}`;
  const blob=new Blob([content],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='mi-mensaje.txt';document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  status.textContent='¡Perfecto! Se ha descargado tu mensaje en un archivo .txt. No se ha enviado a ningún destinatario.';
});
