// Digital-Services - Orders Manager

(() => {
  "use strict";

  // Temporary demo storage.
  // Real orders ko baad mein Supabase database se load karenge.
  const demoOrders = [];

  function getOrders() {
    return demoOrders.map((order) => ({ ...order }));
  }

  function getOrderById(orderId) {
    const order = demoOrders.find(
      (item) => item.id === orderId
    );

    return order ? { ...order } : null;
  }

  function createDemoOrder(serviceId) {
    if (!serviceId || typeof serviceId !== "string") {
      throw new Error("Valid service select karo.");
    }

    if (!window.DigitalServicesCatalog) {
      throw new Error("Services catalog abhi load nahi hua.");
    }

    const service =
      window.DigitalServicesCatalog.getById(serviceId);

    if (!service) {
      throw new Error("Ye service available nahi hai.");
    }

    const order = {
      id: `DEMO-${Date.now()}`,
      serviceId: service.id,
      serviceName: service.name,
      status: "demo",
      createdAt: new Date().toISOString()
    };

    demoOrders.unshift(order);

    window.dispatchEvent(
      new CustomEvent("ds:orders-updated", {
        detail: { orders: getOrders() }
      })
    );

    return { ...order };
  }

  function renderOrders(container) {
    if (!container) {
      console.warn("Orders container nahi mila.");
      return;
    }

    container.replaceChildren();

    const orders = getOrders();

    if (orders.length === 0) {
      const message = document.createElement("p");
      message.textContent = "Abhi koi demo order nahi hai.";
      container.appendChild(message);
      return;
    }

    orders.forEach((order) => {
      const card = document.createElement("article");
      card.className = "order-card";

      const title = document.createElement("h3");
      title.textContent = order.serviceName;

      const id = document.createElement("p");
      id.textContent = `Order ID: ${order.id}`;

      const status = document.createElement("p");
      status.textContent = `Status: ${order.status}`;

      const date = document.createElement("p");
      date.textContent =
        `Created: ${new Date(order.createdAt).toLocaleString()}`;

      card.append(title, id, status, date);
      container.appendChild(card);
    });
  }

  window.DigitalServicesOrders = {
    getAll: getOrders,
    getById: getOrderById,
    createDemo: createDemoOrder,
    render: renderOrders
  };
})();
