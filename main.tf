terraform {
  required_providers {
    yandex = {
      source  = "yandex-cloud/yandex"
      version = "0.74.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "2.2.0"
    }
  }
  required_version = ">= 0.13"
}

provider "yandex" {
  token     = var.token
  cloud_id  = var.cloud_id
  folder_id = var.folder_id
}

### IAM
resource "yandex_iam_service_account" "this" {
  name        = var.service_account_name
  description = "Service account to manage Functions"
}
resource "yandex_resourcemanager_folder_iam_member" "this" {
  for_each  = toset(["admin"])
  folder_id = var.folder_id
  member    = "serviceAccount:${yandex_iam_service_account.this.id}"
  role      = each.value
}
resource "yandex_iam_service_account_static_access_key" "sa-static-key" {
  service_account_id = yandex_iam_service_account.this.id
  description        = "static access key for YMQ"
}

### Functions
resource "yandex_function" "event-handler" {
  name               = "event-handler"
  description        = "VK event handler"
  user_hash          = data.archive_file.event-handler.output_base64sha256
  runtime            = "nodejs16"
  entrypoint         = "main.handler"
  memory             = "128"
  execution_timeout  = "30"
  service_account_id = yandex_iam_service_account.this.id
  content {
    zip_filename = "${path.module}/dist/packages/functions/event-handler.zip"
  }
  environment = {
    "AWS_ACCESS_KEY_ID"     = yandex_iam_service_account_static_access_key.sa-static-key.access_key
    "AWS_SECRET_ACCESS_KEY" = yandex_iam_service_account_static_access_key.sa-static-key.secret_key
    "YMQ_WALL_POST_NEW_URL" = data.yandex_message_queue.wall-post-new.url
    "YMQ_MESSAGE_NEW_URL"   = data.yandex_message_queue.message-new.url
    "VK_CONFIRMATION"       = var.vk_confirmation
    "LOG_LEVEL"             = "ALL"
    "VK_TOKEN"              = var.vk_token
    "VK_ERROR_CHAT_ID"      = var.vk_error_chat_id
    "YC_TOKEN"              = var.token
  }
}
data "archive_file" "event-handler" {
  type        = "zip"
  source_dir  = "${path.module}/dist/packages/functions/event-handler"
  output_path = "${path.module}/dist/packages/functions/event-handler.zip"
}

resource "yandex_function" "wall-post-new" {
  name               = "wall-post-new"
  description        = "VK event 'wall_post_new'"
  user_hash          = data.archive_file.wall-post-new.output_base64sha256
  runtime            = "nodejs16"
  entrypoint         = "main.handler"
  memory             = "128"
  execution_timeout  = "180"
  service_account_id = yandex_iam_service_account.this.id
  content {
    zip_filename = "${path.module}/dist/packages/functions/wall-post-new.zip"
  }
  environment = {
    "TG_TOKEN"         = var.tg_token
    "TG_CHAT_ID"       = var.tg_chat_id
    "LOG_LEVEL"        = "ALL"
    "VK_TOKEN"         = var.vk_token
    "VK_ERROR_CHAT_ID" = var.vk_error_chat_id
  }
  depends_on = [yandex_message_queue.wall-post-new]
}
data "archive_file" "wall-post-new" {
  type        = "zip"
  source_dir  = "${path.module}/dist/packages/functions/wall-post-new"
  output_path = "${path.module}/dist/packages/functions/wall-post-new.zip"
}

resource "yandex_function" "message-new" {
  name               = "message-new"
  description        = "VK event 'message_new'"
  user_hash          = data.archive_file.message-new.output_base64sha256
  runtime            = "nodejs16"
  entrypoint         = "main.handler"
  memory             = "128"
  execution_timeout  = "180"
  service_account_id = yandex_iam_service_account.this.id
  content {
    zip_filename = "${path.module}/dist/packages/functions/message-new.zip"
  }
  environment = {
    "LOG_LEVEL"        = "ALL"
    "CURRENCY_TOKEN"   = var.currency_token
    "VK_TOKEN"         = var.vk_token
    "VK_ERROR_CHAT_ID" = var.vk_error_chat_id
  }
  depends_on = [yandex_message_queue.message-new]
}
data "archive_file" "message-new" {
  type        = "zip"
  source_dir  = "${path.module}/dist/packages/functions/message-new"
  output_path = "${path.module}/dist/packages/functions/message-new.zip"
}

### Triggers
resource "yandex_function_trigger" "ymq-wall-post-new" {
  name        = "ymq-wall-post-new"
  description = "Trigger for ymq-wall-post-new"
  folder_id   = var.folder_id
  message_queue {
    queue_id           = yandex_message_queue.wall-post-new.arn
    service_account_id = yandex_iam_service_account.this.id
    batch_cutoff       = 1
    batch_size         = 1
  }
  function {
    id                 = yandex_function.wall-post-new.id
    tag                = "$latest"
    service_account_id = yandex_iam_service_account.this.id
  }
}

resource "yandex_function_trigger" "ymq-message-new" {
  name        = "ymq-message-new"
  description = "Trigger for ymq-message-new"
  folder_id   = var.folder_id
  message_queue {
    queue_id           = yandex_message_queue.message-new.arn
    service_account_id = yandex_iam_service_account.this.id
    batch_cutoff       = 1
    batch_size         = 1
  }
  function {
    id                 = yandex_function.message-new.id
    tag                = "$latest"
    service_account_id = yandex_iam_service_account.this.id
  }
}

### Message Queue
resource "yandex_message_queue" "wall-post-new" {
  name                       = "wall-post-new"
  visibility_timeout_seconds = 600
  receive_wait_time_seconds  = 0
  message_retention_seconds  = 86400
  access_key                 = yandex_iam_service_account_static_access_key.sa-static-key.access_key
  secret_key                 = yandex_iam_service_account_static_access_key.sa-static-key.secret_key
  redrive_policy = jsonencode({
    deadLetterTargetArn = yandex_message_queue.d-wall-post-new.arn
    maxReceiveCount     = 3
  })
}
resource "yandex_message_queue" "d-wall-post-new" {
  name       = "d-wall-post-new"
  access_key = yandex_iam_service_account_static_access_key.sa-static-key.access_key
  secret_key = yandex_iam_service_account_static_access_key.sa-static-key.secret_key
}
data "yandex_message_queue" "wall-post-new" {
  name       = "wall-post-new"
  access_key = yandex_iam_service_account_static_access_key.sa-static-key.access_key
  secret_key = yandex_iam_service_account_static_access_key.sa-static-key.secret_key
}

resource "yandex_message_queue" "message-new" {
  name                       = "message-new"
  visibility_timeout_seconds = 600
  receive_wait_time_seconds  = 0
  message_retention_seconds  = 86400
  access_key                 = yandex_iam_service_account_static_access_key.sa-static-key.access_key
  secret_key                 = yandex_iam_service_account_static_access_key.sa-static-key.secret_key
}
data "yandex_message_queue" "message-new" {
  name       = "message-new"
  access_key = yandex_iam_service_account_static_access_key.sa-static-key.access_key
  secret_key = yandex_iam_service_account_static_access_key.sa-static-key.secret_key
}

### API Gateway
resource "yandex_api_gateway" "bot-gateway" {
  name        = "bot-gateway"
  description = "Redirects POST to event-handler function"
  spec        = <<-EOT
openapi: 3.0.0
info:
  title: Bot API
  version: 1.0.0
paths:
  /:
    post:
      x-yc-apigateway-integration:
        type: cloud-functions
        function_id: ${yandex_function.event-handler.id}
        service_account_id: ${yandex_iam_service_account.this.id}
      operationId: event-handler
EOT
}