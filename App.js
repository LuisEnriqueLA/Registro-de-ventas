// -------------------- ESTADO --------------------
let total = 0;

let resumen = {
    Cantinera: { cantidad: 0, total: 0 },
    "5kg": { cantidad: 0, total: 0 },
    Molido: { cantidad: 0, total: 0 },
    "1/4 Entero": { cantidad: 0, total: 0 },
    "3kg": { cantidad: 0, total: 0 }
};

let productosIndirectos = [];

// -------------------- PERSISTENCIA --------------------
function guardarEstado() {
    const estado = {
        total,
        resumen,
        indirectas: document.querySelector("#tabla-indirecto").innerHTML,
        gastos: document.querySelector("#tabla-gastos tbody").innerHTML
    };

    localStorage.setItem("controlVentas", JSON.stringify(estado));
}

function cargarEstado() {
    const data = JSON.parse(localStorage.getItem("controlVentas"));
    if (!data) return;

    total = data.total;
    resumen = data.resumen;

    document.querySelector("#tabla-indirecto").innerHTML = data.indirectas;
    document.querySelector("#tabla-gastos tbody").innerHTML = data.gastos;

    actualizarTotal();
    actualizarResumen();
}

// -------------------- DOM --------------------
const totalEl = document.getElementById("total");
const tablaResumen = document.querySelector("#tabla-directo tbody");

// -------------------- FUNCIONES --------------------
function actualizarTotal() {
    totalEl.textContent = `$${total.toFixed(2)}`;
    guardarEstado();
}

function actualizarResumen() {
    tablaResumen.innerHTML = "";

    for (const producto in resumen) {
        const datos = resumen[producto];
        if (datos.cantidad === 0) continue;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${producto}</td>
            <td>${datos.cantidad}</td>
            <td>$${datos.total.toFixed(2)}</td>
        `;
        tablaResumen.appendChild(tr);
    }

    guardarEstado();
}

// -------------------- VENTAS DIRECTAS --------------------
document.querySelectorAll("#ventas-directas button").forEach(btn => {
    btn.addEventListener("click", () => {
        const nombre = btn.dataset.nombre;
        const precio = Number(btn.dataset.precio);

        total += precio;
        resumen[nombre].cantidad++;
        resumen[nombre].total += precio;

        actualizarTotal();
        actualizarResumen();
    });
});

// -------------------- INDIRECTAS --------------------
document.getElementById("btn-agregar-indirecto").addEventListener("click", () => {
    const producto = document.getElementById("tipo-indirecto").value;
    const cantidad = Number(document.getElementById("cant-indirecta").value);
    const precio = Number(document.getElementById("precio-indirecto").value);

    if (!producto || cantidad <= 0 || precio <= 0) {
        alert("Completa todos los campos");
        return;
    }

    productosIndirectos.push({ producto, cantidad, precio });

    const li = document.createElement("li");
    li.textContent = `${producto} x${cantidad} = $${(precio * cantidad).toFixed(2)}`;
    document.getElementById("lista-productos").appendChild(li);

    document.getElementById("cant-indirecta").value = "";
    document.getElementById("precio-indirecto").value = "";
});

document.getElementById("btn-indirecta").addEventListener("click", () => {
    const vendedor = document.getElementById("vendedor").value;
    if (!vendedor || productosIndirectos.length === 0) {
        alert("Completa todos los datos");
        return;
    }

    const tabla = document.getElementById("tabla-indirecto");
    const tr = document.createElement("tr");

    const totalVenta = productosIndirectos.reduce((acc, p) => acc + p.cantidad * p.precio, 0);

    tr.innerHTML = `
        <td>${vendedor}</td>
        <td>${productosIndirectos.map(p => p.producto).join("<br>")}</td>
        <td>${productosIndirectos.map(p => p.cantidad).join("<br>")}</td>
        <td>$${totalVenta.toFixed(2)}</td>
    `;

    tabla.appendChild(tr);

    total += totalVenta;
    actualizarTotal();

    productosIndirectos = [];
    document.getElementById("lista-productos").innerHTML = "";
});

// -------------------- GASTOS --------------------
document.getElementById("btn-gasto").addEventListener("click", () => {
    const desc = document.getElementById("desc-gasto").value;
    const monto = Number(document.getElementById("monto-gasto").value);

    if (!desc || monto <= 0) {
        alert("Completa los datos del gasto");
        return;
    }

    const tbody = document.querySelector("#tabla-gastos tbody");
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${desc}</td><td>-$${monto.toFixed(2)}</td>`;
    tbody.appendChild(tr);

    total -= monto;
    actualizarTotal();

    document.getElementById("desc-gasto").value = "";
    document.getElementById("monto-gasto").value = "";
});

// -------------------- CARGAR ESTADO --------------------
cargarEstado();
