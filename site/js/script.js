let mascotas = JSON.parse(localStorage.getItem('veterinaria_db')) || [];
let editando = false;
let idEditando = null;

const imgs = [
    "source/img/1.jpg",
    "source/img/2.jpg",
    "source/img/3.jpg",
    "source/img/4.jpg"
];
let idImg = 0;

function cambiarImg(n) {
    const el = document.getElementById("imagenCarrusel");
    if (!el) return;
    idImg = (idImg + n + imgs.length) % imgs.length;
    el.classList.add("fade-out");
    setTimeout(() => {
        el.src = imgs[idImg];
        el.classList.remove("fade-out");
    }, 500);
}

window.siguienteImagen = () => cambiarImg(1);
window.anteriorImagen = () => cambiarImg(-1);

function obtenerCampos() {
    return {
        nombreMascota: document.getElementById('nombreMascota').value.trim(),
        nombreDueno: document.getElementById('nombreDueno').value.trim(),
        telefono: document.getElementById('telefonoDueno')?.value.trim() || '',
        edad: document.getElementById('edadMascota').value.trim(),
        tipo: document.getElementById('tipoMascota').value
    };
}

function validar({ nombreMascota, nombreDueno, telefono, edad, tipo }) {
    let ok = true;
  
    document.querySelectorAll('.error-campo').forEach(e => e.textContent = '');

    if (nombreMascota.length < 2) {
        mostrarError('errorNombre', 'Mínimo 2 caracteres.');
        ok = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreMascota)) {
        mostrarError('errorNombre', 'Solo letras y espacios.');
        ok = false;
    }

    if (nombreDueno.length < 2) {
        mostrarError('errorDueno', 'Mínimo 2 caracteres.');
        ok = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreDueno)) {
        mostrarError('errorDueno', 'Solo letras y espacios.');
        ok = false;
    }

    const edadNum = parseInt(edad, 10);
    if (!edad || isNaN(edadNum) || edadNum < 1 || edadNum > 100) {
        mostrarError('errorEdad', 'Edad inválida (1-100).');
        ok = false;
    }

    if (!tipo) {
        mostrarError('errorTipo', 'Seleccione un tipo.');
        ok = false;
    }

    if (telefono !== undefined && !/^\d{11}$/.test(telefono)) {
        mostrarError('errorTelefono', 'Teléfono inválido (11 dígitos).');
        ok = false;
    }

    return ok;
}

function mostrarError(idSpan, mensaje) {
    const span = document.getElementById(idSpan);
    if (span) span.textContent = mensaje;
}

function guardarStorage() {
    localStorage.setItem('veterinaria_db', JSON.stringify(mascotas));
}

function crearMascota(datos) {
    return {
        id: Date.now(),
        nombreMascota: datos.nombreMascota,
        nombreDueno: datos.nombreDueno,
        telefono: datos.telefono || '',
        edad: parseInt(datos.edad, 10),
        tipo: datos.tipo
    };
}

function render(datos = mascotas) {
    const tbody = document.querySelector('#tablaMascotas tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    datos.forEach(m => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="fw-bold text-primary">${m.nombreMascota}</td>
            <td>${m.nombreDueno}</td>
            <td>${m.telefono || '—'}</td>
            <td>${m.edad} años</td>
            <td><span class="badge bg-secondary">${m.tipo}</span></td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-warning me-1 btn-editar" data-id="${m.id}">✏️</button>
                <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${m.id}">🗑️</button>
            </td>`;
        tbody.appendChild(tr);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('#tablaMascotas tbody');
    if (tbody) {
        tbody.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const id = parseInt(btn.dataset.id, 10);
            if (btn.classList.contains('btn-editar')) prepararEdicion(id);
            if (btn.classList.contains('btn-eliminar')) eliminar(id);
        });
    }

    render();
    setInterval(siguienteImagen, 6000);
});

const formulario = document.getElementById('formMascota');
if (formulario) {
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        const datos = obtenerCampos();
        if (!validar(datos)) return;

        if (editando && idEditando) {
            const idx = mascotas.findIndex(m => m.id === idEditando);
            if (idx !== -1) {
                mascotas[idx] = { ...mascotas[idx], ...datos, edad: parseInt(datos.edad, 10) };
            }
            editando = false;
            idEditando = null;
            document.getElementById('btnGuardar').textContent = 'Guardar Registro';
        } else {
            mascotas.push(crearMascota(datos));
        }

        guardarStorage();
        render();
        formulario.reset();
    });
}

const buscador = document.getElementById('filtroTipo');
if (buscador) {
    buscador.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        
        const filtrados = mascotas.filter(m => {
            const nombreM = m.nombreMascota.toLowerCase();
            const nombreD = m.nombreDueno.toLowerCase();
            const tipoM = m.tipo.toLowerCase();
            const telM = m.telefono.toString();

            return nombreM.includes(val) || 
                   nombreD.includes(val) || 
                   tipoM.includes(val) || 
                   telM.includes(val);
        });

        render(filtrados);
    });
}

window.eliminar = (id) => {
    if (confirm('¿Seguro que quieres eliminar este registro?')) {
        mascotas = mascotas.filter(m => m.id !== id);
        if (idEditando === id) {
            editando = false;
            idEditando = null;
            document.getElementById('btnGuardar').textContent = 'Guardar Registro';
            formulario.reset();
        }
        guardarStorage();
        render();
    }
};

window.prepararEdicion = (id) => {
    const m = mascotas.find(m => m.id === id);
    if (!m) return;
    document.getElementById('nombreMascota').value = m.nombreMascota;
    document.getElementById('nombreDueno').value = m.nombreDueno;
    if (document.getElementById('telefonoDueno')) {
        document.getElementById('telefonoDueno').value = m.telefono || '';
    }
    document.getElementById('edadMascota').value = m.edad;
    document.getElementById('tipoMascota').value = m.tipo;
    editando = true;
    idEditando = id;
    document.getElementById('btnGuardar').textContent = 'Actualizar Datos';
};