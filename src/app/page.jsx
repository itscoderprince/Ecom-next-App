import Link from "next/link";
import { useSelector } from "react-redux";

const page = () => {
  // const { user } = useSelector((state) => state.auth);
  // console.log(user);

  return (
    <>
      <nav className="shadow-sm">
        <div className="flex justify-between gap-4 p-4">
          <span>LOGO</span>
          <ul className="flex gap-6">
            <li>
              <Link className="text-semibold" href="/auth/login">
                Login
              </Link>
            </li>
            <li>
              <Link className="text-semibold" href="/auth/signup">
                Register
              </Link>
            </li>
            <li>
              <Link className="text-semibold" href="/admin/dashboard">
                Admindashboard
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="flex justify-center items-center h-screen">
        <h1 className="text-4xl font-bold">Welcome to Next.js Ecommerce</h1>
        {/* <spna> {} </spna>*/}
      </div>
    </>
  );
};
export default page;
