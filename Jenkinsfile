pipeline {
    agent any

    parameters {
        choice(name: 'TF_ENV', choices: ['dev', 'prod'], description: 'Terraform environment file to use')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/nalinsinghchauhan/aws-infrastructure-monitor'
            }
        }

        stage('Install Test Dependencies') {
            steps {
                sh '''
                    apt-get update -y || yum update -y
                    apt-get install -y python3 python3-pip python3-venv || yum install -y python3 python3-pip
                    cd backend
                    python3 -m venv .venv
                    . .venv/bin/activate
                    pip install -r requirements.txt
                '''
            }
        }

        stage('Test') {
            steps {
                sh 'cd backend && ../.venv/bin/pytest tests/ -v'
            }
        }

        stage('Terraform Plan') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
                    sh 'terraform -chdir=terraform init'
                    sh 'terraform -chdir=terraform plan -var-file=${TF_ENV}.tfvars -out=tfplan'
                }
            }
        }

        stage('Approval') {
            steps {
                input message: 'Apply Terraform changes?', ok: 'Yes, Apply'
            }
        }

        stage('Terraform Apply') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
                    sh 'terraform -chdir=terraform apply -auto-approve tfplan'
                }
            }
        }

        stage('Generate Ansible Inventory') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
                    sh '''#!/usr/bin/env bash
set -euo pipefail
EC2_IP="$(terraform -chdir=terraform output -raw ec2_public_ip)"
cat > ansible/inventory/hosts.ini <<EOF
[app_servers]
app1 ansible_host=${EC2_IP} ansible_user=ec2-user
EOF
'''
                }
            }
        }

        stage('Ansible Deploy') {
            steps {
                withCredentials([
                    [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials'],
                    file(credentialsId: 'ansible-vault-password', variable: 'VAULT_FILE')
                ]) {
                    sh 'ansible-playbook -i ansible/inventory/hosts.ini ansible/site.yml --vault-password-file "$VAULT_FILE"'
                }
            }
        }

    }

    post {
        success {
            withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
                sh '''#!/usr/bin/env bash
set -euo pipefail
EC2_IP="$(terraform -chdir=terraform output -raw ec2_public_ip)"
APP_URL="$(terraform -chdir=terraform output -raw app_url)"
echo "EC2 Public IP: ${EC2_IP}"
echo "Application URL: ${APP_URL}"
'''
            }
            echo 'Deployment succeeded!'
        }
        failure {
            echo 'Deployment failed. Check Jenkins logs.'
        }
    }
}
