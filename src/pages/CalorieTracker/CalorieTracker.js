import React, { useEffect, useState } from "react";
import foods from "./nutritiondata";
import NavMargin from "../../components/NavMargin";
import {} from "./calorietracker.css";
import { VictoryPie } from "victory";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { MdOutlineNetworkWifi1Bar } from "react-icons/md";
import { MdOutlineNetworkWifi3Bar } from "react-icons/md";
import { MdOutlineSignalWifi4Bar } from "react-icons/md";
import Footer from "../../components/Footer/Footer";
import { IoMdDownload } from "react-icons/io";

function CalorieTracker() {
  const [nutritionData] = useState(foods);
  const [filteredNutritionData, setFilteredNutritionData] = useState(foods);
  const [currentMeal, setCurrentMeal] = useState([]);
  const [currentMealStats, setCurrentMealStats] = useState({
    no_of_items: 0,
    t_calories: 0,
    t_serving: 0,
    t_carbs: 0,
    t_protein: 0,
    t_sugars: 0,
    t_fats: 0,
    t_fiber: 0,
    t_iron: 0,
  });
  let [max_per_page, setMaxPerPage] = useState(20);
  let [max_pagenum, set_max_pagenum] = useState(
    Math.ceil(filteredNutritionData.length / max_per_page)
  );
  let [pagenum, setPageNum] = useState(1);
  let [searchInput, setSearchInput] = useState("");
  let [totalFoodAmount, setTotalFoodAmount] = useState(0);
  useEffect(() => {
    set_max_pagenum(Math.ceil(filteredNutritionData.length / max_per_page));
    setPageNum(1);
  }, [filteredNutritionData]);

  let checkCurrentMeal = (id) => {
    for (let j = 0; j < currentMeal.length; j++) {
      if (currentMeal[j].id === id) {
        return true;
      }
    }
    return false;
  };

  let addMeal = (fooditem) => {
    setCurrentMeal([
      ...currentMeal,
      {
        id: fooditem.id,
        name: fooditem.foodname,
        calories: fooditem.calories,
        carbs: fooditem.carbs,
        protein: fooditem.protein,
        sugar: fooditem.sugar,
        fats: fooditem.fats,
        fiber: fooditem.fiber,
        iron: fooditem.iron,
      },
    ]);
    setCurrentMealStats({
      no_of_items: currentMealStats.no_of_items + 1,
      t_calories: currentMealStats.t_calories + fooditem.calories,
      t_serving: currentMealStats.t_serving + fooditem.user_serving,
      t_carbs: currentMealStats.t_carbs + fooditem.carbs,
      t_protein: currentMealStats.t_protein + fooditem.protein,
      t_sugars: currentMealStats.t_sugars + fooditem.sugar,
      t_fats: currentMealStats.t_fats + fooditem.fats,
      t_fiber: currentMealStats.t_fiber + fooditem.fiber,
      t_iron: currentMealStats.t_iron + fooditem.iron,
    });
    setTotalFoodAmount(
      totalFoodAmount +
        fooditem.carbs +
        fooditem.protein +
        fooditem.sugar +
        fooditem.fats +
        fooditem.fiber +
        fooditem.iron / 1000
    );
  };
  const searchValue = (event) => {
    event.preventDefault();
    searchInput !== ""
      ? setFilteredNutritionData(
          nutritionData.filter((food) => {
            return food.foodname
              .toLowerCase()                           //ensures capitalization doesnt impact search results
              .includes(searchInput.toLowerCase());    //filters out objects which have a substring that matches the search input.
          })
        )
      : setFilteredNutritionData(nutritionData);       //Handling abnormal data
  };

  let removeMeal = (fooditem) => {
    setCurrentMeal(currentMeal.filter((item) => item.id !== fooditem.id));
    setCurrentMealStats({
      no_of_items: currentMealStats.no_of_items - 1,
      t_calories: currentMealStats.t_calories - fooditem.calories,
      t_serving: currentMealStats.t_serving - fooditem.user_serving,
      t_carbs: currentMealStats.t_carbs - fooditem.carbs,
      t_protein: currentMealStats.t_protein - fooditem.protein,
      t_sugars: currentMealStats.t_sugars - fooditem.sugar,
      t_fats: currentMealStats.t_fats - fooditem.fats,
      t_fiber: currentMealStats.t_fiber - fooditem.fiber,
      t_iron: currentMealStats.t_iron - fooditem.iron,
    });
    setTotalFoodAmount(
      currentMeal.length === 0
        ? 0
        : totalFoodAmount -
            (fooditem.carbs +
              fooditem.protein +
              fooditem.sugar +
              fooditem.fats +
              fooditem.fiber +
              fooditem.iron / 1000)
    );
  };

  let exportToCsv = () => {
    if (currentMeal.length > 0) {
      const csvRows = [];
      const headers = Object.keys(currentMeal[0]).join(",");          //creates a row for all parameter keys (acting as the table headings)
      csvRows.push(headers);                                          //push this row as the first row

      currentMeal.forEach((row) => {                                  //loop over each object in the array object
        let values = Object.values(row)
          .map((value) => `"${value}"`)                               //map all the values in the object and join with a comma
          .join(",");
        csvRows.push(values);                                         //immediately push into csvRows
      });

      csvRows.push(Object.keys(currentMealStats).join(","));          //add additional rows for meal statistics
      csvRows.push(Object.values(currentMealStats).join(","));
      const csvString = csvRows.join("\n");                           //combine all the rows, joining them with a line break
      const blob = new Blob([csvString], { type: "text/csv" });       //create a new blob (object) file with the csv rows

      const url = URL.createObjectURL(blob);                          //this blob is created and is converted into an element
      const a = document.createElement("a");
      a.href = url;
      const today = new Date();
      a.download = `currentMeal-${today.toISOString()}.csv`;          //dynamic file naming
      a.click();                                                      //simulate clikcing the link leading to download

      URL.revokeObjectURL(url);
    } else {
      alert("There are no items added to the meal yet");              //error handling
    }
  };

  return (
    <>
      <NavMargin />
      <div className="calorie-tracker-container">
        <div className="menu-bar">
          <h2>My Caloric Intake</h2>
          <div className="meal-container-container">
            <div className="meal-container">
              {currentMeal.length !== 0 ? (
                currentMeal.map((mealItem) => {         //loops over currentMeal array object, storing each iteration's object in the mealItem object
                  return (
                    <>
                      <div className="meal-item">
                        <p id="meal-name">{mealItem.name}</p>
                        <div className="meal-item-info-container">
                          <p>
                            Calories:{" "}
                            <span className="meal-unit">
                              {mealItem.calories}
                            </span>
                          </p>
                          <div className="meal-item-serving-size">
                            <p>Serving Size:</p>
                            <input type="number" defaultValue={100} />
                            <p className="meal-unit">g</p>
                          </div>
                        </div>
                        <a
                          onClick={() => {
                            removeMeal(mealItem);
                          }}
                        >
                          Remove Item
                        </a>
                      </div>
                    </>
                  );
                })
              ) : (
                <p style={{ fontSize: "1vw" }}>
                  No Food Items added in the meal
                </p>
              )}
            </div>
          </div>
          <div className="meal-summary">
            <p id="meal-stat-tot-calories">
              Total Calories: <span>{currentMealStats.t_calories}</span>
            </p>
            <div className="meal-summary-data">
              <div className="meal-stat-container">
                <p>
                  <div
                    className="bullet-box-meal-stat"
                    style={{ background: "blue" }}
                  />
                  Total Carbs:{" "}
                  <span>{Math.round(currentMealStats.t_carbs)}g</span>
                  <span className="meal-comment">
                    {currentMeal.length === 0 ? (
                      ""
                    ) : currentMealStats.t_carbs / totalFoodAmount <= 0.3 ? (
                      <MdOutlineNetworkWifi1Bar
                        style={{ color: "var(--alert-two)" }}
                      />
                    ) : currentMealStats.t_carbs / totalFoodAmount >= 0.7 ? (
                      <MdOutlineSignalWifi4Bar
                        style={{ color: "var(--alert-light)" }}
                      />
                    ) : (
                      <MdOutlineNetworkWifi3Bar />
                    )}
                  </span>
                </p>
                <p>
                  <div
                    className="bullet-box-meal-stat"
                    style={{ background: "red" }}
                  />
                  Total Protein:{" "}
                  <span>{Math.round(currentMealStats.t_protein)}g</span>
                  <span className="meal-comment">
                    {currentMeal.length === 0 ? (
                      ""
                    ) : currentMealStats.t_protein / totalFoodAmount <= 0.05 ? (
                      <MdOutlineNetworkWifi1Bar
                        style={{ color: "var(--alert-two)" }}
                      />
                    ) : currentMealStats.t_protein / totalFoodAmount >= 0.3 ? (
                      <MdOutlineSignalWifi4Bar
                        style={{ color: "var(--alert-light)" }}
                      />
                    ) : (
                      <MdOutlineNetworkWifi3Bar />
                    )}
                  </span>
                </p>
                <p>
                  <div
                    className="bullet-box-meal-stat"
                    style={{ background: "lightgreen" }}
                  />
                  Total Sugar:{" "}
                  <span>{Math.round(currentMealStats.t_sugars)}g</span>
                  <span className="meal-comment">
                    {currentMeal.length === 0 ? (
                      ""
                    ) : currentMealStats.t_sugars / totalFoodAmount <= 0.05 ? (
                      <MdOutlineNetworkWifi1Bar
                        style={{ color: "var(--alert-two)" }}
                      />
                    ) : currentMealStats.t_sugars / totalFoodAmount >= 0.225 ? (
                      <MdOutlineSignalWifi4Bar
                        style={{ color: "var(--alert-light)" }}
                      />
                    ) : (
                      <MdOutlineNetworkWifi3Bar />
                    )}
                  </span>
                </p>
                <p>
                  <div
                    className="bullet-box-meal-stat"
                    style={{ background: "yellow" }}
                  />
                  Total Fats:{" "}
                  <span>{Math.round(currentMealStats.t_fats)}g</span>
                  <span className="meal-comment">
                    {currentMeal.length === 0 ? (
                      ""
                    ) : currentMealStats.t_fats / totalFoodAmount <= 0.1 ? (
                      <MdOutlineNetworkWifi1Bar
                        style={{ color: "var(--alert-two)" }}
                      />
                    ) : currentMealStats.t_fats / totalFoodAmount >= 0.3 ? (
                      <MdOutlineSignalWifi4Bar
                        style={{ color: "var(--alert-light)" }}
                      />
                    ) : (
                      <MdOutlineNetworkWifi3Bar />
                    )}
                  </span>
                </p>
                <p>
                  <div
                    className="bullet-box-meal-stat"
                    style={{ background: "white" }}
                  />
                  Total Fiber:{" "}
                  <span>{Math.round(currentMealStats.t_fiber)}g</span>
                  <span className="meal-comment">
                    {currentMeal.length === 0 ? (
                      ""
                    ) : currentMealStats.t_fiber / totalFoodAmount <= 0.01 ? (
                      <MdOutlineNetworkWifi1Bar
                        style={{ color: "var(--alert-two)" }}
                      />
                    ) : currentMealStats.t_fiber / totalFoodAmount >= 0.07 ? (
                      <MdOutlineSignalWifi4Bar
                        style={{ color: "var(--alert-light)" }}
                      />
                    ) : (
                      <MdOutlineNetworkWifi3Bar />
                    )}
                  </span>
                </p>
                <p>
                  <div
                    className="bullet-box-meal-stat"
                    style={{ background: "orange" }}
                  />
                  Total Iron:{" "}
                  <span>{Math.round(currentMealStats.t_iron)}mg</span>
                  <span className="meal-comment">
                    {currentMeal.length === 0 ? (
                      ""
                    ) : currentMealStats.t_iron / totalFoodAmount <= 0.2 ? (
                      <MdOutlineNetworkWifi1Bar
                        style={{ color: "var(--alert-two)" }}
                      />
                    ) : currentMealStats.t_fats / totalFoodAmount >= 0.4 ? (
                      <MdOutlineSignalWifi4Bar
                        style={{ color: "var(--alert-light)" }}
                      />
                    ) : (
                      <MdOutlineNetworkWifi3Bar />
                    )}
                  </span>
                </p>
              </div>
              <div className="meal-summary-pie-chart-container">
                {currentMeal.length === 0 ? (
                  <VictoryPie                     
                    labels={() => null}
                    data={[
                      {
                        x: "Carbs",
                        y: 1,
                      },
                      {
                        x: "Protein",
                        y: 1,
                      },
                      {
                        x: "Sugar",
                        y: 1,
                      },
                      {
                        x: "Fats",
                        y: 1,
                      },
                      {
                        x: "Fiber",
                        y: 1,
                      },
                      {
                        x: "Iron",
                        y: 1,
                      },
                    ]}
                    colorScale={[
                      "blue",
                      "red",
                      "lightgreen",
                      "yellow",
                      "white",
                      "orange",
                    ]}
                    padding={20}
                    innerRadius={60}
                  />
                ) : (
                  <VictoryPie                   
                    labels={() => null}
                    data={[
                      {
                        x: "Carbs",
                        y: parseInt(currentMealStats.t_carbs),
                      },
                      {
                        x: "Protein",
                        y: parseInt(currentMealStats.t_protein),
                      },
                      {
                        x: "Sugar",
                        y: parseInt(currentMealStats.t_sugars),
                      },
                      {
                        x: "Fats",
                        y: parseInt(currentMealStats.t_fats),
                      },
                      {
                        x: "Fiber",
                        y: parseInt(currentMealStats.t_fiber),
                      },
                      {
                        x: "Iron",
                        y: parseInt(currentMealStats.t_iron / 1000),
                      },
                    ]}
                    colorScale={[
                      "blue",
                      "red",
                      "lightgreen",
                      "yellow",
                      "white",
                      "orange",
                    ]}
                    padding={20}
                    innerRadius={60}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="calorie-tracker-list-container">
          <div className="ribbon-list-container">
            <form onSubmit={searchValue}>
              <input
                type="text"
                placeholder="Search Food Item"
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
              />
              <input type="submit" value={"Search"} />
              <input
                type="button"
                value={"Clear Filters"}
                onClick={() => {
                  setFilteredNutritionData(nutritionData);
                }}
              />
              <button onClick={exportToCsv}>
                <IoMdDownload />
              </button>
            </form>
          </div>
          <div className="food-items-container">
            {filteredNutritionData.length > 0 ? (
              filteredNutritionData
                .slice(               //splits food items based on page number. I.e: 
                                      // for page #1, index range would be 0-19, for Pg.2, it would be 20-39, etc. 
                  (pagenum - 1) * max_per_page,
                  (pagenum - 1) * max_per_page + (max_per_page - 1)
                )
                .map((fooditem) => {
                  return (
                    <>
                      <div className="food-item-container-container">
                        <div className="food-item-container">
                          <div className="food-item-left">
                            <h3>{fooditem.foodname}</h3>
                            <p>Per {fooditem.servingsize}g serving</p>
                          </div>
                          <div className="food-item-calorie">
                            <div className="food-item-calorie-chart">
                              <VictoryPie
                                data={[
                                  {
                                    x: "Calories",
                                    y: fooditem.calories,
                                  },
                                  {
                                    x: "Not Calories",
                                    y: 500 - fooditem.calories,
                                  },
                                ]}
                                labels={() => null}
                                colorScale={[
                                  "var(--secondary-one)",
                                  "var(--secondary-four)",
                                ]}
                                innerRadius={100}
                              />
                              <p className="calorie-val">{fooditem.calories}</p>
                            </div>

                            <p>calories</p>
                          </div>
                          <div className="food-item-nutrition-stats">
                            <div className="food-item-nutrition-stat">
                              <h4>Carbs</h4>
                              <p>
                                {Math.round(fooditem.carbs)}
                                <span>g</span>
                              </p>
                            </div>
                            <div className="food-item-nutrition-stat">
                              <h4>Protein</h4>
                              <p>
                                {Math.round(fooditem.protein)}
                                <span>g</span>
                              </p>
                            </div>
                            <div className="food-item-nutrition-stat">
                              <h4>Sugars</h4>
                              <p>
                                {Math.round(fooditem.sugar)}
                                <span>g</span>
                              </p>
                            </div>
                            <div className="food-item-nutrition-stat">
                              <h4>Fats</h4>
                              <p>
                                {Math.round(fooditem.fats)}
                                <span>g</span>
                              </p>
                            </div>
                            <div className="food-item-nutrition-stat">
                              <h4>Fiber</h4>
                              <p>
                                {Math.round(fooditem.fiber)}
                                <span>g</span>
                              </p>
                            </div>
                            <div className="food-item-nutrition-stat">
                              <h4>Iron</h4>
                              <p>
                                {Math.round(fooditem.iron)}
                                <span>mg</span>
                              </p>
                            </div>
                          </div>
                          <div className="add-to-tracker-button">
                            <button
                              className="add-to-tracker"
                              onClick={() => {
                                addMeal(fooditem);
                              }}
                              disabled={checkCurrentMeal(fooditem.id)}
                            >
                              {checkCurrentMeal(fooditem.id)
                                ? "Added to Daily Caloric Intake"
                                : "Add to Daily Caloric Intake"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })
            ) : (
              <>
                <div className="not-found-container">
                  <p>Food Item Not Found</p>
                </div>
              </>
            )}
          </div>
          <div className="food-items-container-buttons">
            <a
              onClick={() => {
                pagenum > 1 ? setPageNum(pagenum - 1) : setPageNum(pagenum);  //decreases page number given it is a posiitve integer
              }}
            >
              <MdOutlineKeyboardArrowLeft />
            </a>
            <p>
              {pagenum}/{max_pagenum}
            </p>
            <a
              onClick={() => {
                pagenum < max_pagenum                     //increases page number given that its lesser than the max number of pages
                  ? setPageNum(pagenum + 1)
                  : setPageNum(pagenum);
              }}
            >
              <MdKeyboardArrowRight />
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
export default CalorieTracker;
