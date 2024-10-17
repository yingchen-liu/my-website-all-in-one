package com.yingchenliu.services.controllers

import com.yingchenliu.services.domains.NodePositionDTO
import com.yingchenliu.services.domains.TreeNode
import com.yingchenliu.services.services.NodeService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import java.util.*


@RestController
@RequestMapping("/api/nodes")
class SkillTreeController(val nodeService: NodeService) {

    @GetMapping("/root")
    fun findRoot(): TreeNode? {
        return nodeService.findFromRoot()
    }

    @GetMapping("/{uuid}")
    fun findNode(@PathVariable("uuid") uuid: String): TreeNode? {
        return nodeService.findFromNode(UUID.fromString(uuid))
    }

    @PostMapping("/{parentUUID}")
    fun createChildNode(@PathVariable("parentUUID") parentUUID: String, @RequestBody node: TreeNode): TreeNode {
        val parentNode = nodeService.findById(UUID.fromString(parentUUID))

        return parentNode?.let {
            nodeService.createChild(node, it.uuid)
        } ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Error creating node: Parent node not found")
    }

    @PostMapping("/{previousNodeUUID}/after")
    fun createNodeAfter(
        @PathVariable("previousNodeUUID") previousNodeUUID: String,
        @RequestBody node: TreeNode
    ): TreeNode {
        val previousNode = nodeService.findById(UUID.fromString(previousNodeUUID))

        return previousNode?.let {
            nodeService.createAfter(node, it.uuid)
        } ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Error creating node: Parent node not found")
    }

    @PutMapping("/{uuid}")
    fun updateNode(@PathVariable("uuid") uuid: String, @RequestBody node: TreeNode): TreeNode {
        val existingNode = nodeService.findById(UUID.fromString(uuid))

        return existingNode?.let {
            val newNode = node.copy(uuid = it.uuid)
            nodeService.update(newNode)
        } ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Error updating node: Node not found")
    }

    @PutMapping("/{uuid}/position")
    fun updateNodeParent(@PathVariable("uuid") uuid: String, @RequestBody positionDTO: NodePositionDTO): TreeNode? {
        val node = nodeService.findById(UUID.fromString(uuid))
        val parentNode = nodeService.findById(UUID.fromString(positionDTO.parentUUID))

        if (node == null || parentNode == null) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Error updating node's position: Node not found")
        }

        positionDTO.order?.let {
            nodeService.findById(UUID.fromString(it.relatedToUUID))
                ?: throw ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Error updating node's position: Related node not found"
                )
        }

        nodeService.changeNodePosition(node.uuid, positionDTO)
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