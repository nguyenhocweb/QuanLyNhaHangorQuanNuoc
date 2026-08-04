
import { prisma } from "../../../../databases/init.mongodb.js"
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
    
    if (employments && employments.length > 0) {
        employments.forEach(element => {
            if (element.restaurant) {
                if (!restaurant.some(r => r.id === element.restaurant.id)) {
                    restaurant.push({ ...element.restaurant, isSelect: false })
                }
            } else if (element.brand) {
                if (!brand.some(b => b.id === element.brand.id)) {
                    brand.push({ ...element.brand, isSelect: false })
                }
            }
        });
        employments.forEach(emp => {
            if (emp.per_vs_emp && emp.per_vs_emp.length > 0) {
                emp.per_vs_emp.forEach(pve => {
                    if (!permissions.includes(pve.permissions.name)) {
                        permissions.push(pve.permissions.name);
                    }
                });
            }
        });
        
        const [{ ...employment }] = employments;
        if (employment.restaurant) {
            restaurant = restaurant.map(e => (e.id === employment.restaurant.id) ? { ...e, isSelect: true } : e)
        } else if (employment.brand) {
            brand = brand.map(e => (e.id === employment.brand.id) ? { ...e, isSelect: true } : e)
        }
    }
    
    return {
        ...User,
        role: role ? role.name : null,
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