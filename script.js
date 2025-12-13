const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const recipesContainer = document.getElementById("recipes-container");

const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

async function fetchRecipes(query) {
  recipesContainer.innerHTML = "<h2>Loading recipes...</h2>";

  try {
    const url = `${API_URL}${query}`;
    const response = await fetch(url);
    const data = await response.json();
    displayRecipes(data.meals);
  } catch (error) {
    recipesContainer.innerHTML =
      "<h2>An error occurred while fetching recipes.</h2>";
    console.error("Fetch Error:", error);
  }
}
function displayRecipes(meals) {
  recipesContainer.innerHTML = "";

  if (!meals || meals.length === 0) {
    recipesContainer.innerHTML =
      "<h2>No recipes found. Try a different ingredient!</h2>";
    return;
  }

  meals.forEach((meal) => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");

    card.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width:100%; height:auto; border-radius: 4px;">
            <h3>${meal.strMeal}</h3>
            <button class="details-btn" data-meal-id="${meal.idMeal}">View Details</button>
        `;

    recipesContainer.appendChild(card);
  });
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();

  if (query) {
    fetchRecipes(query);
  }
});
