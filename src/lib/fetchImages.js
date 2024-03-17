/**
 * A script for fetching images and updating the initial dataset of recipes
 */
const dotenv = require("dotenv");
dotenv.config({ path: "../../.env.local" });

const fs = require("fs");
const axios = require("axios");
const util = require("util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function fetchImageURL(mealName) {
  const options = {
    method: "GET",
    url: "https://real-time-image-search.p.rapidapi.com/search",
    params: {
      query: mealName,
      region: "us",
      file_type: "png",
      aspect_ratio: "square",
    },
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": "real-time-image-search.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const image = response.data.data[0];

    return {
      title: mealName,
      url: image.url,
      width: image.width,
      height: image.height,
      source: image.source,
      source_url: image.source_url,
    };
  } catch (error) {
    console.error(error);
  }
}

async function updateImageURLs(index) {
  if (!index) { return; }

  const data = await readFile("../../initialSelectionMenu.json", "utf8");
  const menu = JSON.parse(data);
  const recipes = menu.recipes;
  const recipe = recipes[index];

  const image = await fetchImageURL(recipe.name);
  recipe.image = image;
  menu.recipes = recipes;

  await writeFile(
    "../../initialSelectionMenu.json",
    JSON.stringify(menu, null, 2),
    "utf8"
  );
}

updateImageURLs(process.argv[2]).catch(console.error);
