FROM jenkins/jenkins:lts

USER root

# Install system dependencies
RUN apt-get update -y && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    ansible \
    wget \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install Terraform
RUN wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com bookworm main" | tee /etc/apt/sources.list.d/hashicorp.list \
    && apt-get update && apt-get install -y terraform \
    && rm -rf /var/lib/apt/lists/*

# Switch back to jenkins user
USER jenkins
