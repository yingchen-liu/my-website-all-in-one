package com.yingchenliu.services.domains

data class CreateNodeNotificationDTO(
    val clientId: String,
    val operationId: Int,
    val parentNodeUUID: String?,
    val previousNodeUUID: String?,
    val createdNode: TreeNode
)

data class UpdateNodeNotificationDTO(
    val clientId: String,
    val operationId: Int,
    val updatedNode: TreeNode
)

data class MoveNodeNotificationDTO(
    val clientId: String,
    val operationId: Int,
    val nodeUUID: String,
    val nodePositionDTO: NodePositionDTO
)