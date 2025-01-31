import { csv } from "d3-fetch";
import data from "../../assets/nutrition.csv";
const foods = [];
csv(data).then((text) => {
  for (var i = 0; i < text.length; i++) {
    foods.push({
      id: parseInt(text[i].id),
      foodname: text[i].name.toString(),
      servingsize: parseFloat(text[i].serving_size), //grams
      calories: parseFloat(text[i].calories),
      fats: parseFloat(text[i].total_fat), //grams
      // cholestrol: parseFloat(text[i].cholestrol), //milligrams
      // sodium: parseFloat(text[i].sodium), //milligrams
      // vit_a: parseFloat(text[i].vitamin_a), //mcg
      // vit_b12: parseFloat(text[i].vitamin_b12), //mcg
      // vit_c: parseFloat(text[i].vitamin_c), //mch
      // vit_d: parseFloat(text[i].vitamin_d), //mcg
      // vit_e: parseFloat(text[i].vitamin_e), //mcg
      // calcium: parseFloat(text[i].calcium), //mg
      iron: parseFloat(text[i].irom), //mg
      // magnesium: parseFloat(text[i].magnesium), //mg
      protein: parseFloat(text[i].protein), //g
      carbs: parseFloat(text[i].carbohydrate), //g
      fiber: parseFloat(text[i].fiber), //g
      sugar: parseFloat(text[i].sugars), //g
      // caffeine: parseFloat(text[i].caffeine), //mg
    });
  }
});
// console.log(foods);
export default foods;
