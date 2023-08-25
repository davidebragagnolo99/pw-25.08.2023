const apiUrl = "https://striveschool-api.herokuapp.com/api/product/";
const authorization =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU4Njk1MzY4NWVjNDAwMTQ1MGI4NWQiLCJpYXQiOjE2OTI5NTI5MTYsImV4cCI6MTY5NDE2MjUxNn0.KMfAGph0V0p0qoF1zZ4Z0XX3FRmheN_DBAEPJChAE8I";

const URLParams = new URLSearchParams(window.location.search);
const selectedId = URLParams.get("id");

const endpoint = selectedId ? apiUrl + selectedId : apiUrl;
const method = selectedId ? "GET" : "POST";

window.onload = () => {
  if (selectedId) {
    document.getElementById("back-office-title").innerText = "Modifica l'articolo selezionato:";
    document.getElementById("submitBtn").classList.add("d-none");
    document.getElementById("modify").classList.remove("d-none");
    document.getElementById("delete-btn").classList.remove("d-none");

    fecth(endpoint, {
      headers: {
        Authorization: authorization,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const { name, description, price, brand, imageUrl } = data;
        document.getElementById("name").value = name;
        document.getElementById("description").value = description;
        document.getElementById("price").value = price;
        document.getElementById("brand").value = brand;
        document.getElementById("URL").value = imageUrl;
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const handleDelete = () => {
  let areYouSure = confirm("Sei sicuro di voler eliminare questo articolo?");
  if (areYouSure) {
    try {
      fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: authorization,
        },
      }).then((res) => {
        if (res.ok) {
          alert("Prodotto eliminato correttamente");
          window.location.href = "index.html";
        } else {
          throw new Error("Eliminazione non riuscita");
        }
      });
    } catch (error) {
      console.log(err);
      alert("Eliminazione non riuscita");
    }
  }
};

const handleSubmit = (event) => {
  event.preventDefault();

  const product = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    brand: document.getElementById("brand").value,
    imageUrl: document.getElementById("URL").value,
  };

  fetch(endpoint, {
    method,
    headers: {
      Authorization: authorization,
      "Content-type": "application/json",
    },
    body: JSON.stringify(product),
  })
    .then(() => {
      if (!selectedId) {
        document.getElementById("name").value = "";
        document.getElementById("description").value = "";
        document.getElementById("price").value = "";
        document.getElementById("brand").value = "";
        document.getElementById("URL").value = "";
      } else {
        window.location.href = "index.html";
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

let modifyBtn1 = document.getElementById("modifyBtn");
modifyBtn1.addEventListener("click", () => {
  let cardModBtns = document.querySelectorAll("#cardModBtn");
  cardModBtns.forEach((cardModBtn) => {
    cardModBtn.style.display = "inline-block";
  });
});

window.onload = () => {
  fetch(apiUrl, {
    headers: {
      Authorization: authorization,
    },
  })
    .then((responseObj) => responseObj.json())
    .then((products) => {
      let row = document.getElementById("row1");
      row.innerText = "";
      products.forEach((product, index) => {
        let col = document.createElement("div");
        col.className = "col";
        col.classList.add("g-5");
        col.innerHTML = `
							<div class="card shadow border-warning rounded-3">
				                <img src="${products[index].imageUrl}" class="card-img-top img-fluid" alt="none">
				                    <div class="card-body">
				                        <h5 class="card-title">${products[index].name}</h5>
				                        <p class="card-text">${products[index].description}</p>
				                        <p class="card-text">€ ${products[index].price}</p>
				                        <a href="details.html?id=${products[index]._id}" class="btn btn-outline-warning text-dark">Scopri di piú</a>
				                        <a href="back-office.html?id=${products[index]._id}" id="cardModBtn" class="btn btn-secondary">Modifica</a>
					                </div>
					            </div>
							</div>`;
        row.appendChild(col);
      });
    });
};
