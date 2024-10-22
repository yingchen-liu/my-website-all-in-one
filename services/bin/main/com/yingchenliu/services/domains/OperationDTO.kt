package com.yingchenliu.services.domains

data class CreateNodeDTO(
    val clientId: String,
    val operationId: Int,
    val node: TreeNode
)

data class UpdateNodeDTO(
    val clientId: String,
    val operationId: Int,
    val node: TreeNode
)

data class MoveNodeDTO(
    val clientId: String,
    val operationId: Int,
    val move: NodePositionDTO
)