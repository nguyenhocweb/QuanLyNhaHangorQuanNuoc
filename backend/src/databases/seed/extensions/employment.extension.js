
import {Brand_employment,Restaurant_employment} from "../constants/Employment.data.js"
export const employment_Extension = async (prisma) => {
    // lấu id user
    const user_Id=await prisma.User.findMany({
        select:{
            id:true,
            user_name:true
        }
    })
  
    console.log("usserid ",user_Id);
    
    // lấy id và name thương hiệu
    const brandId=await prisma.Brand.findMany({
        select:{
            id:true,
            name:true
        }
    });
    const restaurantId=await prisma.Restaurant.findMany({
        select:{
            id:true,
            name:true
        }
    });

   

    // create data employment brand 
    const resultBrand=await prisma.Employment.createMany({
        data:Brand_employment.map(
            e=>
             ({
              userId:  user_Id.find(user=> user.user_name===e.user_name).id,
              brandId:brandId.find(brand=>brand.name===e.Brandname).id,
             })
        )
    });
    console.log(`✅ Đã tạo thành công ${resultBrand.count} Employment Brand!`);
    // create data employment restaurant
    const resultRestaurant=await prisma.Employment.createMany({
        data:Restaurant_employment.map(
            e=>
        ({
              userId:  user_Id.find(user=> user.user_name===e.user_name).id,
              restaurantId:restaurantId.find(restaurant=>restaurant.name===e.Restaurantname).id,
        })
        )
    })


     console.log(`✅ Đã tạo thành công ${resultRestaurant.count} Employment restaurand!`);
};
