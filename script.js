// ===============================================
// 1. DOM ELEMENTS AND API CONFIGURATION
// ===============================================

// Main Search & Results
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

// All Container IDs
const recipesContainer = document.getElementById("recipes-container"); // Home (Search)
const recommendedContainer = document.getElementById("recommended-container"); // Explore
const trendingContainer = document.getElementById("trending-container"); // Explore
const favoritesContainer = document.getElementById("favorites-container"); // Favorites

// API URLs
const SEARCH_API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const DETAIL_API_URL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

// Modal
const modalOverlay = document.getElementById("recipe-modal-overlay");
const closeModalBtn = document.getElementById("close-modal-btn");
const modalContent = document.getElementById("modal-content");

// View Management
const navLinks = document.querySelectorAll(".nav-link");
const homeView = document.getElementById("home-view");
const exploreView = document.getElementById("explore-view");
const favoritesView = document.getElementById("favorites-view");

// ===============================================
// 2. FAVORITES UTILITY FUNCTIONS (LOCAL STORAGE)
// ===============================================

/** Retrieves the array of favorite meal IDs from localStorage. */
function getFavorites() {
  const favorites = localStorage.getItem("recipeFavorites");
  return favorites ? JSON.parse(favorites) : [];
}

/** Saves the array of favorite meal IDs back to localStorage. */
function saveFavorites(favoritesArray) {
  localStorage.setItem("recipeFavorites", JSON.stringify(favoritesArray));
}

/** Toggles the favorite status of a meal ID. */
function toggleFavorite(mealId) {
  let favorites = getFavorites();
  const index = favorites.indexOf(mealId);

  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(mealId);
  }

  saveFavorites(favorites);

  // If viewing the favorites page, refresh it
  if (favoritesView && favoritesView.classList.contains("active")) {
    fetchAndDisplayFavorites();
  }
  return index === -1;
}

// ===============================================
// 3. RECIPE FETCHING & RENDERING
// ===============================================

/** Fetches recipes based on a query and displays them in the main container. */
async function fetchRecipes(query) {
  recipesContainer.innerHTML = "<h2>Loading recipes...</h2>";

  try {
    const url = `${SEARCH_API_URL}${query}`;
    const response = await fetch(url);
    const data = await response.json();

    displayRecipes(data.meals, recipesContainer);
  } catch (error) {
    recipesContainer.innerHTML =
      '<p class="initial-text">An error occurred while fetching recipes. Please check your network.</p>';
    console.error("Fetch Error:", error);
  }
}

/** Dynamically creates and renders recipe cards into a specified container. */
function displayRecipes(meals, containerElement) {
  containerElement.innerHTML = "";

  if (!meals || meals.length === 0) {
    const message =
      containerElement.id === "favorites-container"
        ? "You haven't added any favorite recipes yet."
        : "No recipes found. Try a different ingredient!";
    containerElement.innerHTML = `<p class="initial-text">${message}</p>`;
    return;
  }

  // Controls horizontal vs grid layout
  if (containerElement.classList.contains("horizontal-list")) {
    containerElement.style.flexWrap = "nowrap";
  } else {
    containerElement.style.flexWrap = "wrap";
  }

  meals.forEach((meal) => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");
    const isFavorite = getFavorites().includes(meal.idMeal);

    // Use random or placeholder data for display consistency
    const randomTime = Math.floor(Math.random() * 45) + 15;
    const randomRating = (Math.random() * (5 - 3) + 3).toFixed(1);
    // Placeholder tags for visual completeness
    const randomTag = Math.random() < 0.5 ? "Quick Meal" : "Low-Carb";

    card.innerHTML = `
            <div class="recipe-card-header">
                <img src="${meal.strMealThumb}" alt="${
      meal.strMeal
    }" class="card-image">
                
                <span 
                    class="favorite-icon ${isFavorite ? "active" : ""}" 
                    data-meal-id="${meal.idMeal}">
                    &hearts; 
                </span>
            </div>
            <div class="card-content">
                <div class="card-header-info">
                    <span class="time-badge">~${randomTime} min</span>
                    <span class="rating">⭐ ${randomRating}</span> 
                </div>

                <h3 class="card-title">${meal.strMeal}</h3>
                
                <p class="card-metadata">${
                  meal.strCategory || "Unknown Category"
                }, ${meal.strArea || "Unknown Area"}</p>

                <div class="card-tags">
                    <span class="tag health">${randomTag}</span>
                </div>
                
                <button class="details-btn" data-meal-id="${
                  meal.idMeal
                }">View Details</button>
            </div>
        `;
    containerElement.appendChild(card);
  });
}

// ===============================================
// 4. RECIPE DETAILS & VIEW MANAGEMENT FUNCTIONS
// ===============================================

/** Fetches a single recipe by ID and populates the modal. */
async function fetchRecipeDetails(mealId) {
  modalContent.innerHTML = "<h2>Loading details...</h2>";
  modalOverlay.classList.add("open");

  try {
    const url = `${DETAIL_API_URL}${mealId}`;
    const response = await fetch(url);
    const data = await response.json();
    const meal = data.meals ? data.meals[0] : null;

    if (meal) {
      displayModalContent(meal);
    } else {
      modalContent.innerHTML = "<h2>Details not found for this recipe.</h2>";
    }
  } catch (error) {
    modalContent.innerHTML = "<h2>Error fetching recipe details.</h2>";
    console.error("Detail Fetch Error:", error);
  }
}

/** Populates the modal with the detailed recipe information. (UPDATED) */
function displayModalContent(meal) {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    // Only add if ingredient is present
    if (ingredient && ingredient.trim() !== "") {
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    }
  }

  modalContent.innerHTML = `
        <div class="modal-header">
            <h2>${meal.strMeal}</h2>
            <p class="modal-meta">Category: <strong>${
              meal.strCategory
            }</strong> | Area: <strong>${meal.strArea}</strong></p>
        </div>
        
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        
        <h3>Ingredients</h3>
        <ul class="ingredients-list">${ingredientsList}</ul>
        
        <h3>Instructions</h3>
        <p>${meal.strInstructions.replace(/\r\n/g, "<br><br>")}</p>
        
        ${
          meal.strYoutube
            ? `<a href="${meal.strYoutube}" target="_blank" class="youtube-link">Watch Instructions on YouTube</a>`
            : ""
        }
    `;
}

/** Fetches and displays all recipes saved in localStorage for the Favorites view. */
async function fetchAndDisplayFavorites() {
  const favoriteIds = getFavorites();
  favoritesContainer.innerHTML = "<h2>Loading favorites...</h2>";

  if (favoriteIds.length === 0) {
    favoritesContainer.innerHTML =
      '<p class="initial-text">You haven\'t added any favorite recipes yet.</p>';
    return;
  }

  try {
    const detailPromises = favoriteIds.map((mealId) =>
      fetch(`${DETAIL_API_URL}${mealId}`)
        .then((res) => res.json())
        .then((data) => data.meals[0])
    );

    const favoriteMeals = await Promise.all(detailPromises);
    const validFavoriteMeals = favoriteMeals.filter((meal) => meal !== null);

    displayRecipes(validFavoriteMeals, favoritesContainer);
  } catch (error) {
    favoritesContainer.innerHTML = "<h2>Error loading your favorites.</h2>";
    console.error("Favorites Load Error:", error);
  }
}

/** Utility to switch the active content view and update nav link */
function switchView(targetViewId, clickedLink) {
  // 1. Update navigation active state
  navLinks.forEach((link) => link.classList.remove("active"));
  clickedLink.classList.add("active");

  // 2. Update content view visibility
  document
    .querySelectorAll(".view")
    .forEach((view) => view.classList.add("hidden"));

  const targetView = document.getElementById(targetViewId);
  if (targetView) {
    targetView.classList.remove("hidden");
    targetView.classList.add("active");
  }
}

// ===============================================
// 5. EVENT LISTENERS
// ===============================================

// Search Form Submission
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();

  searchInput.value = "";

  if (query) {
    // Switch to Home view and set active link
    const homeLink = document.querySelector(
      '.nav-link[data-view-id="home-view"]'
    );
    switchView("home-view", homeLink);
    fetchRecipes(query);
  }
});

// Handle Sidebar Navigation
navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const targetViewId = link.dataset.viewId;
    switchView(targetViewId, link);

    if (targetViewId === "favorites-view") {
      fetchAndDisplayFavorites();
    } else if (targetViewId === "explore-view") {
      // Load content only if it hasn't been loaded before
      if (recommendedContainer.innerHTML.includes("Loading")) {
        loadInitialContent();
      }
    }
  });
});

// Consolidated Click Handler for Details Button and Favorites Icon
function handleRecipeCardClick(event) {
  const detailsButton = event.target.closest(".details-btn");
  const icon = event.target.closest(".favorite-icon");

  if (detailsButton) {
    const mealId = detailsButton.dataset.mealId;
    fetchRecipeDetails(mealId);
  }

  if (icon) {
    const mealId = icon.dataset.mealId;
    const wasAdded = toggleFavorite(mealId);

    if (wasAdded) {
      icon.classList.add("active");
    } else {
      icon.classList.remove("active");
    }
  }
}

// Event Delegation for All Recipe Containers
recipesContainer.addEventListener("click", handleRecipeCardClick);
if (recommendedContainer)
  recommendedContainer.addEventListener("click", handleRecipeCardClick);
if (trendingContainer)
  trendingContainer.addEventListener("click", handleRecipeCardClick);
if (favoritesContainer)
  favoritesContainer.addEventListener("click", handleRecipeCardClick);

// Modal Closing Listeners
closeModalBtn.addEventListener("click", () => {
  modalOverlay.classList.remove("open");
});

modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    modalOverlay.classList.remove("open");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    modalOverlay.classList.remove("open");
  }
});

// ===============================================
// 6. INITIALIZATION (Loads content for the EXPLORE view)
// ===============================================

async function loadInitialContent() {
  if (recommendedContainer)
    recommendedContainer.innerHTML = "<h2>Loading Recommended...</h2>";
  if (trendingContainer)
    trendingContainer.innerHTML = "<h2>Loading Trending...</h2>";

  // Fetch for Recommended
  await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=chicken")
    .then((res) => res.json())
    .then((data) => {
      if (data.meals && recommendedContainer) {
        displayRecipes(data.meals.slice(0, 5), recommendedContainer);
      }
    })
    .catch((error) =>
      console.error("Error loading recommended recipes:", error)
    );

  // Fetch for Trending
  await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=beef")
    .then((res) => res.json())
    .then((data) => {
      if (data.meals && trendingContainer) {
        displayRecipes(data.meals.slice(0, 5), trendingContainer);
      }
    })
    .catch((error) => console.error("Error loading trending recipes:", error));
}
