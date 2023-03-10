const API_RANDOM = "https://api.thecatapi.com/v1/images/search?limit=3";
const API_FAVORITES = "https://api.thecatapi.com/v1/favourites";
const API_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_UPLOAD = "https://api.thecatapi.com/v1/images/upload";
const API_KEY =
  "live_xADZpNiQJgLW4UREtEKn1PAeF7lnLzZ9xpjzpk9UoVJMBZD5rXjYbRBhCKWKpAZw";

const spanError = document.querySelector("#error");

const img1 = null || document.querySelector("#img1");
const img2 = null || document.querySelector("#img2");
const img3 = null || document.querySelector("#img3");
const btn1 = document.querySelector("#btn1");
const btn2 = document.querySelector("#btn2");
const btn3 = document.querySelector("#btn3");

const button = document.querySelector(".container__button");
const containerFavorites = document.querySelector(
  ".favoritesMichis__container"
);

const form = document.querySelector("#uploading__form");

async function fetchData(urlApi, obj) {
  const response = await fetch(urlApi, obj);
  const data = await response.json();
  return data;
}

const generatePicture = async (urlApi) => {
  try {
    const cats = await fetchData(urlApi);
    img1.src = cats[0].url;
    img2.src = cats[1].url;
    img3.src = cats[2].url;

    btn1.onclick = () => saveFavoritesPicture(cats[0].id);
    btn2.onclick = () => saveFavoritesPicture(cats[1].id);
    btn3.onclick = () => saveFavoritesPicture(cats[2].id);
  } catch (error) {
    console.log(error);
  }
};

const loadFavoritesPicture = async (urlApi) => {
  try {
    const favoriteCatsChosen = await fetchData(urlApi, {
      method: "GET",
      headers: {
        "X-API-KEY": API_KEY,
      },
    });

    containerFavorites.innerHTML = "";
    let toRender = favoriteCatsChosen
      .map((cat) => {
        return `
      <article class="randomMichis__container-michi">
        <figure>
          <img src="${cat.image.url}" id="img1" alt="Foto de gato aleatorio" />
        </figure>
            <button id="delete__button">Delete michi to favorite</button>
      </article>
      `;
      })
      .join("");
    containerFavorites.innerHTML = toRender;

    const btnDelete = [...document.querySelectorAll("#delete__button")];

    favoriteCatsChosen.forEach((cat, i) => {
      btnDelete[i].onclick = () => deleteFavoritesPicture(cat.id);
    });
  } catch (error) {
    console.log(error);
  }
};

const saveFavoritesPicture = async (id) => {
  try {
    const favoriteCats = await fetchData(API_FAVORITES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
      },
      body: JSON.stringify({
        image_id: id,
      }),
    });

    loadFavoritesPicture(API_FAVORITES);
  } catch (error) {
    console.log(error);
  }
};

const deleteFavoritesPicture = async (id) => {
  try {
    const deleteCats = await fetchData(API_DELETE(id), {
      method: "DELETE",
      headers: {
        "X-API-KEY": API_KEY,
      },
    });

    loadFavoritesPicture(API_FAVORITES);
  } catch (error) {
    console.log(error);
  }
};

const uploadMichi = async () => {
  const formData = new FormData(form);
  const uploadImage = document.querySelector(".uploading__photo");

  const dataNewPicture = await fetchData(API_UPLOAD, {
    method: "POST",
    headers: {
      "X-API-KEY": API_KEY,
    },
    body: formData,
  });

  uploadImage.src = dataNewPicture.url;
  saveFavoritesPicture(dataNewPicture.id);
};

button.addEventListener("click", () => {
  generatePicture(API_RANDOM);
});

generatePicture(API_RANDOM);
loadFavoritesPicture(API_FAVORITES);
