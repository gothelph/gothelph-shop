import { Footer } from "../footer";
import Header from "../header/Header";
import OrdersList from "./OrderList";
import ProfileForm from "./ProfileForm";

export default function ProfilePage() {
  return (
    <div>
      <Header />
      <h2 className="text-4xl font-bold text-center flex items-center justify-center">
        ДАННЫЕ О ЗАКАЗАХ
      </h2>
      <OrdersList />
      <h2 className="text-4xl font-bold text-center flex items-center justify-center">
        ФОРМА ПРОФИЛЯ
      </h2>
      <ProfileForm />
      <Footer topRef={undefined} />
    </div>
  );
}
