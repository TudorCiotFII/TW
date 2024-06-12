const barChartTab = document.getElementById("bar-chart-tab");
const exportButton = document.getElementById("export-button");
const tabButtons = document.querySelectorAll(".tab button");
const resultsButton = document.querySelector(".results-button");
let chartInstance = null;

barChartTab.classList.add("active");

tabButtons.forEach((button) => {
  button.addEventListener("click", function () {
    tabButtons.forEach((btn) => btn.classList.remove("active"));

    console.log(button);
    button.classList.add("active");
  });
});

const modifyDropdownYears = (select) => {
  select.innerHTML = "";
  for (let i = 2015; i <= 2023; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.innerText = i;
    select.appendChild(option);
  }
};

// event listeners
resultsButton.addEventListener("click", function () {
  const select1 = document.getElementById("select-1");
  const select2 = document.getElementById("select-2");
  const value1 = select1.value;
  const value2 = select2.value;

  const activeTab = document.querySelector(".tab button.active");

  if (activeTab.id === "bar-chart-tab") {
    loadChart("bar", value1, value2);
  } else if (activeTab.id === "pie-chart-tab") {
    if (value1 < value2) {
      loadChart("pie", value1, value2);
    } else {
      alert("Year 1 must be smaller than Year 2");
    }
  } else if (activeTab.id === "line-chart-tab") {
    loadChart("line", value1, value2);
  }
});

exportButton.addEventListener("click", function () {
  const exportSelect = document.getElementById("export-select");
  const exportFormat = exportSelect.value;

  switch (exportFormat) {
    case "CSV":
      exportAsCSV();
      break;
    case "WebP":
      exportAsWebP();
      break;
    case "SVG":
      exportAsSVG(chartInstance);
      break;
    default:
      alert("Invalid export format");
  }
});

//exports
const exportAsCSV = () => {
  const activeTab = document.querySelector(".tab button.active");
  const chartData = chartInstance.data;
  const labels = chartData.labels;
  const datasets = chartData.datasets;

  let csvContent = "data:text/csv;charset=utf-8,";

  if (activeTab.id === "bar-chart-tab") {
    csvContent += "Year,Genre,Data,Genre,Data\n";
  } else if (activeTab.id === "pie-chart-tab") {
    csvContent += "Genre,Data\n";
  } else if (activeTab.id === "line-chart-tab") {
    csvContent += "Month,Genre,Data\n";

    for (let i = 0; i < labels.length; i++) {
      let row;
      if (activeTab.id === "bar-chart-tab") {
        const genres = labels[i].split(",");
        const label1 = datasets[0].label;
        const label2 = datasets[1].label;
        let data1 = datasets[0].data[i];
        let data2 = datasets[1].data[i];

        if (data1 == undefined) {
          data1 = "Not enough data";
        }
        if (data2 == undefined) {
          data2 = "Not enough data";
        }

        genres.forEach((genre) => {
          row = `${genre},${label1},${data1},${label2},${data2}\n`;
          csvContent += row;
        });
      } else if (activeTab.id === "pie-chart-tab") {
        const label = labels[i];
        const data = datasets[0].data[i];
        row = `${label},${data}\n`;
        csvContent += row;
      } else if (activeTab.id === "line-chart-tab") {
        const genres = labels[i].split(",");
        const label1 = datasets[0].label;
        let data1 = datasets[0].data[i];

        if (data1 == undefined) {
          data1 = "Not enough data";
        }

        genres.forEach((genre) => {
          row = `${genre},${label1},${data1}\n`;
          csvContent += row;
        });
      }
    }
  }

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);

  if (activeTab.id === "bar-chart-tab") {
    link.setAttribute("download", "bar_chart_data.csv");
  } else if (activeTab.id === "pie-chart-tab") {
    link.setAttribute("download", "pie_chart_data.csv");
  } else if (activeTab.id === "line-chart-tab") {
    link.setAttribute("download", "line_chart_data.csv");
  }

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};

const exportAsWebP = () => {
  const canvas = document.querySelector("#chart");
  const link = document.createElement("a");

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "chart.webp");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, "image/webp");
};

let chartOptions;

const exportAsSVG = (chartInstance) => {
  const svgData = chartInstance.outerHTML;
  const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
  const svgUrl = URL.createObjectURL(svgBlob);

  const link = document.createElement("a");
  link.setAttribute("href", svgUrl);
  link.setAttribute("download", "chart.svg");

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(svgUrl);
};

const loadChart = (chartType, value1, value2) => {
  const URL = `http://localhost:3000/stats/${chartType}/${value1}/${value2}`;

  fetch(URL)
    .then((res) => res.json())
    .then((data) => {
      console.log(chartType, data);
      showChart(data, chartType);
    });
};

const showChart = async (dataInfo, chartType) => {
  switch (chartType) {
    case "bar":
      label1 = document.getElementById("label-1");
      label2 = document.getElementById("label-2");

      if (label1.textContent != "Genre 1" && label2.textContent != "Genre 2") {
        label1.textContent = "Genre 1";
        label2.textContent = "Genre 2";
        loadAllGenres();
      }
      const firstChart = document.getElementById("chart");
      const genreName1 = dataInfo[0].genre.name;
      const years = dataInfo[0].profit.map((item) => item.year);
      const profits1 = dataInfo[0].profit.map((item) => item.profit);

      const genreName2 = dataInfo[1].genre.name;
      const profits2 = dataInfo[1].profit.map((item) => item.profit);

      if (chartInstance) {
        chartInstance.destroy();
      }

      chartOptions = {
        type: "bar", // bar, horizontalBar, pie, line, doughnut, radar, polarArea

        data: {
          labels: years,

          datasets: [
            {
              label: genreName1,
              data: profits1,
              backgroundColor: "#d27685",
            },

            {
              label: genreName2,
              data: profits2,
              backgroundColor: "#4db8ff",
            },
          ],
        },

        options: {
          scales: {
            y: {
              ticks: {
                color: "#fff",
              },
            },
            x: {
              ticks: {
                color: "#fff",
              },
            },
          },

          plugins: {
            title: {
              display: true,
              text: "Profit comparison of movies launched in the last 5 years per genre",
              color: "#fff",
              font: {
                size: 18,
              },
            },

            legend: {
              labels: {
                color: "#fff",
              },
            },
          },
        },
      };

      chartInstance = new Chart(firstChart, chartOptions);
      break;
    case "pie":
      label1 = document.getElementById("label-1");
      label2 = document.getElementById("label-2");
      select1 = document.getElementById("select-1");
      select2 = document.getElementById("select-2");
      if (label1.textContent != "Year 1" && label2.textContent != "Year 2") {
        label1.textContent = "Year 1";
        label2.textContent = "Year 2";
        modifyDropdownYears(select1);
        modifyDropdownYears(select2);
      }
      const secondChart = document.getElementById("chart");
      const genres = [];
      for (object of dataInfo) {
        genres.push(object.genre_name);
      }
      const popularityAverages = [];
      for (object of dataInfo) {
        popularityAverages.push(object.popularityAverage);
      }

      if (chartInstance) {
        chartInstance.destroy();
      }

      const chartDiv = document.getElementById("chart-div");
      chartDiv.style.height = "80%";

      chartInstance = new Chart(secondChart, {
        type: "pie",
        data: {
          datasets: [
            {
              data: popularityAverages,
              backgroundColor: [
                "red",
                "blue",
                "yellow",
                "green",
                "purple",
                "gray",
              ],
              borderWidth: 0,
            },
          ],
          labels: genres,
        },

        options: {
          plugins: {
            title: {
              display: true,
              text: "Popularity Average by Genre",
              color: "#fff",
              font: {
                size: 18,
              },
            },

            legend: {
              labels: {
                color: "#fff",
              },
            },
          },
        },
      });
      break;
    case "line":
      const thirdChart = document.getElementById("chart");
      label1 = document.getElementById("label-1");
      label2 = document.getElementById("label-2");
      select1 = document.getElementById("select-1");
      select2 = document.getElementById("select-2");

      if (label1.textContent != "Genre" && label2.textContent != "Year") {
        label1.textContent = "Genre";
        label2.textContent = "Year";
        modifyDropdownYears(select2);
        prepareLineData();
      }

      const months = [];
      const voteAverages = [];
      const genreName = dataInfo.genre.name;
      console.log(genreName);
      for (object of dataInfo.voteAveragePerMonth) {
        months.push(object.month);
        voteAverages.push(object.voteAverage);
      }

      if (chartInstance) {
        chartInstance.destroy();
      }

      chartInstance = new Chart(thirdChart, {
        type: "line", // bar, horizontalBar, pie, line, doughnut, radar, polarArea

        data: {
          labels: months,
          datasets: [
            {
              label: genreName,
              data: voteAverages,
              backgroundColor: "#4db8ff",
            },
          ],
        },

        options: {
          animation: false,
          resposive: false,
          maintainAspectRatio: false,
          scales: {
            y: {
              ticks: {
                color: "#fff",
              },
            },
            x: {
              ticks: {
                color: "#fff",
              },
            },
          },

          plugins: {
            title: {
              display: true,
              text: "Vote Average per month of a genre in a year",
              color: "#fff",
              font: {
                size: 18,
              },
            },
            legend: {
              labels: {
                color: "#fff",
              },
            },
          },
        },
      });
  }
};

const prepareLineData = async (data) => {
  const URL = `http://localhost:3000/genres/1`;

  await fetch(URL)
    .then((res) => res.json())
    .then((data) => {
      processLineData(data);
    });
};

const processLineData = async (data) => {
  const select1 = document.getElementById("select-1");
  select1.innerHTML = "";
  for (genre of data) {
    const option = document.createElement("option");
    option.value = genre.id;
    option.innerText = genre.name;
    select1.appendChild(option);
  }
};

const loadAllGenres = async (data) => {
  const URL = `http://localhost:3000/genres/1`;

  await fetch(URL)
    .then((res) => res.json())
    .then((data) => {
      processGenres(data);
    });
};

const processGenres = async (data) => {
  const select1 = document.getElementById("select-1");
  select1.innerHTML = "";
  for (genre of data) {
    const option = document.createElement("option");
    option.value = genre.id;
    option.innerText = genre.name;
    select1.appendChild(option);
  }

  const select2 = document.getElementById("select-2");
  select2.innerHTML = "";
  for (genre of data) {
    const option = document.createElement("option");
    option.value = genre.id;
    option.innerText = genre.name;
    select2.appendChild(option);
  }
};

loadAllGenres();
loadChart("bar", "28", "12");
