document.getElementById('btnBuscar').addEventListener('click', () => {
  const query = document.getElementById('inputBuscar').value.trim();

  if (query) {
    const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}`;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(data); // Verifica que los datos se están recibiendo
        displayResults(data.collection.items);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  } else {
    alert('Por favor, ingresa un texto para buscar.');
  }
});

function displayResults(items) {
  const resultsContainer = document.getElementById('scrollContainer');
  const navbar = document.getElementById('navbar-example2');

  // Limpiar resultados anteriores
  resultsContainer.innerHTML = ''; 

  // Si no hay resultados, mostrar un mensaje
  if (items.length === 0) {
    resultsContainer.innerHTML = '<p>No se encontraron resultados.</p>';
    resultsContainer.classList.remove('d-none'); // Asegura mostrar el contenedor
    navbar.classList.remove('d-none'); // Asegura mostrar la barra de navegación
    return;
  }

  // Crear la fila para las tarjetas
  const row = document.createElement('div');
  row.className = 'row row-cols-1 row-cols-md-3 g-4'; // Añadir espaciado entre las tarjetas

  // Recorrer los elementos recibidos
  items.forEach((item, index) => {
    const data = item.data[0]; 
    const title = data.title || 'Sin título'; 
    const description = data.description || 'Sin descripción disponible'; 
    const date = data.date_created || 'No especificada'; 
    const links = item.links || []; 
    const imageUrl = links.length > 0 ? links[0].href : 'https://via.placeholder.com/150';

    const cardId = `card-${index}`;

    // Crear la tarjeta
    const col = document.createElement('div');
    col.className = 'col'; // Cada tarjeta ocupa una columna
    
    col.innerHTML = `
      <div class="card h-100 d-flex flex-column" id="${cardId}" style="max-height: 700px;">
        <img src="${imageUrl}" class="card-img-top" style="width: 100%; height: 500px; object-fit: cover;" alt="${title}">
        <div class="card-body" style="flex-grow: 1; overflow-y: auto;">
          <h5 class="card-title">${title}</h5>
          <p class="card-text">${description}</p>
          <p><strong>Fecha:</strong> ${date}</p>
        </div>
      </div>
    `;

    // Añadir la tarjeta a la fila
    row.appendChild(col);
  });

  // Añadir la fila al contenedor
  resultsContainer.appendChild(row);

  // Mostrar los contenedores ahora que hay resultados
  resultsContainer.classList.remove('d-none');
  navbar.classList.remove('d-none');

  // Inicializar el ScrollSpy
  new bootstrap.ScrollSpy(document.body, {
    target: '#navbar-example2',
    offset: 50,
  });
}
