// Chart.js Default Configs for Tailwind integration
Chart.defaults.color = '#57423a';
Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";

document.addEventListener('DOMContentLoaded', () => {
    // Set Current Date
    const dateDisplay = document.getElementById('current-date-display');
    if (dateDisplay) {
        const today = new Date();
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        dateDisplay.textContent = today.toLocaleDateString('es-ES', options);
    }

    initCharts();
});

function initCharts() {
    // Bar Chart: Ventas Semanales
    const ctxWeekly = document.getElementById('weekly-sales-chart');
    if (ctxWeekly) {
        new Chart(ctxWeekly, {
            type: 'bar',
            data: {
                labels: ['L', 'M', 'M', 'J', 'V', 'S'],
                datasets: [{
                    label: 'Ventas ($)',
                    data: [3200, 4100, 7800, 4600, 2450, 6200],
                    backgroundColor: [
                        '#e8e4df', // Light gray
                        '#e8e4df',
                        '#c05621', // Orange main
                        '#e8e4df',
                        '#e8e4df',
                        '#ffb596'  // Light orange 
                    ],
                    borderWidth: 0,
                    borderRadius: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false // simple clean design in screenshot
                    }
                },
                scales: {
                    y: {
                        display: false // no axis
                    },
                    x: {
                        display: false // no axis labels shown in image? actually the image shows no labels at all inside the bar, just the bars. I will hide axes to match perfectly.
                    }
                }
            }
        });
    }

    // Pie Chart: Distribución por Categoría
    const ctxCategory = document.getElementById('category-sales-chart');
    if (ctxCategory) {
        new Chart(ctxCategory, {
            type: 'pie',
            data: {
                labels: ['Platos Principales', 'Entrantes', 'Bebidas', 'Postres'],
                datasets: [{
                    data: [45, 20, 25, 10],
                    backgroundColor: [
                        '#c05621', // primary-container
                        '#d8e6a6', // secondary-container
                        '#dec0b5', // outline-variant
                        '#76766d'  // tertiary-container
                    ],
                    borderWidth: 2,
                    borderColor: '#fff8f3'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                }
            }
        });
    }
}