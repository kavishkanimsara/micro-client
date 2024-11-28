import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Button,
  Input,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const SellerOrders = () => {
  const TABLE_HEAD = [
    "Order Reference",
    "Buyer ID",
    "Date Created",
    "Status",
    "Product ID",
    "Quantity",
    "Unit Price",
    "Total Price",
  ];

  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("All");
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = () => {
    fetch("http://localhost:8084/api/v1/order")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => {
        setError("Failed to fetch orders");
        console.error(error);
      });
  };

  useEffect(() => {
    const filterResult = (statusItem, searchQuery) => {
      let result = [];
      if (statusItem === "All") {
        result = data;
      } else {
        result = data.filter(
          (item) => item.status?.toLowerCase() === statusItem.toLowerCase()
        );
      }

      // Filter by search query (Order Reference or User ID)
      if (searchQuery) {
        result = result.filter(
          (item) =>
            item.id.toLowerCase().includes(searchQuery.toLowerCase()) || // Filter by Order ID
            item.userId.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by User ID
        );
      }

      setFilteredData(result);
    };

    filterResult(tab, searchQuery); // Apply filter based on status and search query
  }, [data, tab, searchQuery]); // Add searchQuery to dependency array

  const handleRowClick = (id) => {
    navigate(`/dashboard/sellerOrders/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateTotalPrice = (items) => {
    return items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    ).toFixed(2);
  };

  return (
    <div>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h3" color="text-custom-gray">
                Orders Overview
              </Typography>
            </div>
            <div className="flex justify-end">
              <div className="w-full md:w-72">
                <Input
                  label="Search"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  value={searchQuery} // Bind the input value to searchQuery state
                  onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state on input change
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
          {error ? (
            <Typography color="red" className="text-center mb-4">
              {error}
            </Typography>
          ) : (
            <div>
              <div className="flex sm:justify-end justify-center sm:mr-16 mr-0 text-custom-gray font-medium">
                <div className="flex sm:text-sm text-xs border-b-2 p-5">
                  <button
                    onClick={() => setTab("All")}
                    className={`focus:outline-none sm:w-40 w-24 transition duration-300 ease-in-out ${
                      tab === "All"
                        ? "text-blue-500 font-bold border-b-2 border-blue-500"
                        : "text-gray-500"
                    }`}
                  >
                    All
                  </button>

                  <button
                    onClick={() => setTab("Pending")}
                    className={`focus:outline-none sm:w-40 w-24 transition duration-300 ease-in-out ${
                      tab === "Ready to pickup"
                        ? "text-blue-500 font-bold border-b-2 border-blue-500"
                        : "text-gray-500"
                    }`}
                  >
                    Pending
                  </button>

                  <button
                    onClick={() => setTab("Processing")}
                    className={`focus:outline-none sm:w-40 w-24 transition duration-300 ease-in-out ${
                      tab === "Picked up"
                        ? "text-blue-500 font-bold border-b-2 border-blue-500"
                        : "text-gray-500"
                    }`}
                  >
                    Processing
                  </button>

                  <button
                    onClick={() => setTab("Delivered")}
                    className={`focus:outline-none sm:w-40 w-24 transition duration-300 ease-in-out ${
                      tab === "Delivered"
                        ? "text-blue-500 font-bold border-b-2 border-blue-500"
                        : "text-gray-500"
                    }`}
                  >
                    Delivered
                  </button>
                </div>
              </div>

              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        scope="col"
                        className="border border-blue-gray-100 bg-blue-gray-50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((order) =>
                    order.items?.map((item, index) => {
                      const isLast = index === order.items.length - 1;
                      const classes = isLast
                        ? "p-4"
                        : "p-4 border-b border-blue-gray-50";

                      return (
                        <tr
                          key={`${order.id}-${item.productID}-${index}`}
                          onClick={() => handleRowClick(order.id)}
                          className="cursor-pointer hover:bg-gray-100" // Hover effect
                        >
                          {index === 0 && (
                            <>
                              <td
                                className="p-4 border border-blue-gray-50"
                                rowSpan={order.items.length}
                              >
                                <Typography variant="small" color="blue-gray">
                                  {order.id}
                                </Typography>
                              </td>
                              <td
                                className="p-4 border border-blue-gray-50"
                                rowSpan={order.items.length}
                              >
                                <Typography variant="small" color="blue-gray">
                                  {order.userId}
                                </Typography>
                              </td>
                              <td
                                className="p-4 border border-blue-gray-50"
                                rowSpan={order.items.length}
                              >
                                <Typography variant="small" color="blue-gray">
                                  {formatDate(order.dateCreated)}
                                </Typography>
                              </td>
                              <td
                                className="p-4 border border-blue-gray-50"
                                rowSpan={order.items.length}
                              >
                                <Typography variant="small" color="blue-gray">
                                  {order.status}
                                </Typography>
                              </td>
                            </>
                          )}
                          <td className="p-4 border border-blue-gray-50">
                            <Typography variant="small" color="blue-gray">
                              {item.productID}
                            </Typography>
                          </td>
                          <td className="p-4 border border-blue-gray-50">
                            <Typography variant="small" color="blue-gray">
                              {item.quantity}
                            </Typography>
                          </td>
                          <td className="p-4 border border-blue-gray-50">
                            <Typography variant="small" color="blue-gray">
                              ${item.price}
                            </Typography>
                          </td>

                          {index === 0 && (
                            <td
                              className="p-4 border border-blue-gray-50"
                              rowSpan={order.items.length}
                            >
                              <Typography variant="small" color="blue-gray">
                                ${calculateTotalPrice(order.items)}
                              </Typography>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default SellerOrders;
