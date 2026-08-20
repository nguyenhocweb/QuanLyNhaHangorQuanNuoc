
import { prisma } from "../../../databases/init.mongodb.js"
const selectUser = {
    id: true,
    user_name: true,
    password: true,
    email: true,
    name: true,
    sdt: true,
    avatar: true,
    gender: true,
    date_of_birth: true,
    is_active: true,
    createdAt: true,
    updatedAt: true,
    role: {
        select: {
            name: true
        }
    },
    employments: {
        select: {
            brand: {
                select: {
                    id: true,
                    name: true
                }
            },
            restaurant: {
                select: {
                    id: true,
                    name: true
                }
            },
            per_vs_emp: {
                select: {
                    permissions: {
                        select: {
                            name: true,
                            type: true,
                        }
                    }
                }
            }
        }
    }

}
const dataUser=(result)=>{
   if(!result) return false
    const { role, employments, ...User } = result;
    let brand = [], restaurant = [], permissions = [];
    if (!role) {
        employments.forEach(element => {
            element.brand ?
                brand.push({ ...element.brand, isSlect: false })
                :
                restaurant.push({ ...element.restaurant, isSlect: false })
        });
        const [{ per_vs_emp, ...employment }] = employments
        permissions = per_vs_emp.map((e) => e.permissions.name);
        if (employment.brand) {
            brand = brand.map(e => (e.id === employment.brand.id) && { ...e, isSlect: true })
        } else {
            restaurant = restaurant.map(e => (e.id === employment.restaurant.id) && { ...e, isSlect: true })
        }
    }
    return {
        ...User,
        role:role?role.name:null,
        brand,
        restaurant,
        permissions,
    }
}
export const getUser = async (where) => {
    const result = await prisma.user.findFirst({
        where,
        select: selectUser
    })
    
    return dataUser(result);
    
}
export const upsetUser=async(where,dataUpdate,dataCreate)=>{
    const result =await prisma.user.upsert({
        where,
        update:dataUpdate,
        create:dataCreate,
        select: selectUser
    })
    return dataUser(result);
}