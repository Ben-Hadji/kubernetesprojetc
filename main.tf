provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "example" {
  name     = "ben-resources"
  location = "West Europe"
}

resource "azurerm_kubernetes_cluster" "example" {
  name                = "ben-aks"
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name
  dns_prefix          = "benaks"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_D2_v2"
  }

  identity {
    type = "SystemAssigned"
  }
}

output "client_certificate" {
  description = "Kube config to connect to the cluster."
  value       = azurerm_kubernetes_cluster.example.kube_config.0.client_certificate
}

output "kube_config" {
  description = "Kube config to connect to the cluster."
  value       = azurerm_kubernetes_cluster.example.kube_config_raw
  sensitive   = true
}