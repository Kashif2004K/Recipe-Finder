// --- 1. DOM Element Selection ---
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const recipesContainer = document.getElementById("recipes-container");
// Note: We are targeting the 'All Search Results' container for the main search

// The MealDB API endpoint for searching by ingredient/name
const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

// --- 2. Asynchronous Function to Fetch Recipes ---
async function fetchRecipes(query) {
  // Clear any previous text/results in the main search container
  recipesContainer.innerHTML = "<h2>Loading recipes...</h2>";

  try {
    const url = `${API_URL}${query}`;
    const response = await fetch(url);
    const data = await response.json();

    // data.meals is the array of results
    displayRecipes(data.meals);
  } catch (error) {
    // Handle any errors during the fetch or JSON parsing
    recipesContainer.innerHTML =
      "<h2>An error occurred while fetching recipes. Please check your network.</h2>";
    console.error("Fetch Error:", error);
  }
}

// --- 3. Function to Display Recipes with Detailed Card Structure ---
function displayRecipes(meals) {
  // Use .horizontal-list style if there are only a few results,
  // or use a grid (recipes-container) for many results.
  // For now, we'll focus on the card structure.

  recipesContainer.innerHTML = ""; // Start by clearing existing content

  if (!meals || meals.length === 0) {
    recipesContainer.innerHTML =
      '<p class="initial-text">No recipes found. Try a different ingredient!</p>';
    return;
  }

  // Since the main recipes-container is a CSS Grid, we loop through and create the cards
  meals.forEach((meal) => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");

    // --- Complex Card HTML Template ---
    card.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${
      meal.strMeal
    }" class="card-image">
            <div class="card-content">
                <div class="card-header-info">
                    <span class="time-badge">25 min</span>
                    <span class="rating">⭐ 4.5</span> 
                </div>

                <h3 class="card-title">${meal.strMeal}</h3>
                
                <p class="card-metadata">${
                  meal.strCategory || "Unknown Category"
                }, ${meal.strArea || "Unknown Area"}</p>
                
                <div class="card-tags">
                    <span class="tag health">Heart-Healthy</span>
                    <span class="tag gluten">Gluten Free</span>
                </div>
                
                <button class="details-btn" data-meal-id="${
                  meal.idMeal
                }">View Details</button>
            </div>
        `;

    // Add the new card to the container
    recipesContainer.appendChild(card);
  });
}

// --- 4. Event Listener for the Search Form ---
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();

  // Clear the input after searching for a cleaner feel
  searchInput.value = "";

  if (query) {
    fetchRecipes(query);
  }
});
