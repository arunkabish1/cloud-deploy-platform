# OpenTofu Manifest to provision Cloudflare Pages deployment for arunkabish1
terraform {
  required_version = ">= 1.6.0"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.25.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

variable "cloudflare_account_id" {
  type    = string
  default = "39cd6e21a6317ad90e471a9b70a463af"
}

variable "cloudflare_api_token" {
  type      = string
  sensitive = true
}

resource "cloudflare_pages_project" "platform_app" {
  account_id        = var.cloudflare_account_id
  name              = "nimbus-deploy-platform"
  production_branch = "main"

  source {
    type = "github"
    config {
      owner shadow_name  = "arunkabish1"
      repo_name          = "cloud-deploy-platform"
      production_branch  = "main"
      pr_comments_enabled = true
    }
  }

  build_config {
    build_command   = "npm run build"
    destination_dir = "dist"
  }
}

output "deployment_url" {
  value = cloudflare_pages_project.platform_app.subdomain
}
