import { useParams } from "react-router-dom";

const OrderDetail = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Details</h1>
      <p className="text-gray-600">Viewing details for order: <span className="font-mono font-bold">{id}</span></p>
      <p className="mt-8 text-sm text-gray-500">This page is under construction.</p>
    </div>
  );
};

export default OrderDetail;
