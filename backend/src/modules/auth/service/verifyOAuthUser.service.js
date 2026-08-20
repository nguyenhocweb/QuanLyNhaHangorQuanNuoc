import { upsetUser } from "../repositories/User.db.js";
import { providerType } from "../../../config/locales.js"
import { getRole } from "../repositories/Role.js";
import { createTokenAccess, createTokenRefresh } from "../../../core/utils/authUtils.js"

export const verifyOAuthUserService = async (profileData) => {

    //hàm sử lý liến quan đến db
    const UserCustomer = await getRole({ name: "Khách hàng" });


    const result = await upsetUser(
        { email: profileData.email },
        {
            name: profileData.name,
            avatar: profileData.avatar,
            is_active: "ACTIVE",
            providerId: profileData.providerId,
            providerType: providerType[profileData.provider],
        },
        {
            email: profileData.email,
            user_name: profileData.name,
            name: profileData.name,
            providerId: profileData.providerId,
            providerType: providerType[profileData.provider],
            avatar: profileData.avatar,
            is_active: "ACTIVE",
            roleId: UserCustomer.id
        }
    )
    // tạo token
    if (result) return {
       token: {
          
                accessToken: createTokenAccess(
                    {
                        id: result.id,
                        role: result.role,
                        employmentType: result.brand ? "BRAND" : (result.restaurant ? "RESTAURANT" : NULL),
                        permissions: result.permissions ?? null
                    }
                ),
                refreshToken: createTokenRefresh({
                    id: result.id,
                    role: result.role,
                    employmentType: result.brand ? "BRAND" : (result.restaurant ? "RESTAURANT" : NULL),
                    permissions: result.permissions ?? null
                })
            
        }
    }
    return false;

}