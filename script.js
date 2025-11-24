// -------------------------------
// CONFIGURACIÓN DE DÍAS
// -------------------------------
const days = [
  "Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"
];

// -------------------------------
// CREAR TABLA DINÁMICAMENTE
// -------------------------------
const tbody = document.getElementById("weekBody");

days.forEach(day => {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td><strong>${day}</strong></td>
    <td><input type="number" class="inp" data-day="${day}" data-field="mat" min="0" max="10"></td>
    <td><input type="number" class="inp" data-day="${day}" data-field="ofi" min="0" max="3"></td>
    <td><input type="number" class="inp" data-day="${day}" data-field="lec" min="0" max="10"></td>
    <td><input type="number" class="inp" data-day="${day}" data-field="ing" min="0" max="3"></td>
    <td id="sb-${day}">0</td>
  `;

  tbody.appendChild(tr);
});

// -------------------------------
// CALCULAR SOBRES POR DÍA
// -------------------------------
function calculateDaily(mat, ofi, lec, ing) {
  
  let sobres = 0;

  // -------------------------------
  // 📌 1. Bloque principal (Mat + Ofi + Lec)
  // -------------------------------

  // Si alcanza la misión base:
  // Matemáticas >= 5
  // Oficios >= 1
  // Lectura >= 2
  if (mat >= 5 && ofi >= 1 && lec >= 2) {
    sobres += 3; // misión base

    // Si además cumple misión máxima:
    // Matemáticas = 10
    // Oficios = 3
    // Lectura = 10
    if (mat === 10 && ofi === 3 && lec === 10) {
      sobres += 2; // total 5
    }
  }

  // -------------------------------
  // 📌 2. Inglés
  // -------------------------------
  if (ing >= 2) sobres += 3;   // 2 horas → 3 sobres
  if (ing === 3) sobres += 1;  // extra 1 → total 4 sobres

  // -------------------------------
  // 📌 3. Límite máximo diario
  // -------------------------------
  if (sobres > 9) sobres = 9;

  return sobres;
}

// -------------------------------
// RECALCULAR TODA LA TABLA
// -------------------------------
function recalcTable() {

  let weeklyTotal = 0;

  days.forEach(day => {

    const mat = Number(document.querySelector(`input[data-day="${day}"][data-field="mat"]`).value) || 0;
    const ofi = Number(document.querySelector(`input[data-day="${day}"][data-field="ofi"]`).value) || 0;
    const lec = Number(document.querySelector(`input[data-day="${day}"][data-field="lec"]`).value) || 0;
    const ing = Number(document.querySelector(`input[data-day="${day}"][data-field="ing"]`).value) || 0;

    // Aplicar límites
    const matC = Math.min(Math.max(mat, 0), 10);
    const ofiC = Math.min(Math.max(ofi, 0), 3);
    const lecC = Math.min(Math.max(lec, 0), 10);
    const ingC = Math.min(Math.max(ing, 0), 3);

    const sobres = calculateDaily(matC, ofiC, lecC, ingC);

    document.getElementById(`sb-${day}`).innerText = sobres;
    weeklyTotal += sobres;
  });

  document.getElementById("weeklyTotal").innerText = weeklyTotal;

  saveData();
}

// -------------------------------
// GUARDAR EN LOCALSTORAGE
// -------------------------------
function saveData() {
  const data = {};

  document.querySelectorAll(".inp").forEach(input => {
    const day = input.dataset.day;
    const field = input.dataset.field;
    if (!data[day]) data[day] = {};
    data[day][field] = input.value;
  });

  localStorage.setItem("misionesData", JSON.stringify(data));
}

// -------------------------------
// CARGAR LOCALSTORAGE
// -------------------------------
function loadData() {
  const saved = JSON.parse(localStorage.getItem("misionesData") || "{}");

  document.querySelectorAll(".inp").forEach(input => {
    const day = input.dataset.day;
    const field = input.dataset.field;

    if (saved[day] && saved[day][field] !== undefined) {
      input.value = saved[day][field];
    }
  });

  recalcTable();
}

loadData();

// -------------------------------
// EVENTO PARA REACCALCULAR
// -------------------------------
document.querySelectorAll(".inp").forEach(inp => {
  inp.addEventListener("input", recalcTable);
});

// -------------------------------
// BOTÓN REINICIAR
// -------------------------------
document.getElementById("resetBtn").addEventListener("click", () => {
  document.querySelectorAll(".inp").forEach(i => i.value = "");
  localStorage.removeItem("misionesData");
  recalcTable();
});
