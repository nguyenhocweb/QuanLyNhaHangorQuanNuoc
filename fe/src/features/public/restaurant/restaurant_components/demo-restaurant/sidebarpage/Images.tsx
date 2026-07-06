import { Div, H, P } from "@/src/core/components/ui"
const IamgePage = ({ images }: { images: string[] | undefined }) => {
    return (
        <Div id="images" vitri="col_none" variant="bg_white" size="full">
            <H variant="text_black" className="text-2xl font-bold mb-4">Hình ảnh</H>
            <Div vitri='col_none' className="grid grid-cols-1 md:grid-cols-3 gap-10 px-10" size="full">
                {
                    images ?
                        images.map((e, index) => (
                            <Div key={index} className="w-55 h-55 z-1 aspect-square rounded-md overflow-hidden" >
                                <img
                                    src={e}
                                    alt="restaurant image"
                                    className="w-full h-full object-cover shadow-2xl scale-110"
                                />
                            </Div>
                        ))
                        :
                        <P>Đang cập nhật!</P>
                }

            </Div>
        </Div>
    )
}
export default IamgePage