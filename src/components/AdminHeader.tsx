interface AdminHeaderPropTypes {
  currentPage: string;
}

const AdminHeader = ({ currentPage }: AdminHeaderPropTypes) => {
  return (
    <div className="flex justify-between items-center mb-4 ml-2">
      <div>
        <h1 className="text-3xl font-semibold capitalize">{currentPage}</h1>
      </div>
    </div>
  );
};

export default AdminHeader;
