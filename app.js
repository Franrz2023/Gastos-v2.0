let verAnteriores = document.getElementById('verAnteriores');
const dateInput = document.getElementById('dateInput');
const categorySelect = document.getElementById('categorySelect');
const alertDiv = document.getElementById('alertDiv');
const formLoad = document.getElementById('formLoad');
const display = document.getElementById('display');
const moneyExpend = document.getElementById('moneyExpend');
const descriptionExpend = document.getElementById('descriptionExpend');
const Gastos = document.getElementById('Gastos');
const clear = document.getElementById('clear');
let content = document.getElementById('content');
let capturescreen = document.getElementById('captureScreenshot');
let total;
const sumaGastos = [];
const categories = []
// Objeto para almacenar el conteo de categorías
const categoryCount = {};

const objDate = new Date();
//unix time to use like id to localstorage
let id = objDate.getTime();

formLoad.addEventListener('submit', function (event) {
  event.preventDefault();
  if (dateInput.value !== '' &&
    moneyExpend.value !== '' &&
    categorySelect.value !== 'Seleccione Categoria') {
    Swal.fire({
      icon: 'success',
      title: 'Registrado!',
    })
    loadData()
    showData()
    setInterval(function () {
      location.reload()
    }, 1850)
  } else {
    Swal.fire('Completa los datos')
  }
});

function loadData() {
  const date = dateInput.value
  const dateSegmented = date.split("T")[0];
  //take select value
  let valueSelect = categorySelect.value
  //extract option text
  let valueText = categorySelect.options[categorySelect.selectedIndex].text
  const uploadData = {
    fecha: dateSegmented,
    monto: moneyExpend.value,
    categoria: valueText,
    descripcion: descriptionExpend.value
  }
  let stringUploadData = JSON.stringify(uploadData)
  localStorage.setItem(id, stringUploadData)
}

function showData() {

  //create a variable to store keys of the objet
  let claves = Object.keys(localStorage);
  //use foreach to access 'key' and elemento variable store key of local storage after parse elemento to allow access to theri individual propieties
  claves.forEach(key => {

    let elemento = localStorage.getItem(key);
    let parsedElement = JSON.parse(elemento);
    // console.log('valores Todos ', elemento)
    //create element and insert data
    let li = document.createElement('li');
    li.classList.add('list-group-item')
    display.appendChild(li);
    li.innerHTML = `<strong>Fecha:</strong>${parsedElement.fecha} <strong>Monto</strong>:${parsedElement.monto}  <strong>Categoria</strong>:${parsedElement.categoria} <strong>Descripcion:</strong>${parsedElement.descripcion.toUpperCase()}`;
    // console.log(parsedElement.descripcion)
    categories.push(parsedElement.categoria)
    sumaGastos.push(parseInt(parsedElement.monto))


  });
}
showData()

function totalGastos() {
  total = 0;
  for (i = 0; i < sumaGastos.length; i++) {
    total += sumaGastos[i]
  }
  let sum = document.createElement('p')
  Gastos.appendChild(sum)
  sum.innerText = `El Gasto Total es $${total}`;
  ///chartjs
  var ctx = document.getElementById('miGrafico').getContext('2d');
  var myDonutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [`Gasto Total `],
      datasets: [{
        data: [total], // El valor de la variable y el valor restante
        backgroundColor: ['#e1b232']
      }],
    },
  });
}

// Contar la cantidad de veces que aparece cada categoría
categories.forEach(category => {
  if (categoryCount.hasOwnProperty(category)) {
    categoryCount[category]++;
  } else {
    categoryCount[category] = 1;
  }
});

// Preparar los datos para el gráfico
const chartData = Object.values(categoryCount);
const chartLabels = Object.keys(categoryCount);

// Crear el gráfico usando Chart.js
const ctx = document.getElementById('myChart').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: chartLabels,
    datasets: [{
      label: 'Gastos Habituales',
      data: chartData,
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(201, 203, 207, 0.6)'
      ],
      borderWidth: 3
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }

  }
});

totalGastos()
clear.addEventListener('click', function () {

  let text = 'Seguro de Eliminar TODOS los REGISTROS?'
  if (confirm(text)) {
    //detele all data 
    localStorage.clear();
    location.reload()
  } else {
    //do nothing

    // console.log('no')
  }

})

document.getElementById('captureScreenshot').addEventListener('click', () => {
  const content = document.getElementById('content');

  // Capturar una captura de pantalla del contenido usando html2canvas
  html2canvas(content).then(canvas => {
    // Convertir el canvas en una imagen base64
    const screenshotData = canvas.toDataURL('image/png');

    // Crear un enlace para descargar la imagen
    const link = document.createElement('a');
    link.href = screenshotData;
    link.download = 'screenshot.png';

    // Hacer clic en el enlace para iniciar la descarga
    link.click();
  });
});

if (total > 0) {
  show()
}

verAnteriores.addEventListener('click', function () {
  if (total <= 1) {
    Swal.fire('NO HAY REGISTROS ANTERIORES')
  }
})

function show() {
  content.classList.toggle('hide')
  clear.classList.toggle('hide')
  capturescreen.classList.toggle('hide')
}

//my apologies to mix lenguages,wont happend again