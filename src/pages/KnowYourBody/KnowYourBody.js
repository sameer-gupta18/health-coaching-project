import React, { useEffect, useState } from "react";
import NavMargin from "../../components/NavMargin";
import Header from "../../components/Header/Header";
import {} from "./knowyourbody.css";
import { GiWeightScale } from "react-icons/gi";
import { FaRuler } from "react-icons/fa6";
import rawdata from "./comments";
import Footer from "../../components/Footer/Footer";

function KnowYourBody() {
  let [male, setMale] = useState(true);
  let [age, setAge] = useState(0);
  let [height, setHeight] = useState(0);
  let [weight, setWeight] = useState(0);
  let [weightUnit, setWeightUnit] = useState("kgs");
  let [heightUnit, setHeightUnit] = useState("in");
  let [generated, setGenerated] = useState(false);
  let [data] = useState(rawdata);
  let [bmiNum, setBmiNum] = useState(0);
  let [description, setDescription] = useState();
  let [category, setCategory] = useState();
  useEffect(() => {
    if (age < 18) {
      if (bmiNum < 16) {
        setDescription(data[0].comments[0].description);
      } else if (bmiNum >= 16 && bmiNum < 20) {
        setDescription(data[0].comments[1].description);
      } else if (bmiNum >= 20 && bmiNum < 25) {
        setDescription(data[0].comments[2].description);
      } else {
        setDescription(data[0].comments[3].description);
      }
    } else if (age >= 18 && age < 25) {
      if (bmiNum < 16) {
        setDescription(data[1].comments[0].description);
      } else if (bmiNum >= 16 && bmiNum < 20) {
        setDescription(data[1].comments[1].description);
      } else if (bmiNum >= 20 && bmiNum < 25) {
        setDescription(data[1].comments[2].description);
      } else {
        setDescription(data[1].comments[3].description);
      }
    } else if (age >= 25 && age < 50) {
      if (bmiNum < 16) {
        setDescription(data[2].comments[0].description);
      } else if (bmiNum >= 16 && bmiNum < 20) {
        setDescription(data[2].comments[1].description);
      } else if (bmiNum >= 20 && bmiNum < 25) {
        setDescription(data[2].comments[2].description);
      } else {
        setDescription(data[2].comments[3].description);
      }
    } else {
      if (bmiNum < 16) {
        setDescription(data[3].comments[0].description);
      } else if (bmiNum >= 16 && bmiNum < 20) {
        setDescription(data[3].comments[1].description);
      } else if (bmiNum >= 20 && bmiNum < 25) {
        setDescription(data[3].comments[2].description);
      } else {
        setDescription(data[3].comments[3].description);
      }
    }

    if (age < 18) {
      if (bmiNum < 16) {
        setCategory(data[0].comments[0].category);
      } else if (bmiNum >= 16 && bmiNum < 20) {
        setCategory(data[0].comments[1].category);
      } else if (bmiNum >= 20 && bmiNum < 25) {
        setCategory(data[0].comments[2].category);
      } else {
        setCategory(data[0].comments[3].category);
      }
    } else if (age >= 18 && age < 25) {
      if (bmiNum < 16) {
        setCategory(data[1].comments[0].category);
      } else if (bmiNum >= 16 && bmiNum < 20) {
        setCategory(data[1].comments[1].category);
      } else if (bmiNum >= 20 && bmiNum < 25) {
        setCategory(data[1].comments[2].category);
      } else {
        setCategory(data[1].comments[3].category);
      }
    } else if (age >= 25 && age < 50) {
      if (bmiNum < 16) {
        setCategory(data[2].comments[0].category);
      } else if (bmiNum >= 16 && bmiNum < 20) {
        setCategory(data[2].comments[1].category);
      } else if (bmiNum >= 20 && bmiNum < 25) {
        setCategory(data[2].comments[2].category);
      } else {
        setCategory(data[2].comments[3].category);
      }
    } else {
      if (bmiNum < 16) {
        setCategory(data[3].comments[0].category);
      } else if (bmiNum >= 16 && bmiNum < 20) {
        setCategory(data[3].comments[1].category);
      } else if (bmiNum >= 20 && bmiNum < 25) {
        setCategory(data[3].comments[2].category);
      } else {
        setCategory(data[3].comments[3].category);
      }
    }
  }, [bmiNum]);

  let generateResponses = async (event) => {
    event.preventDefault();
    let heightfinal =
      heightUnit === "in"
        ? height / 39.37
        : heightUnit === "cm"
        ? height / 100
        : height / 3.281;                                                     //stores the height in metres
    let weightfinal = weightUnit === "kgs" ? weight : weight / 2.205;         //stores the weight in kilograms
    setBmiNum((weightfinal / heightfinal ** 2).toFixed(1));                   //BMI formula + rounding
    setGenerated(true);                                                       //BMI generated flag activated
  };

  return (
    <>s
      <NavMargin />
      <div className="know-your-body-container">
        <Header title={"BMI Calculator"} />
        <div className="know-your-body-cards-container">
          <form onSubmit={generateResponses}>
            <div className="form-know-your-body">
              <div className="know-your-body-card-container">
                <GiWeightScale />
                <h2>Enter Your Weight</h2>
                <div className="know-your-body-input">
                  <select
                    onChange={(e) => {
                      setWeightUnit(e.target.value);
                    }}
                  >
                    <option>kgs</option>
                    <option>lbs</option>
                  </select>
                  <input
                    type="number"
                    required
                    max={weightUnit === "kgs" ? 299 : 499}
                    maxLength={3}
                    onChange={(e) => {
                      setWeight(e.target.value);
                    }}
                  />
                </div>
                {weight === "" ? (
                  <>
                    <p style={{ color: "var(--alert)", fontSize: "1vw" }}>
                      Please enter your weight.
                    </p>
                  </>
                ) : null}
              </div>
              <div className="know-your-body-card-container">
                <h2>Gender</h2>
                <div className="know-your-body-gender-container">
                  <input
                    type="button"
                    name="gender"
                    required
                    value={"Male"}
                    onClick={() => {
                      setMale(true);
                    }}
                    style={{
                      background: !male
                        ? "var(--secondary-three)"
                        : "var(--secondary-one)",
                      border: !male ? "none" : "1px solid black",
                    }}
                  />
                  <input
                    type="button"
                    name="gender"
                    required
                    value={"Female"}
                    onClick={() => {
                      setMale(false);
                    }}
                    style={{
                      background: male
                        ? "var(--secondary-three)"
                        : "var(--secondary-one)",
                      border: male ? "none" : "1px solid black",
                    }}
                  />
                </div>
                <h2>Age</h2>
                <input
                  type="number"
                  required
                  className="age-input-know-your-body"
                  max={120}
                  onChange={(e) => {
                    setAge(e.target.value);
                  }}
                />
                {age === "" ? (
                  <>
                    <p style={{ color: "var(--alert)", fontSize: "1vw" }}>
                      Please enter your age.
                    </p>
                  </>
                ) : null}
              </div>
              <div className="know-your-body-card-container">
                <FaRuler />
                <h2>Enter Your Height</h2>
                <div className="know-your-body-input">
                  <select
                    onChange={(e) => {
                      setHeightUnit(e.target.value);
                    }}
                  >
                    <option>in</option>
                    <option>cm</option>
                    <option>ft</option>
                  </select>
                  <input
                    type="number"
                    required
                    max={
                      heightUnit === "in" ? 100 : heightUnit === "cm" ? 250 : 8
                    }
                    onChange={(e) => {
                      setHeight(e.target.value);
                    }}
                  />
                </div>
                {height === "" ? (
                  <>
                    <p style={{ color: "var(--alert)", fontSize: "1vw" }}>
                      Please enter your height.
                    </p>
                  </>
                ) : null}
              </div>
            </div>
            <input
              type="submit"
              value="Calculate BMI"
              id="submit-know-your-body"
            />
          </form>
        </div>
        {generated ? (
          <>
            <div className="know-your-body-results-container">
              <div className="bmi-result-container">
                <div className="bmi-result-number-container">
                  <p>Your BMI is</p>
                  <h1>{bmiNum}</h1>
                </div>
                <div className="bmi-result-comment-container">
                  <h3>{category}</h3>
                  <p>{description}</p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
      <Footer />
    </>
  );
}

export default KnowYourBody;
