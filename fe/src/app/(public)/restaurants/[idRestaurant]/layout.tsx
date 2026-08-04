import { Metadata } from 'next';
import axios from 'axios';

type Props = {
    params: { idRestaurant: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        // Fetch metadata from backend bypassing the client-side axios instance
        // Assuming backend runs on port 8000. In production, use process.env.NEXT_PUBLIC_API_URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const { data } = await axios.get(`${apiUrl}/public/restaurant/v2/${params.idRestaurant}`);
        const restaurant = data.metadata;

        return {
            title: `${restaurant.name} | Đặt bàn & Gọi món`,
            description: restaurant.description || `Khám phá thực đơn và đặt bàn tại ${restaurant.name}.`,
            openGraph: {
                title: restaurant.name,
                description: restaurant.description,
                images: [restaurant.imageMain],
            },
        };
    } catch (error) {
        return {
            title: 'Nhà hàng không tồn tại',
            description: 'Rất tiếc, không tìm thấy thông tin nhà hàng này.',
        };
    }
}

export default function RestaurantLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section>
            {children}
        </section>
    );
}
