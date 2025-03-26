
function showLoadingAnimation() {
    if (!document.getElementById("loading-animation")) {
        const loadingElement = document.createElement("div");
        loadingElement.id = "loading-animation";
        loadingElement.innerHTML = `
            <div class="spinner"></div>
            <p>Loading status information...</p>
        `;
        document.body.appendChild(loadingElement);
    }
}

function hideLoadingAnimation() {
    const loadingElement = document.getElementById("loading-animation");
    if (loadingElement) {
        loadingElement.style.opacity = "0";
        loadingElement.style.transition = "opacity 0.5s ease";
        setTimeout(() => {
            if (loadingElement.parentNode) {
                loadingElement.parentNode.removeChild(loadingElement);
            }
        }, 500);
    }
}


function updateServices(services) {
    const servicesContainer = document.getElementById("services");
    servicesContainer.innerHTML = "<h2>Services</h2>";

    services.forEach((category, index) => {
        const groupName = category.categoryName;
        const serviceGroup = category.services;

        const groupElement = document.createElement("div");
        groupElement.className = "service-group";
        groupElement.style.setProperty("--index", index);

        const groupStatus = calculateGroupStatus(serviceGroup);

        const groupTitle = document.createElement("h2");
        groupTitle.innerHTML = `
            <span class="dropdown-icon">▼</span>
            <span class="group-name">${groupName}</span>
            <span class="service-status status-${groupStatus.toLowerCase()}">${groupStatus}</span>
        `;
        groupElement.appendChild(groupTitle);

        const serviceList = document.createElement("div");
        serviceList.className = "service-list";

        serviceGroup.forEach((service) => {
            const serviceName = service.serviceName;
            const status = service.status;

            const serviceItem = document.createElement("div");
            serviceItem.className = "service-item";

            const nameSpan = document.createElement("span");
            nameSpan.textContent = serviceName;
            serviceItem.appendChild(nameSpan);

            const statusSpan = document.createElement("span");
            statusSpan.className = `service-status status-${status.toLowerCase()}`;
            statusSpan.textContent = status;
            serviceItem.appendChild(statusSpan);

            serviceList.appendChild(serviceItem);
        });

        groupElement.appendChild(serviceList);
        servicesContainer.appendChild(groupElement);

        groupTitle.addEventListener("click", () => {
            groupElement.classList.toggle("open");
        });
    });
}

function updateOverallStatus(services, RandomOperationalMessage, data) {
    const overallStatusElement = document.getElementById("overall-status");

    let overallStatus = "Operational";
    if (data.OverallStatus && data.OverallStatus !== "NoOverride") {
        overallStatus = data.OverallStatus;
    } else {
        const allStatuses = services.flatMap(category =>
            category.services.map(service => service.status)
        );
        if (allStatuses.some((status) => status === "Maintenance")) {
            overallStatus = "Maintenance";
        } else if (allStatuses.some((status) => status === "Issue")) {
            overallStatus = "Issue";
        } else if (allStatuses.some((status) => status === "Slow")) {
            overallStatus = "Slow";
        } else if (allStatuses.some((status) => status === "Degraded")) {
            overallStatus = "Degraded";
        } else {
            overallStatus = "Operational";
        }
    }

    let statusText = "";
    let statusIcon = "";

    if (overallStatus === "Maintenance") {
        statusText = "Undergoing maintenance";
        statusIcon = "//";
    } else if (overallStatus === "Issue") {
        statusText = "Major outage detected";
        statusIcon = "✕";
    } else if (overallStatus === "Slow") {
        statusText = "Some services may be slow";
        statusIcon = "…";
    } else if (overallStatus === "Degraded") {
        statusText = "Some systems may be experiencing issues";
        statusIcon = "!";
    } else if (overallStatus === "Operational") {
        if (RandomOperationalMessage) {
            const successMessages = [
                "All systems are operational",
                "Systems are functioning normally",
                "Services are running smoothly",
                "All systems are performing as expected",
                "All platforms are operational and responsive",
                "All services are online"
            ];
            statusText =
                successMessages[Math.floor(Math.random() * successMessages.length)];
        } else {
            statusText = "All systems are operational";
        }
        statusIcon = "✓";
    } else {
        statusText = overallStatus;
        statusIcon = "?";
    }

    overallStatusElement.innerHTML = `
        <div class="status-icon">${statusIcon}</div>
        ${statusText}
    `;

    overallStatusElement.className = "";

    if (overallStatus.toLowerCase() === "operational") {
        overallStatusElement.classList.add("overall-operational");
    } else if (overallStatus.toLowerCase() === "degraded" || overallStatus.toLowerCase() === "slow") {
        overallStatusElement.classList.add("overall-degraded");
    } else if (overallStatus.toLowerCase() === "issue") {
        overallStatusElement.classList.add("overall-issue");
    }
}

function updateMaintenanceAlerts(alerts) {
    const maintenanceAlertsContainer = document.getElementById(
        "maintenance-alerts"
    );

    if (alerts && alerts.length > 0) {
        const headingText =
            alerts.length > 1
                ? "Upcoming Maintenances"
                : "Upcoming Maintenance";
        maintenanceAlertsContainer.innerHTML = `<h2>${headingText}</h2>`;

        alerts.forEach((alert) => {
            const alertElement = createAlertElement(alert, "alert");
            maintenanceAlertsContainer.appendChild(alertElement);
        });
    } else {
        maintenanceAlertsContainer.innerHTML =
            "<h2>Scheduled Maintenance</h2><p style='opacity: 0.7;'>No upcoming maintenance scheduled at this time.</p>";
    }
}

function updateStatusUpdates(updates) {
    const statusUpdatesContainer = document.getElementById("status-updates");
    statusUpdatesContainer.innerHTML = "<h2>Recent Updates</h2>";

    if (updates && updates.length > 0) {
        updates.forEach((update) => {
            const updateElement = createAlertElement(update, "update");
            if (update.color) {
                updateElement.style.setProperty(
                    "--status-update-color",
                    update.color
                );
            }
            statusUpdatesContainer.appendChild(updateElement);
        });
    } else {
        statusUpdatesContainer.innerHTML +=
            "<p style='opacity: 0.7;'>No recent status updates.</p>";
    }
}