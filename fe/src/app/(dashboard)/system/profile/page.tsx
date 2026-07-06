import { Div,H,P } from "@/src/core/components/ui"
import AvatarProfile from "@/src/features/shared/profile/profile_component/avatar_profile"
import ImformationProfile from "@/src/features/shared/profile/profile_component/information_profile"
import ChangePassword from "@/src/features/shared/profile/profile_component/changePassword"
const ProfileAdmin =()=>{
    return(
      <Div vitri="col_none" className="p-10 gap-3" size="full" >
        <Div vitri="col_none">
        <H variant="text_black" className="text-3xl">Hồ sơ cá nhân</H>
        <P>Quản lý hồ sơ cá nhân của bạn</P>
        </Div>
        <Div size="full" className=" justify-between items-start gap-5" >
          <AvatarProfile /> 
          <Div vitri="col_none" size="full" gap="g4_5">
            <ImformationProfile />
            <ChangePassword/>
          </Div>
          
        </Div>
         
      </Div>
    )
}
export default ProfileAdmin