// ---------------------------
// PERSISTENCIA
// ---------------------------
function save() {
    localStorage.setItem("total", total);
    localStorage.setItem("resumen", JSON.stringify(resumen));
    localStorage.setItem("indirectas", document.querySelector("#tabla-indirecto tbody").innerHTML);
    localStorage.setItem("gastos", document.querySelector("#tabla-gastos tbody").innerHTML);
}

function load() {
    if (localStorage.getItem("total")) {
        total = Number(localStorage.getItem("total"));
    }

    if (localStorage.getItem("resumen")) {
        Object.assign(resumen, JSON.parse(localStorage.getItem("resumen")));
        actualizarResumen();
    }

    document.querySelector("#tabla-indirecto tbody").innerHTML =
        localStorage.getItem("indirectas") || "";

    document.querySelector("#tabla-gastos tbody").innerHTML =
        localStorage.getItem("gastos") || "";

    actualizarTotal();
}

// ---------------------------
// ESTADO INICIAL
// ---------------------------
let total = 0;
const resumen = {
    Cantinera: { cantidad: 0, total: 0 },
    "5kg": { cantidad: 0, total: 0 },
    Molido: { cantidad: 0, total: 0 },
    "1/4 Entero": { cantidad: 0, total: 0 },
    "3kg": { cantidad: 0, total: 0 }
};
let productosIndirectos = [];

// ---------------------------
const totalEl = document.getElementById("total");
const tablaResumen = document.querySelector("#tabla-directo tbody");

// ---------------------------
// FUNCIONES
// ---------------------------
function actualizarTotal() {
    totalEl.textContent = `$${total.toFixed(2)}`;
    save();
}

function actualizarResumen() {
    tablaResumen.innerHTML = "";

    for (const p in resumen) {
        const d = resumen[p];
        if (d.cantidad === 0) continue;

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${p}</td>
            <td>${d.cantidad}</td>
            <td>$${d.total.toFixed(2)}</td>
        `;
        tablaResumen.appendChild(fila);
    }
    save();
}

// ---------------------------
// VENTAS DIRECTAS
// ---------------------------
document.querySelectorAll("#ventas-directas button").forEach(boton => {
    boton.addEventListener("click", () => {
        const nombre = boton.dataset.nombre;
        const precio = Number(boton.dataset.precio);

        total += precio;
        resumen[nombre].cantidad++;
        resumen[nombre].total += precio;

        actualizarTotal();
        actualizarResumen();
    });
});

// ---------------------------
// VENTAS INDIRECTAS
// ---------------------------
document.querySelector("#btn-agregar-indirecto").addEventListener("click", () => {
    const producto = document.getElementById("tipo-indirecto").value;
    const cantidad = Number(document.getElementById("cant-indirecta").value);
    const precio = Number(document.getElementById("precio-indirecto").value);

    if (!producto || cantidad <= 0 || precio <= 0) return alert("Campos incompletos");

    productosIndirectos.push({ producto, cantidad, precio });

    const li = document.createElement("li");
    li.textContent = `${producto} x${cantidad} = $${(precio * cantidad).toFixed(2)}`;
    document.querySelector("#lista-productos").appendChild(li);

    document.getElementById("tipo-indirecto").value = "";
    document.getElementById("cant-indirecta").value = "";
    document.getElementById("precio-indirecto").value = "";
});

document.querySelector("#btn-indirecta").addEventListener("click", () => {
    const vendedor = document.getElementById("vendedor").value;
    const tbody = document.querySelector("#tabla-indirecto tbody");

    if (!vendedor || productosIndirectos.length === 0)
        return alert("Falta vendedor o productos");

    const fila = document.createElement("tr");

    const totalVenta = productosIndirectos.reduce((a, p) => a + p.cantidad * p.precio, 0);

    fila.innerHTML = `
        <td>${vendedor}</td>
        <td>${productosIndirectos.map(p => `${p.producto} x${p.cantidad}`).join("<br>")}</td>
        <td>${productosIndirectos.map(p => p.cantidad).join("<br>")}</td>
        <td>$${totalVenta.toFixed(2)}</td>
    `;

    tbody.appendChild(fila);

    // sumar al total
    total += totalVenta;
    actualizarTotal();

    productosIndirectos = [];
    document.querySelector("#lista-productos").innerHTML = "";

    save();
});

// ---------------------------
// GASTOS
// ---------------------------
document.querySelector("#btn-gasto").addEventListener("click", () => {
    const desc = document.getElementById("desc-gasto").value;
    const monto = Number(document.getElementById("monto-gasto").value);

    if (!desc || monto <= 0) return alert("Datos incorrectos");

    total -= monto;
    actualizarTotal();

    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td>${desc}</td>
        <td>-$${monto.toFixed(2)}</td>
    `;

    document.querySelector("#tabla-gastos tbody").appendChild(fila);

    document.getElementById("desc-gasto").value = "";
    document.getElementById("monto-gasto").value = "";

    save();
});

// ---------------------------
load();
