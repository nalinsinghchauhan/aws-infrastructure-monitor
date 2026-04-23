async function loadResources() {
    const response = await fetch("/api/resources");
    const resources = await response.json();

    const tbody = document.querySelector("#resources-table tbody");
    tbody.innerHTML = "";

    let running = 0;
    let stopped = 0;

    resources.forEach((item) => {
        if (item.state === "running") running += 1;
        if (item.state === "stopped") stopped += 1;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.id ?? "N/A"}</td>
            <td>${item.name ?? ""}</td>
            <td>${item.state ?? "unknown"}</td>
            <td>${item.region ?? "N/A"}</td>
            <td>${item.public_ip ?? "N/A"}</td>
            <td>${item.type ?? "N/A"}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById("total-count").textContent = resources.length;
    document.getElementById("running-count").textContent = running;
    document.getElementById("stopped-count").textContent = stopped;
}

document.getElementById("refresh-btn").addEventListener("click", loadResources);
loadResources();
