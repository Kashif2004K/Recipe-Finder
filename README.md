# 👩‍🍳 Recipe Explorer Web Application

Welcome to the Recipe Explorer! This project is a front-end, single-page web application (SPA) designed to help users search, discover, and save their favorite meal recipes using the publicly available TheMealDB API.

The application features a modern, clean design with a focus on usability, fixed card layouts, and a highly responsive recipe detail view.

## ✨ Features

* **Integrated Search:** A dedicated Home view with a search bar to quickly find recipes by ingredient or name.
* **Structured Discovery (Explore):** Separate sections for "Recommended" and "Trending" recipes displayed in responsive horizontal lists.
* **Favorites Management:** Users can toggle a heart icon on any recipe card to save or remove it from a persistent "Favorites" list (stored in local storage).
* **Fixed Layout Cards:** Recipe cards maintain a consistent vertical height regardless of the length of the title or description, ensuring a clean grid layout.
* **Modern Detail Modal:** A stylish, full-featured modal view for recipe details, including:
    * Responsive sizing with internal scrolling (`max-height: 90vh`).
    * Clean, two-column "Ingredients" list.
    * Direct link to the recipe's YouTube video (if available).
* **SPA Navigation:** Smooth transition between views (Home, Explore, Favorites) handled by JavaScript, with the sidebar link visually highlighting the active section.
* **Light Theme:** A clean, vibrant color scheme utilizing white backgrounds, bright blue navigation accents, and green primary action buttons.

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Defines the structure and semantic elements of the application. |
| **CSS** | Provides modern styling, layout (Flexbox/Grid), and animation. |
| **JavaScript (ES6+)** | Handles all application logic, including API calls, DOM manipulation, navigation, and local storage management. |
| **TheMealDB API** | External data source for fetching all recipe and meal information. |

## 💡 Future Enhancements

These features could be considered for future development:

* **Filtering:** Implement functionality for the "Filter" button to allow searching by category, area, or ingredients.
* **Offline Support:** Utilize Service Workers for a basic level of caching and offline functionality.
* **Loading States:** Implement skeleton loaders or more sophisticated visual feedback during API fetches.
* **Accessibility:** Review and improve keyboard navigation and ARIA attributes for better accessibility.

## 🤝 Contribution

Contributions are welcome! If you have suggestions for improvement or new features, please open an issue or submit a pull request.
