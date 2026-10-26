// Digital-Services - Services Manager

(() => {
  "use strict";

  const services = [
    {
      id: "instagram-audit",
      name: "Instagram Profile Audit",
      platform: "Instagram",
      category: "Analytics",
      description:
        "Profile optimization aur improvement suggestions.",
      price: "Free demo",
      status: "available"
    },
    {
      id: "content-plan",
      name: "Social Media Content Plan",
      platform: "Instagram / Facebook",
      category: "Content",
      description:
        "Content ideas aur posting schedule plan karne mein help.",
      price: "Free demo",
      status: "available"
    },
    {
      id: "youtube-audit",
      name: "YouTube Channel Audit",
      platform: "YouTube",
      category: "Analytics",
      description:
        "Channel performance aur content improvement checklist.",
      price: "Free demo",
      status: "available"
    },
    {
      id: "campaign-planning",
      name: "Promotion Campaign Plan",
      platform: "Multiple platforms",
      category: "Marketing",
      description:
        "Authentic audience tak pahunchne ke liye campaign planning.",
      price: "Free demo",
      status: "available"
    }
  ];

  function getServices() {
    return services.map((service) => ({ ...service }));
  }

  function getServiceById(id) {
    const service = services.find((item) => item.id === id);
    return service ? { ...service } : null;
  }

  function renderServices(container) {
    if (!container) {
      console.warn("Services container nahi mila.");
      return;
    }

    container.replaceChildren();

    services.forEach((service) => {
      const card = document.createElement("article");
      card.className = "service-card";

      const title = document.createElement("h3");
      title.textContent = service.name;

      const platform = document.createElement("p");
      platform.textContent = `Platform: ${service.platform}`;

      const category = document.createElement("p");
      category.textContent = `Category: ${service.category}`;

      const description = document.createElement("p");
      description.textContent = service.description;

      const price = document.createElement("p");
      price.textContent = `Price: ${service.price}`;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "service-select-button";
      button.textContent = "View Service";
      button.dataset.serviceId = service.id;

      button.addEventListener("click", () => {
        window.dispatchEvent(
          new CustomEvent("ds:service-selected", {
            detail: { service: getServiceById(service.id) }
          })
        );

        alert(
          `${service.name}\n\n${service.description}\n\n` +
          "Ye demo listing hai. Booking aur payment abhi enabled nahi hain."
        );
      });

      card.append(
        title,
        platform,
        category,
        description,
        price,
        button
      );

      container.appendChild(card);
    });
  }

  window.DigitalServicesCatalog = {
    getAll: getServices,
    getById: getServiceById,
    render: renderServices
  };
})();
