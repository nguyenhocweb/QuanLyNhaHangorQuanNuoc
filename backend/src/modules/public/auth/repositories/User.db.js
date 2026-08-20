
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
    systemRole: {
        select: {
            name: true
        }
    },
    employments: {
        select: {
            brand: {
                select: {
                    id: true,
                    name: true,
                    subscriptions: {
                        where: { status: 'ACTIVE' },
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                        select: { featuresData: true }
                    }
                }
            },
            restaurant: {
                select: {
                    id: true,
                    name: true,
                    brand: {
                        select: {
                            subscriptions: {
                                where: { status: 'ACTIVE' },
                                orderBy: { createdAt: 'desc' },
                                take: 1,
                                select: { featuresData: true }
                            }
                        }
                    }
                }
            },
            workspaceRole: {
                select: {
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
    const { systemRole, employments, ...User } = result;
    let brand = [], restaurant = [], permissions = [];
    
    if (employments && employments.length > 0) {
        employments.forEach(element => {
            const empRole = element.workspaceRole ? element.workspaceRole.name : null;
            if (element.restaurant) {
                if (!restaurant.some(r => r.id === element.restaurant.id)) {
                    const activeSub = element.restaurant.brand?.subscriptions?.[0];
                    const features = activeSub ? activeSub.featuresData : null;
                    restaurant.push({ id: element.restaurant.id, name: element.restaurant.name, isSelect: false, role: empRole, features })
                }
            } else if (element.brand) {
                if (!brand.some(b => b.id === element.brand.id)) {
                    const activeSub = element.brand.subscriptions?.[0];
                    const features = activeSub ? activeSub.featuresData : null;
                    brand.push({ id: element.brand.id, name: element.brand.name, isSelect: false, role: empRole, features })
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
        systemRole: systemRole ? systemRole.name : null,
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