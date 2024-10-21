package com.yingchenliu.services.services

import org.springframework.stereotype.Service
import org.springframework.messaging.simp.SimpMessagingTemplate

@Service
class NotificationService(val messagingTemplate: SimpMessagingTemplate) {

    fun notifyOperation(operationDetails: String) {
        messagingTemplate.convertAndSend("/topic/operations", operationDetails)
    }
}