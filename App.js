// -------------------- PERSISTENCIA --------------------
const guardar = (clave, data) => localStorage.setItem(clave, JSON.stringify(data));
const cargar = (clave, def) => JSON.parse(localStorage.getItem(clave)) || def;

// -------------------- DATA --------------------
let ventasDirectas = cargar("ventasDirectas", []);
let ventasIndirectas = cargar("ventasIndirectas", []);
let gastos = cargar("gastos", []);

const listaIndirectos = ["Juan", "Ana", "Pedro", "Luis", "Carlos"];

// -------------------- ELEMENTOS --------------------
const tablaDirecta = document.getElementById("tablaDirecta");
const tablaIndirecta = document.getElementById("tablaIndirecta");
const tablaGasto = document.getElementById("tablaGasto");
const totalHTML = document.getElementById("total");
const selIndirecto = document.getElementById("selectIndirecto");

// -------------------- INICIAL --------------------
listaIndirectos.forEach(n => {
    let op = document.createElement("option");
    op.textContent = n;
    selIndirecto.appendChild(op);
});

// -------------------- FUNCIONES --------------------
function actualizarTablas() {
    // Ventas directas
    tablaDirecta.innerHTML = "";
    ventasDirectas.forEach(v => {
        tablaDirecta.innerHTML += `
            <tr>
                <td>${v.tipo}</td>
                <td>${v.cantidad}</td>
                <td>$${v.total}</td>
            </tr>`;
    });

    // Ventas indirectas
    tablaIndirecta.innerHTML = "";
    ventasIndirectas.forEach(v => {
        tablaIndirecta.innerHTML += `
            <tr>
                <td>${v.nombre}</td>
                <td>${v.cantidad}</td>
                <td>${v.fecha}</td>
            </tr>`;
    });

    // Gastos
    tablaGasto.innerHTML = "";
    gastos.forEach(g => {
        tablaGasto.innerHTML += `
            <tr>
                <td>${g.desc}</td>
                <td>$${g.monto}</td>
            </tr>`;
    });

    // Total
    const total = 
        ventasDirectas.reduce((a,b)=>a+b.total,0) +
        ventasIndirectas.reduce((a,b)=>a+b.cantidad * 20,0) -
        gastos.reduce((a,b)=>a+b.monto,0);

    totalHTML.textContent = `$${total.toFixed(2)}`;
}

// -------------------- BOTONES --------------------

// Venta directa
document.getElementById("btnGuardarDirecta").onclick = () => {
    const tipo = document.getElementById("tipoD").value;
    const cant = Number(document.getElementById("cantD").value);
    const precio = Number(document.getElementById("precioD").value);

    if (!cant || !precio) return alert("Completa todos los campos");

    ventasDirectas.push({
        tipo,
        cantidad: cant,
        total: cant * precio
    });

    guardar("ventasDirectas", ventasDirectas);
    actualizarTablas();
};

// Venta indirecta
document.getElementById("btnGuardarIndirecta").onclick = () => {
    const nombre = selIndirecto.value;
    const cantidad = Number(document.getElementById("cantidadIndirecto").value);

    if (!cantidad) return alert("Cantidad inválida");

    ventasIndirectas.push({
        nombre,
        cantidad,
        fecha: new Date().toLocaleDateString()
    });

    guardar("ventasIndirectas", ventasIndirectas);
    actualizarTablas();
};

// Gasto
document.getElementById("btnGuardarGasto").onclick = () => {
    const desc = document.getElementById("descGasto").value;
    const monto = Number(document.getElementById("montoGasto").value);

    if (!desc || !monto) return alert("Completa todos los campos");

    gastos.push({ desc, monto });

    guardar("gastos", gastos);
    actualizarTablas();
};

// -------------------- INICIO --------------------
actualizarTablas();
