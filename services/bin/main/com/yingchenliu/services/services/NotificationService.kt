package com.yingchenliu.services.services

import com.yingchenliu.services.domains.CreateNodeNotificationDTO
import com.yingchenliu.services.domains.MoveNodeNotificationDTO
import com.yingchenliu.services.domains.UpdateNodeNotificationDTO
import org.springframework.stereotype.Service
import org.springframework.messaging.simp.SimpMessagingTemplate

@Service
class NotificationService(val messagingTemplate: SimpMessagingTemplate) {

    fun notifyUpdate(updateNodeNotificationDTO: UpdateNodeNotificationDTO) {
        messagingTemplate.convertAndSend("/topic/operations/update", updateNodeNotificationDTO)
    }

    fun notifyCreateAfter(createNodeNotificationDTO: CreateNodeNotificationDTO) {
        messagingTemplate.convertAndSend("/topic/operations/create", createNodeNotificationDTO)
    }

    fun notifyMove(moveNodeNotificationDTO: MoveNodeNotificationDTO) {
        messagingTemplate.convertAndSend("/topic/operations/move", moveNodeNotificationDTO)

    }
}