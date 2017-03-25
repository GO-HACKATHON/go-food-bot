import {FoodMenuModel} from "./FoodMenuModel";
import {RestaurantModel} from "./RestaurantModel";

export const FoodMenusData:FoodMenuModel[] = [
    new FoodMenuModel("Martabak Beng2 Tiker", "Beng2 + Keju + Susu", 25000, 
                new RestaurantModel("Martabak Gahar", "Panglima Polim", "JL. Panglima Polim 5 No. 4")),
    new FoodMenuModel("Martabak Rendang Spesial", "Beng2 + Keju + Susu", 65000, 
                new RestaurantModel("Martabak Gahar", "Panglima Polim", "JL. Panglima Polim 5 No. 4")),

    new FoodMenuModel("Classic Telor Daging Sapi", "", 85000, 
                new RestaurantModel("BANG!Martabak", "Panglima Polim", "JL. Panglima Polim Raya No. 102")),
    new FoodMenuModel("Rock Nutella", "", 95000, 
                new RestaurantModel("BANG!Martabak", "Panglima Polim", "JL. Panglima Polim Raya No. 102")),


    new FoodMenuModel("Aneka Nasi Lemak Ayam", "", 30000, 
                new RestaurantModel("Nasi Lemak Lontong Medan", "Melawai", "Pasaraya Grande, Food Court @Dapur Raya, JL. Iskandarsyah, Melawai, Jakarta")),                
    new FoodMenuModel("Nasi Goreng Kambing 1 Porsi", "", 39000, 
                new RestaurantModel("Nasi Goreng Kambing Kebon Sirih", "Melawai", "Pasaraya Blok M, Foodcourt Dapuraya Basement, JL. Iskandarsyah Raya, Melawai, Jakarta")),
                
];
