function cargarComponente(id, archivo) {
    let ruta = window.location.pathname.includes("/pages/") ? `../components/${archivo}` : `components/${archivo}`;
    fetch(ruta)
        .then(res => res.text())
        .then(data => { document.getElementById(id).innerHTML = data; })
        .catch(err => console.error("Error cargando componente:", err));
}

document.addEventListener("DOMContentLoaded", () => {
    cargarComponente("nav-container", "nav.html");
    cargarComponente("footer-container", "footer.html");
});