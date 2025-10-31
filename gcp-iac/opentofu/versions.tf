terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.50.0"
    }
  }
}

provider "google" {
  project     = "thrrosenheim"
  region      = "europe-west4"
}
