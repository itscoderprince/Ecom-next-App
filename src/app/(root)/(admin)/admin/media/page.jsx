import BreadCrumb1 from "@/components/Application/Admin/BreadCrumb1";
import UploadMedia from "@/components/Application/Admin/UploadMedia";
import { ADMIN_DASHBOARD } from "@/routes/AdminPanel.route";

const MediaPage = () => {
  const breadcrumbData = [
    {
      href: ADMIN_DASHBOARD,
      label: "Home",
    },
    {
      href: "",
      label: "Media",
    },
  ];

  return (
    <div>
      <BreadCrumb1 breadcrumbData={breadcrumbData} />
      <UploadMedia />
    </div>
  );
};

export default MediaPage;
