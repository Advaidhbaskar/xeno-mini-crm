import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [segmentPrompt, setSegmentPrompt] = useState("");
  const [segmentResult, setSegmentResult] = useState(null);

  const [campaignPrompt, setCampaignPrompt] = useState("");
  const [campaignMessage, setCampaignMessage] = useState("");

  const [deliveryResult, setDeliveryResult] = useState(null);
  const [analytics, setAnalytics] = useState({
  totalCustomers: 0,
  sent: 0,
  failed: 0
  });
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerForm, setCustomerForm] = useState({
  name: "",
  email: "",
  city: "",
  total_spent: "",
  last_order_days_ago: ""
  });

  useEffect(() => {
  loadAnalytics();
  }, []);

  const createCustomer = async () => {

    try {

      await axios.post(
        "https://xeno-backend-uqlu.onrender.com/customers/",
        {
          ...customerForm,
          total_spent: Number(customerForm.total_spent),
          last_order_days_ago: Number(customerForm.last_order_days_ago)
        }
      );

      alert("Customer added successfully!");

      setCustomerForm({
        name: "",
        email: "",
        city: "",
        total_spent: "",
        last_order_days_ago: ""
      });

      loadAnalytics();

    } catch (error) {
      console.log(error);
    }
  };

  const generateSegment = async () => {

    const response = await axios.post(
      "https://xeno-backend-uqlu.onrender.com/segment/",
      {
        prompt: segmentPrompt
      }
    );

    setSegmentResult(response.data);
  };

  const generateMessage = async () => {

    const response = await axios.post(
      "https://xeno-backend-uqlu.onrender.com/campaigns/generate-message",
      {
        prompt: campaignPrompt
      }
    );

    setCampaignMessage(response.data.generated_message);
  };

  const sendCampaign = async () => {

    if (!selectedCustomer) {
      alert("Please select a customer first");
      return;
    }

    const response = await axios.post(
      "https://xeno-backend-uqlu.onrender.com/campaigns/send",
      {
        customer_id: selectedCustomer.id,
        message: campaignMessage
      }
    );

    setDeliveryResult(response.data);

    loadAnalytics();
  };

  const loadAnalytics = async () => {

  const customersResponse = await axios.get(
    "https://xeno-backend-uqlu.onrender.com/customers/"
  );

  const receiptsResponse = await axios.get(
    "https://xeno-backend-uqlu.onrender.com/campaigns/delivery-receipts"
  );

  const receipts = receiptsResponse.data;
  setDeliveryHistory(receipts);

  const sentCount = receipts.filter(
    (r) => r.status === "SENT"
  ).length;

  const failedCount = receipts.filter(
    (r) => r.status === "FAILED"
  ).length;

  setAnalytics({
    totalCustomers: customersResponse.data.length,
    sent: sentCount,
    failed: failedCount
  });
  };

  return (

    <div className="app">

      <h1 className="title">
        Xeno Mini CRM
      </h1>
      
      <div className="card">

  <h2>Add Customer</h2>

  <div className="customer-form">

    <input
      type="text"
      placeholder="Name"
      value={customerForm.name}
      onChange={(e) =>
        setCustomerForm({
          ...customerForm,
          name: e.target.value
        })
      }
    />

    <input
      type="email"
      placeholder="Email"
      value={customerForm.email}
      onChange={(e) =>
        setCustomerForm({
          ...customerForm,
          email: e.target.value
        })
      }
    />

    <input
      type="text"
      placeholder="City"
      value={customerForm.city}
      onChange={(e) =>
        setCustomerForm({
          ...customerForm,
          city: e.target.value
        })
      }
    />

    <input
      type="number"
      placeholder="Total Spent"
      value={customerForm.total_spent}
      onChange={(e) =>
        setCustomerForm({
          ...customerForm,
          total_spent: e.target.value
        })
      }
    />

    <input
      type="number"
      placeholder="Last Order Days Ago"
      value={customerForm.last_order_days_ago}
      onChange={(e) =>
        setCustomerForm({
          ...customerForm,
          last_order_days_ago: e.target.value
        })
      }
    />

    <button onClick={createCustomer}>
      Add Customer
    </button>

  </div>

</div>

      <div className="analytics-grid">

        <div className="analytics-card">
          <h3>Total Customers</h3>
          <p>{analytics.totalCustomers}</p>
        </div>

        <div className="analytics-card">
          <h3>Campaigns Sent</h3>
          <p>{analytics.sent}</p>
        </div>

        <div className="analytics-card">
          <h3>Failed Deliveries</h3>
          <p>{analytics.failed}</p>
        </div>

      </div>

      <div className="card">

        <h2>
          AI Audience Segmentation
        </h2>

        <div className="input-group">

          <input
            type="text"
            placeholder="High spending inactive customers"
            value={segmentPrompt}
            onChange={(e) => setSegmentPrompt(e.target.value)}
          />

          <button onClick={generateSegment}>
            Generate Segment
          </button>

        </div>

        {segmentResult && (

          <div className="results">

            <h3>Audience Filters</h3>

            <div className="filters">

              <span>
                Min Spend: ₹{segmentResult.filters.min_spent}
              </span>

              <span>
                Inactive Days: {segmentResult.filters.inactive_days}
              </span>

            </div>

            <h3>Matching Customers</h3>

            <div className="customer-list">

              {segmentResult.matching_customers.map((customer) => (

                <div
                  className={
                    selectedCustomer?.id === customer.id
                      ? "customer-card selected"
                      : "customer-card"
                  }
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                >

                  <h4>{customer.name}</h4>

                  <p>{customer.email}</p>

                  <p>{customer.city}</p>

                  <p>
                    Total Spent: ₹{customer.total_spent}
                  </p>

                  <p>
                    Last Order: {customer.last_order_days_ago} days ago
                  </p>

                </div>

              ))}

            </div>

          </div>
        )}

      </div>

      <div className="card">

        <h2>
          AI Campaign Generator
        </h2>

        <div className="input-group">

          <input
            type="text"
            placeholder="Generate campaign for inactive premium customers"
            value={campaignPrompt}
            onChange={(e) => setCampaignPrompt(e.target.value)}
          />

          <button onClick={generateMessage}>
            Generate Message
          </button>

        </div>

        {campaignMessage && (

          <div className="message-box">

            {campaignMessage}

          </div>
        )}

        {campaignMessage && (

          <button
            className="send-btn"
            onClick={sendCampaign}
          >
            Send Campaign
          </button>
        )}

        {deliveryResult && (

          <div className="delivery-box">

            <p>
              <strong>Status:</strong>

              <span
                className={
                  deliveryResult.delivery_status === "SENT"
                    ? "success"
                    : "failed"
                }
              >
                {deliveryResult.delivery_status}
              </span>
            </p>

          </div>
        )}

      </div>

      <div className="card">

        <h2>Delivery History</h2>

        <table className="history-table">

          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {deliveryHistory.map((item, index) => (

              <tr key={index}>

                <td>{item.customer_id}</td>

                <td>

                  <span
                    className={
                      item.status === "SENT"
                        ? "success"
                        : "failed"
                    }
                  >
                    {item.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default App;