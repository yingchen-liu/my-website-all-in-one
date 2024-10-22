package com.yingchenliu.services.controllers

import com.yingchenliu.services.domains.*
import com.yingchenliu.services.services.NotificationService
import com.yingchenliu.services.services.NodeService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import java.util.*


@RestController
@RequestMapping("/api/nodes")
class SkillTreeController(val nodeService: NodeService, val notificationService: NotificationService) {

    @GetMapping("/root")
    fun findRoot(): TreeNode? {
        return nodeService.findFromRoot()
    }

    @GetMapping("/{uuid}")
    fun findNode(@PathVariable("uuid") uuid: String): TreeNode? {
        return nodeService.findFromNode(UUID.fromString(uuid))
    }

    @PostMapping("/{parentUUID}")
    fun createChildNode(@PathVariable("parentUUID") parentUUID: String, @RequestBody createNodeDTO: CreateNodeDTO): TreeNode {
        val parentNode = nodeService.findById(UUID.fromString(parentUUID))

        return parentNode?.let {
            val createdNode = nodeService.createChild(createNodeDTO.node, it.uuid)
            notificationService.notifyCreateAfter(
                CreateNodeNotificationDTO(
                    clientId = createNodeDTO.clientId,
                    operationId = createNodeDTO.operationId,
                    previousNodeUUID = null,
                    createdNode = createdNode,
                    parentNodeUUID = parentUUID
                )
            )
            createdNode
        } ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Error creating node: Parent node not found")
    }

    @PostMapping("/{previousNodeUUID}/after")
    fun createNodeAfter(
        @PathVariable("previousNodeUUID") previousNodeUUID: String,
        @RequestBody createNodeDTO: CreateNodeDTO
    ): TreeNode {
        val previousNode = nodeService.findById(UUID.fromString(previousNodeUUID))

        return previousNode?.let {
            val createdNode = nodeService.createAfter(createNodeDTO.node, it.uuid)
            notificationService.notifyCreateAfter(
                CreateNodeNotificationDTO(
                    clientId = createNodeDTO.clientId,
                    operationId = createNodeDTO.operationId,
                    previousNodeUUID = previousNodeUUID,
                    createdNode = createdNode,
                    parentNodeUUID = null
                )
            )
            createdNode
        } ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Error creating node: Parent node not found")
    }

    @PutMapping("/{uuid}")
    fun updateNode(@PathVariable("uuid") uuid: String, @RequestBody updateNodeDTO: UpdateNodeDTO): TreeNode {
        val existingNode = nodeService.findById(UUID.fromString(uuid))

        return existingNode?.let {
            val newNode = updateNodeDTO.node.copy(uuid = it.uuid)
            val updatedNode = nodeService.update(newNode)
            notificationService.notifyUpdate(
                UpdateNodeNotificationDTO(
                    clientId = updateNodeDTO.clientId,
                    operationId = updateNodeDTO.operationId,
                    updatedNode = updatedNode
                )
            )
            updatedNode
        } ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Error updating node: Node not found")
    }

    @PutMapping("/{uuid}/position")
    fun updateNodeParent(@PathVariable("uuid") uuid: String, @RequestBody moveNodeDTO: MoveNodeDTO): TreeNode? {
        val node = nodeService.findById(UUID.fromString(uuid))
        val parentNode = nodeService.findById(UUID.fromString(moveNodeDTO.move.parentUUID))

        if (node == null || parentNode == null) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Error updating node's position: Node not found")
        }

        moveNodeDTO.move.order?.let {
            nodeService.findById(UUID.fromString(it.relatedToUUID))
                ?: throw ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Error updating node's position: Related node not found"
                )
        }

        nodeService.changeNodePosition(node.uuid, moveNodeDTO.move)
        notificationService.notifyMove(MoveNodeNotificationDTO(
            clientId = moveNodeDTO.clientId,
            operationId = moveNodeDTO.operationId,
            nodeUUID = node.uuid.toString(),
            nodePositionDTO = moveNodeDTO.move
        ))
        return nodeService.findFromNode(parentNode.uuid)
    }

    @DeleteMapping("/{uuid}")
    fun deleteById(@PathVariable("uuid") uuid: String) {
        val node = nodeService.findById(UUID.fromString(uuid))
        node?.let { nodeService.delete(it) }
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Error deleting node: Node not found")
    }

    @GetMapping("/refresh")
    fun refresh() {
        nodeService.refresh()
    }

    @GetMapping("/setup")
    fun setup() {
        nodeService.setup()
    }
}